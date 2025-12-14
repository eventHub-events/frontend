import { CLOUDINARY_API_ROUTES } from "@/constants/cloudinary/cloudinaryApiRoutes";
import { apiClient } from "../ApiClient";

export const CLOUDINARY_SERVICE  = {
  getCloudinarySignature : (folder: string) => apiClient.get(CLOUDINARY_API_ROUTES.GET_SIGNATURE(),{params:{folder}, withCredentials: true}),
  getDocumentCloudinarySignature : (organizerId : string) => apiClient.get(CLOUDINARY_API_ROUTES.GET_DOCUMENT_SIGNATURE(organizerId),{withCredentials :true}),
  getDocumentSignedUrl : (publicId: string) => apiClient.get(CLOUDINARY_API_ROUTES.GET_DOCUMENT_SIGNED_URL,{params:{publicId}, withCredentials :true})
}