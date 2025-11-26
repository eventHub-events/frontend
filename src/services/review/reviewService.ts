import { EventReviewRoutes } from "@/constants/user/review/event/apiRoutes";
import { apiClient } from "../ApiClient";

export const reviewService = {
  addEventReview : (eventId:string, data:{rating: number,review: string,userId:string,targetType: string, targetId:string, userName: string}) => apiClient.post(EventReviewRoutes.ADD_REVIEW(eventId),data,{withCredentials: true}),
  getEventReviews :(eventId:string, targetType: string, pageNumber: number,limit: number) => apiClient.get(EventReviewRoutes.GET_EVENT_REVIEWS(eventId, targetType),{params: {pageNumber,limit},withCredentials: true}),
  getReviewSummary:( targetType:string,targetId:string)=> apiClient.get(EventReviewRoutes.GET_EVENT_REVIEW_SUMMARY(targetType, targetId),{withCredentials : true}),
  deleteReview :(reviewId: string) => apiClient.delete(EventReviewRoutes.DELETE_REVIEW(reviewId),{withCredentials :true}),
  updateReview: (reviewId: string, data:{rating: number, review: string}) => apiClient.put(EventReviewRoutes.EDIT_REVIEW(reviewId),data,{withCredentials: true}),
  getReviewsForOrganizer:(targetId: string, targetType: string, page: number, limit: number) => apiClient.get(EventReviewRoutes.GET_EVENT_REVIEWS_FOR_ORGANIZER(targetId,targetType),{params:{page,limit}, withCredentials: true})
}