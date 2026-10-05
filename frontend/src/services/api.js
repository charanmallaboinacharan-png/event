import axios from 'axios';

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_URL = (!isLocalhost || !rawApiUrl || rawApiUrl === 'http://localhost:8000') ? '' : rawApiUrl;

const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ee_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ee_token');
      localStorage.removeItem('ee_user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateMe: (data) => api.put('/auth/me', data),
};

// ─── Events ──────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};

// ─── Registrations ───────────────────────────────────────────────────────────
export const registrationsAPI = {
  register: (eventId) => api.post('/registrations', { event_id: eventId }),
  getMyRegistrations: () => api.get('/registrations/my'),
  cancelRegistration: (id) => api.delete(`/registrations/${id}`),
};

// ─── Tickets ─────────────────────────────────────────────────────────────────
export const ticketsAPI = {
  getMyTickets: () => api.get('/tickets/my'),
};

// ─── Check-in ────────────────────────────────────────────────────────────────
export const checkinAPI = {
  checkIn: (ticketCode, eventId) =>
    api.post('/checkin', { ticket_code: ticketCode, event_id: eventId }),
  getParticipants: (eventId) => api.get(`/checkin/participants/${eventId}`),
};

// ─── Organizer ───────────────────────────────────────────────────────────────
export const organizerAPI = {
  getMyEvents: () => api.get('/organizer/events'),
  getStats: () => api.get('/organizer/stats'),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// ─── Upload ───────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
