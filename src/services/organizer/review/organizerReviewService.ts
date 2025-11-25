import { OrganizerReviewRoutes } from "@/constants/user/review/organizer/apiRoutes";
import { apiClient } from "@/services/ApiClient";

export const organizerReviewService = {
  addOrganizerReview :(organizerId: string, data:{targetId: string,userId:string,rating: number, review: string,targetType: string, userName: string}) => apiClient.post(OrganizerReviewRoutes.ADD_REVIEW(organizerId), data,{withCredentials: true})
}