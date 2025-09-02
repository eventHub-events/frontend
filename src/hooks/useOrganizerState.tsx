"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setOrganizer } from "@/redux/slices/organizer/authSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"


export function useOrganizerState(){
  const  dispatch= useAppDispatch()
  const router= useRouter()
  
  const organizer=useAppSelector((state)=>state.organizerAuth.organizer)

  useEffect(()=>{
    if(!organizer && typeof window!=="undefined"){
      const stored= localStorage.getItem("organizerInfo")
      
if (stored && stored !== "undefined") {
  try {
    const parsed = JSON.parse(stored);
    dispatch(setOrganizer(parsed));
  } catch (err) {
    console.error("Failed to parse userInfo:", err);
    localStorage.removeItem("organizerInfo"); // optional: clean up
  }
} else {
  router.push("/");
}
    }

  },[organizer,dispatch,router])
}