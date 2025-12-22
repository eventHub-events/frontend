import { BookingPayload, BookingsFilter } from "@/interface/user/booking";
import { apiClient } from "../ApiClient";
import { API_ROUTES } from "@/constants/apiRoutes";

export const bookingService = {
  bookTicket: (eventId: string, payload: BookingPayload) => apiClient.post(API_ROUTES.BOOK_TICKET(eventId),payload, {
    withCredentials : true
  }),
  cancelBookings:(bookingId :string) => apiClient.patch(API_ROUTES.CANCEL_BOOKING(bookingId),{},{withCredentials: true}),
  fetchAllBookings:(userId: string, filters: BookingsFilter) => apiClient.get(API_ROUTES.FETCH_USER_BOOKINGS(userId),{params: filters, withCredentials: true}),
  fetchBookingById:(bookingId: string) => apiClient.get(API_ROUTES.FETCH_USER_BOOKING_BY_ID(bookingId),{withCredentials: true}),
   fetchBookingBySessionId:(sessionId: string) => apiClient.get(API_ROUTES.FETCH_USER_BOOKING_BY_SESSION_ID(sessionId),{withCredentials: true})
}