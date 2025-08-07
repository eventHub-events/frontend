"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setAdmin } from "@/redux/slices/admin/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export function useAdminState(){
  const dispatch=useAppDispatch()
  const admin =useAppSelector((state)=>state.adminAuth.admin);
  const router= useRouter()
  useEffect(()=>{
    if(!admin && typeof window!=="undefined"){
      const stored= localStorage.getItem("adminInfo");
    
if (stored && stored !== "undefined") {
  try {
    const parsed = JSON.parse(stored);
    dispatch(setAdmin(parsed));
  } catch (err) {
    console.error("Failed to parse adminInfo:", err);
    localStorage.removeItem("adminInfo"); 
  }
} else {
  router.push("/admin/login");
}
  }
  },[admin,dispatch,router])
}