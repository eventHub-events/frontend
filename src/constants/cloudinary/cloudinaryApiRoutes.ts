export const CLOUDINARY_API_ROUTES = {
  GET_SIGNATURE: () => `/api/organizer/cloudinary/signature`,
  GET_DOCUMENT_SIGNATURE : (organizerId :string) => `/api/organizer/cloudinary/${organizerId}/signature`,
  GET_DOCUMENT_SIGNED_URL : `/api/organizer/uploaded-documents/signed-url`
}