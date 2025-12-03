import { UpdateDocumentData, UpdateOrganizerProfileKycStatus, UpdateOrganizerStatus } from "@/types/admin/organizerVerification";
import { apiClient } from "../ApiClient";
import { ADMIN_API_ROUTES } from "@/constants/admin/adminApiRoutes";

export const organizerVerificationService={
  fetchVerificationDetails:(organizerId:string)=>apiClient.get(ADMIN_API_ROUTES.ORGANIZER_VERIFICATION.FETCH_VERIFICATION_DETAILS(organizerId),{
    withCredentials:true
  }),
  fetchPendingOrganizers:()=>apiClient.get(ADMIN_API_ROUTES.ORGANIZER_VERIFICATION.FETCH_PENDING_ORGANIZERS,{
    withCredentials:true
  }),
  updateOrganizerUploadDocuments:(organizerId:string,data:UpdateDocumentData)=>apiClient.post(ADMIN_API_ROUTES.ORGANIZER_VERIFICATION.UPDATE_ORGANIZER_UPLOAD_DOCUMENTS(organizerId),{organizerId,data},{
    withCredentials:true
  }),
  updateOrganizerVerificationStatus:(organizerId:string,organizerData:UpdateOrganizerStatus,profileData:UpdateOrganizerProfileKycStatus)=>apiClient.patch(ADMIN_API_ROUTES.ORGANIZER_VERIFICATION.UPDATE_ORGANIZER_VERIFICATION_STATUS(organizerId),{user:organizerData,profile:profileData},{
    withCredentials:true
  })
}