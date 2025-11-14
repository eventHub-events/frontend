import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "../ApiClient";

export const paymentService = {
   paymentCheckout:(bookingId: string)=> apiClient.post(API_ROUTES.PAYMENT_CHECKOUT(),{bookingId},{withCredentials: true})
}