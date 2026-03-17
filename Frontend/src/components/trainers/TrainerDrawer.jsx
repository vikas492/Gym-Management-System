const statusStyles = {
  ACTIVE:   'bg-green-50 text-green-700',
  ON_LEAVE: 'bg-gray-100 text-gray-500',
}

export default function TrainerDrawer({ trainer, onClose, onEdit, onDelete }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <span className="text-sm font-medium text-gray-800">Trainer details</span>
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
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {trainer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{trainer.name}</p>
                <p className="text-xs text-gray-400">{trainer.phone}</p>
                {trainer.email && <p className="text-xs text-gray-400">{trainer.email}</p>}
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[trainer.status]}`}>
              {trainer.status === 'ON_LEAVE' ? 'On leave' : 'Active'}
            </span>
            {trainer.bio && (
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{trainer.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Stats</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Classes', value: trainer._count?.classes || 0  },
                { label: 'Members', value: trainer._count?.members || 0  },
                { label: 'Rating',  value: `${trainer.rating} ★`         },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Speciality */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Speciality</p>
            <div className="flex flex-wrap gap-1.5">
              {trainer.speciality.split(/[,،]/).map((s) => (
                <span
                  key={s.trim()}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full"
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Contact</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Phone</span>
                <span className="text-xs font-medium text-gray-700">{trainer.phone}</span>
              </div>
              {trainer.email && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Email</span>
                  <span className="text-xs font-medium text-gray-700">{trainer.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">Status</span>
                <span className="text-xs font-medium text-gray-700">
                  {trainer.status === 'ON_LEAVE' ? 'On leave' : 'Active'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Actions — fixed at bottom */}
        <div className="px-5 py-4 border-t border-gray-100 space-y-2 flex-shrink-0">
          <button
            onClick={() => onEdit(trainer)}
            className="w-full text-xs bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Edit trainer
          </button>
          <button
            onClick={() => onDelete(trainer.id)}
            className="w-full text-xs border border-red-100 text-red-500 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Remove trainer
          </button>
        </div>
      </div>
    </>
  )
}