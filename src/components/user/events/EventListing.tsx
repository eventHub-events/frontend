"use client";

import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import { FiMapPin, FiUser } from "react-icons/fi";
import { GiWineBottle } from "react-icons/gi";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/button";
import { PaginatedEventsResponse } from "@/types/user/events/eventResponseType";

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
  return { ...state, ...action }; // merge, not replace -> stable object
}

interface EventsListingProps {
  title: string;
  initialCategory?: string; // ✅ undefined when not provided
  fetchEvents: (params: {
    title?: string;
    location?: string;
    category?: string;
    organizer?: string;
    page: number;
    limit: number;
  }) => Promise<PaginatedEventsResponse<FeaturedEvent>>;
}

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

  // ✅ SHOW CATEGORY FILTER ONLY WHEN CATEGORY IS NOT FIXED
  const showCategoryFilter = !initialCategory;

  // ✅ FILTER STATE (CATEGORY INCLUDED ONLY WHEN NEEDED)
  const [filters, dispatchFilters] = useReducer(filterReducer, {
  title: "",
  location: "",
  organizer: "",
  ...(initialCategory ? { category: initialCategory } : {}),
});

  // ✅ FETCH DATA
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
    console.log("hhhhj")

    load();
  }, [filters, page, limit, fetchEvents]);

  // ✅ FILTER HANDLER (MAIN FIX)
 const handleSearch = React.useCallback(
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

const filterConfig = React.useMemo(
  () => [
    { label: "Title", name: "title", type: "text" as const },
    { label: "Location", name: "location", type: "text" as const },
    { label: "Organizer", name: "organizer", type: "text" as const },
    ...(showCategoryFilter
      ? [{ label: "Category", name: "category", type: "text" as const }]
      : []),
  ],
  [showCategoryFilter]
);


  return (
    <section className="py-24 bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover immersive experiences curated just for you
          </p>

          {/* FILTER BAR */}
          <div className="mt-10">
          <FilterBar filters={filterConfig} onApply={handleSearch} />

          </div>
        </div>

        {/* LOADER */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* EVENTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {events.map((event) => {
                const date = new Date(event.startDate);
                const month = date.toLocaleString("en-US", { month: "short" });
                const day = date.getDate();

                return (
                  <div
                    key={event.id}
                    className="
                      group bg-white rounded-[28px]
                      overflow-hidden border border-black/5
                      shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                      transition-all duration-500
                      hover:-translate-y-2 hover:shadow-[0_35px_80px_rgba(0,0,0,0.15)]
                    "
                  >
                    {/* IMAGE */}
                    <div className="relative h-56">
                      <Image
                        src={event.images?.[0] || "/placeholder.jpg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

                      {/* CATEGORY */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full shadow-md text-xs font-semibold">
                        <GiWineBottle className="text-indigo-600" />
                        {event.category}
                      </div>

                      {/* DATE */}
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-xl shadow-md text-center">
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          {month}
                        </div>
                        <div className="text-lg font-extrabold text-slate-900">
                          {day}
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <h3 className="
                        text-[22px] font-extrabold mb-2 line-clamp-2
                        bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600
                        bg-clip-text text-transparent
                      ">
                        {event.title}
                      </h3>

                      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="text-sm space-y-2 mb-4">
                        <div className="flex gap-2 items-center">
                          <FiMapPin className="text-blue-600" />
                          {event.location}
                        </div>
                        <div className="flex gap-2 items-center">
                          <FiUser className="text-violet-600" />
                          {event.organizer}
                        </div>
                      </div>

                      {/* TICKETS */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-red-600 font-semibold text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          {event.ticketsLeft} tickets left
                        </div>
                        <span className="text-xs text-slate-500">
                          {Math.round(event.availability)}% booked
                        </span>
                      </div>

                      {/* AVAILABILITY BAR */}
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-5">
                        <div
                          className={`
                            h-full transition-all duration-700
                            ${
                              event.availability > 80
                                ? "bg-gradient-to-r from-red-500 to-orange-500"
                                : event.availability > 50
                                ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                                : "bg-gradient-to-r from-emerald-400 to-green-500"
                            }
                          `}
                          style={{ width: `${event.availability}%` }}
                        />
                      </div>

                      {/* CTA */}
                      <button
                        onClick={() => router.push(`/user/events/${event.id}`)}
                        className="
                          w-full py-3 rounded-xl
                          bg-gradient-to-r from-red-600 to-orange-500
                          text-white font-semibold
                          shadow-md transition
                          hover:shadow-lg hover:scale-[1.03]
                        "
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-14 gap-4">
              <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Prev
              </Button>

              <span className="text-slate-700 font-medium">
                Page {page} of {totalPages}
              </span>

              <Button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsListing;
