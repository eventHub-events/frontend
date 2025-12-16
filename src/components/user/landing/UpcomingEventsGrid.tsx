"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiMapPin, FiArrowRight } from "react-icons/fi";
import { GiTicket } from "react-icons/gi";

export interface UpcomingEvent {
  eventId: string;
  title: string;
  description: string;
  startDate: string;
  location: string;
  images: string[];
  category: string;
  ticketsLeft: number;
  availability: number;
  organizer: string;
}

interface Props {
  events: UpcomingEvent[];
}

export default function UpcomingEventsGrid({ events }: Props) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => {
        const date = new Date(event.startDate);
        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();

        const organizerInitials = event.organizer
          ? event.organizer.slice(0, 2).toUpperCase()
          : "EV";

        return (
          <div
            key={event.eventId}
            className="
              group relative p-[1px] rounded-[32px]
              bg-gradient-to-b from-white via-slate-100 to-slate-200
              hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400
              transition-all duration-500
              hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.25)]
              hover:-translate-y-2
            "
          >
            {/* INNER CARD */}
            <div className="relative h-full bg-white rounded-[31px] overflow-hidden flex flex-col">

              {/* IMAGE HEADER */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={event.images?.[0] || "/placeholder.jpg"}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* DATE BADGE */}
                <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl p-3 text-center shadow-lg">
                  <span className="block text-xs font-bold text-white uppercase tracking-wider">
                    {month}
                  </span>
                  <span className="block text-2xl font-black text-white">
                    {day}
                  </span>
                </div>

                {/* CATEGORY */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                    {event.category}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex flex-col flex-grow p-6">

                {/* TITLE */}
                <div className="mb-4">
                  <h3 className="text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-1">
                    {event.description}
                  </p>
                </div>

                {/* META */}
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FiMapPin className="text-indigo-500" />
                    <span className="font-semibold truncate max-w-[110px]">
                      {event.location}
                    </span>
                  </div>

                  <div className="w-px h-4 bg-slate-200" />

                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                      {organizerInitials}
                    </div>
                    <span className="font-semibold truncate max-w-[110px]">
                      {event.organizer || "Organizer"}
                    </span>
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="h-px w-full bg-slate-100 mb-5" />

                {/* FOOTER */}
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-3 text-xs font-bold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <GiTicket />
                      {event.ticketsLeft} remaining
                    </span>
                    <span className="text-slate-400">
                      {Math.round(event.availability)}% booked
                    </span>
                  </div>

                  {/* PROGRESS */}
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${event.availability}%` }}
                    />
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => router.push(`/user/events/${event.eventId}`)}
                    className="
                      w-full py-3.5 rounded-xl
                      bg-gradient-to-r from-red-600 via-orange-500 to-amber-500
                      bg-[length:200%_auto] hover:bg-right
                      transition-all duration-500
                      text-white font-bold text-sm
                      shadow-xl shadow-orange-300
                      flex items-center justify-center gap-2
                    "
                  >
                    Get Tickets
                    <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
