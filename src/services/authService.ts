import { apiClient } from "./ApiClient";

export const authService = {
  signup: <T>(payload: T) =>
    apiClient.post(`/api/user/register`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }, // Ensures HttpOnly cookies are sent
    }),
  resentOtp: <T>(payload: T) => apiClient.post(`/api/user/resend-otp`, payload),

  verifyOtp: <T>(payload: T) =>
    apiClient.post("/api/user/verify-otp", payload, {
      withCredentials: true,
    }),

  login: <T>(payload: T) =>
    apiClient.post(`/api/user/login`, payload, {
      withCredentials: true,
    }),
  adminLogin: <T>(payload: T) =>
    apiClient.post(`/api/admin/login`, payload, { withCredentials: true }),
  adminLogout: () =>
    apiClient.post(`/api/admin/logout`, {}, { withCredentials: true }),
  usersList: () =>
    apiClient.get(`/api/admin/usersList`, {
      withCredentials: true,
    }),
  changeStatus: <T>(payload: T) =>
    apiClient.post(`/api/admin/updateUser`, payload, { withCredentials: true }),
  logout: () => {
    return apiClient.post(
      `/api/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  },
};
