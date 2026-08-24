import api from './api'

export const tripService = {
  async saveTrip(tripData) {
    const response = await api.post('/trips', tripData)
    return response.data
  },

  async getAllTrips() {
    const response = await api.get('/trips')
    return response.data
  },

  async getTripById(id) {
    const response = await api.get(`/trips/${id}`)
    return response.data
  },

  async deleteTrip(id) {
    const response = await api.delete(`/trips/${id}`)
    return response.data
  },

  async downloadPDF(id) {
    const response = await api.get(`/trips/${id}/pdf`, {
      responseType: 'blob',
    })
    return response.data
  },
}