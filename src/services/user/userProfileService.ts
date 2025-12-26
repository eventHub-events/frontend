import { UserProfileUpdatePayload } from "@/types/user/profile/profileUpdateType";
import { apiClient } from "../ApiClient";
import { UserProfileRoutes } from "@/constants/user/userProfileRoutes";


export const USER_PROFILE_SERVICE = {
  fetchProfile: (userId: string) =>
    apiClient.get(UserProfileRoutes.FETCH_PROFILE(userId), {
      withCredentials: true,
    }),

  updateProfile: (profileId: string, data: UserProfileUpdatePayload) =>
    apiClient.patch(UserProfileRoutes.UPDATE_PROFILE(profileId), data, {
      withCredentials: true,
    }),
   userRequestPasswordSetOtp: () => apiClient.post(UserProfileRoutes.REQUEST_PASSWORD_SET_OTP,{},{withCredentials :true}),
   userSetPasswordWithOtp : (data : {otp :string,newPassword : string, confirmNewPassword:string,}) => apiClient.post(UserProfileRoutes.SET_PASSWORD_WITH_OTP,{otp:data.otp,newPassword: data.newPassword},{withCredentials : true}),
  }