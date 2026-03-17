import { useState, useEffect } from 'react'
import {
  getPaymentsApi, markAsPaidApi,
  markAsOverdueApi, deletePaymentApi,
  createPaymentApi
} from '../api/payments'
import { getMembersApi } from '../api/members'

const statusStyles = {
  PAID:    'bg-green-50 text-green-700',
  PENDING: 'bg-amber-50 text-amber-700',
  OVERDUE: 'bg-red-50 text-red-700',
}

const filters    = ['All', 'PAID', 'PENDING', 'OVERDUE']
const maxBar     = 420000
const revenueMonths = [
  { month: 'Oct', value: 280000 },
  { month: 'Nov', value: 310000 },
  { month: 'Dec', value: 340000 },
  { month: 'Jan', value: 370000 },
  { month: 'Feb', value: 390000 },
  { month: 'Mar', value: 420000 },
]

export default function Payments() {
  const [payments,     setPayments]  = useState([])
  const [members,      setMembers]   = useState([])
  const [loading,      setLoading]   = useState(true)
  const [activeFilter, setFilter]    = useState('All')
  const [showForm,     setShowForm]  = useState(false)
  const [saving,       setSaving]    = useState(false)
  const [form, setForm] = useState({
    memberId: '', amount: '', method: 'UPI', dueDate: ''
  })

  useEffect(() => {
    fetchPayments()
    getMembersApi().then(res => setMembers(res.data.data))
  }, [activeFilter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const params = activeFilter !== 'All' ? { status: activeFilter } : {}
      const res    = await getPaymentsApi(params)
      setPayments(res.data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleMarkPaid = async (id) => {
    try { await markAsPaidApi(id); fetchPayments() }
    catch (err) { console.error(err) }
  }

  const handleMarkOverdue = async (id) => {
    try { await markAsOverdueApi(id); fetchPayments() }
    catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return
    try { await deletePaymentApi(id); fetchPayments() }
    catch (err) { console.error(err) }
  }

 const handleCreate = async (e) => {
  if (e?.preventDefault) e.preventDefault()
  if (!form.memberId || !form.amount || !form.dueDate) return
  setSaving(true)
  try {
    await createPaymentApi(form)
    setShowForm(false)
    setForm({ memberId: '', amount: '', method: 'UPI', dueDate: '' })
    fetchPayments()
  } catch (err) {
    console.error(err)
  } finally {
    setSaving(false)
  }
}

  const totalPaid    = payments.filter(p => p.status === 'PAID').reduce((a, p) => a + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((a, p) => a + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'OVERDUE').reduce((a, p) => a + p.amount, 0)

  const stats = [
    { label: 'Collected', value: `₹${totalPaid.toLocaleString()}`,    sub: 'Paid invoices',                                                    subColor: 'text-green-600' },
    { label: 'Pending',   value: `₹${totalPending.toLocaleString()}`,  sub: `${payments.filter(p => p.status === 'PENDING').length} invoices`,  subColor: 'text-amber-500' },
    { label: 'Overdue',   value: `₹${totalOverdue.toLocaleString()}`,  sub: `${payments.filter(p => p.status === 'OVERDUE').length} members`,   subColor: 'text-red-500'   },
    { label: 'Total',     value: payments.length,                      sub: 'All invoices',                                                     subColor: 'text-gray-400'  },
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

      {/* Revenue chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-medium text-gray-800 mb-4">Revenue — last 6 months</p>
        <div className="flex items-end gap-2 md:gap-3 h-24 md:h-28">
          {revenueMonths.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-400 hidden sm:block">
                ₹{(m.value / 100000).toFixed(1)}L
              </span>
              <div
                className="w-full rounded-t-md bg-indigo-500"
                style={{ height: `${Math.round((m.value / maxBar) * 80)}px` }}
              />
              <span className="text-xs text-gray-400">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <p className="text-sm font-medium text-gray-800 flex-shrink-0">Invoices</p>
            <div className="flex gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors flex-shrink-0 ${
                    activeFilter === f
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {f === 'All' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0 ml-2"
          >
            + New
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
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Member</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Amount</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Method</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Due date</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                            {p.member?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <span className="text-xs font-medium text-gray-800">{p.member?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-800">₹{p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{p.method}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(p.dueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>
                          {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {p.status !== 'PAID' && (
                            <button onClick={() => handleMarkPaid(p.id)} className="text-xs text-green-600 hover:text-green-800 font-medium">
                              Mark paid
                            </button>
                          )}
                          {p.status === 'PENDING' && (
                            <button onClick={() => handleMarkOverdue(p.id)} className="text-xs text-amber-500 hover:text-amber-700 font-medium">
                              Overdue
                            </button>
                          )}
                          <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center text-sm text-gray-400 py-10">No invoices found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {payments.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {p.member?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{p.member?.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>
                      {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Amount</p>
                        <p className="text-xs font-medium text-gray-800">₹{p.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Due</p>
                        <p className="text-xs font-medium text-gray-700">{new Date(p.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Method</p>
                        <p className="text-xs font-medium text-gray-700">{p.method}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {p.status !== 'PAID' && (
                        <button onClick={() => handleMarkPaid(p.id)} className="text-xs text-green-600 font-medium">
                          Paid
                        </button>
                      )}
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-10">No invoices found</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* New invoice form */}
     {showForm && (
  <>
    <div
      className="fixed inset-0 bg-black/20 z-40"
      onClick={() => setShowForm(false)}
    />
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-sm shadow-xl flex flex-col"
        style={{ height: 'min(520px, 90vh)' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-medium text-gray-800">New invoice</span>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Scrollable fields */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Member</label>
            <select
              value={form.memberId}
              required
              onChange={(e) => setForm({ ...form, memberId: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 bg-white"
            >
              <option value="">Select member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              required
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="1800"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Payment method</label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800 bg-white"
            >
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              required
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-100 text-gray-800"
            />
          </div>

        </div>

        {/* Sticky buttons — always visible at bottom */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 bg-white">
          <button
            onClick={handleCreate}
            disabled={saving || !form.memberId || !form.amount || !form.dueDate}
            className="w-full text-sm bg-indigo-600 text-white py-3.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40 mb-2"
          >
            {saving ? 'Creating...' : 'Create invoice'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="w-full text-sm border border-gray-200 text-gray-600 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
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