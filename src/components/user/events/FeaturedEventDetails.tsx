"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiCalendar as DateIcon,
  FiMapPin as LocationIcon,
  FiUser as OrganizerIcon,
  FiArrowRight,
} from "react-icons/fi";
import { HiTicket } from "react-icons/hi";
import { GiWineBottle } from "react-icons/gi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/button";

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

const FeaturedEventsDetails = () => {
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    category: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 6;
  const router = useRouter();

  // ⭐ Render Stars
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

  // 🧠 Fetch Events
  useEffect(() => {
    const getFeaturedEvents = async () => {
      try {
        setLoading(true);
        const res = await eventDisplayService.fetchAllFeaturedEvents({
          ...filters,
          page,
          limit,
        });
        
        setFeaturedEvents(res.data.data.events);
        setTotalPages(res.data.data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching featured events:", err);
      } finally {
        setLoading(false);
      }
    };

    getFeaturedEvents();
  }, [filters, page]);

  // 🔍 Handle Filter Apply
  const handleSearch = (newFilters: Record<string, string>) => {
    setPage(1);
    setFilters({
      title: newFilters.title || "",
      location: newFilters.location || "",
      category: newFilters.category || "",
    });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-150 to-slate-150">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
              Featured
            </span>{" "}
            Events
          </h2>

          {/* 🔍 Filters */}
          <div className="mb-10">
            <FilterBar
              filters={[
                { label: "Title", name: "title", type: "text" },
                { label: "Location", name: "location", type: "text" },
                {
                  label: "Category",
                  name: "category",
                  type: "select",
                  options: ["Music", "Sports", "Tech", "Art"],
                },
              ]}
              onApply={handleSearch}
            />
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-indigo-100 aspect-[4/5] flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full overflow-hidden flex-shrink-0">
                    <div className="relative h-56 w-full overflow-hidden">
                      <Image
                        src={event.images?.[0] || "/placeholder.jpg"}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={Number(event.id) <= 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Category */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center shadow-lg">
                        <GiWineBottle className="mr-2 text-indigo-600" size={16} />
                        <span className="text-gray-800">{event.category}</span>
                      </div>

                      {/* Overlay Info */}
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

                      {/* Top Rated Badge */}
                      {event.rating && event.rating >= 4.8 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
                          🔥 Top Rated
                        </div>
                      )}
                    </div>

                    {/* Rating / Availability */}
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
                        {event.availability > 0
                          ? `${event.availability}% Booked`
                          : "Just Launched!"}
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
                        <span className="font-medium text-sm">
                          {event.startDate}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <OrganizerIcon
                          className="mr-3 text-amber-500 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-sm">By {event.organizer}</span>
                      </div>
                    </div>

                    {/* Book Now */}
                    <div className="mb-4 flex-shrink-0">
                      <button
                        onClick={() => router.push(`/user/events/${event.id}`)}
                        className="w-full group relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                      >
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
                      <HiTicket
                        className="mr-3 text-red-500 flex-shrink-0"
                        size={16}
                      />
                      <span className="font-semibold text-sm">
                        {event.ticketsLeft} tickets remaining
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-10">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </Button>
              <span className="text-gray-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedEventsDetails;
