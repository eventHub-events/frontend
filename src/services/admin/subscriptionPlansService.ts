import { ADMIN_API_ROUTES } from "@/constants/admin/adminApiRoutes";
import { apiClient } from "../ApiClient";
import { PlanFormData } from "@/validation/admin/subscriptionPlanSchema";

export const subscriptionPlansService =  {
   createSubscription :(payload: PlanFormData) => apiClient.post(ADMIN_API_ROUTES.SUBSCRIPTION_PLANS.CREATE,payload,{
     withCredentials: true
   }),
   updateSubscription :(id: string, payload: PlanFormData) => apiClient.put(ADMIN_API_ROUTES.SUBSCRIPTION_PLANS.UPDATE(id), payload, {
    withCredentials : true
   }),
   fetchAllSubscription: () => apiClient.get(ADMIN_API_ROUTES.SUBSCRIPTION_PLANS.FETCH_ALL,{
       withCredentials: true
   })

}