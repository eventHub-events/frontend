import { apiclient } from "./ApiClient";

export const authService = {
  signup: <T>(payload: T) =>
    apiclient.post(`/api/user/register`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" } // Ensures HttpOnly cookies are sent
    }),
    resentOtp:<T>(payload:T)=>apiclient.post(`/api/user/resend-otp`,payload),

  verifyOtp: <T>(payload: T) =>
    apiclient.post("/api/user/verify-otp", payload, {
      withCredentials: true,
    }),

  login: <T>(payload: T) =>
    apiclient.post(`/api/user/login`, payload, {
      withCredentials: true,
    }),
    logout: () => {
  return apiclient.post(`/api/user/logout`, {}, {
    withCredentials: true
  });
}

};
