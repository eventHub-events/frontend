import { apiClient } from "../ApiClient";

export const subscriptionService  = {
  subscriptionCheckout: (payload: {planName: string, price: number, planId: string, durationInDays: number, organizerEmail: string, organizerName: string, subscriptionType: string }) => apiClient.post("/api/organizer/subscription/checkout", payload, {
     withCredentials : true
  }),
  fetchCurrentSubscription : (organizerId : string) => apiClient.get(`/api/organizer/${organizerId}/subscription`,{
    withCredentials: true
  })
}