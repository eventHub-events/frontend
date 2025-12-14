import { ApiRoutes, RedirectRoutes } from "@/constants/api-client/apiClientRoutes";
import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const errCode = error.response?.data?.errCode;
    const roleFromBackend = error.response?.data?.role;

    if (status === 403 && errCode === "USER_BLOCKED") {
      toast.error(message || "Your account is blocked.");

      let role = roleFromBackend;

      if (!role) {
        if (originalRequest.url?.includes(ApiRoutes.ORGANIZER_BASE)) role = "organizer";
        else if (originalRequest.url?.includes(ApiRoutes.ADMIN_BASE)) role = "admin";
        else role = "user";
      }

     setTimeout(() => {
  if (role === "organizer") {
    window.location.href = RedirectRoutes.LOGIN_ORGANIZER;
  } else if (role === "admin") {
    window.location.href = RedirectRoutes.LOGIN_ADMIN;
  } else {
    window.location.href = RedirectRoutes.LOGIN_USER;
  }
}, 800);


      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await apiClient.post(ApiRoutes.REFRESH_TOKEN);
        return apiClient(originalRequest);
      } catch (refreshError) {
        let role = "user";

        if (originalRequest.url?.includes(ApiRoutes.ORGANIZER_BASE)) role = "organizer";
        if (originalRequest.url?.includes(ApiRoutes.ADMIN_BASE)) role = "admin";

        window.location.href =
          role === "admin" ? `/admin/login` : `/login/${role}`;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
