export const EventRoutes = {
  CREATE_EVENT: `/api/organizer/events`,

  FETCH_EVENTS: (organizerId: string) =>
    `/api/organizer/${organizerId}/events`,

  DELETE_EVENT: (eventId: string) =>
    `/api/organizer/events/${eventId}/soft-delete`,

  CANCEL_EVENT: (eventId: string) =>
    `/api/organizer/events/${eventId}/cancel`,

  FETCH_EVENT_BY_ID: (eventId: string) =>
    `/api/organizer/events/${eventId}`,

  UPDATE_EVENT: (eventId: string) =>
    `/api/organizer/events/${eventId}`,
} as const;
