import express from 'express'
import {
  getMembers, getMemberById,
  createMember, updateMember,
  deleteMember, checkInMember
} from '../controllers/memberController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/',            getMembers)
router.get('/:id',         getMemberById)
router.post('/',           createMember)
router.put('/:id',         updateMember)
router.delete('/:id',      adminOnly, deleteMember)
router.post('/:id/checkin',checkInMember)

export default router