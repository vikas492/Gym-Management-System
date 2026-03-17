import { useState } from 'react'

const initialProfile = {
  gymName:  'GymFlow Fitness Centre',
  address:  'Bandra West, Mumbai – 400050',
  phone:    '+91 98765 43210',
  email:    'admin@gymflow.in',
  hours:    '5:00 am – 11:00 pm',
  website:  'www.gymflow.in',
}

const initialPlans = [
  { id: 1, name: 'Monthly',   duration: '30 days',  price: 1800,  active: true  },
  { id: 2, name: 'Quarterly', duration: '90 days',  price: 4500,  active: true  },
  { id: 3, name: 'Annual',    duration: '365 days', price: 12000, active: true  },
  { id: 4, name: 'Student',   duration: '30 days',  price: 1200,  active: false },
  { id: 5, name: 'Couple',    duration: '30 days',  price: 3000,  active: false },
]

const initialNotifications = [
  { id: 'renewal',   label: 'Renewal reminders',        desc: '3 days before expiry via WhatsApp', enabled: true  },
  { id: 'receipts',  label: 'Payment receipts',          desc: 'Auto-send after payment',           enabled: true  },
  { id: 'booking',   label: 'Class booking confirmations',desc: 'SMS on booking',                   enabled: true  },
  { id: 'equipment', label: 'Equipment fault alerts',     desc: 'Email to admin',                   enabled: true  },
  { id: 'report',    label: 'Monthly revenue report',     desc: 'Auto-sent on 1st of month',         enabled: true  },
  { id: 'checkin',   label: 'Daily check-in summary',     desc: 'Email at 10 pm every day',          enabled: false },
]

const roles = [
  { role: 'Admin',           access: 'Full access',            badge: 'bg-purple-50 text-purple-700' },
  { role: 'Reception staff', access: 'Members + payments',     badge: 'bg-blue-50 text-blue-700'     },
  { role: 'Trainers',        access: 'Classes only',           badge: 'bg-gray-100 text-gray-500'    },
]

const tabs = ['Gym profile', 'Plans', 'Notifications', 'Access & roles']

export default function Settings() {
  const [activeTab,      setTab]          = useState('Gym profile')
  const [profile,        setProfile]      = useState(initialProfile)
  const [plans,          setPlans]        = useState(initialPlans)
  const [notifications,  setNotifications]= useState(initialNotifications)
  const [saved,          setSaved]        = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const togglePlan = (id) =>
    setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p))

  const toggleNotification = (id) =>
    setNotifications(notifications.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n))

  const updatePrice = (id, value) =>
    setPlans(plans.map(p => p.id === id ? { ...p, price: Number(value) } : p))

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-900">Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage your gym configuration</p>
        </div>
        <button
          onClick={handleSave}
          className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`text-xs px-4 py-2 rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-white text-gray-900 font-medium shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Gym profile ── */}
      {activeTab === 'Gym profile' && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Gym info</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Gym name',        key: 'gymName'  },
              { label: 'Phone',           key: 'phone'    },
              { label: 'Email',           key: 'email'    },
              { label: 'Website',         key: 'website'  },
              { label: 'Operating hours', key: 'hours'    },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
                <input
                  type="text"
                  value={profile[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-gray-800 bg-white"
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-gray-800 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Plans ── */}
      {activeTab === 'Plans' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Membership plans</p>
            <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              + Add plan
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Plan name</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Duration</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Price (₹)</th>
                <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 text-xs font-medium text-gray-800">{p.name}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{p.duration}</td>
                  <td className="px-5 py-3">
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) => updatePrice(p.id, e.target.value)}
                      className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 text-gray-800"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => togglePlan(p.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        p.active ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          p.active ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Notifications ── */}
      {activeTab === 'Notifications' && (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          <div className="px-5 py-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Notification settings</p>
          </div>
          {notifications.map((n) => (
            <div key={n.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-gray-800 font-medium">{n.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(n.id)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                  n.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    n.enabled ? 'translate-x-4' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Access & roles ── */}
      {activeTab === 'Access & roles' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Role permissions</p>
            </div>
            {roles.map((r) => (
              <div key={r.role} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.role}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${r.badge}`}>
                  {r.access}
                </span>
              </div>
            ))}
          </div>

          {/* Staff accounts */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Staff accounts</p>
              <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                + Invite staff
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { initials: 'AK', name: 'Amit Kumar',   email: 'amit@gymflow.in',   role: 'Admin',           color: 'bg-purple-100 text-purple-800' },
                { initials: 'SR', name: 'Seema Rao',    email: 'seema@gymflow.in',  role: 'Reception staff', color: 'bg-blue-100 text-blue-800'     },
                { initials: 'RS', name: 'Ravi Sharma',  email: 'ravi@gymflow.in',   role: 'Trainer',         color: 'bg-teal-100 text-teal-800'     },
                { initials: 'PM', name: 'Priya Mehta',  email: 'priya@gymflow.in',  role: 'Trainer',         color: 'bg-amber-100 text-amber-800'   },
              ].map((staff) => (
                <div key={staff.email} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${staff.color}`}>
                    {staff.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-800">{staff.name}</p>
                    <p className="text-xs text-gray-400">{staff.email}</p>
                  </div>
                  <span className="text-xs text-gray-400">{staff.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-xl border border-red-100 p-5">
            <p className="text-xs font-medium text-red-400 uppercase tracking-wide mb-3">Danger zone</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Reset all data</p>
                <p className="text-xs text-gray-400 mt-0.5">Permanently delete all members, invoices, and records</p>
              </div>
              <button className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                Reset data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}