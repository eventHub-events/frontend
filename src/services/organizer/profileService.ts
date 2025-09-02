import { apiClient } from "../ApiClient";

export const profileService={
  createProfile:<T>(payload:T)=> apiClient.post(`api/organizer/organizerProfile`,payload,{
    withCredentials:true,
    headers: { "Content-Type": "application/json" }
  }),
  updateProfile:<T>(id:string,payload:T)=>apiClient.patch(`api/organizer/organizerProfile/${id}`,payload,{
      withCredentials:true,
      headers:{"Content-Type":"application/json"}
  }),

  getProfile:(id:string)=>apiClient.get(`api/organizer/organizerProfile/${id}`,{
    withCredentials:true
  })
}