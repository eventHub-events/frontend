import { TicketForm } from "@/components/organizer/events/TicketManagement";
import { apiClient } from "../ApiClient";

export const ticketingService = {
   createTicketingDetails: (payload: TicketForm) => apiClient.post(`/api/organizer/ticketing/`, payload,{
    withCredentials : true
   }),

   updateTicketingDetails: (eventId: string,payload: TicketForm) => apiClient.patch(`/api/organizer/events/${eventId}/ticketing`,payload, {
    withCredentials : true
   }),
   fetchTicketingDetails :(ticketingId: string) => apiClient.get(`/api/organizer/ticketing/${ticketingId}`,{
    withCredentials : true
   }),
   fetchTicketingDetailsByEvent :(eventId: string) => apiClient.get(`/api/organizer/events/${eventId}/ticketing`,{
    withCredentials : true
   })
}