import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {

  // Trainers
  const ravi = await prisma.trainer.create({ data: {
    name: 'Ravi Sharma', phone: '+91 98765 11001',
    email: 'ravi@gymflow.in', speciality: 'CrossFit, HIIT',
    bio: 'Certified CrossFit Level 2 trainer.', rating: 4.9, status: 'ACTIVE'
  }})
  const priya = await prisma.trainer.create({ data: {
    name: 'Priya Mehta', phone: '+91 98765 11002',
    email: 'priya@gymflow.in', speciality: 'Yoga, Pilates',
    bio: 'RYT-500 certified yoga instructor.', rating: 4.8, status: 'ACTIVE'
  }})
  const nina = await prisma.trainer.create({ data: {
    name: 'Nina Kapoor', phone: '+91 98765 11003',
    email: 'nina@gymflow.in', speciality: 'Zumba, Dance',
    bio: 'Licensed Zumba instructor.', rating: 4.7, status: 'ACTIVE'
  }})
  const arjun = await prisma.trainer.create({ data: {
    name: 'Arjun Desai', phone: '+91 98765 11004',
    email: 'arjun@gymflow.in', speciality: 'Strength, PT',
    bio: 'NSCA certified strength specialist.', rating: 4.6, status: 'ACTIVE'
  }})

  // Members
  const members = await Promise.all([
    prisma.member.create({ data: {
      name: 'Sneha Rao', phone: '+91 98765 00001',
      email: 'sneha@gmail.com', plan: 'ANNUAL', status: 'ACTIVE',
      expiresAt: new Date('2026-01-01'), trainerId: ravi.id
    }}),
    prisma.member.create({ data: {
      name: 'Kiran Patil', phone: '+91 98765 00002',
      email: 'kiran@gmail.com', plan: 'MONTHLY', status: 'ACTIVE',
      expiresAt: new Date('2025-04-01')
    }}),
    prisma.member.create({ data: {
      name: 'Aditya Mehta', phone: '+91 98765 00003',
      email: 'aditya@gmail.com', plan: 'QUARTERLY', status: 'ACTIVE',
      expiresAt: new Date('2025-03-31'), trainerId: priya.id
    }}),
    prisma.member.create({ data: {
      name: 'Deepa Lal', phone: '+91 98765 00004',
      email: 'deepa@gmail.com', plan: 'ANNUAL', status: 'ACTIVE',
      expiresAt: new Date('2026-03-01')
    }}),
    prisma.member.create({ data: {
      name: 'Rahul Verma', phone: '+91 98765 00005',
      email: 'rahul@gmail.com', plan: 'MONTHLY', status: 'EXPIRED',
      expiresAt: new Date('2025-02-01'), trainerId: arjun.id
    }}),
    prisma.member.create({ data: {
      name: 'Nisha Kulkarni', phone: '+91 98765 00006',
      email: 'nisha@gmail.com', plan: 'ANNUAL', status: 'FROZEN',
      expiresAt: new Date('2025-05-01'), trainerId: ravi.id
    }}),
    prisma.member.create({ data: {
      name: 'Pooja Shah', phone: '+91 98765 00007',
      email: 'pooja@gmail.com', plan: 'QUARTERLY', status: 'ACTIVE',
      expiresAt: new Date('2025-09-01'), trainerId: nina.id
    }}),
    prisma.member.create({ data: {
      name: 'Vivek Nair', phone: '+91 98765 00008',
      email: 'vivek@gmail.com', plan: 'MONTHLY', status: 'ACTIVE',
      expiresAt: new Date('2025-04-15')
    }}),
  ])

  // Classes
  const crossfit = await prisma.class.create({ data: {
    name: 'CrossFit', trainerId: ravi.id,
    day: 'Mon & Fri', time: '6:00 am', duration: 60, capacity: 20
  }})
  const yoga = await prisma.class.create({ data: {
    name: 'Yoga Flow', trainerId: priya.id,
    day: 'Tue & Sat', time: '8:30 am', duration: 60, capacity: 15
  }})
  const zumba = await prisma.class.create({ data: {
    name: 'Zumba', trainerId: nina.id,
    day: 'Wed & Fri', time: '5:00 pm', duration: 45, capacity: 25
  }})
  const strength = await prisma.class.create({ data: {
    name: 'Strength', trainerId: arjun.id,
    day: 'Thu', time: '7:00 pm', duration: 60, capacity: 20
  }})

  // Bookings
  await Promise.all([
    prisma.booking.create({ data: { memberId: members[0].id, classId: crossfit.id }}),
    prisma.booking.create({ data: { memberId: members[1].id, classId: yoga.id }}),
    prisma.booking.create({ data: { memberId: members[2].id, classId: zumba.id }}),
    prisma.booking.create({ data: { memberId: members[3].id, classId: strength.id }}),
    prisma.booking.create({ data: { memberId: members[6].id, classId: zumba.id }}),
    prisma.booking.create({ data: { memberId: members[7].id, classId: crossfit.id }}),
  ])

  // Payments
  await Promise.all([
    prisma.payment.create({ data: {
      memberId: members[0].id, amount: 12000,
      method: 'UPI', status: 'PAID',
      dueDate: new Date('2025-03-15'), paidAt: new Date('2025-03-14')
    }}),
    prisma.payment.create({ data: {
      memberId: members[1].id, amount: 1800,
      method: 'CARD', status: 'PENDING',
      dueDate: new Date('2025-03-20')
    }}),
    prisma.payment.create({ data: {
      memberId: members[2].id, amount: 4500,
      method: 'CASH', status: 'OVERDUE',
      dueDate: new Date('2025-03-10')
    }}),
    prisma.payment.create({ data: {
      memberId: members[3].id, amount: 12000,
      method: 'UPI', status: 'PAID',
      dueDate: new Date('2025-03-22'), paidAt: new Date('2025-03-21')
    }}),
    prisma.payment.create({ data: {
      memberId: members[4].id, amount: 1800,
      method: 'CASH', status: 'OVERDUE',
      dueDate: new Date('2025-03-05')
    }}),
    prisma.payment.create({ data: {
      memberId: members[6].id, amount: 4500,
      method: 'UPI', status: 'PENDING',
      dueDate: new Date('2025-03-25')
    }}),
    prisma.payment.create({ data: {
      memberId: members[7].id, amount: 1800,
      method: 'CARD', status: 'PAID',
      dueDate: new Date('2025-03-28'), paidAt: new Date('2025-03-27')
    }}),
  ])

  // Equipment
  const equipmentList = [
    { name: 'Treadmill',     zone: 'Cardio',  quantity: 12, condition: 92, status: 'GOOD'         },
    { name: 'Elliptical',    zone: 'Cardio',  quantity: 6,  condition: 88, status: 'GOOD'         },
    { name: 'Spin Bike',     zone: 'Studio',  quantity: 14, condition: 96, status: 'GOOD'         },
    { name: 'Bench Press',   zone: 'Weights', quantity: 8,  condition: 75, status: 'SERVICE_DUE'  },
    { name: 'Dumbbells',     zone: 'Weights', quantity: 30, condition: 90, status: 'GOOD'         },
    { name: 'Cable Machine', zone: 'Weights', quantity: 4,  condition: 40, status: 'UNDER_REPAIR' },
    { name: 'Leg Press',     zone: 'Weights', quantity: 3,  condition: 85, status: 'GOOD'         },
    { name: 'Pull-up Bar',   zone: 'Studio',  quantity: 6,  condition: 95, status: 'GOOD'         },
  ]

  const createdEquipment = await Promise.all(
    equipmentList.map(e => prisma.equipment.create({ data: e }))
  )

  // Maintenance logs
  await Promise.all([
    prisma.maintenanceLog.create({ data: {
      equipmentId: createdEquipment[5].id,
      issue: 'Pulley cable snapped', status: 'OPEN'
    }}),
    prisma.maintenanceLog.create({ data: {
      equipmentId: createdEquipment[0].id,
      issue: 'Belt worn out', status: 'SCHEDULED'
    }}),
    prisma.maintenanceLog.create({ data: {
      equipmentId: createdEquipment[3].id,
      issue: 'Bolt loose', status: 'FIXED'
    }}),
  ])

  // Check-ins
  await Promise.all(
    members.slice(0, 5).map(m =>
      prisma.checkIn.create({ data: { memberId: m.id } })
    )
  )

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })