import { BookingFilter } from "@/interface/organizer/booking/bookingInfo";

export const API_ROUTES = {
  BOOK_TICKET : (eventId: string) => `/api/user/events/${eventId}/book`,
  FETCH_BOOKING_DETAILS : (organizerId:string)  => `/api/organizer/${organizerId}/bookings`,
  FETCH_BOOKING_BY_ID :(organizerId:string, bookingId: string) => `/api/organizer/${organizerId}/bookings/${bookingId}`,
}