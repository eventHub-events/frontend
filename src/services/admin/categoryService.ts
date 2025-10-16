import { Category } from "@/components/admin/category/CategoryManagement";
import { apiClient } from "../ApiClient";

export const categoryService = {
  fetchAllCategories: () => apiClient.get(`/api/admin/categories`,{
    withCredentials: true
  }),
  createCategory: (data: Category) => apiClient.post(`/api/admin/categories`, data,{
     withCredentials: true
  }),
    
  editCategory: (categoryId: string, data: Category) => apiClient.patch(`/api/admin/categories/${categoryId}`,data,{
    withCredentials: true
  }),

  deleteCategory: (categoryId: string,data:{isDeleted: boolean}) => apiClient.patch(`/api/admin/categories/${categoryId}`, data,{
       withCredentials: true
  }),
  fetchCategory :(categoryId: string) => apiClient.get(`/api/admin/categories/${categoryId}`,{
    withCredentials: true
  })
 
  
}