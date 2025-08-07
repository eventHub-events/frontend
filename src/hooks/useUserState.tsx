"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setUser } from "@/redux/slices/user/authSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export function useUserState(){
  const  dispatch= useAppDispatch()
  const router= useRouter()
  
  const user=useAppSelector((state)=>state.auth.user)

  useEffect(()=>{
    if(!user && typeof window!=="undefined"){
      const stored= localStorage.getItem("userInfo")
      
if (stored && stored !== "undefined") {
  try {
    const parsed = JSON.parse(stored);
    dispatch(setUser(parsed));
  } catch (err) {
    console.error("Failed to parse userInfo:", err);
    localStorage.removeItem("userInfo"); // optional: clean up
  }
} else {
  router.push("/");
}
    }

  },[user,dispatch,router])
}