import api from '../lib/axios'

export const sendMessageApi = (messages) =>
  api.post('/chat', { messages })