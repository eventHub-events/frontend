import { PASSWORD_ROUTES } from "@/constants/user/password-routes/routes";
import { apiClient } from "../ApiClient";


export const passwordService = {
  forgetPassword: <T>(userType: "user" | "organizer", payload: T) =>
    apiClient.post(PASSWORD_ROUTES.forgetPassword(userType), payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }),

  verifyResetPasswordOtp: <T>(userType: "user" | "organizer", payload: T) =>
    apiClient.post(PASSWORD_ROUTES.verifyOtp(userType), payload, {
      withCredentials: true,
    }),

  changePassword: <T>(userType: "user" | "organizer", payload: T) =>
    apiClient.post(PASSWORD_ROUTES.changePassword(userType), payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }),
};
