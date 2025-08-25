import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // Send HttpOnly cookies automatically
});

// Request interceptor (optional)
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
console.log("error is",error.message)
    // Avoid retrying multiple times
    if (
      (error.response?.status === 403 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // await axios.post(
        //   // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/refreshToken`,
        //   {},
        //   { withCredentials: true, headers: { "x-refresh-request": "true" } }
        // );

        // // Retry original request after successful refresh
        // return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("refresh error happend", refreshError);
        let role = "user";

        if (originalRequest.url?.includes("/organizer")) {
          role = "organizer";
        } else if (originalRequest.url?.includes("/admin")) {
          role = "admin";
        }

        if (role === "admin") {
           window.location.href = `/admin/login`;
        } else {
           window.location.href = `/login/${role}`;
        }
        return Promise.reject(refreshError);
      }
    }

    // Optional: log other errors
    if (error.response?.data?.message) {
      console.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);
