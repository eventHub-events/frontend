export const ProfileRoutes = {
  CREATE_PROFILE: `/api/organizer/organizerProfile`,
  UPDATE_PROFILE: (id: string) => `/api/organizer/organizerProfile/${id}`,
  GET_PROFILE: (id: string) => `/api/organizer/organizerProfile/${id}`,
  UPDATE_PASSWORD: (id: string) => `/api/organizer/updatePassword/${id}`,
  REQUEST_PASSWORD_SET_OTP :`/api/organizer/profile/setPasswordOtp`,
  SET_PASSWORD : "/api/organizer/profile/setPassword",
  GET_STRIPE_ACCOUNTS : (organizerId : string) => `/api/organizer/stripe-accounts/${organizerId}`
} as const;
