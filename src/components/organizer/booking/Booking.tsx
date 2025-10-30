
"use client"
import { FilterBar } from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import { BookingInfo } from "@/interface/organizer/booking/bookingInfo";
import { bookingService } from "@/services/user/bookingService";
import { useEffect, useState } from "react";
import { FiCalendar, FiMapPin, FiUser } from "react-icons/fi";


export default function OrganizerBookingList () {
  const[bookings, setBookings] = useState<BookingInfo[]>([]);
  const[loading , setLoading] = useState(false);
  const[filters,  setFilters] = useState({search: "", status: ""});
  const [page, setPage]  = useState(1);
  const[totalPages,setTotalPages] = useState(1);

useEffect(() => {
  const delay = setTimeout(() => {
       fetchBooking(page, filters);
  },400 );
  return () => clearTimeout(delay);
},[page, filters]);

const fetchBooking  = async (pageNum = 1, appliedFilters = filters) => {
 setLoading(true);
 try{
  //    const res = await bookingService.getBookings(pageNum, appliedFilters);
  //  setBooking(res.data);
  //  setTotalPages(res.totalPages)
 }catch(Err){
   
 }finally{
   setLoading(false);
 }
}
const filterConfig = [
   {
    type: "text",
    name: "search",
    placeHolder: "Search by  event or buyer name"
   },
   {
    type: "select",
    status: "status",
    placeholder: "Booking status",
    options: [
       {label:"All", value: ""},
       {label:"Confirmed", value:"CONFIRMED"},
       {label:"Pending Payment", value:"PENDING_PAYMENT"},
       {label:"Cancelled", value:"CANCELLED"},
       {label:"Expired", value: "EXPIRED"}
    ]
        
   },
   {
    type: "date",
    name: "startDate",
    placeholder: "Start Date",
  },
  {
    type: "date",
    name: "endDate",
    placeholder: "End Date",
  },
  ]
 return (
    <div className="p-6">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">
        🎟️ Booking Management
      </h1>

      {/* <FilterBar
        filters={filterConfig}
        onFilterChange={(values) => {
          setFilters(values);
          setPage(1);
        }}
      /> */}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No bookings found.</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {b.eventTitle}
                  </h3>
                  <div className="flex flex-wrap text-sm text-gray-500 gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> {b.eventDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin /> {b.eventVenue}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser /> {b.organizerName}
                    </span>
                  </div>
                </div>

                <div className="text-right mt-3 md:mt-0">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      b.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : b.status === "PENDING_PAYMENT"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                  <p className="text-sm text-gray-600 mt-2">
                    ₹{b.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-600">
                {b.tickets.map((t, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {t.name} × {t.quantity}
                    </span>
                    <span>₹{t.price * t.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );


}