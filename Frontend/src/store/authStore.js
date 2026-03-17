import { create } from 'zustand'
import { loginApi, getMeApi } from '../api/auth'

const useAuthStore = create((set) => ({
  user:    null,
  token:   localStorage.getItem('token') || null,
  loading: false,
  error:   null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await loginApi({ email, password })
      localStorage.setItem('token', res.data.token)
      set({ user: res.data.user, token: res.data.token, loading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  fetchMe: async () => {
    try {
      const res = await getMeApi()
      set({ user: res.data.user })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  }
}))

export default useAuthStore