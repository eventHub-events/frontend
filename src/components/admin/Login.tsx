"use client"

import { useAppDispatch } from "@/redux/hooks"
import { setAdmin } from "@/redux/slices/admin/authSlice"
import { authService } from "@/services/authService"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"



export  default function AdminLogin(){

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const[isSubmitting,setIsSubmitting]=useState(false)
  
  const router= useRouter()
  const dispatch= useAppDispatch()

  const handleSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  try{
    setIsSubmitting(true)
    console.log(email,password)

    const response= await authService.adminLogin({email,password})
   
    console.log("response from  admin login",response)
     if(response){
        dispatch(setAdmin(response.data.data))
        toast.success("Admin login Successful")
         router.push("/admin/dashboard")
     }


  }catch(err:unknown){
      const error= err instanceof Error? err.message:"Error in admin  login"
      console.log(error)
    toast.error(error)

  }finally{
    setIsSubmitting(false)
  }

  }

return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md transition-all">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Admin Portal
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* {errorMessage && (
            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
          )} */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );

}