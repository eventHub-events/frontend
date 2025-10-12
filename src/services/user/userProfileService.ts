import { UserProfileUpdatePayload } from "@/types/user/profile/profileUpdateType";
import { apiClient } from "../ApiClient";

export const userProfileService = {
  fetchProfile: (userId: string) => apiClient.get(`/api/user/${userId}/profile`,{
    withCredentials:true
  }),
  updateProfile:(profileId: string, data: UserProfileUpdatePayload ) => apiClient.patch(`/api/user/${profileId}/profile`,data,{
    withCredentials: true
  })

}

                                 
   