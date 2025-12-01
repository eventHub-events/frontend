
import { ReportTypes } from "@/types/admin/report";


export const API_ROUTES = {
  BOOK_TICKET : (eventId: string) => `/api/user/events/${eventId}/book`,
  FETCH_BOOKING_DETAILS : (organizerId:string)  => `/api/organizer/${organizerId}/bookings`,
  FETCH_BOOKING_BY_ID :(organizerId:string, bookingId: string) => `/api/organizer/${organizerId}/bookings/${bookingId}`,
  FETCH_USER_BOOKINGS: (userId: string) => `/api/user/${userId}/bookings`,
  FETCH_USER_BOOKING_BY_ID:(bookingId: string) => `/api/user/bookings/${bookingId}`,
  FETCH_USER_BOOKING_BY_SESSION_ID:(sessionId: string) => `/api/user/bookings/session/${sessionId}`,
  PAYMENT_CHECKOUT :() => `/api/user/payments/create-checkout-session`,
  GET_USER_CHAT_COUNT : (eventId :string)=> `/api/user/chat/event/${eventId}`,

   REPORT : {
      CREATE_EVENT_REPORT: `/api/user/report/event`,
      CREATE_ORGANIZER_REPORT :`/api/user/report/organizer`,
      FETCH_REPORTS: (targetType: ReportTypes ) => `/api/admin/reports/${targetType}`,
      TAKE_ACTION: (reportId:  string) => `/api/admin/report/${reportId}`
   },
   DASHBOARD: {
       FETCH_DATA : `/api/admin/dashboard`
   },
   ORGANIZER_DASHBOARD : {
         FETCH_DATA : `/api/organizer/dashboard`
   },
    EVENTS : {
      FETCH_BY_FILTER: `/api/user/search/events`,
      FETCH_TRENDING_EVENTS : "/api/user/events/trending",
      FETCH_FEATURED_EVENTS :  "/api/user/events/featured",
      FETCH_EVENT_DETAILS_BY_ID : (eventId: string) =>  `/api/user/events/${eventId}`,
      FETCH_ALL_FEATURED_EVENTS :  `/api/user/events/featured/all`,

    }

} 