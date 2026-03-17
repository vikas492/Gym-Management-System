import { useState, useEffect } from 'react'
import { getReportsApi }       from '../api/reports'
import { getMembersApi }       from '../api/members'
import ChatBot                 from '../components/chat/ChatBot'

export default function Dashboard() {
  const [stats,    setStats]    = useState(null)
  const [checkins, setCheckins] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reportsRes, membersRes] = await Promise.all([
        getReportsApi(),
        getMembersApi({ status: 'ACTIVE' })
      ])
      setStats(reportsRes.data.data)
      setCheckins(membersRes.data.data.slice(0, 4))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const peakHours = [
    { time: '7 am',  count: 52,  pct: 42  },
    { time: '9 am',  count: 81,  pct: 65  },
    { time: '12 pm', count: 68,  pct: 55  },
    { time: '4 pm',  count: 112, pct: 90  },
    { time: '6 pm',  count: 128, pct: 100 },
    { time: '8 pm',  count: 44,  pct: 36  },
  ]

  const classes = [
    { time: '6:00 am', name: 'CrossFit',  trainer: 'Ravi S.',  capacity: '18/20', status: 'open'   },
    { time: '8:30 am', name: 'Yoga Flow', trainer: 'Priya M.', capacity: '12/15', status: 'open'   },
    { time: '5:00 pm', name: 'Zumba',     trainer: 'Nina K.',  capacity: '24/25', status: 'almost' },
    { time: '7:00 pm', name: 'Strength',  trainer: 'Arjun D.', capacity: '8/20',  status: 'low'    },
  ]

  const statusStyles = {
    open:   'bg-green-50 text-green-700',
    almost: 'bg-amber-50 text-amber-700',
    low:    'bg-gray-100 text-gray-500',
  }

  const checkinStatusStyles = {
    ACTIVE:  'bg-green-50 text-green-700',
    FROZEN:  'bg-gray-100 text-gray-500',
    EXPIRED: 'bg-red-50 text-red-700',
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-gray-400">Loading dashboard...</p>
    </div>
  )

  const statCards = [
    {
      label:    'Total members',
      value:    stats?.totalMembers || 0,
      sub:      `↑ ${stats?.newThisMonth || 0} this month`,
      subColor: 'text-green-600'
    },
    {
      label:    'Active today',
      value:    stats?.checkInsToday || 0,
      sub:      `${stats?.checkInsThisMonth || 0} this month`,
      subColor: 'text-gray-400'
    },
    {
      label:    'Monthly revenue',
      value:    `₹${((stats?.revenueThisMonth || 0) / 1000).toFixed(0)}K`,
      sub:      `${stats?.overduePayments || 0} overdue`,
      subColor: stats?.overduePayments > 0 ? 'text-red-500' : 'text-green-600'
    },
    {
      label:    'Pending payments',
      value:    stats?.pendingPayments || 0,
      sub:      `${stats?.activeMembers || 0} active members`,
      subColor: 'text-amber-500'
    },
  ]

  return (
    <div className="space-y-4 md:space-y-5">

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 md:p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl md:text-2xl font-medium text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Peak hours + Classes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Peak hours */}
        <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Peak hours — today</p>
          <div className="space-y-2.5">
            {peakHours.map((h) => (
              <div key={h.time} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-10 text-right">{h.time}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${h.pct}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-6 text-right">
                  {h.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Classes today */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Classes today</p>
          <div className="space-y-3">
            {classes.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-12 flex-shrink-0">{c.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.trainer}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusStyles[c.status]}`}>
                  {c.capacity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent members */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-medium text-gray-800 mb-4">Recent members</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {checkins.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                {m.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <span className="flex-1 text-sm text-gray-800 truncate">{m.name}</span>
              <span className="text-xs text-gray-400 hidden sm:block">
                {m.plan.charAt(0) + m.plan.slice(1).toLowerCase()}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${checkinStatusStyles[m.status]}`}>
                {m.status.charAt(0) + m.status.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating chat button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center z-30"
        title="GymFlow Assistant"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {/* Chatbot */}
      {showChat && <ChatBot onClose={() => setShowChat(false)} />}

    </div>
  )
}