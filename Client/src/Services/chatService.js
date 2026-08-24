import api from './api';

export const chatService = {
  async sendMessage(message) {
    try {
      const response = await api.post('/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },

  async getHistory() {
    const response = await api.get('/chat/history');
    return response.data;
  },
};