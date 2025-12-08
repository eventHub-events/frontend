export const ADMIN_API_ROUTES = {
  BOOKING : {
    FETCH_BOOKING_DETAILS : `/api/admin/bookings`,
    FETCH_BOOKING_BY_ID:(bookingId:string) => `/api/admin/bookings/${bookingId}`
  },
  
  SUBSCRIPTION_PLANS: {
      CREATE: `/api/admin/plans`,
      UPDATE:(id:string) =>  `/api/admin/plans/${id}`,
      FETCH_ALL: `/api/admin/plans`,
      UPDATE_STATUS : (id: string) => `/api/admin/plans/${id}/status`,
  },
  ORGANIZER_VERIFICATION : {
    FETCH_VERIFICATION_DETAILS : (organizerId: string) => `/api/admin/organizers/${organizerId}/verification`,
    FETCH_PENDING_ORGANIZERS : `/api/admin/pending-organizers?status=Pending`,
    UPDATE_ORGANIZER_UPLOAD_DOCUMENTS : (organizerId: string) => `/api/admin/organizers/${organizerId}/updateDocument`,
    UPDATE_ORGANIZER_VERIFICATION_STATUS: (organizerId: string) => `/api/admin/organizers/${organizerId}/verification-status`
  },
   FINANCE_PAYOUT : {
       FETCH_FINANCE_OVERVIEW : `/api/admin/finance/overview`
   }
}