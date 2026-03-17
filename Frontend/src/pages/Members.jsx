import { useState, useEffect } from 'react'
import {
  getMembersApi, getMemberByIdApi,
  createMemberApi, deleteMemberApi
} from '../api/members'
import { getTrainersApi } from '../api/trainers'
import MemberDrawer from '../components/members/MemberDrawer'

const statusStyles = {
  ACTIVE:  'bg-green-50 text-green-700',
  FROZEN:  'bg-gray-100 text-gray-500',
  EXPIRED: 'bg-red-50 text-red-700',
}

const filters = ['All', 'ACTIVE', 'FROZEN', 'EXPIRED']

export default function Members() {
  const [members,        setMembers]  = useState([])
  const [trainers,       setTrainers] = useState([])
  const [loading,        setLoading]  = useState(true)
  const [search,         setSearch]   = useState('')
  const [activeFilter,   setFilter]   = useState('All')
  const [selectedMember, setMember]   = useState(null)
  const [showForm,       setShowForm] = useState(false)
  const [saving,         setSaving]   = useState(false)
  const [form, setForm] = useState({
    name:      '',
    phone:     '',
    email:     '',
    plan:      'MONTHLY',
    trainerId: '',
    expiresAt: ''
  })

  useEffect(() => { fetchMembers() }, [search, activeFilter])
  useEffect(() => {
    getTrainersApi().then(r => setTrainers(r.data.data))
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = {
        ...(search       && { search }),
        ...(activeFilter !== 'All' && { status: activeFilter }),
      }
      const res = await getMembersApi(params)
      setMembers(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = async (m) => {
    try {
      const res = await getMemberByIdApi(m.id)
      setMember(res.data.data)
    } catch {
      setMember(m)
    }
  }

const handleCreate = async (e) => {
  if (e?.preventDefault) e.preventDefault()
  if (!form.name || !form.phone || !form.expiresAt) return
  setSaving(true)
  try {
    await createMemberApi(form)
    setShowForm(false)
    setForm({
      name: '', phone: '', email: '',
      plan: 'MONTHLY', trainerId: '', expiresAt: ''
    })
    fetchMembers()
  } catch (err) {
    console.error(err)
  } finally {
    setSaving(false)
  }
}

  const handleDelete = async (id) => {
    try {
      await deleteMemberApi(id)
      fetchMembers()
      setMember(null)
    } catch (err) {
      console.error(err)
    }
  }

  const counts = filters.reduce((acc, f) => {
    acc[f] = f === 'All'
      ? members.length
      : members.filter(m => m.status === f).length
    return acc
  }, {})

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-900">All members</h2>
          <p className="text-xs text-gray-400 mt-0.5">{members.length} results</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New member
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white placeholder-gray-300"
      />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
              activeFilter === f
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-sm text-gray-400 py-10">Loading...</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Member</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Phone</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Plan</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Joined</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Expires</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Trainer</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr
                      key={m.id}
                      onClick={() => handleRowClick(m)}
                      className="border-b border-gray-50 hover:bg-indigo-50/40 cursor-pointer transition-colors last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {m.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{m.phone}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {m.plan.charAt(0) + m.plan.slice(1).toLowerCase()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(m.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(m.expiresAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {m.trainer?.name || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[m.status]}`}>
                          {m.status.charAt(0) + m.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-sm text-gray-400 py-10">
                        No members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                onClick={() => handleRowClick(m)}
                className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer active:bg-indigo-50/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {m.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.phone}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${statusStyles[m.status]}`}>
                    {m.status.charAt(0) + m.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400">Plan</p>
                    <p className="text-xs font-medium text-gray-700 mt-0.5">
                      {m.plan.charAt(0) + m.plan.slice(1).toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Expires</p>
                    <p className="text-xs font-medium text-gray-700 mt-0.5">
                      {new Date(m.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Trainer</p>
                    <p className="text-xs font-medium text-gray-700 mt-0.5">
                      {m.trainer?.name || '—'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-center text-sm text-gray-400 py-10">
                No members found
              </div>
            )}
          </div>
        </>
      )}

      {/* Member drawer */}
      {selectedMember && (
        <MemberDrawer
          member={selectedMember}
          onClose={() => setMember(null)}
          onDelete={handleDelete}
          onRefresh={fetchMembers}
        />
      )}

      {/* New member form */}
    {showForm && (
  <>
    <div
      className="fixed inset-0 bg-black/20 z-40"
      onClick={() => setShowForm(false)}
    />
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md shadow-xl flex flex-col"
        style={{ height: 'min(520px, 92vh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-medium text-gray-800">New member</span>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center"
          >✕</button>
        </div>

        {/* Scrollable fields */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Full name</label>
              <input
                type="text"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sneha Rao"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Phone</label>
              <input
                type="text"
                value={form.phone}
                required
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="sneha@gmail.com"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Plan</label>
              <select
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 bg-white"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUAL">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Trainer</label>
              <select
                value={form.trainerId}
                onChange={(e) => setForm({ ...form, trainerId: e.target.value })}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 bg-white"
              >
                <option value="">No trainer</option>
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Membership expiry</label>
            <input
              type="date"
              value={form.expiresAt}
              required
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
            />
          </div>
        </div>

        {/* Sticky buttons */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white space-y-2">
          <button
            onClick={handleCreate}
            disabled={saving}
            className="w-full text-sm bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add member'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="w-full text-sm border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  )
}
