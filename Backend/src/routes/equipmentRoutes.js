import express from 'express'
import {
  getEquipment, getEquipmentById,
  createEquipment, updateEquipment,
  deleteEquipment, addMaintenanceLog,
  updateLogStatus
} from '../controllers/equipmentController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)

router.get('/',                    getEquipment)
router.get('/:id',                 getEquipmentById)
router.post('/',      adminOnly,   createEquipment)
router.put('/:id',    adminOnly,   updateEquipment)
router.delete('/:id', adminOnly,   deleteEquipment)
router.post('/:id/logs',           addMaintenanceLog)
router.put('/:id/logs/:logId',     updateLogStatus)

export default router