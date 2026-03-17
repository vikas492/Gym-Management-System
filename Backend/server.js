import express    from 'express'
import cors       from 'cors'
import dotenv     from 'dotenv'

dotenv.config()

import authRoutes       from './src/routes/authRoutes.js'
import memberRoutes     from './src/routes/memberRoutes.js'
import trainerRoutes    from './src/routes/trainerRoutes.js'
import classRoutes      from './src/routes/classRoutes.js'
import paymentRoutes    from './src/routes/paymentRoutes.js'
import equipmentRoutes  from './src/routes/equipmentRoutes.js'
import reportRoutes     from './src/routes/reportRoutes.js'
import chatRoutes       from './src/routes/chatRoutes.js'
import { errorHandler } from './src/middleware/errorMiddleware.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}))

app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/members',   memberRoutes)
app.use('/api/trainers',  trainerRoutes)
app.use('/api/classes',   classRoutes)
app.use('/api/payments',  paymentRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/reports',   reportRoutes)
app.use('/api/chat',      chatRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`GymFlow API running on port ${PORT}`)
})