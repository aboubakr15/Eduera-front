import api from './axios';

export const instructorApi = {
  getDashboard: () => api.get('/api/professor/dashboard/'),
  
  getCourses: () => api.get('/api/professor/courses/'),
  createCourse: (data) => api.post('/api/professor/courses/', data),
  getCourseDetails: (id) => api.get(`/api/professor/courses/${id}/`),
  updateCourse: (id, data) => api.patch(`/api/professor/courses/${id}/`, data),
  deleteCourse: (id) => api.delete(`/api/professor/courses/${id}/`),
  
  getMaterials: (params) => api.get('/api/professor/materials/', { params }),
  createMaterial: (data) => api.post('/api/professor/materials/', data),
  updateMaterial: (id, data) => api.patch(`/api/professor/materials/${id}/`, data),
  deleteMaterial: (id) => api.delete(`/api/professor/materials/${id}/`),
  
  getAssignments: (params) => api.get('/api/professor/assignments/', { params }),
  createAssignment: (data) => api.post('/api/professor/assignments/', data),
  getAssignmentDetails: (id) => api.get(`/api/professor/assignments/${id}/`),
  updateAssignment: (id, data) => api.patch(`/api/professor/assignments/${id}/`, data),
  deleteAssignment: (id) => api.delete(`/api/professor/assignments/${id}/`),
  
  getSubmissions: (params) => api.get('/api/professor/submissions/', { params }),
  gradeSubmission: (id, data) => api.post(`/api/professor/submissions/${id}/grade/`, data),
  
  getStudents: (params) => api.get('/api/professor/students/', { params }),
  
  getAnnouncements: (params) => api.get('/api/professor/announcements/', { params }),
  createAnnouncement: (data) => api.post('/api/professor/announcements/', data),
  updateAnnouncement: (id, data) => api.patch(`/api/professor/announcements/${id}/`, data),
  deleteAnnouncement: (id) => api.delete(`/api/professor/announcements/${id}/`),
  
  getConversations: () => api.get('/api/professor/chat/'),
  getConversationMessages: (conversationId) => api.get('/api/professor/chat/messages/', { params: { conversation_id: conversationId } }),
  
  getNotifications: () => api.get('/api/professor/notifications/'),
  markNotificationRead: (id, data) => api.patch(`/api/professor/notifications/${id}/`, data),
};