"use client";

import { bookingService } from "@/services/user/bookingService";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

type Ticket = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
};

type Booking = {
  bookingId: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  organizerName: string;
  userName: string;
  totalAmount: number;
  paymentStatus: string;
  tickets: Ticket[];
  ticketUrls: string[];
};

export default function TicketVerificationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) return;

        const result = await bookingService.fetchBookingById(
          bookingId.toString()
        );

        setBooking(result.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (!booking)
    return (
      <p className="text-center mt-20 text-gray-600">
        Loading ticket...
      </p>
    );

  const totalTickets = booking.tickets.reduce(
    (sum, t) => sum + t.quantity,
    0
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 px-4 py-10">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-5 sm:p-8">

        {/* VALID BADGE */}
        <div className="flex justify-center mb-5">
          <span className="bg-green-100 text-green-700 text-xs sm:text-sm px-4 py-2 rounded-full font-semibold">
            ✅ VALID TICKET
          </span>
        </div>

        {/* EVENT NAME */}
        <h1 className="text-lg sm:text-2xl font-bold text-center text-gray-800 mb-1">
          {booking.eventName}
        </h1>

        <p className="text-center text-xs sm:text-sm text-gray-500 mb-6">
          Organized by {booking.organizerName}
        </p>

        {/* EVENT DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">

          <div>
            <p className="text-gray-400 text-xs">Venue</p>
            <p className="font-medium">{booking.eventLocation}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Date</p>
            <p className="font-medium">{booking.eventDate}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Booked By</p>
            <p className="font-medium">{booking.userName}</p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Booking ID</p>
            <p className="font-medium break-all">
              {booking.bookingId}
            </p>
          </div>

        </div>

        {/* TICKET BREAKDOWN */}
        <div className="border-t pt-4">

          <h2 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">
            Ticket Details
          </h2>

          {booking.tickets.map(ticket => (
            <div
              key={ticket._id}
              className="flex justify-between text-sm text-gray-600 mb-2"
            >
              <span>{ticket.name} × {ticket.quantity}</span>
              <span>₹{ticket.price}</span>
            </div>
          ))}

          <div className="flex justify-between font-semibold mt-3 text-sm sm:text-base">
            <span>Total Tickets</span>
            <span>{totalTickets}</span>
          </div>

          <div className="flex justify-between font-semibold text-sm sm:text-base">
            <span>Total Amount</span>
            <span>₹{booking.totalAmount}</span>
          </div>

        </div>

        {/* TICKET IMAGE */}
        {booking.ticketUrls?.length > 0 && (
          <div className="mt-6">
            <Image
              src={booking.ticketUrls[0]}
              alt="Ticket"
              width={600}
              height={400}
              className="rounded-lg shadow-md w-full h-auto"
            />
          </div>
        )}

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Please show this screen to event staff for entry verification
        </p>

      </div>

    </div>
  );
}