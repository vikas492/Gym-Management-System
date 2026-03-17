import prisma from '../lib/prisma.js'

export const getMembers = async (req, res, next) => {
  try {
    const { search, status, plan } = req.query

    const members = await prisma.member.findMany({
      where: {
        ...(status && { status }),
        ...(plan   && { plan   }),
        ...(search && {
          OR: [
            { name:  { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
          ]
        })
      },
      include: { trainer: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ success: true, data: members })
  } catch (err) { next(err) }
}

export const getMemberById = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where:   { id: Number(req.params.id) },
      include: {
        trainer:  { select: { id: true, name: true } },
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
        checkIns: { orderBy: { createdAt: 'desc' }, take: 10 },
        bookings: { include: { class: true }, orderBy: { createdAt: 'desc' }, take: 5 }
      }
    })

    if (!member) return res.status(404).json({ message: 'Member not found' })
    res.json({ success: true, data: member })
  } catch (err) { next(err) }
}

export const createMember = async (req, res, next) => {
  try {
    const { name, phone, email, plan, trainerId, expiresAt } = req.body

    const member = await prisma.member.create({
      data: {
        name, phone, email, plan,
        expiresAt: new Date(expiresAt),
        ...(trainerId && { trainerId: Number(trainerId) })
      }
    })

    res.status(201).json({ success: true, data: member })
  } catch (err) { next(err) }
}

export const updateMember = async (req, res, next) => {
  try {
    const member = await prisma.member.update({
      where: { id: Number(req.params.id) },
      data:  req.body
    })
    res.json({ success: true, data: member })
  } catch (err) { next(err) }
}

export const deleteMember = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // Delete related records first
    await prisma.booking.deleteMany({ where: { memberId: id } })
    await prisma.checkIn.deleteMany({ where: { memberId: id } })
    await prisma.payment.deleteMany({ where: { memberId: id } })
    await prisma.member.delete({ where: { id } })

    res.json({ success: true, message: 'Member deleted' })
  } catch (err) { next(err) }
}

export const checkInMember = async (req, res, next) => {
  try {
    const checkIn = await prisma.checkIn.create({
      data: { memberId: Number(req.params.id) }
    })
    res.status(201).json({ success: true, data: checkIn })
  } catch (err) { next(err) }
}