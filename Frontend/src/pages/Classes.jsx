import { useState, useEffect }           from 'react'
import { getClassesApi, deleteClassApi } from '../api/classes'
import ClassModal from '../components/classes/ClassModal'
import ClassForm  from '../components/classes/ClassForm'

const weekDays  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dayColors = {
  Mon: 'bg-purple-50 border-purple-200 text-purple-800',
  Tue: 'bg-teal-50 border-teal-200 text-teal-800',
  Wed: 'bg-amber-50 border-amber-200 text-amber-800',
  Thu: 'bg-red-50 border-red-200 text-red-800',
  Fri: 'bg-blue-50 border-blue-200 text-blue-800',
  Sat: 'bg-green-50 border-green-200 text-green-800',
}

const statusStyles = {
  'Open':         'bg-green-50 text-green-700',
  'Almost full':  'bg-amber-50 text-amber-700',
  'Full':         'bg-red-50 text-red-700',
}

const getStatus = (enrolled, capacity) => {
  const pct = enrolled / capacity
  if (pct >= 1)    return 'Full'
  if (pct >= 0.85) return 'Almost full'
  return 'Open'
}

export default function Classes() {
  const [classes,       setClasses]  = useState([])
  const [loading,       setLoading]  = useState(true)
  const [selectedClass, setClass]    = useState(null)
  const [showForm,      setShowForm] = useState(false)
  const [editData,      setEditData] = useState(null)

  useEffect(() => { fetchClasses() }, [])

  const fetchClasses = async () => {
    setLoading(true)
    try {
      const res = await getClassesApi()
      setClasses(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Cancel this class?')) return
    try {
      await deleteClassApi(id)
      fetchClasses()
      setClass(null)
    } catch (err) { console.error(err) }
  }

  const stats = [
    { label: 'Total classes',  value: classes.length,                                                                                                                              sub: 'Active classes',    subColor: 'text-gray-400'  },
    { label: 'Total enrolled', value: classes.reduce((a, c) => a + (c._count?.bookings || 0), 0),                                                                                  sub: 'Across all classes', subColor: 'text-green-600' },
    { label: 'Avg occupancy',  value: classes.length ? `${Math.round(classes.reduce((a, c) => a + ((c._count?.bookings || 0) / c.capacity), 0) / classes.length * 100)}%` : '0%', sub: 'Fill rate',          subColor: 'text-green-600' },
    { label: 'Full classes',   value: classes.filter(c => (c._count?.bookings || 0) >= c.capacity).length,                                                                         sub: 'At capacity',        subColor: 'text-amber-500' },
  ]

  return (
    <div className="space-y-4 md:space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 md:p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-xl md:text-2xl font-medium text-gray-900">{s.value}</p>
            <p className={`text-xs mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly schedule */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-800">Weekly schedule</p>
          <span className="text-xs text-gray-400 hidden sm:block">Mon 10 – Sat 15 Mar</span>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-6">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-6 gap-2 min-w-[480px]">
              {weekDays.map((day) => (
                <div key={day}>
                  <p className="text-xs font-medium text-gray-400 text-center pb-2 border-b border-gray-100 mb-2">
                    {day}
                  </p>
                  <div className="space-y-2">
                    {classes
                      .filter((c) => c.day?.includes(day))
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setClass(c)}
                          className={`rounded-lg border p-2 cursor-pointer hover:opacity-80 transition-opacity ${dayColors[day]}`}
                        >
                          <p className="text-xs opacity-60 mb-0.5">{c.time}</p>
                          <p className="text-xs font-medium leading-tight">{c.name}</p>
                          <p className="text-xs opacity-60 mt-0.5">
                            {c.trainer?.name?.split(' ')[0]}
                          </p>
                          <p className="text-xs opacity-70 mt-1">
                            {c._count?.bookings || 0}/{c.capacity}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Class list */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800">All classes</p>
          <button
            onClick={() => { setEditData(null); setShowForm(true) }}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + New class
          </button>
        </div>

        {loading ? (
          <div className="text-center text-sm text-gray-400 py-10">Loading...</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Class</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Trainer</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Days</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Time</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Duration</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Enrolled</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => {
                    const enrolled = c._count?.bookings || 0
                    const status   = getStatus(enrolled, c.capacity)
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setClass(c)}
                        className="border-b border-gray-50 hover:bg-indigo-50/40 cursor-pointer transition-colors last:border-0"
                      >
                        <td className="px-4 py-3 text-xs font-medium text-gray-800">{c.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.trainer?.name || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.day}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.time}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{c.duration} min</td>
                        <td className="px-4 py-3 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-indigo-400"
                                style={{ width: `${Math.min(Math.round((enrolled / c.capacity) * 100), 100)}%` }}
                              />
                            </div>
                            <span className="text-gray-500">{enrolled}/{c.capacity}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[status]}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  {classes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-sm text-gray-400 py-10">No classes found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {classes.map((c) => {
                const enrolled = c._count?.bookings || 0
                const status   = getStatus(enrolled, c.capacity)
                return (
                  <div
                    key={c.id}
                    onClick={() => setClass(c)}
                    className="p-4 cursor-pointer active:bg-indigo-50/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[status]}`}>
                        {status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-xs text-gray-400">Trainer</p>
                        <p className="text-xs font-medium text-gray-700">{c.trainer?.name?.split(' ')[0] || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Time</p>
                        <p className="text-xs font-medium text-gray-700">{c.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Enrolled</p>
                        <p className="text-xs font-medium text-gray-700">{enrolled}/{c.capacity}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
              {classes.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-10">No classes found</div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedClass && (
        <ClassModal
          cls={selectedClass}
          onClose={() => setClass(null)}
          onEdit={(c) => { setEditData(c); setShowForm(true); setClass(null) }}
          onDelete={handleDelete}
        />
      )}
      {showForm && (
        <ClassForm
          editData={editData}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchClasses() }}
        />
      )}
    </div>
  )
}