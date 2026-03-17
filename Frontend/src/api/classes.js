import api from '../lib/axios'

export const getClassesApi    = ()           => api.get('/classes')
export const getClassByIdApi  = (id)         => api.get(`/classes/${id}`)
export const createClassApi   = (data)       => api.post('/classes', data)
export const updateClassApi   = (id, data)   => api.put(`/classes/${id}`, data)
export const deleteClassApi   = (id)         => api.delete(`/classes/${id}`)
export const bookClassApi     = (id, data)   => api.post(`/classes/${id}/book`, data)
