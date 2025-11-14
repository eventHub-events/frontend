"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiCalendar,
  FiMapPin,
  FiStar,
  FiTag,
  FiLayers,
  FiUsers,
  FiMessageCircle,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import { HiPlus, HiMinus } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { showError } from "@/utils/toastService";
import { bookingService } from "@/services/user/bookingService";
import { BookedTickets, BookingPayload } from "@/interface/user/booking";
import { useAppSelector } from "@/redux/hooks";
import Swal from "sweetalert2";

interface TicketData {
  name: string;
  totalSeats: number;
  description: string;
  benefits: string[];
  maxTicketPerUser: number;
  isRefundable: boolean;
  price: number;
  bookedSeats: number;
}

interface EventDetailsData {
  id: string;
  title: string;
  images: string[];
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  startDate: string;
  tags?: string[];
  tickets: TicketData[];
  totalCapacity: number;
  organizerId: string;
  venue: string;
  organizerName: string;
  category: string;
}

const EventDetails: React.FC = () => {
  const params = useParams();
  const eventId = params.id as string ;

  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketSelections, setTicketSelections] = useState<
    { ticket: TicketData; count: number }[]
  >([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
 

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await eventDisplayService.fetchEventDetailsById(
          eventId as string
        );
        const fetchedEvent = res.data.data;
        setEvent(fetchedEvent);

        const initialSelection = fetchedEvent.tickets.map((t: TicketData) => ({
          ticket: t,
          count: 0,
        }));
        setTicketSelections(initialSelection);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600">{"The event you're looking for doesn't exist."}</p>
        </div>
      </div>
    );
  }

  const handleIncrease = (index: number) => {
    setTicketSelections((prev) =>
      prev.map((item, i) =>
        i === index &&
        item.count < item.ticket.totalSeats - item.ticket.bookedSeats
          ? { ...item, count: item.count + 1 }
          : item
      )
    );
  };

  const handleDecrease = (index: number) => {
    setTicketSelections((prev) =>
      prev.map((item, i) =>
        i === index && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
  };

  const totalPrice = ticketSelections
    .reduce((sum, item) => sum + item.ticket.price * item.count, 0)
    .toFixed(2);

  const startingPrice = Math.min(...event.tickets.map((t) => t.price));
  const totalTicketsSelected = ticketSelections.reduce((sum, item) => sum + item.count, 0);

  const handleBooking = async () => {
   if (!event ) return;
   if(!user) return
  

  const selectedTickets: BookedTickets[] = ticketSelections
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.ticket.name,
      quantity: item.count,
      price: item.ticket.price,
    }));

  const payload:BookingPayload = {
     eventId,
     userId: user.id,
     eventTitle: event.title,
     eventDate: event.startDate,
     userName : user.name,
     organizerName: event.organizerName,
     eventVenue: event.venue,
     tickets: selectedTickets,
     organizerId: event.organizerId,
     eventImages : event.images
     

  };
   
  try {
    const res = await bookingService.bookTicket(event.id, payload);
    console.log("rseeee", res)
    const bookingId = res.data.data.id;
    if(res) {
       Swal.fire({
  html: `
    <div class="flex flex-col justify-center items-center">
      <div class="relative w-24 h-24 border-amber-700 rounded-full bg-white flex items-center justify-center shadow-lg animate-[pulse_1.5s_ease-in-out_infinite]">
        <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="mt-5 text-2xl font-bold text-black tracking-wide">Booking Successful!</h2>
      <p class="mt-2 text-gray-900 text-sm">Your tickets have been booked successfully 🎟️</p>
    </div>
  `,
  showConfirmButton: false,
  background: "transparent", 
  backdrop: "transparent",  
  width: "auto",
  padding: "0",
  timer: 2000,
  customClass: {
    popup: "shadow-none p-0",
  },
});
      
     router.push(`/user/make-payment/${bookingId}`)
    }
    // showSuccess("Tickets booked successfully!");

   
  } catch (err) {
    console.error("Booking failed:", err);
    showError("Failed to book tickets. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* ===== ENHANCED HEADER BANNER ===== */}
      <div className="relative bg-gradient-to-br from-red-900 via-purple-900 to-orange-900 text-white">
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-6">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            {/* Content Section */}
            <div className="space-y-4 z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-white/30">
                  {event.category}
                </span>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <FiStar className="text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8 (124 reviews)</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold leading-snug tracking-tight">
                {event.title}
              </h1>

                <p className="text-white/95 leading-relaxed max-w-xl text-sm">
                {event.description.slice(0, 160)}...
              </p>

             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/30">
                  <FiCalendar className="text-white/90 text-sm" />
                  <span className="text-sm font-medium">
                    {new Date(event.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/30">
                  <FiMapPin className="text-white/90 text-sm" />
                  <span className="text-sm font-medium">
                    {event.venue}, {event.location.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Image Section */}
               <div className="relative h-64 lg:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/30">
              <Image
                src={event.images[0]}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="bg-white/25 backdrop-blur-sm p-2 rounded-lg hover:bg-white/35 transition-all hover:scale-110"
                >
                  <FiHeart className={`text-sm ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button className="bg-white/25 backdrop-blur-sm p-2 rounded-lg hover:bg-white/35 transition-all hover:scale-110">
                  <FiShare2 className="text-sm text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Tickets & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-purple-300 group hover:scale-105">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                  <FiMessageCircle className="text-white text-sm" />
                </div>
                <span className="font-semibold text-gray-700 text-sm">Chat with Organizer</span>
              </button>
              <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 group hover:scale-105">
                <div className="p-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                  <FiUsers className="text-white text-sm" />
                </div>
                <span className="font-semibold text-gray-700 text-sm">Community Chat</span>
              </button>
            </div>

            {/* Enhanced Tickets Section */}
            <div className="bg-[#ededed] rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-500 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-500 rounded-xl shadow-md">
                    <FiTag className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Available Tickets</h3>
                    <p className="text-gray-600 text-sm">Choose your preferred ticket type</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {ticketSelections.map((item, index) => (
                  <motion.div
                    key={item.ticket.name}
                    whileHover={{ scale: 1.005, y: -2 }}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 shadow-sm ${
                      item.count > 0
                        ? "border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-md"
                        : "border-gray-200 hover:border-purple-300 bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h4 className="text-lg font-bold text-gray-800">{item.ticket.name}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.ticket.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                              ₹{item.ticket.price}
                            </div>
                            <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              {item.ticket.totalSeats - item.ticket.bookedSeats-(ticketSelections.find(t => t.ticket.name === item.ticket.name)?.count || 0)} seats left
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {item.ticket.benefits.slice(0, 3).map((benefit, i) => (
                            <span key={i} className="bg-white text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                              ✓ {benefit}
                            </span>
                          ))}
                          {item.ticket.benefits.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                              +{item.ticket.benefits.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Quantity Counter */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 border border-gray-300">
                            <button
                              onClick={() => handleDecrease(index)}
                              className="p-1.5 rounded-lg hover:bg-white transition-all text-gray-600 hover:text-gray-800 hover:shadow-sm disabled:opacity-30"
                              disabled={item.count === 0}
                            >
                              <HiMinus className="text-sm" />
                            </button>
                            <span className="w-6 text-center font-bold text-gray-800 text-sm">{item.count}</span>
                            <button
                              onClick={() => handleIncrease(index)}
                              className="p-1.5 rounded-lg hover:bg-white transition-all text-gray-600 hover:text-gray-800 hover:shadow-sm"
                            >
                              <HiPlus className="text-sm" />
                            </button>
                          </div>
                          {item.count > 0 && (
                            <div className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                              ₹{(item.ticket.price * item.count).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Event Details Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-gray-600 to-blue-600 rounded-xl shadow-md">
                    <FiLayers className="text-white text-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Event Details</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Gallery */}
                {event.images?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800 text-lg">Event Gallery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {event.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-shadow">
                          <Image
                            src={img}
                            alt={`Event image ${idx + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Event Info Grid */}
               <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-lg">Event Information</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-sm">
                      <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
                        <FiCalendar className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Date & Time</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {new Date(event.startDate).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 shadow-sm">
                      <div className="p-2 bg-green-500 rounded-lg shadow-sm">
                        <FiMapPin className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Location</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {event.venue}, {event.location.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-sm">
                      <div className="p-2 bg-purple-500 rounded-lg shadow-sm">
                        <FiUsers className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Capacity</p>
                        <p className="font-semibold text-gray-800 text-sm">{event.totalCapacity} attendees</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 shadow-sm">
                      <div className="p-2 bg-orange-500 rounded-lg shadow-sm">
                        <FiTag className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Starting from</p>
                        <p className="font-semibold text-gray-800 text-sm">₹{startingPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* About Event */}
               <div className="space-y-3">
                  <h4 className="font-bold text-gray-800 text-lg">About this Event</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{event.description}</p>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-300 shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Sticky Booking Card */}
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-300 overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-red-600 to-red-600">
                  <h3 className="text-lg font-bold text-white text-center">Booking Summary</h3>
                </div>

                <div className="p-5 space-y-5">
                  {/* Enhanced Price Display */}
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                      ₹{totalPrice}
                    </div>
                    <div className="text-gray-600 text-sm font-medium">
                      {totalTicketsSelected > 0 
                        ? `${totalTicketsSelected} ticket${totalTicketsSelected > 1 ? 's' : ''} selected`
                        : 'Select tickets to continue'
                      }
                    </div>
                  </div>
                  {/* Selected Tickets */}
                   <AnimatePresence>
                    {totalTicketsSelected > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Selected Tickets
                        </div>
                        {ticketSelections
                          .filter(item => item.count > 0)
                          .map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                              <div className="space-y-1">
                                <span className="font-semibold text-gray-800 block">{item.ticket.name}</span>
                                <span className="text-gray-600 text-xs">Quantity: {item.count}</span>
                              </div>
                              <span className="font-bold text-purple-600">₹{(item.ticket.price * item.count).toFixed(2)}</span>
                            </div>
                          ))
                        }
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Book Now Button */}
                   <button  onClick={ handleBooking}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                      totalTicketsSelected > 0
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-xl hover:scale-105 active:scale-95'
                        : 'bg-[#7B059B] text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={totalTicketsSelected === 0}
                  >
                    {totalTicketsSelected > 0 ? 'Proceed to Checkout' : 'Select Tickets'}
                  </button>

                  {/* Security Badge */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Secure checkout
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        100% refundable
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mt-6">
                <h4 className="font-bold text-gray-800 mb-4 text-sm">Organized by</h4>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-300">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    {event.organizerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{event.organizerName}</p>
                    <p className="text-gray-600 text-xs">Event Organizer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;