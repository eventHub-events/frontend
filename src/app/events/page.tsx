"use client";
import EventsListing, { FeaturedEvent } from "@/components/user/events/EventListing";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { useCallback } from "react";
import { PaginatedEventsResponse } from "@/types/user/events/eventResponseType";
import Header from "@/components/user/landing/Header";
import Footer from "@/components/user/landing/Footer";



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

  return (
  
    <div>
       <Header/>
      <EventsListing title="Explore Events" fetchEvents={fetchEvents} />
      <Footer/>
    </div>
  )
};

export default AllEventsPage;
