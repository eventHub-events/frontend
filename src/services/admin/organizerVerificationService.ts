import { apiClient } from "../ApiClient";

export const organizerVerificationService={
  fetchVerificationDetails:(organizerId:string)=>apiClient.get(`/api/admin/organizers/${organizerId}/verification`,{
    withCredentials:true
  }),
  fetchPendingOrganizers:()=>apiClient.get(`/api/admin/pending-organizers?status=Pending`,{
    withCredentials:true
  })
}