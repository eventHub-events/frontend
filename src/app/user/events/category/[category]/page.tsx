"use client"
import EventsListing from "@/components/user/events/EventListing";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { useParams } from "next/navigation";

export default function CategoryEventsPage() {
  const { category } = useParams();

  const decodedCategory = decodeURIComponent(category as string);

  return (
    <EventsListing
      title={`${decodedCategory} Events`}
      initialCategory={decodedCategory}
      fetchEvents={eventDisplayService.fetchAllEventByFilter}
    />
  );
}