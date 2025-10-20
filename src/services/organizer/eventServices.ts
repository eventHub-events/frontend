import { EventCreationForm } from "@/types/organizer/events";
import { apiClient } from "../ApiClient";

export const eventService = {
  createEvent: (data: EventCreationForm) => apiClient.post(`/api/organizer/events`,data,{
    withCredentials: true
  }),
  fetchEvents: (organizerId: string) => apiClient.get(`/api/organizer/${organizerId}/events`,{
    withCredentials: true
  }),

  deleteEvent:(eventId: string) => apiClient.delete(`/api/organizer/events/${eventId}/soft-delete`,{
    withCredentials: true
  }),
  cancelEvent: (eventId: string) => apiClient.patch(`/api/organizer/events/${eventId}/cancel`,{},{
    withCredentials: true
  })

}