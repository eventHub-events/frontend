"use client";

import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaEdit, FaEye, FaTrash, FaBan } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: {
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
  };
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onView,
  onDelete,
  onCancel,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "draft":
        return "bg-gray-200 text-gray-700";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition">
      <div className="relative h-44 w-full">
        <Image
          src={event.imageUrls[0] || "/placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {event.status.toUpperCase()}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>

        <div className="flex items-center text-sm text-gray-600 mt-2">
          <FaCalendarAlt className="mr-2 text-gray-400" />
          <span>
            {new Date(event.eventTime.startDate).toLocaleDateString()} @{" "}
            {event.eventTime.startTime}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span>{event.location.city}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-700 mt-2 border-t pt-2">
          <div className="flex items-center space-x-1">
            <FaUsers className="text-gray-400" />
            <span>
              {event.ticketsSold}/{event.capacity}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FaDollarSign className="text-gray-400" />
            <span>{event.revenue}</span>
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <Button
            onClick={() => onEdit(event._id)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <FaEdit />
            <span>Edit</span>
          </Button>
          <div className="flex items-center space-x-2">
            <FaEye
              onClick={() => onView(event._id)}
              className="cursor-pointer text-gray-500 hover:text-blue-600"
            />
            <FaBan
              onClick={() => onCancel(event._id)}
              className="cursor-pointer text-red-500 hover:text-red-700"
            />
            <FaTrash
              onClick={() => onDelete(event._id)}
              className="cursor-pointer text-gray-500 hover:text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
