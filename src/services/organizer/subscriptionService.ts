import { ORGANIZER_API_ROUTES } from "@/constants/organizer/organizerApiRoutes";
import { apiClient } from "../ApiClient";

export const subscriptionService  = {
  subscriptionCheckout: (payload: {planName: string, price: number, planId: string, durationInDays: number, organizerEmail: string, organizerName: string, subscriptionType: string,payoutDelayDays: number, commissionRate: number }) => apiClient.post("/api/organizer/subscription/checkout", payload, {
     withCredentials : true
  }),
  fetchCurrentSubscription : (organizerId : string) => apiClient.get(ORGANIZER_API_ROUTES.SUBSCRIPTION.FETCH_CURRENT_SUBSCRIPTION(organizerId),{
    withCredentials: true
  }),
  fetchAllSubscriptionPlans :()=> apiClient.get(ORGANIZER_API_ROUTES.SUBSCRIPTION.FETCH_ALL_PLANS,{withCredentials: true})
}