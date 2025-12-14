import { EventCreationForm } from "@/types/organizer/events";
import { apiClient } from "../ApiClient";
import { EventRoutes } from "@/constants/organizer/eventRoutes";


export const EVENT_SERVICE = {
  createEvent: (data: EventCreationForm) =>
    apiClient.post(EventRoutes.CREATE_EVENT, data, {
      withCredentials: true,
    }),

  fetchEvents: (organizerId: string) =>
    apiClient.get(EventRoutes.FETCH_EVENTS(organizerId), {
      withCredentials: true,
    }),

  deleteEvent: (eventId: string) =>
    apiClient.delete(EventRoutes.DELETE_EVENT(eventId), {
      withCredentials: true,
    }),

  cancelEvent: (eventId: string) =>
    apiClient.patch(EventRoutes.CANCEL_EVENT(eventId), {}, {
      withCredentials: true,
    }),

  fetchEventById: (eventId: string) =>
    apiClient.get(EventRoutes.FETCH_EVENT_BY_ID(eventId), {
      withCredentials: true,
    }),

  updateEvent: (eventId: string, payload: EventCreationForm) =>
    apiClient.patch(EventRoutes.UPDATE_EVENT(eventId), payload, {
      withCredentials: true,
    }),
} as const;
