export const ADMIN_API_ROUTES = {
  BOOKING : {
    FETCH_BOOKING_DETAILS : `/api/admin/bookings`
  },
  SUBSCRIPTION_PLANS: {
      CREATE: `/api/admin/plans`,
      UPDATE:(id:string) =>  `/api/admin/plans/${id}`,
      FETCH_ALL: `/api/admin/plans`
  }
}