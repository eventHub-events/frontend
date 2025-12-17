
import { apiClient } from "../ApiClient";
import { ORGANIZER_API_ROUTES } from "@/constants/organizer/organizerApiRoutes";

export const stripeOnboardingService = {
   stripeOnboard : (data:{organizerId: string, email: string,accountId?: string,label?:string}) => apiClient.post(ORGANIZER_API_ROUTES.STRIPE.ONBOARDING,data,{withCredentials: true}),
   verify: (stripeAccountId: string) => apiClient.post(ORGANIZER_API_ROUTES.STRIPE.VERIFY,{stripeAccountId},{withCredentials: true})
}