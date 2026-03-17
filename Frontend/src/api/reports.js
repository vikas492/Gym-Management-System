import api from '../lib/axios'

export const getReportsApi = () => api.get('/reports')