"use client";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaEdit,
  FaEye,
  FaTrash,
  FaBan,
} from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { EventData } from "@/types/organizer/events";

interface EventCardProps {
  event: EventData;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onManageTickets?: (id: string) => void;
  totalTicketsSold?: number;
  totalRevenue?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onView,
  onDelete,
  onCancel,
  onManageTickets,
  totalTicketsSold = 0,
  totalRevenue = 0,
}) => {
  const getStatusColor = (status?: string) => {
   switch (status?.toLowerCase()) {
  case "upcoming":
    return "bg-blue-100 text-blue-700";
  case "active":
    return "bg-yellow-100 text-yellow-700";
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
          src={event.images?.[0] || "/placeholder.jpg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
            event.status
          )}`}
        >
          {event.status?.toUpperCase()}
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {event.description}
        </p>

        <div className="flex items-center text-sm text-gray-600 mt-2">
          <FaCalendarAlt className="mr-2 text-gray-400" />
          <span>
            {new Date(event.startDate).toLocaleDateString()}{" "}
            {event.startTime || ""}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span>{event.location?.city}</span>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-700 mt-2 border-t pt-2">
          <div className="flex items-center space-x-1">
            <FaUsers className="text-gray-400" />
            <span>
              {totalTicketsSold}/{event.totalCapacity}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <FaDollarSign className="text-gray-400" />
            <span>{totalRevenue}</span>
          </div>
        </div>

        <div className="flex justify-between mt-3">
          <Button
            onClick={() => onEdit(event.eventId!)}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <FaEdit />
            <span>Edit</span>
          </Button>
          <Button
               onClick={() => onManageTickets?.(event.eventId!)}
               variant="secondary"
               size="sm"
               className="flex items-center space-x-1"
>
          <FaDollarSign />
         <span>Tickets</span>
         </Button>
          <div className="flex items-center space-x-2">
            <FaEye
              onClick={() => onView(event.eventId!)}
              className="cursor-pointer text-gray-500 hover:text-blue-600"
            />
            <FaBan
              onClick={() => onCancel(event.eventId!)}
              className="cursor-pointer text-red-500 hover:text-red-700"
            />
            <FaTrash
              onClick={() => onDelete(event.eventId!)}
              className="cursor-pointer text-gray-500 hover:text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
