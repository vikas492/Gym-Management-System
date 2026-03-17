import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '▪' },
  { to: '/members',   label: 'Members',   icon: '●' },
  { to: '/classes',   label: 'Classes',   icon: '▦' },
  { to: '/trainers',  label: 'Trainers',  icon: '◈' },
  { to: '/payments',  label: 'Payments',  icon: '◇' },
  { to: '/equipment', label: 'Equipment', icon: '◻' },
  { to: '/reports',   label: 'Reports',   icon: '▲' },
]

export default function Sidebar() {
  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col py-4 flex-shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 pb-4 border-b border-gray-100 mb-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
          GF
        </div>
        <span className="text-sm font-medium text-gray-900">GymFlow</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 space-y-0.5">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <span className="text-xs opacity-70">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pt-3 border-t border-gray-100">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`
          }
        >
          <span className="text-xs opacity-70">⚙</span>
          Settings
        </NavLink>
      </div>
    </aside>
  )
}