import { UpdatePasswordType } from "@/types/organizer/organizerProfile";
import { apiClient } from "../ApiClient";
import { ProfileRoutes } from "@/constants/organizer/profileRoutes";


export const PROFILE_SERVICE = {
  createProfile: <T>(payload: T) =>
    apiClient.post(ProfileRoutes.CREATE_PROFILE, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }),

  updateProfile: <T>(id: string, payload: T) =>
    apiClient.patch(ProfileRoutes.UPDATE_PROFILE(id), payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }),

  getProfile: (id: string) =>
    apiClient.get(ProfileRoutes.GET_PROFILE(id), {
      withCredentials: true,
    }),
   requestPasswordOTP : () => apiClient.post(ProfileRoutes.REQUEST_PASSWORD_SET_OTP,{},{withCredentials:true}),
   setPasswordWithOtp : (data :{ newPassword: string, confirmNewPassword:string,otp :string}) => apiClient.post(ProfileRoutes.SET_PASSWORD,data,{withCredentials :true}),
  updatePassword: (id: string, passwordData: UpdatePasswordType) =>
    apiClient.patch(ProfileRoutes.UPDATE_PASSWORD(id), passwordData, {
      withCredentials: true,
    }),
    getStripeAccounts : (organizerId :string) => apiClient.get(ProfileRoutes.GET_STRIPE_ACCOUNTS(organizerId),{withCredentials :true})
} as const;
