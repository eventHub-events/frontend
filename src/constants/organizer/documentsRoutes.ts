export const DocumentRoutes = {
  GET_DOCUMENTS: (organizerId: string) =>
    `/api/organizer/uploaded-documents/${organizerId}`,

  DOWNLOAD_PDF: `/api/admin/download-pdf`,

  SAVE_DOCUMENT: `/api/organizer/upload-document`,

  DELETE_DOCUMENT: (documentId: string) =>
    `/api/organizer/uploaded-document/${documentId}/deletion`,

  SEND_VERIFICATION_REQUEST: (organizerId: string) =>
    `/api/organizer/${organizerId}/verification-request`,

  UPDATE_DOCUMENT: (id: string) =>
    `/api/organizer/uploaded-documents/${id}`,
} as const;
