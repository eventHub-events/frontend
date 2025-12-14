export const TicketingRoutes = {
  CREATE_TICKETING: `/api/organizer/ticketing`,

  UPDATE_TICKETING: (eventId: string) =>
    `/api/organizer/events/${eventId}/ticketing`,

  FETCH_TICKETING: (ticketingId: string) =>
    `/api/organizer/ticketing/${ticketingId}`,

  FETCH_TICKETING_BY_EVENT: (eventId: string) =>
    `/api/organizer/events/${eventId}/ticketing`,
} as const;
