import axios from "axios";


export const apiclient = axios.create({
  baseURL:process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true

})
apiclient.interceptors.request.use(
  (config)=>config,
  (error)=>Promise.reject(error)
 )

 apiclient.interceptors.response.use(
 (res)=>res,
 (error)=> {
  if(error.response?.status===403){
    window.location.href ="/login/user"
  }
  return Promise.reject(error)
 }
 )