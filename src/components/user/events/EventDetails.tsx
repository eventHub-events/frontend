"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ChatDrawer from "@/components/chat/ChatDrawer";
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
  FiCheck,
  
  FiAward,
  // FiPlus,
  // FiMinus,
} from "react-icons/fi";
// import { HiPlus, HiMinus } from "react-icons/hi";
import {
  BsTicket,   // Regular + Header (ticket stub)
} from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { eventDisplayService } from "@/services/user/eventDisplayService";
import { showError } from "@/utils/toastService";
import { bookingService } from "@/services/user/bookingService";
import { BookedTickets, BookingPayload } from "@/interface/user/booking";
import { useAppSelector } from "@/redux/hooks";
import Swal from "sweetalert2";
import ReviewSection from "../review/event/ReviewSection";
import ReportIcon from "../report/ReportIcon";
import { BadgeCheck, RefreshCw, Shield, ShieldCheck, ShoppingBag, Sparkles, Ticket } from "lucide-react";

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
  stripeAccountId: string;
  venue: string;
  organizerName: string;
  category: string;
}

const EventDetails: React.FC = () => {
  const params = useParams();
  const eventId = params.id as string ;
  const [chatState, setChatState] = useState({
  open: false,
  mode: "private" as "private" | "community",
});

  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ticketSelections, setTicketSelections] = useState<
    { ticket: TicketData; count: number }[]
  >([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  // const [selected, setSelected] = useState<any>(null);


 

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await eventDisplayService.fetchEventDetailsById(
          eventId as string
        );
        const fetchedEvent = res.data.data;
        console.log("fecthecd event", fetchedEvent);
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
     eventImages : event.images,
     userEmail: user.email,
     stripeAccountId : event.stripeAccountId
     

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
                       {/* ✅ REPORT EVENT */}
                             <ReportIcon
                               targetId={event.id}
                               targetType="event"
                               reporterId={user?.id??""}
                               reporterName={user?.name??""}
                               reporterRole="user"
                                  />
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
             <button
  onClick={() => setChatState({ open: true, mode: "private" })}
  className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-purple-300 group hover:scale-105"
>
  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
    <FiMessageCircle className="text-white text-sm" />
  </div>
  <span className="font-semibold text-gray-700 text-sm">Chat with Organizer</span>
</button>

<button
  onClick={() => setChatState({ open: true, mode: "community" })}
  className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 group hover:scale-105"
>
  <div className="p-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg group-hover:scale-110 transition-transform">
    <FiUsers className="text-white text-sm" />
  </div>
  <span className="font-semibold text-gray-700 text-sm">Community Chat</span>
</button>
            </div>

            {/* Enhanced Tickets Section */}
            <div className="bg-[#ededed] rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* <div className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-500 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-green-500 rounded-xl shadow-md">
                    <FiTag className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Available Tickets</h3>
                    <p className="text-gray-600 text-sm">Choose your preferred ticket type</p>
                  </div>
                </div>
              </div> */}
{/* ... inside your component */}

<section className="bg-slate-50/50 rounded-[3rem] border border-slate-200 p-8 md:p-12 shadow-inner">
  {/* HEADER */}
  <div className="flex items-center gap-3 mb-10">
    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
      <BsTicket size={24} />
    </div>
    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
      Choose Your Experience
    </h3>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
    {ticketSelections.map((item, index) => {
      const seatsLeft =
        item.ticket.totalSeats -
        item.ticket.bookedSeats -
        item.count;

      const isVIP = item.ticket.name.toLowerCase().includes("vip");
      const isPremium = item.ticket.name.toLowerCase().includes("premium");

      const theme = isVIP
        ? {
            icon: FiAward,
            accentBg: "bg-purple-500",
            badge: true,
          }
        : isPremium
        ? {
            icon: FiStar,
            accentBg: "bg-orange-500",
            badge: false,
          }
        : {
            icon: BsTicket,
            accentBg: "bg-blue-500",
            badge: false,
          };

      const Icon = theme.icon;

      return (
        <div
          key={item.ticket.name}
          className={`
            relative rounded-[2.5rem] border-2 border-slate-200
            flex flex-col bg-white shadow-xl transition-all duration-500
            ${isVIP ? "scale-[1.05] z-10 shadow-2xl" : "hover:scale-[1.02]"}
            p-8
          `}
        >
          {/* MOST POPULAR BADGE */}
          {theme.badge && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2
              bg-orange-500 text-white text-[10px] font-black
              px-5 py-2 rounded-full shadow-lg uppercase">
              Most Popular
            </div>
          )}

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center
                ${theme.accentBg} text-white text-2xl shadow-md
              `}
            >
              <Icon />
            </div>
          </div>

          {/* TITLE & PRICE */}
          <div className="text-center mb-6">
            <h4 className="text-xl font-extrabold text-slate-800 uppercase">
              {item.ticket.name}
            </h4>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-black text-slate-900">
                ₹{item.ticket.price}
              </span>
              <span className="text-slate-400 text-sm font-bold">
                /person
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-slate-500 text-center leading-relaxed font-medium mb-8">
            {item.ticket.description}
          </p>

          {/* BENEFITS */}
          <ul className="space-y-4 mb-10 flex-grow">
            {item.ticket.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-1 bg-emerald-100 text-emerald-600 shadow-sm">
                  <FiCheck size={12} strokeWidth={4} />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          {/* AVAILABILITY (MATCHES SCREENSHOT) */}
          <div className="mt-auto pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">
                Available
              </span>
              <span className="text-sm font-semibold text-emerald-600">
                {seatsLeft} left
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${Math.max(
                    5,
                    (seatsLeft / item.ticket.totalSeats) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* QUANTITY CONTROL (UNCHANGED) */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-6 rounded-2xl px-6 py-3 shadow-xl">
              <button
                onClick={() => handleDecrease(index)}
                className="text-2xl font-light text-slate-400"
                disabled={item.count === 0}
              >
                −
              </button>

              <div className="flex flex-col items-center min-w-[24px]">
                <span className="text-slate-900 font-black text-lg">
                  {item.count}
                </span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">
                  Qty
                </span>
              </div>

              <button
                onClick={() => handleIncrease(index)}
                className="text-2xl font-light text-slate-400"
              >
                +
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</section>

 

            </div>

            {/* Event Details Section */}
<div className="bg-white rounded-[20px] border border-gray-200 shadow-lg overflow-hidden">

  {/* ================= HEADER ================= */}
  <div className="px-8 py-6 border-b border-gray-200">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl bg-indigo-600 text-white">
        <FiLayers className="text-xl" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">
          Event Details
        </h3>
        <p className="text-sm text-gray-500">
          Everything you need to know about this event
        </p>
      </div>
    </div>
  </div>

  <div className="p-8 space-y-12">

    {/* ================= GALLERY ================= */}
    {event.images?.length > 0 && (
      <section className="space-y-4">
        <h4 className="text-xl font-semibold text-gray-900">
          Event Gallery
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {event.images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-xl overflow-hidden group"
            >
              <Image
                src={img}
                alt={`Event image ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>
    )}

    {/* ================= EVENT INFORMATION ================= */}
    <section className="space-y-6">
      <h4 className="text-xl font-semibold text-gray-900">
        Event Information
      </h4>

      <div className="divide-y divide-gray-200">

        {/* Date & Time */}
        <div className="flex items-start gap-6 py-5">
          <div className="text-indigo-600 mt-1">
            <FiCalendar className="text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              Date & Time
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(event.startDate).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-6 py-5">
          <div className="text-emerald-600 mt-1">
            <FiMapPin className="text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              Location
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {event.venue}, {event.location.city}
            </p>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-start gap-6 py-5">
          <div className="text-purple-600 mt-1">
            <FiUsers className="text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              Capacity
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {event.totalCapacity} Attendees
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-start gap-6 py-6">
          <div className="text-orange-600 mt-1">
            <FiTag className="text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              Starting From
            </p>
            <p className="text-3xl font-extrabold text-gray-900">
              ₹{startingPrice}
            </p>
          </div>
        </div>

      </div>
    </section>

    {/* ================= ABOUT ================= */}
    <section className="space-y-4 max-w-3xl">
      <h4 className="text-xl font-semibold text-gray-900">
        About This Event
      </h4>

      <p className="text-gray-700 leading-relaxed">
        {event.description}
      </p>

      {(event.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {event.tags?.map(tag => (
            <span
              key={tag}
              className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </section>

  </div>
</div>


            <ReviewSection mode={"event"} targetId={event.id} userId={user?.id??""} userName={user?.name??""} />
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            {/* Sticky Booking Card */}
            <div className="sticky top-6">
           <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-300 overflow-hidden"
>
  {/* Header */}
  <div className="p-5 bg-gradient-to-r from-red-600 to-red-700">
    <div className="flex items-center justify-center gap-2">
      <ShoppingBag className="w-5 h-5 text-white" />
      <h3 className="text-lg font-bold text-white text-center">
        Booking Summary
      </h3>
    </div>
  </div>

  <div className="p-5 space-y-6">
    {/* Price Display */}
    <motion.div
      animate={totalTicketsSelected > 0 ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="text-center space-y-2"
    >
      <div className="text-4xl font-black text-gray-900">
        ₹{totalPrice}
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 rounded-full border border-purple-200">
        <Ticket className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-semibold text-purple-900">
          {totalTicketsSelected > 0
            ? `${totalTicketsSelected} ticket${
                totalTicketsSelected > 1 ? "s" : ""
              } selected`
            : "Select tickets to continue"}
        </span>
      </div>
    </motion.div>

    {/* Selected Tickets */}
    <AnimatePresence>
      {totalTicketsSelected > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Selected Tickets
          </div>

          {ticketSelections
            .filter(item => item.count > 0)
            .map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Ticket className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      {item.ticket.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Quantity: {item.count}
                    </div>
                  </div>
                </div>

                <div className="text-sm font-bold text-black-900">
                  ₹{(item.ticket.price * item.count).toFixed(2)}
                </div>
              </motion.div>
            ))}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Checkout Button */}
    <motion.button
      onClick={handleBooking}
      disabled={totalTicketsSelected === 0}
      whileHover={totalTicketsSelected > 0 ? { scale: 1.03 } : {}}
      whileTap={totalTicketsSelected > 0 ? { scale: 0.97 } : {}}
      className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
        totalTicketsSelected > 0
          ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-900"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      {totalTicketsSelected > 0
        ? "Proceed to Checkout"
        : "Select Tickets"}
    </motion.button>

    {/* Trust Badges */}
    <div className="space-y-2">
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
        <div className="p-2 bg-green-500 rounded-lg">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-bold text-green-700">
            Secure checkout
          </div>
          <div className="text-[11px] text-green-600">
            SSL encrypted payment
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <div className="p-2 bg-blue-500 rounded-lg">
          <RefreshCw className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-xs font-bold text-blue-700">
            100% refundable
          </div>
          <div className="text-[11px] text-blue-600">
            Cancel 24 hours before event
          </div>
        </div>
      </div>
    </div>
  </div>
</motion.div>


              {/* Organizer Info */}
{/* Added mt-8 for spacing and max-w-md to keep it elegant in the sidebar */}
 <div className="relative mt-8 flex items-center justify-between gap-6 rounded-2xl 
      bg-white/70 backdrop-blur-xl px-6 py-5 
      shadow-[0_20px_60px_-25px_rgba(0,0,0,0.25)] 
      border border-gray-200">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-xl 
          bg-gradient-to-br from-red-600 to-purple-600 text-white shadow-lg">
          <ShieldCheck className="h-7 w-7" />
          {event.organizerName && (
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300" />
          )}
        </div>

        {/* Name + Meta */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-semibold text-gray-900 tracking-tight">
              {event.organizerName}
            </h4>

            {event.organizerName && (
              <span className="inline-flex items-center gap-1 rounded-full 
                bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Trusted official organizer
          </p>
        </div>
      </div>

      {/* RIGHT SIDE ACTION */}
     <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all cursor-pointer opacity-60 hover:opacity-100">
           <ReportIcon
            targetId={event.organizerId}
            targetType="organizer"
            reporterId={user?.id ?? ""}
            reporterName={user?.name??""}
            reporterRole="user"
          />
        </div>
    </div>   <ReviewSection 
                  mode="organizer" 
                  targetId={event.organizerId} 
                  userId={user?.id ?? ""} 
                  userName={user?.name?? ""}
                  />

            </div>
          </div>
        </div>
      </div>
         <ChatDrawer
  open={chatState.open}
  onClose={() => setChatState({ ...chatState, open: false })}
  mode={chatState.mode}
  eventId={event.id}
  organizerId={event.organizerId}
  userId={user?.id?? ""}
  role={user?.role??""}
  // userName={event.organizerName+" - Organizer"}
  userName={user?.name?? ""}
  peerId={event.organizerId}
  targetName={event.organizerName+" - Organizer"}
   isChatOpen={chatState.open} 


/>

    </div>
    
  );
};

export default EventDetails;