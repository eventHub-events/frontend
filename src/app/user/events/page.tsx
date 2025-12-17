import EventsClient from "@/components/user/events/EventsClient";
import { Suspense } from "react";


export default function EventsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading events…</div>}>
      <EventsClient />
    </Suspense>
  );
}
