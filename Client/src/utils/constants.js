export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
  },
  TRIPS: {
    BASE: '/trips',
    PDF: (id) => `/trips/${id}/pdf`,
  },
  CHAT: '/chat',
  DASHBOARD: '/users/dashboard',
}

export const BUDGET_CATEGORIES = {
  BUDGET: { min: 0, max: 15000, label: 'Budget', color: '#10b981' },
  MODERATE: { min: 15001, max: 35000, label: 'Moderate', color: '#3b82f6' },
  PREMIUM: { min: 35001, max: 70000, label: 'Premium', color: '#8b5cf6' },
  LUXURY: { min: 70001, max: Infinity, label: 'Luxury', color: '#f59e0b' },
}

export const DESTINATION_TYPES = {
  BEACH: 'Beach',
  MOUNTAIN: 'Mountain',
  HERITAGE: 'Heritage',
  ADVENTURE: 'Adventure',
  SPIRITUAL: 'Spiritual',
  WILDLIFE: 'Wildlife',
}