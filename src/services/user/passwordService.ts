import { apiClient } from "../ApiClient";


export const passwordService={
  forgetPassword:<T>(userType:"user" |"organizer",payload:T)=>apiClient.post(`/api/${userType}/forgetPassword`,payload,{
     withCredentials: true,
      headers: { "Content-Type": "application/json" }
  }),
  verifyResetPasswordOtp:<T>(userType:"user"|"organizer",payload:T)=>apiClient.post(`/api/${userType}/resetPasswordOtp`,payload,{
     withCredentials: true,
  }),

  changePassword:<T>(userType:"user" |"organizer",payload:T)=>apiClient.post(`/api/${userType}/changePassword`,payload,{
     withCredentials: true,
      headers: { "Content-Type": "application/json" }
  })
}