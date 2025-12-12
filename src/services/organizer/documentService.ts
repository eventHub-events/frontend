import { DocumentRoutes } from "@/constants/organizer/documentsRoutes";
import { apiClient } from "../ApiClient";
import { KycStatus, UploadDocumentStatus } from "@/types/admin/Enums/organizerVerificationEnum";


export const DOCUMENT_SERVICE = {
  getDocuments: (organizerId: string) =>
    apiClient.get(DocumentRoutes.GET_DOCUMENTS(organizerId)),

  getDocumentsInPdf: (data: { imageUrl: string; docType: string }) =>
    apiClient.post(DocumentRoutes.DOWNLOAD_PDF, data, {
      responseType: "blob",
    }),

  saveDocuments: (data: {
    organizerId: string;
    type: string;
    url: string;
    name: string;
  }) =>
    apiClient.post(DocumentRoutes.SAVE_DOCUMENT, data),

  deleteDocument: (documentId: string) =>
    apiClient.delete(DocumentRoutes.DELETE_DOCUMENT(documentId), {
      withCredentials: true,
    }),

  sentVerificationRequest: (
    organizerId: string,
    data: { kycStatus: KycStatus }
  ) =>
    apiClient.patch(
      DocumentRoutes.SEND_VERIFICATION_REQUEST(organizerId),
      data,
      {
        withCredentials: true,
      }
    ),

  updateDocumentDetails: (
    id: string,
    data: { url: string; status: UploadDocumentStatus }
  ) =>
    apiClient.patch(DocumentRoutes.UPDATE_DOCUMENT(id), data, {
      withCredentials: true,
    }),
} as const;
