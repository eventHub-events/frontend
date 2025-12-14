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
} as const;
