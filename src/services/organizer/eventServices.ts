import { EventCreationForm } from "@/types/organizer/events";
import { apiClient } from "../ApiClient";

export const eventService = {
  createEvent: (data: EventCreationForm) => apiClient.post(`/api/organizer/events`,data,{
    withCredentials: true
  })
}