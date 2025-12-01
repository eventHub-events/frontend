
import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "../ApiClient";
import { CategoryFormData } from "@/components/admin/category/CategoryModal";

export const categoryService = {
  fetchAllCategories: () => apiClient.get(API_ROUTES.CATEGORY.FETCH_ALL,{
    withCredentials: true
  }),
  createCategory: (data: CategoryFormData) => apiClient.post(API_ROUTES.CATEGORY.CREATE, data,{
     withCredentials: true
  }),
    
  editCategory: (categoryId: string, data: CategoryFormData | {isBlocked: boolean}) => apiClient.patch(API_ROUTES.CATEGORY.EDIT(categoryId),data,{
    withCredentials: true
  }),

  deleteCategory: (categoryId: string) => apiClient.patch(API_ROUTES.CATEGORY.DELETE(categoryId),{
       withCredentials: true
  }),
  fetchCategory :(categoryId: string) => apiClient.get(API_ROUTES.CATEGORY.FETCH_BY_ID(categoryId),{
    withCredentials: true
  }),
   fetchAllCategoriesForLandingPage: () => apiClient.get(API_ROUTES.CATEGORY.FETCH_ALL_FOR_LANDING_PAGE),
 
  
}

