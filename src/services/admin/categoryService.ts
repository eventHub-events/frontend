
import { apiClient } from "../ApiClient";
import { CategoryFormData } from "@/components/admin/category/CategoryModal";

export const categoryService = {
  fetchAllCategories: () => apiClient.get(`/api/admin/categories`,{
    withCredentials: true
  }),
  createCategory: (data: CategoryFormData) => apiClient.post(`/api/admin/categories`, data,{
     withCredentials: true
  }),
    
  editCategory: (categoryId: string, data: CategoryFormData | {isBlocked: boolean}) => apiClient.patch(`/api/admin/categories/${categoryId}`,data,{
    withCredentials: true
  }),

  deleteCategory: (categoryId: string) => apiClient.patch(`/api/admin/categories/${categoryId}/soft-delete`,{
       withCredentials: true
  }),
  fetchCategory :(categoryId: string) => apiClient.get(`/api/admin/categories/${categoryId}`,{
    withCredentials: true
  })
 
  
}