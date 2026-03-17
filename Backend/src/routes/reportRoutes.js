import express          from 'express'
import { getReports }   from '../controllers/reportController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, adminOnly, getReports)

export default router