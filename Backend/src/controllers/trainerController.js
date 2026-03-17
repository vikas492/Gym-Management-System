import prisma from '../lib/prisma.js'

export const getTrainers = async (req, res, next) => {
  try {
    const trainers = await prisma.trainer.findMany({
      include: {
        _count: { select: { members: true, classes: true } }
      },
      orderBy: { rating: 'desc' }
    })
    res.json({ success: true, data: trainers })
  } catch (err) { next(err) }
}

export const getTrainerById = async (req, res, next) => {
  try {
    const trainer = await prisma.trainer.findUnique({
      where:   { id: Number(req.params.id) },
      include: {
        members: { select: { id: true, name: true, status: true } },
        classes: true
      }
    })
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' })
    res.json({ success: true, data: trainer })
  } catch (err) { next(err) }
}

export const createTrainer = async (req, res, next) => {
  try {
    const trainer = await prisma.trainer.create({ data: req.body })
    res.status(201).json({ success: true, data: trainer })
  } catch (err) { next(err) }
}

export const updateTrainer = async (req, res, next) => {
  try {
    const trainer = await prisma.trainer.update({
      where: { id: Number(req.params.id) },
      data:  req.body
    })
    res.json({ success: true, data: trainer })
  } catch (err) { next(err) }
}

export const deleteTrainer = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // Unassign members first, then delete classes and trainer
    await prisma.member.updateMany({
      where: { trainerId: id },
      data:  { trainerId: null }
    })
    const trainerClasses = await prisma.class.findMany({ where: { trainerId: id } })
    for (const cls of trainerClasses) {
      await prisma.booking.deleteMany({ where: { classId: cls.id } })
    }
    await prisma.class.deleteMany({ where: { trainerId: id } })
    await prisma.trainer.delete({ where: { id } })

    res.json({ success: true, message: 'Trainer removed' })
  } catch (err) { next(err) }
}