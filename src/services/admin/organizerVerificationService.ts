import { UpdateDocumentData, UpdateOrganizerProfileKycStatus, UpdateOrganizerStatus } from "@/types/admin/organizerVerification";
import { apiClient } from "../ApiClient";

export const organizerVerificationService={
  fetchVerificationDetails:(organizerId:string)=>apiClient.get(`/api/admin/organizers/${organizerId}/verification`,{
    withCredentials:true
  }),
  fetchPendingOrganizers:()=>apiClient.get(`/api/admin/pending-organizers?status=Pending`,{
    withCredentials:true
  }),
  updateOrganizerUploadDocuments:(organizerId:string,data:UpdateDocumentData)=>apiClient.post(`/api/admin/organizers/${organizerId}/updateDocument`,{organizerId,data},{
    withCredentials:true
  }),
  updateOrganizerVerificationStatus:(organizerId:string,organizerData:UpdateOrganizerStatus,profileData:UpdateOrganizerProfileKycStatus)=>apiClient.patch(`/api/admin/organizers/${organizerId}/verification-status`,{user:organizerData,profile:profileData},{
    withCredentials:true
  })
}