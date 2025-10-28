import { BookingPayload } from "@/interface/user/booking";
import { apiClient } from "../ApiClient";
import { API_ROUTES } from "@/constants/apiRoutes";

export const bookingService = {
  bookTicket: (eventId: string, payload: BookingPayload) => apiClient.post(API_ROUTES.BOOK_TICKET(eventId),payload, {
    withCredentials : true
  })
}