import express from 'express'
import {
  getPayments, getPaymentById,
  createPayment, markAsPaid,
  markAsOverdue, deletePayment
} from '../controllers/paymentController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/',           getPayments)
router.get('/:id',        getPaymentById)
router.post('/',          createPayment)
router.put('/:id/pay',    markAsPaid)
router.put('/:id/overdue',markAsOverdue)
router.delete('/:id',     adminOnly, deletePayment)

export default router