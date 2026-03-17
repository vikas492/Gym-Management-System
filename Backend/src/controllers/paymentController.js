// import prisma from '../lib/prisma.js'

// export const getPayments = async (req, res, next) => {
//   try {
//     const { status } = req.query

//     const payments = await prisma.payment.findMany({
//       where:   { ...(status && { status }) },
//       include: { member: { select: { id: true, name: true } } },
//       orderBy: { createdAt: 'desc' }
//     })
//     res.json({ success: true, data: payments })
//   } catch (err) { next(err) }
// }

// export const createPayment = async (req, res, next) => {
//   try {
//     const { memberId, amount, method, dueDate } = req.body

//     const payment = await prisma.payment.create({
//       data: {
//         memberId: Number(memberId),
//         amount:   Number(amount),
//         method,
//         dueDate:  new Date(dueDate)
//       }
//     })
//     res.status(201).json({ success: true, data: payment })
//   } catch (err) { next(err) }
// }

// export const markAsPaid = async (req, res, next) => {
//   try {
//     const payment = await prisma.payment.update({
//       where: { id: Number(req.params.id) },
//       data:  { status: 'PAID', paidAt: new Date() }
//     })
//     res.json({ success: true, data: payment })
//   } catch (err) { next(err) }
// }

// export const deletePayment = async (req, res, next) => {
//   try {
//     await prisma.payment.delete({ where: { id: Number(req.params.id) } })
//     res.json({ success: true, message: 'Payment deleted' })
//   } catch (err) { next(err) }
// }

import prisma from '../lib/prisma.js'

export const getPayments = async (req, res, next) => {
  try {
    const { status } = req.query

    const payments = await prisma.payment.findMany({
      where:   { ...(status && { status }) },
      include: { member: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: payments })
  } catch (err) { next(err) }
}

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await prisma.payment.findUnique({
      where:   { id: Number(req.params.id) },
      include: { member: { select: { id: true, name: true } } }
    })
    if (!payment) return res.status(404).json({ message: 'Payment not found' })
    res.json({ success: true, data: payment })
  } catch (err) { next(err) }
}

export const createPayment = async (req, res, next) => {
  try {
    const { memberId, amount, method, dueDate } = req.body

    if (!memberId || !amount || !method || !dueDate)
      return res.status(400).json({ message: 'All fields are required' })

    const payment = await prisma.payment.create({
      data: {
        memberId: Number(memberId),
        amount:   Number(amount),
        method,
        dueDate:  new Date(dueDate),
        status:   'PENDING'
      },
      include: { member: { select: { id: true, name: true } } }
    })
    res.status(201).json({ success: true, data: payment })
  } catch (err) { next(err) }
}

export const markAsPaid = async (req, res, next) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: Number(req.params.id) },
      data:  { status: 'PAID', paidAt: new Date() }
    })
    res.json({ success: true, data: payment })
  } catch (err) { next(err) }
}

export const markAsOverdue = async (req, res, next) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: Number(req.params.id) },
      data:  { status: 'OVERDUE' }
    })
    res.json({ success: true, data: payment })
  } catch (err) { next(err) }
}

export const deletePayment = async (req, res, next) => {
  try {
    await prisma.payment.delete({ where: { id: Number(req.params.id) } })
    res.json({ success: true, message: 'Payment deleted' })
  } catch (err) { next(err) }
}