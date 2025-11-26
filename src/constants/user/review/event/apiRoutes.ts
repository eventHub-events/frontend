export const EventReviewRoutes = {
  ADD_REVIEW : (eventId:string) => `/api/reviews/event/${eventId}`,
  EDIT_REVIEW :(reviewId: string) => `/api/reviews/${reviewId}`,
  DELETE_REVIEW :(reviewId: string) => `/api/reviews/${reviewId}`,
  GET_EVENT_REVIEW_SUMMARY :(targetType: string, targetId: string) => `/api/reviews/summary/${targetType}/${targetId}`,
  GET_EVENT_REVIEWS :(eventId: string,targetType: string) => `/api/reviews/${targetType}/${eventId}`,
  GET_EVENT_REVIEWS_FOR_ORGANIZER:(targetId: string,targetType: string) => `/api/reviews/organizer/${targetType}/${targetId}`

}