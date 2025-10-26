"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiCalendar as DateIcon,
  FiMapPin as LocationIcon,
  FiUser as OrganizerIcon,
  FiArrowRight,
} from "react-icons/fi";
import { HiTicket, HiTicket as TicketIcon } from "react-icons/hi";
import { GiWineBottle } from "react-icons/gi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { eventDisplayService } from "@/services/user/eventDisplayService";

interface FeaturedEvent {
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
  tags?: string[];
  price?: number;
  rating?: number;
  totalReviews?: number;
}

const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);

  // Star rating component
  const renderStars = (rating: number) => {
    return Array(5)
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
  };

  useEffect(() => {
    try {
      const getFeaturedEvents = async () => {
        const res = await eventDisplayService.fetchFeaturedEvents();
        setFeaturedEvents(res.data.data);
      };
      getFeaturedEvents();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-150 to-slate-150">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Featured
            </span>{" "}
            Events
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div
              key={event.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-100 aspect-[4/5] flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full overflow-hidden flex-shrink-0">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={event.images[0]}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={Number(event.id) <= 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <GiWineBottle className="mr-2 text-indigo-600" size={16} />
                    <span className="text-gray-800">{event.category}</span>
                  </div>

                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-16 left-4 right-4">
                    <h3 className="text-white font-bold text-xl mb-2 leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <LocationIcon className="mr-1.5" size={14} />
                      <span className="line-clamp-1">
                        {event.location.split(",")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Top Rated Ribbon */}
                  {event.rating && event.rating >= 4.8 && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                      🔥 Top Rated
                    </div>
                  )}
                </div>

                {/* ✅ Rating section shown only if rating exists */}
                {event.rating ? (
                  <div className="bg-black px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(event.rating)}
                      </div>
                      <div className="text-white text-sm">
                        <span className="font-semibold">
                          {event.rating.toFixed(1)}
                        </span>
                        {event.totalReviews ? (
                          <span className="text-gray-300">
                            {" "}
                            ({event.totalReviews})
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-white text-sm font-medium">
                      {event.availability}% Booked
                    </div>
                  </div>
                ) : (
                  <div className="bg-black px-4 py-3 flex items-center justify-center text-white text-sm font-medium">
                    {event.availability > 0 ? `${event.availability}% Booked` : "Just Launched!"}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3 flex-shrink-0">
                  {event.description}
                </p>

                <div className="space-y-3 mb-4 flex-shrink-0">
                  <div className="flex items-center text-gray-700">
                    <DateIcon
                      className="mr-3 text-purple-500 flex-shrink-0"
                      size={16}
                    />
                    <span className="font-medium text-sm">{event.startDate}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <OrganizerIcon
                      className="mr-3 text-amber-500 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-sm">By {event.organizer}</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="mb-4 flex-shrink-0">
                  <button className="w-full group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                    <HiTicket className="text-white" size={16} />
                    Book Now
                    <FiArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-200"
                      size={14}
                    />
                  </button>
                </div>

                {/* Tickets Remaining */}
                <div className="flex items-center text-gray-700 mb-2 flex-shrink-0">
                  <TicketIcon
                    className="mr-3 text-red-500 flex-shrink-0"
                    size={16}
                  />
                  <span className="font-semibold text-sm">
                    {event.ticketsLeft} tickets remaining
                  </span>
                </div>

                {/* Availability Bar */}
                {/* <div className="mt-auto pt-4 flex-shrink-0">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Almost gone!</span>
                    <span className="font-semibold text-emerald-600">
                      {event.availability}% booked
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${event.availability}%` }}
                    ></div>
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Explore All Events
            <FiArrowRight
              className="group-hover:translate-x-1 transition-transform duration-200"
              size={18}
            />
          </button>
          <p className="text-gray-500 mt-4 text-sm">
            Join 50,000+ attendees in unforgettable experiences
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
