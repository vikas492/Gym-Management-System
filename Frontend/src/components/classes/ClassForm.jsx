import { useState, useEffect }             from 'react'
import { createClassApi, updateClassApi }  from '../../api/classes'
import { getTrainersApi }                  from '../../api/trainers'

export default function ClassForm({ editData, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', trainerId: '', day: '',
    time: '', duration: 60, capacity: 20
  })
  const [trainers, setTrainers] = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    getTrainersApi().then(res => setTrainers(res.data.data))
    if (editData) setForm({
      name:      editData.name        || '',
      trainerId: editData.trainerId   || '',
      day:       editData.day         || '',
      time:      editData.time        || '',
      duration:  editData.duration    || 60,
      capacity:  editData.capacity    || 20,
    })
  }, [editData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (editData) await updateClassApi(editData.id, form)
      else          await createClassApi(form)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-800">
              {editData ? 'Edit class' : 'New class'}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Class name</label>
              <input
                type="text" value={form.name} required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="CrossFit, Yoga Flow..."
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Trainer</label>
              <select
                value={form.trainerId} required
                onChange={(e) => setForm({ ...form, trainerId: e.target.value })}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
              >
                <option value="">Select trainer</option>
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Days</label>
                <input
                  type="text" value={form.day} required
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  placeholder="Mon & Fri"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Time</label>
                <input
                  type="text" value={form.time} required
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="6:00 am"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Duration (min)</label>
                <input
                  type="number" value={form.duration} required
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Capacity</label>
                <input
                  type="number" value={form.capacity} required
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit" disabled={loading}
                className="flex-1 text-xs bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : editData ? 'Save changes' : 'Create class'}
              </button>
              <button
                type="button" onClick={onClose}
                className="flex-1 text-xs border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}