import { AdminBookingFilterOptions } from "@/interface/admin/bookings/bookingInfo";
import { apiClient } from "../ApiClient";
import { ADMIN_API_ROUTES } from "@/constants/admin/adminApiRoutes";

export const bookingService_admin = {
  getBookings : (filter: AdminBookingFilterOptions) => apiClient.get(ADMIN_API_ROUTES.BOOKING.FETCH_BOOKING_DETAILS,{params: filter, withCredentials: true}),
  getBookingById: (bookingId: string) => apiClient.get(ADMIN_API_ROUTES.BOOKING.FETCH_BOOKING_BY_ID(bookingId),{ withCredentials: true})
}