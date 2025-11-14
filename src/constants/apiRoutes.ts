

export const API_ROUTES = {
  BOOK_TICKET : (eventId: string) => `/api/user/events/${eventId}/book`,
  FETCH_BOOKING_DETAILS : (organizerId:string)  => `/api/organizer/${organizerId}/bookings`,
  FETCH_BOOKING_BY_ID :(organizerId:string, bookingId: string) => `/api/organizer/${organizerId}/bookings/${bookingId}`,
  FETCH_USER_BOOKINGS: (userId: string) => `/api/user/${userId}/bookings`,
  FETCH_USER_BOOKING_BY_ID:(bookingId: string) => `/api/user/bookings/${bookingId}`,
  FETCH_USER_BOOKING_BY_SESSION_ID:(sessionId: string) => `/api/user/bookings/session/${sessionId}`,
  PAYMENT_CHECKOUT :() => `/api/user/payments/create-checkout-session`
} 