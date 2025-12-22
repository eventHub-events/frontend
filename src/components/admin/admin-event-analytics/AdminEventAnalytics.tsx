"use client";

import { useEffect, useState } from "react";


import { EventData } from "@/types/organizer/events";
import { CreditCard, Ticket } from "lucide-react";

// import { AnalyticsFilters } from "./AnalyticsFilter";
// import { AnalyticsSummaryCards } from "./AnalyticsSummaryCards";
// import { AnalyticsPieCharts } from "./AnalyticsPieCharts";
// import { TicketRevenueLineCharts } from "./TicketRevenueLineCharts";
// import { BookingTable } from "./BookingsTable";

// import { useDebounce } from "./useDebounce";
// import { EventSelector } from "./EventSelector";
import { EVENT_ANALYTICS_SERVICE } from "@/services/event-analytics/eventAnalyticsService";
// import { TicketTypeAnalytics } from "./TicketTypeAnalytics";
import Pagination from "@/components/ui/Pagination";
import { EventAnalyticsData } from "@/interface/common/event-analytics";


import { EventSelector } from "@/components/organizer/event-analytics/EventSelector";
import { AnalyticsFilters } from "@/components/organizer/event-analytics/AnalyticsFilter";
import { AnalyticsSummaryCards } from "@/components/organizer/event-analytics/AnalyticsSummaryCards";
import { TicketRevenueLineCharts } from "@/components/organizer/event-analytics/TicketRevenueLineCharts";
import { AnalyticsPieCharts } from "@/components/organizer/event-analytics/AnalyticsPieCharts";
import { BookingTable } from "@/components/organizer/event-analytics/BookingsTable";
import { useDebounce } from "@/components/organizer/event-analytics/useDebounce";
import { TicketTypeAnalytics } from "@/components/organizer/event-analytics/TicketTypeAnalytics";
import { eventManagementService } from "@/services/admin/eventManagementService";

/* ---------------- TYPES ---------------- */

interface FiltersState {
  from?: string;
  to?: string;
  bookingStatus?: string;
  paymentMethod?: string;
  refundStatus?: string;
  search?: string;
 
}
export interface EventAnalyticsFilter {
  eventId : string;
  from? : Date | string;
  to?: Date | string;
  bookingStatus? :string;
  paymentMethod?: string;
  refundStatus?: string;
  search? : string;
   page?: number;
  limit?: number;
}
/* ---------------- PAGE ---------------- */

export default function EventAnalyticsAdmin() {
  
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [eventId, setEventId] = useState<string>();
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EventAnalyticsData| null>(null);
  const [page, setPage] = useState(1);
const limit = 10;
 

  /* ---------------- API CALL ---------------- */

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const res = await eventManagementService.fetchAllEvents();
        console.log("evneeee", res)
        const formattedEvents = res.data.data
  .filter((e: EventData) => typeof e.id === "string" && e.id.trim() !== "")
  .map((e: EventData) => ({
    id: e.id,
    title: e.title
  }));

setEvents(formattedEvents);

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!eventId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await EVENT_ANALYTICS_SERVICE.fetchEventAnalyticsData({
          eventId,
          ...filters,
          search: debouncedSearch,
          page,
          limit
        });
        console.log("ress", res)
        setData(res.data.data);
      } catch (err) {
        console.error("Failed to load event analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId, filters, debouncedSearch]);

  useEffect(() => {
  setPage(1);
}, [eventId, filters, debouncedSearch]);


   

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6">

      {/* HEADER: EVENT SELECT + FILTERS */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">

        <EventSelector
          events={events}
          value={eventId}
          onChange={setEventId}
        />

        <AnalyticsFilters
          filters={filters}
          search={search}
          onSearchChange={setSearch}
          onChange={setFilters}
        />
      </div>

      {/* EMPTY STATE */}
      {!eventId && (
  <div className="flex justify-center py-20">
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">

      {/* Icon */}
      <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
        <Ticket size={26} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900">
        No Event Selected
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 mt-1">
        Please select an event to view detailed analytics, bookings,
        and revenue insights.
      </p>

      {/* Hint */}
      <div className="mt-4 text-xs text-muted-foreground">
        Use the event selector above to get started
      </div>
    </div>
  </div>
)}


      {eventId && data && (
        <>
          {/* SUMMARY CARDS */}
          <AnalyticsSummaryCards data={data.summary} />

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TicketRevenueLineCharts
              ticketTrend={data.ticketTrend}
              revenueTrend={data.revenueTrend}
            />

            <AnalyticsPieCharts
              paymentSplit={data.paymentSplit}
              refundSplit={data.refundSplit}
            />
          </div>

             {/* ✅ TICKET TYPE ANALYTICS (NEW SECTION) */}
          

{/* SECTION HEADING */}
<div className="mt-12 mb-10 ">
  <div
    className="
      rounded-2xl
      border border-gray-200
      border-t-1 border-t-red-900
      border-b-1 border-b-red-900
      border-l-1 border-l-red-900
      border-r-1 border-r-red-900
      shadow-sm
      px-8 py-6
      w-full max-w-4xl
      bg-white
    "
  >
    <div className="flex items-center gap-4">


      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
        <Ticket size={26} />
      </div>

      {/* Text */}
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Ticket  Wise  Performance
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Breakdown of sales and revenue by ticket category
        </p>
      </div>

    </div>
  </div>
</div>





    <TicketTypeAnalytics
      ticketTypePerformance={
        data.ticketTypePerformance
      }
      ticketRevenueSplit={
        data.ticketRevenueSplit
      }
      topTicketType={
        data.topTicketType
      }
    />

        {/* BOOKINGS TABLE SECTION ✅ */}
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* TABLE HEADING */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <CreditCard size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Booking Transactions
                </h2>
                <p className="text-sm text-gray-500">
                  Complete list of bookings, payments, and refund statuses
                </p>
              </div>
            </div>

            {/* TABLE */}
            <div className="p-4">
              <BookingTable rows={data.bookings} />
            </div>
            <Pagination
                                currentPage={page}
                                totalPages={data.pagination.totalPages}
                                onPageChange={(p) => setPage(p)}
                              />
          </div>
        </>
      )}

      {loading && (
        <div className="text-center py-10 text-muted-foreground">
          Loading analytics...
        </div>
      )}
    </div>
  );
}
