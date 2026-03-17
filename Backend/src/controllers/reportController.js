import prisma from '../lib/prisma.js'

export const getReports = async (req, res, next) => {
  try {
    const now   = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalMembers,
      newThisMonth,
      totalRevenue,
      pendingPayments,
      popularClasses,
      checkInsToday
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { joinedAt: { gte: start } } }),
      prisma.payment.aggregate({
        where:   { status: 'PAID', paidAt: { gte: start } },
        _sum:    { amount: true }
      }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.booking.groupBy({
        by:      ['classId'],
        _count:  { classId: true },
        orderBy: { _count: { classId: 'desc' } },
        take:    5
      }),
      prisma.checkIn.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
      })
    ])

    res.json({
      success: true,
      data: {
        totalMembers,
        newThisMonth,
        revenueThisMonth: totalRevenue._sum.amount || 0,
        pendingPayments,
        popularClasses,
        checkInsToday
      }
    })
  } catch (err) { next(err) }
}