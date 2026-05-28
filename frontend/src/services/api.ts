import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set token in header after login
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authService = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string, department: string) =>
    api.post('/auth/register', { email, password, name, department }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (name: string, department: string) =>
    api.put('/auth/profile', { name, department }),
  
  logout: () =>
    api.delete('/auth/logout')
};

export const feedbackService = {
  sendFeedback: (evaluatedId: number, rating: number, comment: string, isAnonymous: boolean, feedbackType: 'colleague' | 'manager') =>
    api.post('/feedbacks', { evaluated_id: evaluatedId, rating, comment, is_anonymous: isAnonymous, feedback_type: feedbackType }),
  
  getEvaluableUsers: (type?: 'colleagues' | 'managers') =>
    api.get('/feedbacks/evaluable-users', { params: { type } }),
  
  getReceivedFeedbacks: () =>
    api.get('/feedbacks/received'),
  
  getFeedbackStats: () =>
    api.get('/feedbacks/stats'),
  
  updateFeedback: (feedbackId: number, rating: number, comment: string) =>
    api.put(`/feedbacks/${feedbackId}`, { rating, comment }),
  
  deleteFeedback: (feedbackId: number) =>
    api.delete(`/feedbacks/${feedbackId}`)
};

export const reportsService = {
  getOverallReport: () =>
    api.get('/reports/overall'),
  
  getDepartmentReport: (department: string) =>
    api.get('/reports/department', { params: { department } }),
  
  getUserAverages: () =>
    api.get('/reports/averages'),
  
  getDepartments: () =>
    api.get('/reports/departments'),
  
  getManagersReport: () =>
    api.get('/reports/managers'),
  
  getTrendingFeedbacks: () =>
    api.get('/reports/trending'),
  
  getDepartmentsComparison: () =>
    api.get('/reports/comparison')
};
