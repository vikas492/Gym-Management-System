import express from 'express'
import {
  getTrainers, getTrainerById,
  createTrainer, updateTrainer, deleteTrainer
} from '../controllers/trainerController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/',      getTrainers)
router.get('/:id',   getTrainerById)
router.post('/',     adminOnly, createTrainer)
router.put('/:id',   adminOnly, updateTrainer)
router.delete('/:id',adminOnly, deleteTrainer)

export default router