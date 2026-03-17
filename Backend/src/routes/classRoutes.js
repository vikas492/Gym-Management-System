import express from 'express'
import {
  getClasses, getClassById,
  createClass, updateClass,
  deleteClass, bookClass
} from '../controllers/classController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/',           getClasses)
router.get('/:id',        getClassById)
router.post('/',          adminOnly, createClass)
router.put('/:id',        adminOnly, updateClass)
router.delete('/:id',     adminOnly, deleteClass)
router.post('/:id/book',  bookClass)

export default router