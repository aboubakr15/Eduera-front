import api from './axios';

export const studentApi = {
  getDashboard: () => api.get('/api/student/dashboard/'),
  
  getCourses: () => api.get('/api/student/courses/'),
  enrollCourse: (data) => api.post('/api/student/courses/', data),
  getCourseDetails: (id) => api.get(`/api/student/courses/${id}/`),
  
  getEnrollments: (params) => api.get('/api/student/enrollments/', { params }),
  dropEnrollment: (id) => api.delete(`/api/student/enrollments/${id}/`),
  
  getSubmissions: () => api.get('/api/student/submissions/'),
  submitAssignment: (data) => api.post('/api/student/submissions/', data),
  
  getGrades: () => api.get('/api/student/grades/'),
  
  getTodo: () => api.get('/api/student/todo/'),
  createTodo: (data) => api.post('/api/student/todo/', data),
  updateTodo: (id, data) => api.post(`/api/student/todo/${id}/`, data),
  deleteTodo: (id) => api.delete(`/api/student/todo/${id}/`),
  
  getProfile: () => api.get('/api/student/profile/'),
  updateProfile: (data) => api.patch('/api/student/profile/', data),
  
  getChatHistory: () => api.get('/api/student/chat/'),
  sendChatMessage: (data) => api.post('/api/student/chat/', data),
  
  getNotifications: () => api.get('/api/student/notifications/'),
  markNotificationRead: (id, data) => api.patch(`/api/student/notifications/${id}/`, data),
};