import Groq   from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

const SYSTEM_PROMPT = `You are GymFlow Assistant, a helpful chatbot for GymFlow Fitness Centre.
You help gym staff and members with questions about:
- Membership plans (Monthly ₹1800, Quarterly ₹4500, Annual ₹12000)
- Class schedules (CrossFit, Yoga Flow, Zumba, HIIT, Pilates, Strength)
- Trainer information and specialities
- General fitness advice and workout tips
- Gym timings (5:00 am – 11:00 pm)
- Equipment usage and safety
- Diet and nutrition basics
- Injury prevention tips
- Membership renewal and freezing policies

Keep responses concise, friendly and professional.
If asked about something unrelated to fitness or the gym, politely redirect back to gym topics.
Always respond in the same language the user writes in.`

export const chat = async (req, res, next) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Messages array is required' })
    }

    const userMessages = messages.filter(m => m.role === 'user')
    if (userMessages.length === 0) {
      return res.status(400).json({ message: 'At least one user message is required' })
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing from .env')
      return res.status(500).json({ message: 'API key not configured' })
    }

    // Initialize client inside function so dotenv has already loaded
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })

    console.log('Sending to Groq:', messages.length, 'messages')

    const response = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      messages:    [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({
          role:    m.role,
          content: m.content
        }))
      ],
      max_tokens:  1024,
      temperature: 0.7,
    })

    const text = response.choices[0].message.content

    console.log('Groq responded successfully')

    res.json({
      success: true,
      message: text
    })

  } catch (err) {
    console.error('Groq API Error:', err.message)
    next(err)
  }
}