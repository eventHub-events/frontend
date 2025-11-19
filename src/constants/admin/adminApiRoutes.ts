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
  }
}