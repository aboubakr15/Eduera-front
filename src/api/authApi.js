import axiosInstance from "./axios";

export const authApi = {
  changePassword: (data) => axiosInstance.post("/api/auth/change-password/", data),
  forgotPassword: (data) => axiosInstance.post("/api/auth/forgot-password/", data),
  resetPassword: (data) => axiosInstance.post("/api/auth/reset-password/", data),
  getNotifications: () => axiosInstance.get("/api/notifications/"),
  markNotificationRead: (id) =>
    id
      ? axiosInstance.post(`/api/notifications/${id}/mark-read/`)
      : axiosInstance.post("/api/notifications/mark-read/"),
};
