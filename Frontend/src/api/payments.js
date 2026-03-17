// import api from '../lib/axios'

// export const getPaymentsApi   = (params)   => api.get('/payments', { params })
// export const createPaymentApi = (data)     => api.post('/payments', data)
// export const markAsPaidApi    = (id)       => api.put(`/payments/${id}/pay`)
// export const deletePaymentApi = (id)       => api.delete(`/payments/${id}`)

import api from '../lib/axios'

export const getPaymentsApi    = (params)  => api.get('/payments', { params })
export const getPaymentByIdApi = (id)      => api.get(`/payments/${id}`)
export const createPaymentApi  = (data)    => api.post('/payments', data)
export const markAsPaidApi     = (id)      => api.put(`/payments/${id}/pay`)
export const markAsOverdueApi  = (id)      => api.put(`/payments/${id}/overdue`)
export const deletePaymentApi  = (id)      => api.delete(`/payments/${id}`)