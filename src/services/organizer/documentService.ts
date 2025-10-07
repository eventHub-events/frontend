
import { apiClient } from "../ApiClient";
import { KycStatus, UploadDocumentStatus } from "@/types/admin/Enums/organizerVerificationEnum";

export const documentService={
  getDocuments:(organizerId:string)  => apiClient.get(`/api/organizer/uploaded-documents/${organizerId}`),
  getDocumentsInPdf:(data: {imageUrl: string, docType:string}) => apiClient.post(`/api/admin/download-pdf`, data,{
    responseType: "blob"
  }),

  saveDocuments:(data:{
    organizerId:string;
    type:string;
    url:string;
    name:string;
  }) => apiClient.post(`/api/organizer/upload-document`,data),

  deleteDocument:(documentId:string)=>apiClient.delete(`/api/organizer/uploaded-document/${documentId}/deletion`,{
    withCredentials:true
  })
  ,
  sentVerificationRequest : (organizerId:string,data:{kycStatus : KycStatus }) => apiClient.patch(`/api/organizer/${organizerId}/verification-request`,data,{
    withCredentials : true
  }),
  updateDocumentDetails : (id: string ,data :{url : string, status: UploadDocumentStatus}) => apiClient.patch(`/api/organizer/uploaded-documents/${id}`,data,{
     withCredentials : true
  }) 



}

