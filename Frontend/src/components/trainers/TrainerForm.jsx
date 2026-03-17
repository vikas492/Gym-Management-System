import { useState, useEffect }               from 'react'
import { createTrainerApi, updateTrainerApi } from '../../api/trainers'

export default function TrainerForm({ editData, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    speciality: '', bio: '', status: 'ACTIVE'
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    if (editData) setForm({
      name:       editData.name       || '',
      phone:      editData.phone      || '',
      email:      editData.email      || '',
      speciality: editData.speciality || '',
      bio:        editData.bio        || '',
      status:     editData.status     || 'ACTIVE',
    })
  }, [editData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (editData) await updateTrainerApi(editData.id, form)
      else          await createTrainerApi(form)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4">
        <div
          className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md shadow-xl flex flex-col"
          style={{ maxHeight: '85vh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <span className="text-sm font-medium text-gray-800">
              {editData ? 'Edit trainer' : 'Add trainer'}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-5 py-4">
            <form id="trainer-form" onSubmit={handleSubmit} className="space-y-3">
              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Full name</label>
                <input type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ravi Sharma"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Phone</label>
                <input type="text" value={form.phone} required
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ravi@gymflow.in"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Speciality</label>
                <input type="text" value={form.speciality} required
                  onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                  placeholder="CrossFit, HIIT"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Short bio..."
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On leave</option>
                </select>
              </div>
            </form>
          </div>

          {/* Sticky footer */}
          <div className="flex gap-2 px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
            <button
              type="submit"
              form="trainer-form"
              disabled={loading}
              className="flex-1 text-xs bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : editData ? 'Save changes' : 'Add trainer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-xs border border-gray-200 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}