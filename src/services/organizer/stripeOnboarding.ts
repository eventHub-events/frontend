
import { apiClient } from "../ApiClient";
import { ORGANIZER_API_ROUTES } from "@/constants/organizer/organizerApiRoutes";

export const stripeOnboardingService = {
   stripeOnboard : (organizerId: string, email: string) => apiClient.post(ORGANIZER_API_ROUTES.STRIPE.ONBOARDING,{organizerId,email},{withCredentials: true}),
   verify: (organizerId: string) => apiClient.post(ORGANIZER_API_ROUTES.STRIPE.VERIFY,{organizerId},{withCredentials: true})
}