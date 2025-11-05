import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilterBar } from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import { useAppSelector } from "@/redux/hooks";
import { bookingService } from "@/services/user/bookingService";
import { SeparatorHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { FiCalendar, FiCreditCard, FiFileText, FiMapPin, FiUser } from "react-icons/fi";
 import { format } from "date-fns";
import Image from "next/image";

interface Booking {
  _id: string;
  bookingId: string;
  eventId: string;
  eventName: string;
  eventImage?: string;
  eventDate: string;
  eventLocation: string;
  organizerName: string;
  tickets: TicketInfo[];
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  bookingDate: string;
}
  interface TicketInfo {
     name :string;
     quantity: number;
     price: number;
  }

export default function UserBookings() {
  const[bookings, setBookings] = useState<Booking[]>([]);
  const[selectedBooking, setSelectedBooking] = useState<Booking| null>(null);
  const[currentPage, setCurrentPage] = useState(1);
  const[totalPages, setTotalPages] = useState(1);
  const[filters, setFilters] = useState<Record<string,string>>({});
  const[loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.auth.user)

  const pageLimit= 5;




  const fetchBookings = async (page = 1, appliedFilters ={}) => {
    
           if(!user?.id) return

       try{
           setLoading(true);
            const payload = {
                page: page,
                limit: pageLimit,
                ...appliedFilters
            }

         const res =  await bookingService.fetchAllBookings(user.id,payload);
         setBookings(res.data.bookings);
      setTotalPages(res.data.totalPages || 1);
      if (res.data.bookings.length > 0) setSelectedBooking(res.data.bookings[0]);
       }catch(err){

       }finally{
           setLoading(false)
       }
  }
  
   useEffect(() => {
      fetchBookings(currentPage, filters);

   },[currentPage, filters])

   if(loading) return<p className="text-center mt-10"> Loading your bookings ....</p>;

   return (
         <div className="flex flex-col gap-6">
      {/* 🔹 Filter Section */}
      <FilterBar
        filters={[
          { label: "Event Name", name: "eventName", type: "text" },
          { label: "Payment Status", name: "paymentStatus", type: "select", options: ["Paid", "Pending", "Refunded"] },
          { label: "Booking Date", name: "bookingDate", type: "date" },
        ]}
        onApply={(values) => {
           setFilters({...filters,...values});
           setCurrentPage(1);
        }}
      />

      <div className="flex h-[calc(100vh-15rem)] bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {/* Left Panel — Booking List */}
        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-semibold p-4">My Bookings</h2>
          <SeparatorHorizontal />
          <div className="flex flex-col gap-2 p-3">
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 mt-6">No bookings found.</p>
            ) : (
              bookings.map((booking) => (
                <Card
                  key={booking._id}
                  className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                    selectedBooking?._id === booking._id ? "bg-gray-100 dark:bg-gray-800" : ""
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <CardContent className="flex gap-3 items-center p-3">
                    <Image
                      src={booking.eventImage||""}
                      alt={booking.eventName}
                      width={70}
                      height={70}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{booking.eventName}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FiCalendar /> {format(new Date(booking.eventDate), "dd MMM yyyy")}
                      </p>
                      <p className="text-sm text-gray-400">
                        {booking.paymentStatus.toUpperCase()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* 🔹 Pagination at bottom */}
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p)  => setCurrentPage(p)}
            />
          </div>
        </div>

        {/* Right Panel — Booking Details */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedBooking ? (
            <div>
              <div className="flex gap-4 items-start">
                <Image
                  src={selectedBooking.eventImage ||""}
                  alt={selectedBooking.eventName}
                  width={200}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedBooking.eventName}</h2>
                  <p className="flex items-center gap-2 text-gray-600 mt-1">
                    <FiCalendar />
                    {format(new Date(selectedBooking.eventDate), "dd MMM yyyy, hh:mm a")}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 mt-1">
                    <FiMapPin /> {selectedBooking.eventLocation}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 mt-1">
                    <FiUser /> Organizer: {selectedBooking.organizerName}
                  </p>
                </div>
              </div>

              <SeparatorHorizontal className="my-4" />

              <h3 className="text-lg font-semibold mb-2">Tickets</h3>
              <div className="space-y-3">
                {selectedBooking.tickets.map((ticket, i) => (
                  <Card key={i}>
                    <CardContent className="flex justify-between items-center p-3">
                      <div>
                        <p className="font-semibold">{ticket.name}</p>
                        <p className="text-sm text-gray-500">Qty: {ticket.quantity}</p>
                        {/* <p className="text-sm text-gray-400">Status: {ticket.status}</p> */}
                      </div>
                      <p className="font-semibold">₹{ticket.price * ticket.quantity}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <SeparatorHorizontal className="my-4" />

              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <FiCreditCard /> <span className="font-medium">Payment Status:</span>{" "}
                  {selectedBooking.paymentStatus}
                </p>
                <p className="flex items-center gap-2">
                  <FiFileText /> <span className="font-medium">Payment Method:</span>{" "}
                  {selectedBooking.paymentMethod}
                </p>
                <p className="font-semibold mt-3 text-lg">
                  Total Paid: ₹{selectedBooking.totalAmount}
                </p>
              </div>

              <SeparatorHorizontal className="my-4" />

              <div className="flex gap-3 mt-4">
                <Button variant="outline">View Event</Button>
                <Button>Download Invoice</Button>
              </div>
            </div>
          ) : (
            <p className="text-center mt-10 text-gray-500">
              Select a booking from the left to view details.
            </p>
          )}
        </div>
      </div>
    </div>
   )


}