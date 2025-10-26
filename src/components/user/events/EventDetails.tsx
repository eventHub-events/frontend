"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { HiPlus, HiMinus } from "react-icons/hi";

interface TicketOption {
  type: string;
  price: number;
  perks: string[];
  available: number;
}

interface EventDetailsData {
  title: string;
  bannerImage: string;
  description: string;
  location: string;
  startDate: string;
  tags?: string[];
  ticketOptions: TicketOption[];
  totalCapacity: number;
}

const EventDetails: React.FC = () => {
  const params = useParams();
  const eventId = params.id;

  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketOption | null>(null);
  const [ticketCount, setTicketCount] = useState(1);

  // Fetch event data by ID
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        const data = await res.json();
        setEvent(data);
        if (data.ticketOptions?.length) setSelectedTicket(data.ticketOptions[0]);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <p className="text-center py-12">Loading event...</p>;
  if (!event) return <p className="text-center py-12">Event not found</p>;
  if (!selectedTicket) return null;

  const increase = () => {
    if (ticketCount < selectedTicket.available) setTicketCount(ticketCount + 1);
  };

  const decrease = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  const totalPrice = (ticketCount * selectedTicket.price).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Banner */}
      <div className="relative w-full h-80 rounded-xl overflow-hidden mb-8">
        <Image src={event.bannerImage} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <h1 className="absolute bottom-4 left-4 text-white text-3xl md:text-4xl font-bold">
          {event.title}
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Ticket & Booking Section */}
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-4">
            {event.ticketOptions.map((ticket) => (
              <div
                key={ticket.type}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedTicket.type === ticket.type
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-purple-400"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{ticket.type}</span>
                  <span className="font-bold">₹{ticket.price}</span>
                </div>
                <ul className="mt-2 text-xs text-gray-600 space-y-1">
                  {ticket.perks.map((perk, i) => (
                    <li key={i}>• {perk}</li>
                  ))}
                </ul>
                <div className="mt-2 text-xs text-green-600">
                  Available: {ticket.available} left
                </div>
              </div>
            ))}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={decrease}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
              >
                <HiMinus />
              </button>
              <span className="px-4">{ticketCount}</span>
              <button
                onClick={increase}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
              >
                <HiPlus />
              </button>
            </div>
            <span className="font-semibold text-lg">₹{totalPrice}</span>
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
            Book Now
          </button>
        </div>

        {/* Event Info & About */}
        <div className="md:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image src={event.bannerImage} alt="Gallery Image" fill className="object-cover" />
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-700 gap-4">
              <FiCalendar className="text-purple-500" />
              <span>{event.startDate}</span>
            </div>
            <div className="flex items-center text-gray-700 gap-4">
              <FiMapPin className="text-purple-500" />
              <span>{event.location}</span>
            </div>
            <div className="text-gray-700 text-sm">
              {event.ticketOptions.reduce((acc, t) => acc + t.available, 0)} tickets available • {event.ticketOptions.length} ticket options
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">About this Event</h3>
            <p className="text-gray-600 text-sm">{event.description}</p>
            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
