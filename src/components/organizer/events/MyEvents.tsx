"use client";

import React, { useState, useEffect } from "react";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaSearch } from "react-icons/fa";

import Link from "next/link";

interface EventType {
  _id: string;
  title: string;
  description: string;
  location: { address: string; city: string };
  eventTime: { startDate: string; startTime: string };
  imageUrls: string[];
  capacity: number;
  ticketsSold: number;
  revenue: number;
  status: "Draft" | "Upcoming" | "Completed" | "Cancelled";
}

export const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");


  useEffect(() => {
    // Simulate fetch (replace with actual API)
    const dummyEvents: EventType[] = [
      {
        _id: "1",
        title: "Tech Conference 2024",
        description: "Annual tech conference featuring the latest innovations",
        location: { address: "Convention Center", city: "New York" },
        eventTime: { startDate: "2024-02-15", startTime: "09:00 AM" },
        imageUrls: ["/images/event1.jpg"],
        capacity: 200,
        ticketsSold: 150,
        revenue: 7500,
        status: "Upcoming",
      },
      {
        _id: "2",
        title: "Music Festival Summer",
        description: "Three-day music festival with top artists",
        location: { address: "Central Park", city: "New York" },
        eventTime: { startDate: "2024-01-28", startTime: "02:00 PM" },
        imageUrls: ["/images/event2.jpg"],
        capacity: 350,
        ticketsSold: 320,
        revenue: 16000,
        status: "Completed",
      },
    ];
    setEvents(dummyEvents);
  }, []);

  const handleEdit = (id: string) => console.log("Edit", id);
  const handleView = (id: string) => console.log("View", id);
  const handleDelete = (id: string) => console.log("Delete", id);
  const handleCancel = (id: string) => console.log("Cancel", id);
  

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || event.status === filter)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <Link href="/organizer/events/add">
        <Button  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
          <FaPlus />
          <span>Create Event</span>
        </Button>
        </Link>
      </div>
      <p className="text-gray-500">Manage and track all your events</p>

      {/* Search and Filter */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center border rounded-lg px-3 w-1/2">
          <FaSearch className="text-gray-400 mr-2" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none focus:ring-0"
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
};
