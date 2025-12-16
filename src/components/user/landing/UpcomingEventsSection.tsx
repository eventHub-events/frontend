"use client";

import { useEffect, useState } from "react";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import { UpcomingEvent } from "./UpcomingEventsGrid"; 
import EventGrid from "./HomeEventGrid"; 

export default function UpcomingEventsSection() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await eventDisplayService.fetchUpcomingEvents();
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
    // 1. Outer Background (Light Gray to make the box pop)
    <section className="relative py-20 bg-[#f1f4f8] mt-0">
      
      {/* Container to constrain width */}
      <div className=" mx-auto px-4 md:px-6">

        {/* 2. THE BOX (White, Rounded, Shadowed) */}
        <div className="relative bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          
          {/* Subtle Grid Pattern inside the box */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10">
            {/* ================= HEADER ================= */}
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 border-b border-slate-100 pb-8">
               
               {/* Left: Title */}
               <div>
                  <div className="flex items-center gap-2 mb-3">
                     <span className="relative flex h-2.5 w-2.5">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                     </span>
                     <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Happening Now</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl  text-slate-900 font-bold tracking-tight">
                    Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500  font-bold">Events.</span>
                  </h2>
               </div>

               {/* Right: Context Badge */}
               <div className="mt-4 md:mt-0 hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                   <CalendarDays className="w-4 h-4 text-indigo-600" />
                   <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Next 7 Days</span>
               </div>
            </div>

            {/* ================= CONTENT GRID ================= */}
            <div className="min-h-[300px]">
              {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="h-[320px] bg-slate-50 rounded-3xl animate-pulse" />
                   ))}
                 </div>
              ) : (
                <EventGrid events={events} />
              )}
            </div>

            {/* ================= FOOTER LINK ================= */}
            {!loading && events.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button variant="outline" className="rounded-full px-8 py-6 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all">
                   View Full Calendar <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}