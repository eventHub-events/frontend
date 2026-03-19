"use client";

import React, { useState, useEffect } from "react";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { EventData } from "@/types/organizer/events";
import { showSuccess } from "@/utils/toastService";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { EventStatus } from "@/enums/organizer/events";
import { useRouter } from "next/navigation";
import { EVENT_SERVICE } from "@/services/organizer/eventServices";
import StripeRequiredScreen from "../StripeRequiredScreen";

export const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const organizerId = organizer?.id;
  const router = useRouter();

  useEffect(() => {
   
    const fetchEvents = async () => {
      try {
        if (!organizer) return;
        setLoading(true);
        const response = await EVENT_SERVICE.fetchEvents(organizerId!);
        setEvents(response?.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizerId]);

  const handleEdit = (id: string) => {
    router.push(`/organizer/events/edit/${id}`);
  };

  const handleView = (id: string) => console.log("View", id);

  const handleDelete = async (id: string) => {
    try {
      const response = await EVENT_SERVICE.deleteEvent(id);
      if (response) {
        showSuccess("Event deleted successfully");
        setEvents((prev) => prev.filter((e) => e.eventId !== id));
      }
    } catch (err) {
      toast.error(
        err instanceof AxiosError
          ? err.message
          : "Error in deleting event"
      );
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await EVENT_SERVICE.cancelEvent(id);
      if (response) {
        showSuccess("Event cancelled successfully");
        const updated = events.map((e) =>
          e.eventId === id
            ? { ...e, status: EventStatus.Cancelled }
            : e
        );
        setEvents(updated);
      }
    } catch (err) {
      toast.error(
        err instanceof AxiosError
          ? err.message
          : "Error in cancelling event"
      );
    }
  };

  const handleViewReviews = (id: string) => {
    router.push(`/organizer/events/${id}/reviews`);
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || event.status === filter)
  );

  if (!organizer) return null;

  if (!organizer.isVerified) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Verification Required
          </h2>
          <p className="text-gray-500">
            Please complete your verification to access event management.
          </p>
          <Button onClick={() => router.push("/organizer/profile")}>
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  if (!organizer.isStripeConnected) {
    return <StripeRequiredScreen />;
  }

  
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-14 px-6">
    <div className="max-w-6xl mx-auto">

      {/* Main Glass Container */}
      <div className="relative bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-12 space-y-12">

        {/* Decorative subtle glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        {/* Header */}
       
            {/* Hero Section */}
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-900 via-orange-600 to-orange-700 p-10 text-white shadow-xl">

  <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl opacity-30"></div>

  <div className="relative z-10 space-y-8">

    {/* Top Row */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          My Events
        </h1>
        <p className="text-white/80 mt-2 text-lg">
          Manage and track all your events effortlessly
        </p>
      </div>

      <Link href="/organizer/events/add">
        <Button className="flex items-center gap-3 bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105">
          <FaPlus className="text-sm" />
          Create Event
        </Button>
      </Link>
    </div>

    {/* Search + Filter */}
    <div className="flex flex-col md:flex-row gap-6">

      <div className="flex items-center bg-white/90 rounded-xl px-5 py-3 w-full md:flex-1 shadow-md focus-within:ring-2 focus-within:ring-white transition">
        <FaSearch className="text-gray-400 mr-3" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-700"
        />
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-white text-gray-700 rounded-xl px-6 py-3 shadow-md focus:ring-2 focus:ring-white transition cursor-pointer"
      >
        <option value="All">All Status</option>
        <option value="Draft">Draft</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

    </div>
  </div>
</div>
        {/* Events Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 relative z-10">

            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-md opacity-40 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>

            <p className="text-gray-600 text-lg font-medium">
              Loading your events...
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center space-y-8 relative z-10">

            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 shadow-inner">
              <FaPlus className="text-blue-600 text-3xl" />
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-800">
                No events found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You haven’t created any events yet or no events match your filter.
                Start by creating a new event.
              </p>
            </div>

            <Link href="/organizer/events/add">
              <Button className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">
                Create Your First Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                onCancel={handleCancel}
                onManageTickets={(id) =>
                  router.push(`/organizer/events/${id}/tickets`)
                }
                onViewReviews={handleViewReviews}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  </div>
);
};