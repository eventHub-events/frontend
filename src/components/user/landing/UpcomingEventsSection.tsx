"use client";

import { useEffect, useState } from "react";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import { UpcomingEvent } from "./UpcomingEventsGrid";
import Image from "next/image";


export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await eventDisplayService.fetchUpcomingEvents();
         console.log("rses",res)
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch upcoming events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <section className="relative py-20 bg-[#f4f7fb] mt-0">
      <div className="max-w-7xl mx-auto px-4 md:px-6">

        
        {/* ===== SECTION TITLE ===== */}
        <div className="mb-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Happening Now
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl text-slate-900 font-bold tracking-tight">
            Upcoming{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
              Events
            </span>
          </h2>
        </div>

        {/* ===== HEADER RIGHT BADGE ===== */}
        <div className="flex justify-end mb-10">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
            <CalendarDays className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Next 7 Days
            </span>
          </div>
        </div>

        {/* ===== EVENTS GRID ===== */}
        <div className="min-h-[300px]">
         {loading ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-[420px] bg-white rounded-3xl animate-pulse shadow-sm"
      />
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
   {events.map((event: UpcomingEvent) => (
  <div
    key={event.eventId}
   className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-100 flex flex-col"

  >
    {/* IMAGE */}
    <div className="relative w-full overflow-hidden shrink-0">
      <div className="relative h-60 w-full overflow-hidden">
       <Image
                           src={event.images[0]}
                           alt={event.title}
                           fill
                           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                           className="object-cover transition-transform duration-700 group-hover:scale-105"
                           priority={Number(event.eventId) <= 3}
                         />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* category badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
          <span className="text-gray-800">{event.category}</span>
        </div>

        {/* title + location */}
        <div className="absolute bottom-16 left-4 right-4">
          <h3 className="text-white font-bold text-xl mb-1 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-white/90 text-sm">{event.location}</p>
        </div>
      </div>

      {/* black booking bar */}
    <div className="bg-black px-4 py-3 text-white text-sm font-medium text-center">
  {event.availability > 0
    ? `${Number(event.availability).toFixed(2)}% Booked`
    : "Just Launched!"}
</div>


    </div>

    {/* CONTENT */}
    <div className="flex-1 p-6 flex flex-col">
      <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
        {event.description}
      </p>

      <div className="space-y-2 mb-5 text-sm">
        <div className="text-gray-700 font-medium">
          📅 {event.startDate}
        </div>
        <div className="text-gray-700">
          👤 By {event.organizer}
        </div>
      </div>
       
       {/* tickets remaining */}
<div className="mt-auto mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
  <span className="text-red-500">🎟</span>
  <span>{event.ticketsLeft} tickets remaining</span>
</div>

      {/* BUTTON */}
      <button
        onClick={() => window.location.href = `/user/events/${event.eventId}`}
        className="mt-auto w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
      >
        🎟 Book Now →
      </button>

      {/* <div className="mt-3 text-sm font-semibold text-gray-700 text-center">
        {event.ticketsLeft} tickets remaining
      </div> */}
    </div>
  </div>
))}

  </div>
)}

        </div>

        {/* ===== FOOTER BUTTON ===== */}
        {!loading && events.length > 0 && (
          <div className="mt-16 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 border-slate-300 text-slate-700 font-semibold hover:bg-white hover:shadow-md transition-all"
            >
              View Full Calendar
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
