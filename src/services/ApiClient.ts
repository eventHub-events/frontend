import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // Send HttpOnly cookies automatically
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const errCode = error.response?.data?.errCode;
    const roleFromBackend = error.response?.data?.role;
    console.log("eeeee", errCode)
    console.log("AXIOS ERROR:", status, message);
  
    // 🚫 CASE 1: USER BLOCKED → Do NOT refresh → Show error
    if (status === 403 && errCode ==="USER_BLOCKED") {

       toast.error(message || "Your account is blocked.");
         let role = roleFromBackend;
          
         if (!role) {
        if (originalRequest.url?.includes("/organizer")) role = "organizer";
        else if (originalRequest.url?.includes("/admin")) role = "admin";
        else role = "user";
      }

        // Redirect based on role
        setTimeout(() => {
               if (role === "organizer") window.location.href = "/login/organizer";
                else if (role === "admin") window.location.href = "/admin/login";
                 else window.location.href = "/login/user";
        },800)
     

      return Promise.reject(error);
    }

    // 🔐 CASE 2: Token expired → Refresh and retry once
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/api/user/refreshToken");
        return apiClient(originalRequest);
      } catch (refreshError) {
        let role = "user";
        if (originalRequest.url?.includes("/organizer")) role = "organizer";
        if (originalRequest.url?.includes("/admin")) role = "admin";

        window.location.href =
          role === "admin" ? `/admin/login` : `/login/${role}`;

        return Promise.reject(refreshError);
      }
    }

    // ❌ CASE 3: Unhandled errors
    return Promise.reject(error);
  }
);
