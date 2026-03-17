import prisma from '../lib/prisma.js'

export const getClasses = async (req, res, next) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        trainer:  { select: { id: true, name: true } },
        _count:   { select: { bookings: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: classes })
  } catch (err) { next(err) }
}

export const getClassById = async (req, res, next) => {
  try {
    const cls = await prisma.class.findUnique({
      where:   { id: Number(req.params.id) },
      include: {
        trainer:  { select: { id: true, name: true } },
        bookings: { include: { member: { select: { id: true, name: true } } } }
      }
    })
    if (!cls) return res.status(404).json({ message: 'Class not found' })
    res.json({ success: true, data: cls })
  } catch (err) { next(err) }
}

export const createClass = async (req, res, next) => {
  try {
    const { name, trainerId, day, time, duration, capacity } = req.body
    const cls = await prisma.class.create({
      data: { name, day, time, duration, capacity, trainerId: Number(trainerId) }
    })
    res.status(201).json({ success: true, data: cls })
  } catch (err) { next(err) }
}

export const updateClass = async (req, res, next) => {
  try {
    const cls = await prisma.class.update({
      where: { id: Number(req.params.id) },
      data:  req.body
    })
    res.json({ success: true, data: cls })
  } catch (err) { next(err) }
}

export const deleteClass = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // Delete bookings first, then the class
    await prisma.booking.deleteMany({ where: { classId: id } })
    await prisma.class.delete({ where: { id } })

    res.json({ success: true, message: 'Class cancelled' })
  } catch (err) { next(err) }
}

export const bookClass = async (req, res, next) => {
  try {
    const { memberId } = req.body
    const classId = Number(req.params.id)

    const cls = await prisma.class.findUnique({
      where:   { id: classId },
      include: { _count: { select: { bookings: true } } }
    })

    if (cls._count.bookings >= cls.capacity)
      return res.status(400).json({ message: 'Class is full' })

    const existing = await prisma.booking.findFirst({
      where: { memberId: Number(memberId), classId }
    })
    if (existing)
      return res.status(400).json({ message: 'Already booked' })

    const booking = await prisma.booking.create({
      data: { memberId: Number(memberId), classId }
    })
    res.status(201).json({ success: true, data: booking })
  } catch (err) { next(err) }
}
