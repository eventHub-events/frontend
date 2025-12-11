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
       FETCH_FINANCE_OVERVIEW : `/api/admin/finance/overview`,
       FETCH_TRANSACTIONS : `/api/admin/finance/transactions`,
       EXPORT_TRANSACTIONS_PDF: "/api/admin/finance/transactions/export/pdf",
       FETCH_REFUNDS :"/api/admin/finance/refunds",
       FETCH_REFUNDS_OVERVIEW :"/api/admin/finance/refunds/overview",
       FETCH_PAYOUT_OVERVIEW: "/api/admin/finance/payouts/overview",
       FETCH_SUBSCRIPTION_OVERVIEW: "/api/admin/finance/subscription/overview",
       FETCH_SUBSCRIPTION_PLAN_REVENUE: "/api/admin/finance/subscription",
       FETCH_PAYOUTS: "/api/admin/finance/payouts",
       FETCH_EVENT_REVENUE_SUMMARY : "/api/admin/finance/event-revenue-summary"

   }
}