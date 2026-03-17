import { useState, useEffect } from 'react'
import { getTrainersApi, deleteTrainerApi } from '../api/trainers'
import TrainerDrawer from '../components/trainers/TrainerDrawer'
import TrainerForm   from '../components/trainers/TrainerForm'

const statusStyles = {
  ACTIVE:   'bg-green-50 text-green-700',
  ON_LEAVE: 'bg-gray-100 text-gray-500',
}

export default function Trainers() {
  const [trainers,  setTrainers]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [selected,  setSelected]  = useState(null)
  const [showForm,  setShowForm]  = useState(false)
  const [editData,  setEditData]  = useState(null)

  useEffect(() => { fetchTrainers() }, [])

  const fetchTrainers = async () => {
    setLoading(true)
    try {
      const res = await getTrainersApi()
      setTrainers(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleEdit = (trainer) => {
    setEditData(trainer)
    setShowForm(true)
    setSelected(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this trainer?')) return
    try {
      await deleteTrainerApi(id)
      fetchTrainers()
      setSelected(null)
    } catch (err) { console.error(err) }
  }

  const stats = [
    { label: 'Total trainers',    value: trainers.length,                                                              sub: `${trainers.filter(t => t.status === 'ACTIVE').length} active today`, subColor: 'text-gray-400'  },
    { label: 'Classes this week', value: trainers.reduce((a, t) => a + (t._count?.classes || 0), 0),                  sub: 'Total classes',    subColor: 'text-green-600' },
    { label: 'Avg rating',        value: trainers.length ? (trainers.reduce((a, t) => a + t.rating, 0) / trainers.length).toFixed(1) : 0, sub: 'From all reviews', subColor: 'text-green-600' },
    { label: 'Total members',     value: trainers.reduce((a, t) => a + (t._count?.members || 0), 0),                  sub: 'Assigned members', subColor: 'text-amber-500' },
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-800">Trainer roster</p>
          <button
            onClick={() => { setEditData(null); setShowForm(true) }}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            + Add trainer
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
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Trainer</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Speciality</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Classes</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Members</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Rating</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="border-b border-gray-50 hover:bg-indigo-50/40 cursor-pointer transition-colors last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {t.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-800">{t.name}</p>
                            <p className="text-xs text-gray-400">{t.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{t.speciality}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-600">{t._count?.classes || 0}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-600">{t._count?.members || 0}</td>
                      <td className="px-4 py-3 text-xs font-medium text-amber-600">{t.rating} ★</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[t.status]}`}>
                          {t.status === 'ON_LEAVE' ? 'On leave' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {trainers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-sm text-gray-400 py-10">No trainers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {trainers.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="flex items-center gap-3 p-4 cursor-pointer active:bg-indigo-50/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {t.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400 truncate">{t.speciality}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-amber-600">{t.rating} ★</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[t.status]}`}>
                      {t.status === 'ON_LEAVE' ? 'On leave' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
              {trainers.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-10">No trainers found</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Top rated + shift overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Top rated</p>
          <div className="space-y-3">
            {[...trainers]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {t.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{t.name}</p>
                    <p className="text-xs text-gray-400 truncate">{t.speciality}</p>
                  </div>
                  <span className="text-sm font-medium text-amber-500 flex-shrink-0">{t.rating} ★</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-800 mb-4">Shift coverage this week</p>
          <div className="space-y-2.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
              const counts = [3, 2, 2, 1, 3, 2]
              const colors = ['text-green-600', 'text-green-600', 'text-green-600', 'text-amber-500', 'text-green-600', 'text-green-600']
              const labels = ['Ravi, Nina, Arjun', 'Priya, Arjun', 'Ravi, Nina', 'Arjun only', 'Ravi, Nina, Priya', 'Priya, Mohan']
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-7 flex-shrink-0">{day}</span>
                  <span className="flex-1 text-xs text-gray-600 truncate">{labels[i]}</span>
                  <span className={`text-xs font-medium flex-shrink-0 ${colors[i]}`}>{counts[i]} on shift</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {selected && (
        <TrainerDrawer
          trainer={selected}
          onClose={() => setSelected(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {showForm && (
        <TrainerForm
          editData={editData}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchTrainers() }}
        />
      )}
    </div>
  )
}