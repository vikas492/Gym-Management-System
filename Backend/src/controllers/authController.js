import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import prisma  from '../lib/prisma.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user   = await prisma.user.create({
      data: { name, email, password: hashed, role }
    })

    res.status(201).json({
      success: true,
      token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) { next(err) }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    res.json({
      success: true,
      token: generateToken(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) { next(err) }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true }
    })
    res.json({ success: true, user })
  } catch (err) { next(err) }
}