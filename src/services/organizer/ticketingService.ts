import { TicketForm } from "@/components/organizer/events/TicketManagement";
import { apiClient } from "../ApiClient";
import { TicketingRoutes } from "@/constants/organizer/ticketRoutes";


export const TICKETING_SERVICE = {
  createTicketingDetails: (payload: TicketForm) =>
    apiClient.post(TicketingRoutes.CREATE_TICKETING, payload, {
      withCredentials: true,
    }),

  updateTicketingDetails: (eventId: string, payload: TicketForm) =>
    apiClient.patch(TicketingRoutes.UPDATE_TICKETING(eventId), payload, {
      withCredentials: true,
    }),

  fetchTicketingDetails: (ticketingId: string) =>
    apiClient.get(TicketingRoutes.FETCH_TICKETING(ticketingId), {
      withCredentials: true,
    }),

  fetchTicketingDetailsByEvent: (eventId: string) =>
    apiClient.get(TicketingRoutes.FETCH_TICKETING_BY_EVENT(eventId), {
      withCredentials: true,
    }),
} as const;
