import api from '../lib/axios'

export const getTrainersApi    = ()         => api.get('/trainers')
export const getTrainerByIdApi = (id)       => api.get(`/trainers/${id}`)
export const createTrainerApi  = (data)     => api.post('/trainers', data)
export const updateTrainerApi  = (id, data) => api.put(`/trainers/${id}`, data)
export const deleteTrainerApi  = (id)       => api.delete(`/trainers/${id}`)
