import EventCards, { EventCardData } from "./EventCards";





interface Props {
  events: EventCardData[];
}

export default function EventGrid({ events }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCards key={event.id} event={event} />
      ))}
    </div>
  );
}
