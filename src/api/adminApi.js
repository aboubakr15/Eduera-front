import api from './axios';

export const adminApi = {
  getDashboardSummary: () => api.get('/admin/dashboard/summary/'),
   
  getCourses: (params) => api.get('/admin/courses/', { params }),
  createCourse: (data) => api.post('/admin/courses/', data),
  updateCourse: (id, data) => api.patch(`/admin/courses/${id}/`, data),
  deleteCourse: (id) => api.delete(`/admin/courses/${id}/`),

  getCourseOfferings: (params) => api.get('/admin/course-offerings/', { params }),
  createCourseOffering: (data) => api.post('/admin/course-offerings/', data),
  updateCourseOffering: (id, data) => api.patch(`/admin/course-offerings/${id}/`, data),
  deleteCourseOffering: (id) => api.delete(`/admin/course-offerings/${id}/`),
   
  getUsers: (role) => api.get('/admin/users/', { params: { role } }),
  createInstructor: (data) => api.post('/admin/users/instructors/', data),
  createTA: (data) => api.post('/admin/users/tas/', data),
   
  getAnnouncements: () => api.get('/admin/announcements/'),
  createAnnouncement: (data) => api.post('/admin/announcements/', data),
   
  uploadMaterial: (data) => api.post('/admin/materials/upload/', data),

  generateQuiz: (data) => api.post('/admin/chat/generate-quiz/', data),
  generatePresentation: (data) => api.post('/admin/chat/generate-presentation/', data),

  getConversations: () => api.get('/admin/chat/'),
  getConversationMessages: (conversationId) => api.get('/admin/chat/messages/', { params: { conversation_id: conversationId } }),
  sendChatMessage: (data) => api.post('/admin/chat/', data),
  createConversation: (data) => api.post('/admin/conversations/', data),
  getConversationDetails: (id) => api.get(`/admin/conversations/${id}/`),
  updateConversation: (id, data) => api.patch(`/admin/conversations/${id}/`, data),
  deleteConversation: (id) => api.delete(`/admin/conversations/${id}/`),

  getProfile: () => api.get('/admin/profile/'),
  getSystemStats: () => api.get('/admin/system-stats/'),
  updateProfile: (data) => api.patch('/admin/profile/', data),
  changePassword: (data) => api.post('/api/auth/change-password/', data),

  getNotifications: () => api.get('/admin/notifications/'),

  getDepartments: (params) => api.get('/admin/departments/', { params }),
  createDepartment: (data) => api.post('/admin/departments/', data),
  updateDepartment: (id, data) => api.patch(`/admin/departments/${id}/`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}/`),
};
