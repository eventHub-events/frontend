"use client"

import TicketManagementPage from "@/components/organizer/events/TicketManagement";
import { useParams } from "next/navigation";


export  default function TicketPage (){
  const {eventId } = useParams()
  
  return (
    <TicketManagementPage eventId={eventId as string}/>
  )
}