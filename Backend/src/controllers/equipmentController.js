import prisma from '../lib/prisma.js'

export const getEquipment = async (req, res, next) => {
  try {
    const { zone } = req.query

    const equipment = await prisma.equipment.findMany({
      where:   { ...(zone && { zone }) },
      include: {
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { name: 'asc' }
    })
    res.json({ success: true, data: equipment })
  } catch (err) { next(err) }
}

export const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await prisma.equipment.findUnique({
      where:   { id: Number(req.params.id) },
      include: { logs: { orderBy: { createdAt: 'desc' } } }
    })
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' })
    res.json({ success: true, data: equipment })
  } catch (err) { next(err) }
}

export const createEquipment = async (req, res, next) => {
  try {
    const { name, zone, quantity, condition, status } = req.body

    if (!name || !zone || !quantity)
      return res.status(400).json({ message: 'Name, zone and quantity are required' })

    const equipment = await prisma.equipment.create({
      data: {
        name,
        zone,
        quantity:  Number(quantity),
        condition: condition ? Number(condition) : 100,
        status:    status || 'GOOD'
      }
    })
    res.status(201).json({ success: true, data: equipment })
  } catch (err) { next(err) }
}

export const updateEquipment = async (req, res, next) => {
  try {
    const { name, zone, quantity, condition, status, lastService } = req.body

    const equipment = await prisma.equipment.update({
      where: { id: Number(req.params.id) },
      data:  {
        ...(name        && { name                       }),
        ...(zone        && { zone                       }),
        ...(quantity    && { quantity:  Number(quantity)  }),
        ...(condition   && { condition: Number(condition) }),
        ...(status      && { status                     }),
        ...(lastService && { lastService: new Date(lastService) }),
      }
    })
    res.json({ success: true, data: equipment })
  } catch (err) { next(err) }
}

export const deleteEquipment = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.maintenanceLog.deleteMany({ where: { equipmentId: id } })
    await prisma.equipment.delete({ where: { id } })
    res.json({ success: true, message: 'Equipment deleted' })
  } catch (err) { next(err) }
}

export const addMaintenanceLog = async (req, res, next) => {
  try {
    const { issue } = req.body

    if (!issue)
      return res.status(400).json({ message: 'Issue description is required' })

    const log = await prisma.maintenanceLog.create({
      data: {
        equipmentId: Number(req.params.id),
        issue,
        status: 'OPEN'
      }
    })
    res.status(201).json({ success: true, data: log })
  } catch (err) { next(err) }
}

export const updateLogStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    const log = await prisma.maintenanceLog.update({
      where: { id: Number(req.params.logId) },
      data:  { status }
    })
    res.json({ success: true, data: log })
  } catch (err) { next(err) }
}