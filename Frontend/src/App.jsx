import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect }     from 'react'
import Layout            from './components/layout/Layout'
import ProtectedRoute    from './components/layout/ProtectedRoute'
import useAuthStore      from './store/authStore'
import Login             from './pages/Login'
import Dashboard         from './pages/Dashboard'
import Members           from './pages/Members'
import Classes           from './pages/Classes'
import Trainers          from './pages/Trainers'
import Payments          from './pages/Payments'
import Equipment         from './pages/Equipment'
import Reports           from './pages/Reports'
import Settings          from './pages/Settings'

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const token   = useAuthStore((s) => s.token)

  useEffect(() => {
    if (token) fetchMe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members"   element={<Members />} />
          <Route path="classes"   element={<Classes />} />
          <Route path="trainers"  element={<Trainers />} />
          <Route path="payments"  element={<Payments />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="reports"   element={<Reports />} />
          <Route path="settings"  element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}