import axios from "axios";

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

    console.log("error is", error.message);

    // Retry only once
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 🔄 Call refresh token API
        await apiClient.post("/api/user/refreshToken");

        // 🔁 Retry original request after successful refresh
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.log("refresh error happened", refreshError);
        console.log("original request", originalRequest);

        // Determine user role
        let role = "user";
        if (originalRequest.url?.includes("/organizer")) {
          role = "organizer";
        } else if (originalRequest.url?.includes("/admin")) {
          role = "admin";
        }

        // 🔐 Redirect to login if refresh also fails
        window.location.href =
          role === "admin" ? `/admin/login` : `/login/${role}`;

        return Promise.reject(refreshError);
      }
    }

    // Log other errors
    if (error.response?.data?.message) {
      console.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);
