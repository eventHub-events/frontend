"use client"
import { FilterBar } from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import { BookingInfo } from "@/interface/organizer/booking/bookingInfo";
import { BookedTickets } from "@/interface/user/booking";
import { bookingService_organizer } from "@/services/organizer/bookingService";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { 
  FiEye, 
  FiDollarSign,
  FiLoader,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiUser
} from "react-icons/fi";

export default function OrganizerBookingList({eventId}:{eventId: string}) {
  const [bookings, setBookings] = useState<BookingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
  
    userName: "",
    status: undefined,
    startDate: "",
    endDate: "",
    search: ""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;
 
  const router = useRouter()

  

 const fetchBooking = useCallback(
  async (page = 1, appliedFilters = filters) => {
    setLoading(true);
    try {
      if (!eventId) return;
      const query = {
        page,
        limit,
        // title: appliedFilters.search || appliedFilters.title || "",
        userName: appliedFilters.userName || "",
        status: appliedFilters.status,
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
      };
      const res = await bookingService_organizer.fetchBookingsByEventId(
        eventId,
        query
      );
       console.log("hello")
      setBookings(res.data?.data.bookings);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  },

  
  [eventId, limit] // dependencies used inside fetchBooking
);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBooking(page, filters);
    }, 400);
    return () => clearTimeout(delay);
  }, [page, filters, fetchBooking]);

  const filterConfig = [
    // {
    //   type: "text" as const,
    //   name: "search",
    //   label: "Search Events",
    //   icon: <FiSearch className="w-4 h-4" />
    // },
    {
      type: "select" as const,
      name: "status",
      label: "Status",
      icon: <FiUsers className="w-4 h-4" />,
      options: ["", "confirmed", "pending-payment", "cancelled", "expired"]
    },
    {
      type: "text" as const,
      name: "userName",
      label: "User Name",
      icon: <FiUser className="w-4 h-4" />
    },
    {
      type: "date" as const,
      name: "startDate",
      label: "From Date",
      icon: <FiCalendar className="w-4 h-4" />
    },
    {
      type: "date" as const,
      name: "endDate",
      label: "To Date",
      icon: <FiCalendar className="w-4 h-4" />
    },
  ];

  const handleViewDetails = (bookingId: string) => {
      router.push(`/organizer/bookings/${bookingId}`)
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending-payment":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatStatusText = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getTotalTickets = (tickets: BookedTickets[]) => {
    return tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your event bookings</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-xl font-bold text-gray-900">
                ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <FilterBar
            filters={filterConfig}
           onApply={(values) => {
  setPage(1);
  setFilters((prev) => ({
    ...prev,
    ...values,
  }));
}}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(bookings.map(b => b.eventTitle)).size}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCalendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.reduce((sum, b) => getTotalTickets(b.tickets), 0)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUser className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{bookings.length > 0 ? (bookings.reduce((sum, b) => sum + b.totalAmount, 0) / bookings.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <FiDollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiLoader className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiUser className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
              <button 
                onClick={() => setFilters({...filters, search: "", status: undefined})}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Table-like Layout for Bookings */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Event & Customer</div>
                    <div className="col-span-2">Date & Venue</div>
                    <div className="col-span-2">Tickets</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  {/* Booking Items */}
                  <div className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Event & Customer */}
                          <div className="col-span-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-gray-900 truncate">
                                  {booking.eventTitle}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                  <FiUser className="w-3 h-3 mr-1" />
                                  {booking.userName}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Date & Venue */}
                          <div className="col-span-2">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-900 flex items-center">
                                <FiCalendar className="w-3 h-3 mr-2 text-gray-400" />
                                {booking.eventDate}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center truncate">
                                <FiMapPin className="w-3 h-3 mr-2 text-gray-400" />
                                {booking.eventVenue}
                              </p>
                            </div>
                          </div>

                          {/* Tickets */}
                          <div className="col-span-2">
                            <div className="text-sm text-gray-900">
                              {getTotalTickets(booking.tickets)} tickets
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.tickets.length} types
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="col-span-2 text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              ₹{booking.totalAmount.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total
                            </div>
                          </div>

                          {/* Status & Action */}
                          <div className="col-span-2">
                            <div className="flex items-center justify-end space-x-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(booking.status)}`}>
                                {formatStatusText(booking.status)}
                              </span>
                              <button
                                onClick={() => handleViewDetails(booking.id)}
                                className="inline-flex items-center p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View details"
                              >
                                <FiEye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Ticket Breakdown - Collapsible */}
                        <div className="mt-3 pl-13">
                          <div className="flex flex-wrap gap-2">
                            {booking.tickets.map((ticket, index) => (
                              <div key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                                <span className="font-medium">{ticket.name}</span>
                                <span className="mx-1">×</span>
                                <span>{ticket.quantity}</span>
                                <span className="ml-1 text-gray-500">
                                  (₹{ticket.price} each)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {!loading && bookings.length > 0 && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}