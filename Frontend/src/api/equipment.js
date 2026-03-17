import api from '../lib/axios'

export const getEquipmentApi      = (params)          => api.get('/equipment', { params })
export const getEquipmentByIdApi  = (id)              => api.get(`/equipment/${id}`)
export const createEquipmentApi   = (data)            => api.post('/equipment', data)
export const updateEquipmentApi   = (id, data)        => api.put(`/equipment/${id}`, data)
export const deleteEquipmentApi   = (id)              => api.delete(`/equipment/${id}`)
export const addMaintenanceLogApi = (id, data)        => api.post(`/equipment/${id}/logs`, data)
export const updateLogStatusApi   = (id, logId, data) => api.put(`/equipment/${id}/logs/${logId}`, data)