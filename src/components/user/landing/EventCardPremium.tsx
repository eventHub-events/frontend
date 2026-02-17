"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiArrowRight
} from "react-icons/fi";
import { HiTicket } from "react-icons/hi";
import { GiWineBottle } from "react-icons/gi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export interface PremiumEvent {
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
  rating?: number;
  totalReviews?: number;
  price?:number;
  
}

interface Props {
  event: PremiumEvent;
}

export const EventCardPremium: React.FC<Props> = ({ event }) => {
  const router = useRouter();

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => {
        if (i < Math.floor(rating)) {
          return <FaStar key={i} className="text-amber-400" />;
        } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
          return <FaStarHalfAlt key={i} className="text-amber-400" />;
        } else {
          return <FaRegStar key={i} className="text-amber-400" />;
        }
      });
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:-translate-y-1">

      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={event.images?.[0] || "/placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* category */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow">
          <GiWineBottle className="mr-1 text-red-600" />
          {event.category}
        </div>

        {/* title */}
        <div className="absolute bottom-14 left-4 right-4">
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center text-white/90 text-xs mt-1">
            <FiMapPin className="mr-1" />
            {event.location}
          </div>
        </div>
      </div>

      {/* rating / booked */}
      {event.rating ? (
        <div className="bg-black px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {renderStars(event.rating)}
            <span className="text-white text-xs ml-2">
              {event.rating.toFixed(1)}
              {event.totalReviews && (
                <span className="text-gray-300 ml-1">
                  ({event.totalReviews})
                </span>
              )}
            </span>
          </div>
          <span className="text-white text-xs font-semibold">
            {event.availability}% Booked
          </span>
        </div>
      ) : (
        <div className="bg-black px-4 py-2 text-center text-white text-xs font-semibold">
          {event.availability > 0
            ? `${event.availability}% Booked`
            : "Just Launched!"}
        </div>
      )}

      {/* CONTENT */}
      <div className="p-5 flex flex-col">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-indigo-500" size={14} />
            {event.startDate}
          </div>
          <div className="flex items-center">
            <FiUser className="mr-2 text-amber-500" size={14} />
            By {event.organizer}
          </div>
        </div>

        {/* BOOK BUTTON */}
        <button
          onClick={() => router.push(`/user/events/${event.id}`)}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition"
        >
          <HiTicket />
          Book Now
          <FiArrowRight />
        </button>

        {/* tickets */}
        <div className="flex items-center text-xs text-gray-600 mt-3">
          <HiTicket className="mr-2 text-red-500" />
          {event.ticketsLeft} tickets remaining
        </div>
      </div>
    </div>
  );
};
