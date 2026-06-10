import api from './axios';

export const studentApi = {
  getDashboard: () => api.get('/api/student/dashboard/'),
  getAnnouncements: () => api.get('/api/student/announcements/'),
  
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
  updateTodo: (id, data) => api.patch(`/api/student/todo/${id}/`, data),
  deleteTodo: (id) => api.delete(`/api/student/todo/${id}/`),
  
  getProfile: () => api.get('/api/student/profile/'),
  updateProfile: (data) => api.patch('/api/student/profile/', data),
  
  getChatHistory: () => api.get('/api/student/chat/'),
  sendChatMessage: (data) => api.post('/api/student/chat/', data),
  getChatMessages: (conversationId) => api.get('/api/student/chat/messages/', { params: { conversation_id: conversationId } }),
  
  getConversations: () => api.get('/api/student/conversations/'),
  createConversation: (data) => api.post('/api/student/conversations/', data),
  getConversationDetails: (id) => api.get(`/api/student/conversations/${id}/`),
  updateConversation: (id, data) => api.patch(`/api/student/conversations/${id}/`, data),
  deleteConversation: (id) => api.delete(`/api/student/conversations/${id}/`),
  
  getAssignments: () => api.get('/api/student/assignments/'),

  getCourseChat: (courseId) => api.get(`/api/student/courses/${courseId}/chat/`),
  sendCourseMessage: (courseId, data) => api.post(`/api/student/courses/${courseId}/chat/`, data),

  generateQuiz: (data) => api.post('/api/student/chat/generate-quiz/', data),
  generatePresentation: (data) => api.post('/api/student/chat/generate-presentation/', data),

  getNotifications: () => api.get('/api/student/notifications/'),
  markNotificationRead: (id, data) => api.patch(`/api/student/notifications/${id}/`, data),
};