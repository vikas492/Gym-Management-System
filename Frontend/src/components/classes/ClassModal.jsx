const statusStyles = {
  'Open':        'bg-green-50 text-green-700',
  'Almost full': 'bg-amber-50 text-amber-700',
  'Full':        'bg-red-50 text-red-700',
}

export default function ClassModal({ cls, onClose, onEdit, onDelete }) {
  const enrolled     = cls._count?.bookings || 0
  const occupancyPct = Math.min(Math.round((enrolled / cls.capacity) * 100), 100)
  const status       = occupancyPct >= 100 ? 'Full' : occupancyPct >= 85 ? 'Almost full' : 'Open'

  const handleDelete = () => {
    if (confirm(`Cancel "${cls.name}"? This will remove all bookings too.`)) {
      onDelete(cls.id)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-800">{cls.name}</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Class info */}
          <div className="px-5 py-4 border-b border-gray-100 space-y-3">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Class info</p>
            {[
              { label: 'Trainer',  value: cls.trainer?.name || '—' },
              { label: 'Days',     value: cls.day                  },
              { label: 'Time',     value: cls.time                 },
              { label: 'Duration', value: `${cls.duration} min`    },
              { label: 'Capacity', value: cls.capacity             },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-xs font-medium text-gray-700">{value}</span>
              </div>
            ))}
          </div>

          {/* Occupancy */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Occupancy</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[status]}`}>
                {status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${occupancyPct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{enrolled}/{cls.capacity}</span>
              <span className="text-xs text-gray-400">({occupancyPct}%)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 py-4 flex gap-2">
            <button
              onClick={() => onEdit(cls)}
              className="flex-1 text-xs bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Edit class
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 text-xs border border-red-200 text-red-500 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancel class
            </button>
          </div>
        </div>
      </div>
    </>
  )
}