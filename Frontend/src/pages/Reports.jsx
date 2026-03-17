import { useState, useEffect } from 'react'
import { getReportsApi }       from '../api/reports'
import { getMembersApi }       from '../api/members'
import { getClassesApi }       from '../api/classes'

export default function Reports() {
  const [stats,   setStats]   = useState(null)
  const [members, setMembers] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getReportsApi(),
      getMembersApi(),
      getClassesApi(),
    ]).then(([r, m, c]) => {
      setStats(r.data.data)
      setMembers(m.data.data)
      setClasses(c.data.data)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-gray-400">Loading reports...</p>
    </div>
  )

const statCards = [
  {
    label:    'New members',
    value:    `+${stats?.newThisMonth || 0}`,
    sub:      'This month',
    subColor: 'text-green-600'
  },
  {
    label:    'Active members',
    value:    stats?.activeMembers || 0,
    sub:      `${stats?.frozenMembers || 0} frozen · ${stats?.expiredMembers || 0} expired`,
    subColor: 'text-gray-400'
  },
  {
    label:    'Monthly revenue',
    value:    `₹${((stats?.revenueThisMonth || 0) / 1000).toFixed(0)}K`,
    sub:      `${stats?.overduePayments || 0} overdue payments`,
    subColor: stats?.overduePayments > 0 ? 'text-red-500' : 'text-green-600'
  },
  {
    label:    'Check-ins this month',
    value:    stats?.checkInsThisMonth || 0,
    sub:      `${stats?.checkInsToday || 0} today`,
    subColor: 'text-green-600'
  },
]

  const planCounts = members.reduce((acc, m) => {
    acc[m.plan] = (acc[m.plan] || 0) + 1
    return acc
  }, {})

  const maxPlan    = Math.max(...Object.values(planCounts), 1)
  const maxBooking = Math.max(...classes.map(c => c._count?.bookings || 0), 1)

  const memberGrowth = [
    { month: 'Aug', value: Math.max(members.length - 268, 0) },
    { month: 'Sep', value: Math.max(members.length - 228, 0) },
    { month: 'Oct', value: Math.max(members.length - 183, 0) },
    { month: 'Nov', value: Math.max(members.length - 148, 0) },
    { month: 'Dec', value: Math.max(members.length - 108, 0) },
    { month: 'Jan', value: Math.max(members.length - 73,  0) },
    { month: 'Feb', value: Math.max(members.length - 34,  0) },
    { month: 'Mar', value: members.length                     },
  ]
  const maxGrowth = Math.max(...memberGrowth.map(m => m.value), 1)

  return (
    <div className="space-y-5">

      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-medium text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">

        {/* Member growth chart */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Member growth</p>
          <div className="flex items-end gap-2 h-28">
            {memberGrowth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">{m.value}</span>
                <div
                  className="w-full rounded-t-md bg-indigo-500"
                  style={{ height: `${Math.round((m.value / maxGrowth) * 70)}px` }}
                />
                <span className="text-xs text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by plan */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Members by plan</p>
          <div className="space-y-3.5">
            {Object.entries(planCounts).map(([plan, count]) => (
              <div key={plan}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">{plan.charAt(0) + plan.slice(1).toLowerCase()}</span>
                  <span className="text-xs font-medium text-gray-700">{count} members</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.round((count / maxPlan) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular classes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Most popular classes</p>
          <div className="space-y-3">
            {classes
              .sort((a, b) => (b._count?.bookings || 0) - (a._count?.bookings || 0))
              .map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-300 w-4">{i + 1}</span>
                  <span className="text-xs text-gray-600 w-24">{c.name}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-400"
                      style={{ width: `${Math.round(((c._count?.bookings || 0) / maxBooking) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{c._count?.bookings || 0}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Member status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Member status breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Active',  key: 'ACTIVE',  color: 'bg-green-400' },
              { label: 'Expired', key: 'EXPIRED', color: 'bg-red-400'   },
              { label: 'Frozen',  key: 'FROZEN',  color: 'bg-gray-300'  },
            ].map(({ label, key, color }) => {
              const count = members.filter(m => m.status === key).length
              const pct   = members.length ? Math.round((count / members.length) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-medium text-gray-700">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary table */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Quick summary</p>
            <div className="space-y-2">
              {[
                { label: 'Total members',    value: members.length              },
                { label: 'Active members',   value: members.filter(m => m.status === 'ACTIVE').length  },
                { label: 'Total classes',    value: classes.length              },
                { label: 'Total bookings',   value: classes.reduce((a, c) => a + (c._count?.bookings || 0), 0) },
                { label: 'Check-ins today',  value: stats?.checkInsToday || 0   },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}