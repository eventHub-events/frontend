export const UserProfileRoutes = {
  FETCH_PROFILE: (userId: string) => `/api/user/${userId}/profile`,
  UPDATE_PROFILE: (profileId: string) => `/api/user/${profileId}/profile`,
  REQUEST_PASSWORD_SET_OTP :  `/api/user/profile/setPasswordOtp`,
  SET_PASSWORD_WITH_OTP : `/api/user/profile/setPassword`
} as const;
