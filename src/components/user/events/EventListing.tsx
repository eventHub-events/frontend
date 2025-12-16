"use client";

import React, { useEffect, useReducer, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { FiMapPin, FiUser, FiArrowRight, FiFilter, FiZap, FiSearch } from "react-icons/fi";
import {  GiTicket } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/button";
import { PaginatedEventsResponse } from "@/types/user/events/eventResponseType";

/* ================= TYPES (UNCHANGED) ================= */

export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  images: string[];
  availability: number;
  ticketsLeft: number;
  organizer: string;
  location: string;
  category: string;
  startDate: string;
  tags: string[];
}

type FilterState = {
  title?: string;
  location?: string;
  organizer?: string;
  category?: string;
};

function filterReducer(state: FilterState, action: Partial<FilterState>) {
  return { ...state, ...action };
}

interface EventsListingProps {
  title: string;
  initialCategory?: string;
  fetchEvents: (params: {
    title?: string;
    location?: string;
    category?: string;
    organizer?: string;
    page: number;
    limit: number;
  }) => Promise<PaginatedEventsResponse<FeaturedEvent>>;
}

/* ================= COMPONENT ================= */

const EventsListing = ({
  title,
  initialCategory,
  fetchEvents,
}: EventsListingProps) => {
  const router = useRouter();
  const limit = 6;

  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const showCategoryFilter = !initialCategory;

  const [filters, dispatchFilters] = useReducer(filterReducer, {
    title: "",
    location: "",
    organizer: "",
    ...(initialCategory ? { category: initialCategory } : {}),
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchEvents({
          ...filters,
          page,
          limit,
        });

        setEvents(res.data.data?.events || []);
        setTotalPages(res.data.data?.totalPages || 1);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, page, limit, fetchEvents]);

  /* ================= FILTER ================= */

  const handleSearch = useCallback(
    (newFilters: Record<string, string>) => {
      setPage(1);
      dispatchFilters({
        title: newFilters.title || "",
        location: newFilters.location || "",
        organizer: newFilters.organizer || "",
        category: showCategoryFilter
          ? newFilters.category || ""
          : initialCategory || "",
      });
    },
    [showCategoryFilter, initialCategory]
  );

  const filterConfig = useMemo(
    () => [
      { label: "Search Event", name: "title", type: "text" as const, placeholder: "e.g. Jazz Night", icon: <FiSearch /> },
      { label: "Location", name: "location", type: "text" as const, placeholder: "City or Venue", icon: <FiMapPin /> },
      { label: "Organizer", name: "organizer", type: "text" as const, placeholder: "Name", icon: <FiUser /> },
      ...(showCategoryFilter
        ? [{ label: "Category", name: "category", type: "text" as const, placeholder: "All", icon: <FiFilter /> }]
        : []),
    ],
    [showCategoryFilter]
  );

  /* ================= RENDER ================= */

  return (
    <section className="relative min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Subtle mesh gradient at top */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[600px] bg-indigo-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[500px] bg-pink-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* ================= COMPACT HEADER CARD ================= */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] mb-12 overflow-hidden">
          <div className="flex flex-col xl:flex-row">
            
            {/* Left: Text & Brand Area (Styled) */}
            <div className="relative p-8 xl:w-[40%] flex flex-col justify-center overflow-hidden">
               {/* Decorative background blobs for text area */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase mb-5 shadow-lg shadow-indigo-500/20 w-fit">
                    <FiZap className="text-yellow-400 fill-yellow-400" />
                    Live Experiences
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4 text-slate-900">
                    {title}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">.</span>
                  </h2>
                  
                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                    Curated moments by the best organizers. <br className="hidden md:block"/> 
                    <span className="text-indigo-600 font-semibold">Book your spot</span> and make memories.
                  </p>
               </div>
            </div>

            {/* Divider (Visible on Desktop) */}
            <div className="hidden xl:block w-[1px] bg-gradient-to-b from-transparent via-slate-100 to-transparent my-4" />

            {/* Right: Filters Area (Clean) */}
            <div className="p-6 xl:p-8 xl:w-[60%] bg-slate-50/30 flex flex-col justify-center">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5">
                 {/* Reusing existing FilterBar structure but wrapper is cleaner */}
                 <FilterBar filters={filterConfig} onApply={handleSearch} />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400 font-medium px-2">
                 <span>Popular:</span>
                 <button className="hover:text-indigo-600 transition-colors">Music</button> •
                 <button className="hover:text-indigo-600 transition-colors">Tech</button> •
                 <button className="hover:text-indigo-600 transition-colors">Workshops</button>
              </div>
            </div>

          </div>
        </div>

        {/* ================= LOADER ================= */}
        {loading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Updating list...</p>
          </div>
        ) : (
          <>
            {/* ================= EVENTS GRID ================= */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           {events.map((event) => {
                             const date = new Date(event.startDate);
                             const month = date.toLocaleString("en-US", { month: "short" });
                             const day = date.getDate();
                             
                             // Get initials for organizer avatar
                             const organizerInitials = event.organizer.slice(0, 2).toUpperCase();
             
                             return (
                               <div
                                 key={event.id}
                                 // GRADIENT BORDER SHELL: The outer div handles the gradient hover effect
                                 className="group relative p-[1px] rounded-[32px] bg-gradient-to-b from-white via-slate-100 to-slate-200 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.25)] hover:-translate-y-2"
                               >
                                 {/* Inner Card Content */}
                                 <div className="relative h-full bg-white rounded-[31px] overflow-hidden flex flex-col">
                                   
                                   {/* 1. Immersive Image Header */}
                                   <div className="relative h-64 w-full overflow-hidden">
                                     <Image
                                       src={event.images?.[0] || "/placeholder.jpg"}
                                       alt={event.title}
                                       fill
                                       className="object-cover transition-transform duration-700 group-hover:scale-110"
                                     />
                                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
             
                                     {/* Glass Date Badge */}
                                     <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-3 text-center min-w-[60px] shadow-lg">
                                        <span className="block text-xs font-bold text-white uppercase tracking-wider mb-1 drop-shadow-sm">{month}</span>
                                        <span className="block text-2xl font-black text-white leading-none drop-shadow-md">{day}</span>
                                     </div>
             
                                     {/* Category Tag */}
                                     <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                                           {event.category}
                                        </span>
                                     </div>
                                   </div>
             
                                   {/* 2. Content Body */}
                                   <div className="flex flex-col flex-grow p-6">
                                     
                                     {/* Title */}
                                     <div className="mb-4">
                                        <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                                           {event.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-1">
                                           {event.description}
                                        </p>
                                     </div>
             
                                     {/* Modern Metadata Row */}
                                     <div className="flex items-center gap-4 mb-6 text-sm">
                                        {/* Location */}
                                        <div className="flex items-center gap-1.5 text-slate-600">
                                           <FiMapPin className="text-indigo-500" />
                                           <span className="font-semibold truncate max-w-[100px]">{event.location}</span>
                                        </div>
                                        
                                        <div className="w-[1px] h-4 bg-slate-200"></div>
             
                                        {/* Organizer with Avatar */}
                                        <div className="flex items-center gap-2 text-slate-600">
                                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                                              {organizerInitials}
                                           </div>
                                           <span className="font-semibold truncate max-w-[100px]">{event.organizer}</span>
                                        </div>
                                     </div>
             
                                     {/* Divider */}
                                     <div className="h-[1px] w-full bg-slate-100 mb-5"></div>
             
                                     {/* 3. Action Footer */}
                                     <div className="mt-auto">
                                        {/* Availability Info */}
                                        <div className="flex justify-between items-center mb-3 text-xs font-bold">
                                           <span className="text-gree-500 flex items-center gap-1">
                                              <GiTicket className="text-sm" /> 
                                              {event.ticketsLeft} remaining
                                           </span>
                                           <span className="text-slate-400">
                                              {Math.round(event.availability)}% booked
                                           </span>
                                        </div>
                                        
                                        {/* Decorative tiny progress line */}
                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                                           <div className="h-full bg-rose-500 rounded-full" style={{ width: `${event.availability}%` }}></div>
                                        </div>
             
                                        {/* Glossy Button */}
                                        <button 
                                          onClick={() => router.push(`/user/events/${event.id}`)}
                                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-bold text-sm shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group/btn"
                                        >
                                          Get Tickets
                                          <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 text-indigo-300" />
                                        </button>
                                     </div>
                                   </div>
             
                                 </div>
                               </div>
                             );
                           })}
                         </div>
             

            {/* ================= PAGINATION ================= */}
                 <div className="mt-20 flex justify-center items-center gap-6 backdrop-blur-xl bg-white/70 border border-black/5 shadow-xl rounded-2xl px-8 py-4">
                              <Button
                                variant="outline"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                              >
                                ← Previous
                              </Button>
                
                              <span className="text-slate-700 font-semibold">
                                Page {page} of {totalPages}
                              </span>
                
                              <Button
                                variant="outline"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                              >
                                Next →
                              </Button>
                            </div>
                
                            {/* ================= FOOTER CTA ================= */}
                            <div className="mt-32 text-center">
                              <h3 className="text-3xl font-extrabold mb-4">
                                Can’t find what you’re looking for?
                              </h3>
                              <p className="text-slate-600 mb-6">
                                New events are added every day by verified organizers.
                              </p>
                              <Button className="px-8 py-4 text-lg rounded-xl">
                                Explore All Events
                              </Button>
                            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsListing;