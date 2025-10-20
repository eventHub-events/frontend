"use client";

import React, { useState, useEffect } from "react";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaSearch } from "react-icons/fa";

import Link from "next/link";
import { eventService } from "@/services/organizer/eventServices";
import { useAppSelector } from "@/redux/hooks";
import { EventData } from "@/types/organizer/events";
import { showSuccess } from "@/utils/toastService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { EventStatus } from "@/enums/organizer/events";
import { useRouter } from "next/navigation";



export const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const organizerId = organizer?.id;
  const router = useRouter()

  useEffect(() => {
    // Simulate fetch (replace with actual API)
   const fetchEvents = async () => {
     try{
         console.log("organizerId", organizerId)
        const  response =  await eventService.fetchEvents(organizerId!);
        setEvents(response?.data.data);
        
     }catch(err){
        console.log(err)
     }

   }
   fetchEvents()
    
    
  }, [organizerId]);

  const handleEdit = (id: string) => {
       router.push(`/organizer/events/edit/${id}`);
  };
  const handleView = (id: string) => console.log("View", id);
  const handleDelete = async (id: string) => {
           try{
            console.log("event id", id)
              const response =  await eventService.deleteEvent(id)
              if(response){
                 showSuccess("Event deleted successfully")
              }
              console.log(response)
           }catch(err){
               toast.error(err instanceof AxiosError?err.message:"Error in  deleting event")
           }
  } 
  const handleCancel =  async (id: string) => {
        try{
            console.log("event id", id)
              const response =  await eventService.cancelEvent(id)
              if(response){
                 showSuccess("Event cancelled successfully");
                const updated = events.map((e) =>
  e.eventId === id ? { ...e, status: EventStatus.Cancelled } : e
);
setEvents(updated);
              }
              console.log(response)
           }catch(err){
               toast.error(err instanceof AxiosError?err.message:"Error in  cancelling event")
           }
  }
  

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || event.status === filter)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <Link href="/organizer/events/add">
        <Button  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <FaPlus />
          <span>Create Event</span>
        </Button>
        </Link>
      </div>
      <p className="text-gray-500">Manage and track all your events</p>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center border rounded-lg px-3 w-1/2">
          <FaSearch className="text-gray-400 mr-2" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none focus:ring-0"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.eventId}
            event={event}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
};
