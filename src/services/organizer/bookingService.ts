import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "../ApiClient";
import { BookingFilter } from "@/interface/organizer/booking/bookingInfo";

export const bookingService_organizer = {
   fetchAllDetails : (organizerId:string, filters: BookingFilter) => apiClient.get(API_ROUTES.FETCH_BOOKING_DETAILS(organizerId),{params:filters}),
   fetchBookingsById:(organizerId: string, bookingId: string) => apiClient.get(API_ROUTES.FETCH_BOOKING_BY_ID(organizerId, bookingId),{
      withCredentials : true
   })
}