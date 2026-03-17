import { useState } from 'react'
import { updateMemberApi } from '../../api/members'

const statusStyles = {
  ACTIVE:  'bg-green-50 text-green-700',
  FROZEN:  'bg-gray-100 text-gray-500',
  EXPIRED: 'bg-red-50 text-red-700',
}

export default function MemberDrawer({ member, onClose, onDelete, onRefresh }) {
  const [loading, setLoading] = useState(false)

  const handleRenew = async () => {
    if (!confirm(`Renew ${member.name}'s membership for 1 month?`)) return
    setLoading(true)
    try {
      const currentExpiry = new Date(member.expiresAt)
      const newExpiry     = new Date(currentExpiry)
      newExpiry.setMonth(newExpiry.getMonth() + 1)

      await updateMemberApi(member.id, {
        status:    'ACTIVE',
        expiresAt: newExpiry.toISOString(),
      })
      onRefresh()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFreeze = async () => {
    if (!confirm(`Freeze ${member.name}'s membership?`)) return
    setLoading(true)
    try {
      await updateMemberApi(member.id, { status: 'FROZEN' })
      onRefresh()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnfreeze = async () => {
    if (!confirm(`Unfreeze ${member.name}'s membership?`)) return
    setLoading(true)
    try {
      await updateMemberApi(member.id, { status: 'ACTIVE' })
      onRefresh()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    if (confirm(`Remove ${member.name}? This will delete all their payments and bookings too.`)) {
      onDelete(member.id)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-medium text-gray-800">Member details</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Profile */}
          <div className="px-5 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-400">{member.phone}</p>
                {member.email && (
                  <p className="text-xs text-gray-400">{member.email}</p>
                )}
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[member.status]}`}>
              {member.status.charAt(0) + member.status.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Membership details */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
              Membership
            </p>
            <div className="space-y-2.5">
              {[
                { label: 'Plan',       value: member.plan.charAt(0) + member.plan.slice(1).toLowerCase()    },
                { label: 'Joined',     value: new Date(member.joinedAt).toLocaleDateString()                },
                { label: 'Expires',    value: new Date(member.expiresAt).toLocaleDateString()               },
                { label: 'Trainer',    value: member.trainer?.name || '—'                                   },
                { label: 'This month', value: `${member.checkIns?.length || 0} visits`                      },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-medium text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent payments */}
          {member.payments?.length > 0 && (
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Recent payments
              </p>
              <div className="space-y-2.5">
                {member.payments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center">
                    <span className="text-xs text-gray-700 font-medium">
                      ₹{p.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">{p.method}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.status === 'PAID'    ? 'bg-green-50 text-green-700' :
                      p.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class bookings */}
          {member.bookings?.length > 0 && (
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Class bookings
              </p>
              <div className="space-y-2">
                {member.bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <p className="text-xs text-gray-600 flex-1">{b.class?.name}</p>
                    <p className="text-xs text-gray-400">{b.class?.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check-in history */}
          {member.checkIns?.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Recent check-ins
              </p>
              <div className="space-y-2">
                {member.checkIns.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0" />
                    <p className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleDateString()} at{' '}
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour:   '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Actions — fixed at bottom */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-2 flex-shrink-0">

          <button
            onClick={handleRenew}
            disabled={loading}
            className="w-full text-xs bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Renew membership'}
          </button>

          {member.status === 'FROZEN' ? (
            <button
              onClick={handleUnfreeze}
              disabled={loading}
              className="w-full text-xs border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Unfreeze membership
            </button>
          ) : (
            <button
              onClick={handleFreeze}
              disabled={loading}
              className="w-full text-xs border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Freeze membership
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full text-xs border border-red-100 text-red-500 py-2.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Remove member
          </button>

        </div>
      </div>
    </>
  )
}