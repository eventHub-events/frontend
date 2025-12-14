export const ProfileRoutes = {
  CREATE_PROFILE: `/api/organizer/organizerProfile`,
  UPDATE_PROFILE: (id: string) => `/api/organizer/organizerProfile/${id}`,
  GET_PROFILE: (id: string) => `/api/organizer/organizerProfile/${id}`,
  UPDATE_PASSWORD: (id: string) => `/api/organizer/updatePassword/${id}`,
} as const;
