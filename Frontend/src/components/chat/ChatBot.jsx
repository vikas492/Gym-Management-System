import { useState, useRef, useEffect } from 'react'
import { sendMessageApi }               from '../../api/chat'

const suggestions = [
  'Membership plans?',
  'Classes available?',
  'Gym timings?',
  'Weight loss tips?',
]

export default function ChatBot({ onClose }) {
  const [displayMessages, setDisplayMessages] = useState([
    { role: 'assistant', content: 'Hi! I am GymFlow Assistant. How can I help you today?' }
  ])
  const [apiMessages, setApiMessages] = useState([])
  const [input,        setInput]      = useState('')
  const [loading,      setLoading]    = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])

  const sendMessage = async (text) => {
    const userMessage = text || input.trim()
    if (!userMessage || loading) return

    const newDisplay = [...displayMessages, { role: 'user', content: userMessage }]
    const newApi     = [...apiMessages,     { role: 'user', content: userMessage }]

    setDisplayMessages(newDisplay)
    setApiMessages(newApi)
    setInput('')
    setLoading(true)

    try {
      const res = await sendMessageApi(newApi)
      const reply = { role: 'assistant', content: res.data.message }
      setDisplayMessages([...newDisplay, reply])
      setApiMessages([...newApi, reply])
    } catch (err) {
      setDisplayMessages([
        ...newDisplay,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Positioned above bottom nav on mobile, bottom-right on desktop */}
      <div
        className="fixed z-50 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
        style={{
          bottom:  'calc(env(safe-area-inset-bottom) + 72px)',
          right:   '16px',
          width:   'min(320px, calc(100vw - 32px))',
          height:  'min(440px, 60vh)',
        }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              AI
            </div>
            <div>
              <p className="text-xs font-medium text-white">GymFlow Assistant</p>
              <p className="text-xs text-indigo-200">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white w-7 h-7 flex items-center justify-center"
          >✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {displayMessages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms'   }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions — only at start */}
        {displayMessages.length === 1 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-2.5 border-t border-gray-100 flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the gym..."
            disabled={loading}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-8 h-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 flex items-center justify-center flex-shrink-0"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}