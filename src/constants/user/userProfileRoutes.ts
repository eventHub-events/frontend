export const UserProfileRoutes = {
  FETCH_PROFILE: (userId: string) => `/api/user/${userId}/profile`,
  UPDATE_PROFILE: (profileId: string) => `/api/user/${profileId}/profile`,
} as const;
