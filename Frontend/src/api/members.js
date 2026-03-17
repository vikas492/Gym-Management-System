import api from '../lib/axios'

export const getMembersApi    = (params) => api.get('/members', { params })
export const getMemberByIdApi = (id)     => api.get(`/members/${id}`)
export const createMemberApi  = (data)   => api.post('/members', data)
export const updateMemberApi  = (id, data) => api.put(`/members/${id}`, data)
export const deleteMemberApi  = (id)     => api.delete(`/members/${id}`)
export const checkInMemberApi = (id)     => api.post(`/members/${id}/checkin`)