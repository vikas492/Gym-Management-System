import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/members':   'Members',
  '/classes':   'Classes',
  '/trainers':  'Trainers',
  '/payments':  'Payments',
  '/equipment': 'Equipment',
  '/reports':   'Reports',
  '/settings':  'Settings',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const navigate     = useNavigate()
  const { user, logout } = useAuthStore()
  const title = pageTitles[pathname] || 'GymFlow'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'A'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Logo — only on mobile since sidebar is hidden */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-medium">
            GF
          </div>
        </div>
        <h1 className="text-sm md:text-base font-medium text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <span className="hidden md:block text-xs text-gray-400">{user?.name || ''}</span>
        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-lg px-2 md:px-3 py-1.5 transition-colors"
        >
          Logout
        </button>
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-800">
          {initials}
        </div>
      </div>
    </header>
  )
}