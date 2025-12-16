"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiCalendar as DateIcon,
  FiMapPin as LocationIcon,
  FiUser as OrganizerIcon,
  FiArrowRight,
} from "react-icons/fi";
import { HiTicket } from "react-icons/hi";
import { GiWineBottle } from "react-icons/gi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export interface EventCardData {
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
  price?: number;
  rating?: number;
  totalReviews?: number;
}

interface Props {
  event: EventCardData;
}

export default function EventCards({ event }: Props) {
  const router = useRouter();

  const renderStars = (rating: number) =>
    Array(5)
      .fill(0)
      .map((_, i) =>
        i < Math.floor(rating) ? (
          <FaStar key={i} className="text-amber-400" />
        ) : i === Math.floor(rating) && rating % 1 >= 0.5 ? (
          <FaStarHalfAlt key={i} className="text-amber-400" />
        ) : (
          <FaRegStar key={i} className="text-amber-400" />
        )
      );

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-100 aspect-[4/5] flex flex-col">
      
      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={event.images?.[0] || "/placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* CATEGORY */}
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow">
          <GiWineBottle className="mr-2 text-indigo-600" size={16} />
          {event.category}
        </div>

        {/* TITLE + LOCATION */}
        <div className="absolute bottom-16 left-4 right-4">
          <h3 className="text-white font-bold text-xl line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <LocationIcon className="mr-1.5" size={14} />
            {event.location.split(",")[0]}
          </div>
        </div>
      </div>

      {/* RATING / AVAILABILITY */}
      <div className="bg-black px-4 py-3 flex items-center justify-between">
        {event.rating ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">{renderStars(event.rating)}</div>
            <span className="text-white text-sm font-semibold">
              {event.rating.toFixed(1)}
            </span>
          </div>
        ) : (
          <span className="text-white text-sm">
            {event.availability > 0 ? `${event.availability}% Booked` : "New"}
          </span>
        )}
        <span className="text-white text-sm font-medium">
          {event.availability}% Booked
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 flex flex-col">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700 text-sm">
            <DateIcon className="mr-2 text-purple-500" />
            {event.startDate}
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <OrganizerIcon className="mr-2 text-amber-500" />
            By {event.organizer}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(`/user/events/${event.id}`)}
          className="mt-auto w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg transition"
        >
          <HiTicket size={16} />
          Book Now
          <FiArrowRight size={14} />
        </button>

        {/* TICKETS LEFT */}
        <div className="mt-3 flex items-center text-sm text-gray-700">
          <HiTicket className="mr-2 text-red-500" />
          {event.ticketsLeft} tickets remaining
        </div>
      </div>
    </div>
  );
}
