"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiMapPin as LocationIcon,
  FiUser as OrganizerIcon,
  FiArrowRight,
} from "react-icons/fi";
import { HiTicket } from "react-icons/hi";
import { GiWineBottle } from "react-icons/gi";
import { Calendar as DateIcon } from "lucide-react";

export interface EventGridItem {
  eventId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  location: string;
  organizer: string;
  startDate: string;
  ticketsLeft: number;
  availability: number;
  rating?: number;
  totalReviews?: number;
}

interface EventGridProps {
  events: EventGridItem[];
  renderStars?: (rating: number) => React.ReactNode;
}

const EventGrid = ({ events }: EventGridProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
       <div
  key={event.eventId}
  className="group bg-white rounded-3xl overflow-hidden
             shadow-lg hover:shadow-2xl transition-all duration-500
             border border-gray-100 hover:border-indigo-100
             flex flex-col"
>
  {/* ================= IMAGE ================= */}
  <div className="relative h-56 w-full">
    <Image
      src={event.images?.[0] || "/placeholder.jpg"}
      alt={event.title}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

    {/* Category */}
    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg">
      <GiWineBottle className="mr-2 text-indigo-600" size={16} />
      {event.category}
    </div>

    {/* Title + Location */}
    <div className="absolute bottom-4 left-4 right-4">
      <h3 className="text-white font-bold text-xl leading-tight line-clamp-2">
        {event.title}
      </h3>
      <div className="flex items-center text-white/90 text-sm mt-1">
        <LocationIcon className="mr-1.5" size={14} />
        {event.location.split(",")[0]}
      </div>
    </div>
  </div>

  {/* ================= AVAILABILITY ================= */}
  <div className="bg-black text-white text-sm font-medium py-2 text-center">
    {event.availability > 0
      ? `${Math.round(event.availability)}% Booked`
      : "Just Launched!"}
  </div>

  {/* ================= CONTENT ================= */}
  <div className="flex flex-col p-6 flex-grow">
    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
      {event.description}
    </p>

    <div className="space-y-3 mb-4">
      <div className="flex items-center text-gray-700 text-sm">
        <DateIcon className="mr-3 text-purple-500" size={16} />
        {new Date(event.startDate).toLocaleDateString()}
      </div>

      <div className="flex items-center text-gray-700 text-sm">
        <OrganizerIcon className="mr-3 text-amber-500" size={16} />
        By {event.organizer}
      </div>

      <div className="flex items-center text-gray-700 text-sm">
        <HiTicket className="mr-3 text-red-500" size={16} />
        <span className="font-semibold">
          {event.ticketsLeft} tickets remaining
        </span>
      </div>
    </div>

    {/* ================= CTA ================= */}
    <button
      onClick={() => router.push(`/user/events/${event.eventId}`)}
      className="mt-auto w-full px-6 py-3
                 bg-gradient-to-r from-red-600 to-red-700
                 hover:from-red-700 hover:to-red-800
                 text-white font-semibold rounded-xl
                 transition-all duration-300 shadow-md
                 hover:shadow-lg flex items-center justify-center gap-2 text-sm"
    >
      <HiTicket size={16} />
      Book Now
      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
    </button>
  </div>
</div>

      ))}
    </div>
  );
};

export default EventGrid;
