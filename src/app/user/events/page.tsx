"use client";
import EventsListing, { FeaturedEvent } from "@/components/user/events/EventListing";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { useCallback } from "react";
import { PaginatedEventsResponse } from "@/types/user/events/eventResponseType";



const AllEventsPage = () => {
  const fetchEvents = useCallback(
    (params: {
      title?: string;
      location?: string;
      category?: string;
      organizer?: string;
      page: number;
      limit: number;
    }): Promise<PaginatedEventsResponse<FeaturedEvent>> =>
      eventDisplayService.fetchAllEventByFilter(params),
    [] // empty dependency array ensures stable reference
  );

  return <EventsListing title="Explore Events" fetchEvents={fetchEvents} />;
};

export default AllEventsPage;
