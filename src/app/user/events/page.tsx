"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EventGrid from "@/components/user/events/EventGrid";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { Search, CalendarX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardData } from "@/components/user/events/EventCards";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 12;

  useEffect(() => {
    setPage(1); // 🔑 reset page on new search
  }, [search]);

  useEffect(() => {
    fetchEvents();
  }, [search, page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventDisplayService.fetchSearchedEvents({
        search,
        page,
        limit,
      });

      setEvents(res.data.data.events);
      setTotalPages(res.data.data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

      {/* ================= HERO ================= */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {search ? "Search Results" : "Discover Events"}
          </h1>

          <p className="text-gray-500 mt-2">
            {search
              ? "Events that match your search"
              : "Browse concerts, workshops, conferences and more"}
          </p>

          {search && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
              <Search className="w-4 h-4" />
              “{search}”
            </div>
          )}
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* -------- Loading Skeleton -------- */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-3xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* -------- Empty State -------- */}
        {!loading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <CalendarX className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 max-w-md">
              Try adjusting your search or explore other exciting events.
            </p>
          </div>
        )}

        {/* -------- Events Grid -------- */}
        {!loading && events.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {events.length}
                </span>{" "}
                events
              </p>

              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </p>
            </div>

            <EventGrid events={events} />

            {/* -------- Pagination -------- */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Prev
              </Button>

              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
