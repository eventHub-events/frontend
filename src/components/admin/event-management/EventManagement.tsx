"use client";

import { useState, useEffect } from "react";
import { showSuccess, showWarning } from "@/utils/toastService";
import { eventManagementService } from "@/services/admin/eventManagementService";
import { ILocation } from "@/types/organizer/events";
import { useAppSelector } from "@/redux/hooks";
import { EventApprovalStatus } from "@/enums/organizer/events";
import OrganizerEventReview from "@/components/organizer/review/OrganizerEventReviews";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  organizerName: string;
  organizerEmail: string;
  startDate: string;
  ticketsSold: number;
  totalCapacity: number;
  totalRevenue: number;
  category: string;
  eventApprovalStatus: "pending" | "approved" | "rejected" | "blocked" | undefined;
  location: ILocation;
  images: string[];
  rejectionReason?: string;
  blockedReason?: string;
}

export default function AdminEventManagementPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [search, setSearch] = useState("");
  // const [loading, setLoading] = useState(false);
  const [showEventReviewModal, setShowEventReviewModal] = useState(false);
const [selectedEventIdForReviews, setSelectedEventIdForReviews] = useState<string | null>(null);

  const [showReasonModal, setShowReasonModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const admin = useAppSelector((state) => state.adminAuth.admin);

  // 🔹 Fetch all events
  const fetchEvents = async () => {
    // setLoading(true);
    try {
      const res = await eventManagementService.fetchAllEvents();
      console.log(res)
      setEvents(res.data.data);
      if (res.data.data.length > 0) setSelectedEvent(res.data.data[0]);
    } catch (err) {
      console.error(err);
      showWarning("Failed to load events");
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔹 Approve Event
  const handleApprove = async (eventId: string) => {
    try {
      // setLoading(true);

      if(selectedEvent?.eventApprovalStatus ===EventApprovalStatus.Approved){
         showWarning("Event already approved");
         return
      }
      const payload = {
           eventId,
           eventApprovalStatus: EventApprovalStatus.Approved,
           approvedBy: admin?.name


      }
      const res = await eventManagementService.approveEvent(eventId, payload);
      if (res) showSuccess("Event approved successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      showWarning("Failed to approve event");
    } finally {
      // setLoading(false);
    }
  };

  // 🔹 Reject Event
  const handleReject = async (eventId: string, reason: string) => {
    try {
      // setLoading(true);
       if(selectedEvent?.eventApprovalStatus ===EventApprovalStatus.Rejected){
         showWarning("Event already rejected");
         return
      }
      const payload = { eventId,eventApprovalStatus:EventApprovalStatus.Rejected, rejectionReason: reason, approvedBy: admin?.name };
      const res = await eventManagementService.rejectEvent(eventId, payload);
      if (res) showSuccess("Event rejected successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      showWarning("Failed to reject event");
    } finally {
      // setLoading(false);
    }
  };

  // 🔹 Block Event
  const handleBlock = async (eventId: string, reason: string) => {
    try {
      // setLoading(true);
       if(selectedEvent?.eventApprovalStatus ===EventApprovalStatus.Blocked){
         showWarning("Event already blocked");
         return
      }
      const payload = { eventId, rejectionReason:reason, eventApprovalStatus: EventApprovalStatus.Blocked, approvedBy: admin?.name };
      const res = await eventManagementService.blockEvent(eventId, payload);
      if (res) showSuccess("Event blocked successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      showWarning("Failed to block event");
    } finally {
      // setLoading(false);
    }
  };

  // 🔹 Unblock Event
  const handleUnblock = async (eventId: string) => {
    try {
      // setLoading(true);
       if(selectedEvent?.eventApprovalStatus !==EventApprovalStatus.Blocked){
         showWarning("Event is not blocked");
         return
      }
       const payload = {
          eventId,
          eventApprovalStatus: EventApprovalStatus.Approved,
          approvedBy: admin?.name
       }
      const res = await eventManagementService.unblockEvent(eventId, payload);
      if (res) showSuccess("Event unblocked successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      showWarning("Failed to unblock event");
    } finally {
      // setLoading(false);
    }
  };

  // 🔹 Handle button clicks (decide if modal is needed)
  const handleActionClick = (action: string, eventId: string) => {
    if (["rejected", "blocked"].includes(action)) {
      setCurrentAction(action);
      setSelectedEvent(events.find((e) => e.id === eventId) || null);
      setShowReasonModal(true);
    } else {
      switch (action) {
        case "approved":
          handleApprove(eventId);
          break;
        case "unblocked":
          handleUnblock(eventId);
          break;
      }
    }
  };

  // 🔹 Search filter
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Statistics
  const stats = {
    pending:
      events.filter(
        (e) => !e.eventApprovalStatus || e.eventApprovalStatus === "pending"
      ).length,
    approved: events.filter((e) => e.eventApprovalStatus === "approved").length,
    blocked: events.filter((e) => e.eventApprovalStatus === "blocked").length,
    total: events.length,
  };

  // 🔹 Format location
  const formatLocation = (location?: ILocation) => {
    if (!location) return "N/A";
    const { venue, address, city, state, country } = location;
    return [venue, address, city, state, country].filter(Boolean).join(", ");
  };

  return (
    <div className="flex flex-col h-full p-6 bg-gray-50">
      {/* 🔍 Search + Filter */}
      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* 🧾 Main Content */}
      <div className="flex flex-1 gap-6 ">
        {/* Left: Event List */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">
            Events ({filteredEvents.length})
          </h2>

          <div className="flex flex-col gap-4">
            {filteredEvents.map((event) => {
              const formattedDate = new Date(event.startDate).toLocaleDateString(
                "en-US",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedEvent?.id === event.id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                            <Image
  src={Array.isArray(event.images) ? event.images[0] : event.images}
  alt={event.title}
  width={64}
  height={64}
  className="rounded-lg object-cover shadow-sm"
/>

                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.organizerEmail}</p>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                    <p className="text-xs text-gray-500">
                      {formatLocation(event.location)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {event.ticketsSold}/{event.totalCapacity} sold • ₹
                      {event.totalRevenue}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full self-start ${
                      !event.eventApprovalStatus ||
                      event.eventApprovalStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : event.eventApprovalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {event.eventApprovalStatus ?? "pending"}
                  </span>
                </div>
                
              );
            })}
            {/* 📝 Show rejection or block reason */}
{selectedEvent?.eventApprovalStatus === "rejected" && selectedEvent?.rejectionReason && (
  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4">
    <strong>Rejection Reason:</strong> {selectedEvent.rejectionReason}
  </div>
)}

{selectedEvent?.eventApprovalStatus === "blocked" && selectedEvent.blockedReason && (
  <div className="bg-purple-50 border border-purple-200 text-purple-700 rounded-lg p-3 mb-4">
    <strong>Blocked Reason:</strong> {selectedEvent.blockedReason}
  </div>
)}

          </div>
        </div>

        {/* Right: Event Details */}
        {selectedEvent && (
  <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 
                  sticky top-0 h-screen overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Event Details</h2>

            <Image
  src={selectedEvent.images?.[0] || "/placeholder.jpg"}
  alt={selectedEvent.title}
  width={800}   // choose a proper width
  height={300}  // choose a proper height
  className="w-full h-48 object-cover rounded-xl mb-4"
/>


            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  !selectedEvent.eventApprovalStatus ||
                  selectedEvent.eventApprovalStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : selectedEvent.eventApprovalStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {selectedEvent.eventApprovalStatus ?? "pending"}
              </span>
            </div>

            <p className="text-gray-600 mb-4">
              Leading {selectedEvent.category} event by{" "}
              {selectedEvent.organizerName}.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <strong>Organizer:</strong> {selectedEvent.organizerName}
                <br />
                <strong>Email:</strong> {selectedEvent.organizerEmail}
              </div>
              <div>
                <strong>Category:</strong> {selectedEvent.category}
                <br />
                <strong>Location:</strong>{" "}
                {formatLocation(selectedEvent.location)}
              </div>
              <div>
                <strong>Date & Time:</strong>{" "}
                {new Date(selectedEvent.startDate).toLocaleString()}
              </div>
            </div>

            {/* Revenue Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h4 className="font-semibold mb-2 text-gray-700">
                Revenue Information
              </h4>
              <div className="grid grid-cols-3 text-sm text-gray-600">
                <div>
                  <strong>Tickets Sold:</strong> {selectedEvent.ticketsSold}/
                  {selectedEvent.totalCapacity}
                </div>
                <div>
                  <strong>Total Revenue:</strong> ₹{selectedEvent.totalRevenue}
                </div>
                <div>
                  <strong>Platform Commission:</strong> ₹
                  {(selectedEvent.totalRevenue * 0.1).toFixed(0)}
                </div>
              </div>
            </div>

            {/* ✅ Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleActionClick("approved", selectedEvent.id)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleActionClick("rejected", selectedEvent.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
  onClick={() => {
    setSelectedEventIdForReviews(selectedEvent.id);
    setShowEventReviewModal(true);
  }}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
>
  View Event Reviews
</button>


              {/* 🔄 Toggle Block/Unblock */}
              {selectedEvent.eventApprovalStatus === "blocked" ? (
                <button
                  onClick={() => handleActionClick("unblocked", selectedEvent.id)}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => handleActionClick("blocked", selectedEvent.id)}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                >
                  Block
                </button>
              )}
            </div>

            {/* 📝 Reason Modal */}
            {showReasonModal && selectedEvent && (
              <div className="relative border border-gray-200 rounded-lg bg-gray-50 p-4 mt-4 shadow-sm">
                <h3 className="text-base font-semibold mb-2 capitalize">
                  {currentAction} Event
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Please provide a reason for <strong>{currentAction}</strong> the
                  event:
                </p>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full border border-gray-300 rounded-md p-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowReasonModal(false);
                      setReason("");
                      setCurrentAction(null);
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!reason.trim()) {
                        showWarning("Please enter a reason");
                        return;
                      }
                      if (currentAction === "rejected")
                        handleReject(selectedEvent.id, reason);
                      else if (currentAction === "blocked")
                        handleBlock(selectedEvent.id, reason);

                      setShowReasonModal(false);
                      setReason("");
                      setCurrentAction(null);
                    }}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-center shadow-sm border border-gray-200">
          <p className="font-semibold">Pending</p>
          <p className="text-xl font-bold">{stats.pending}</p>
        </div>
        <div className="bg-green-50 text-green-800 p-4 rounded-lg text-center shadow-sm border border-gray-200">
          <p className="font-semibold">Approved</p>
          <p className="text-xl font-bold">{stats.approved}</p>
        </div>
        <div className="bg-purple-50 text-purple-800 p-4 rounded-lg text-center shadow-sm border border-gray-200">
          <p className="font-semibold">Blocked</p>
          <p className="text-xl font-bold">{stats.blocked}</p>
        </div>
        <div className="bg-gray-50 text-gray-800 p-4 rounded-lg text-center shadow-sm border border-gray-200">
          <p className="font-semibold">Total Events</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
      </div>
                               {showEventReviewModal && selectedEventIdForReviews && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-3">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">

      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        onClick={() => setShowEventReviewModal(false)}
      >
        ✕
      </button>

       <OrganizerEventReview eventId ={selectedEventIdForReviews} isAdmin={true}/>
      
      
    </div>
  </div>
)}

    </div>
  );
}
