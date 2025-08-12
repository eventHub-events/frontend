import axios from "axios";


export const apiClient = axios.create({
  baseURL:process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true

})
apiClient.interceptors.request.use(
  (config)=>config,
  (error)=>Promise.reject(error)
 )

 apiClient.interceptors.response.use(
 (res)=>res,
 (error)=> {
  if(error.response?.status===403){
    window.location.href ="/login/user"
  }
  return Promise.reject(error)
 }
 )