import api from './api'

export const userService = {
  async getDashboardStats() {
    const response = await api.get('/users/dashboard')
    return response.data
  },
}