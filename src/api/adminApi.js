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
   
  getConversations: () => api.get('/admin/chat/'),
  getConversationMessages: (conversationId) => api.get('/admin/chat/messages/', { params: { conversation_id: conversationId } }),
   
  getNotifications: () => api.get('/admin/notifications/'),
};
