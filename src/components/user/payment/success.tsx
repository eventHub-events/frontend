"use client";

import { useEffect, useState } from "react";
import { UserBookingData } from "@/components/user/payment/payment";
import { Loader2, Download } from "lucide-react";
import { bookingService } from "@/services/user/bookingService";

export default function BookingSuccess({sessionId}: {sessionId: string}) {
 
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<UserBookingData | null>(null);

  useEffect(() => {
    if (!sessionId) return;

  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    const res = await bookingService.fetchBookingBySessionId(sessionId);
    setBooking(res.data.data);

    if (res.data.data.ticketUrls.length > 0 || attempts >= 10) {
      clearInterval(interval);
      setLoading(false);
    }
  }, 1000); // check every 1 sec

  return () => clearInterval(interval);
  }, [sessionId]);

  if (loading)
    return (
      <div className="flex justify-center mt-20 text-gray-600 text-lg">
        <Loader2 className="animate-spin mr-2" /> Loading ticket...
      </div>
    );

  if (!booking)
    return (
      <p className="mt-10 text-center text-red-600 text-lg">
        Booking not found.
      </p>
    );

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-green-600 text-center">
        🎉 Booking Confirmed!
      </h1>

      <p className="mt-3 text-center text-gray-700">
        Your tickets for{" "}
        <span className="font-semibold">{booking.eventName}</span> are ready.
      </p>

      {/* EVENT DETAILS */}
      <div className="mt-6 space-y-3 text-gray-700">
        <div className="flex justify-between">
          <span>Event Date:</span>
          <span className="font-medium">{booking.eventDate}</span>
        </div>

        <div className="flex justify-between">
          <span>Location:</span>
          <span className="font-medium">{booking.eventLocation}</span>
        </div>

        <div className="flex justify-between">
          <span>Organizer:</span>
          <span className="font-medium">{booking.organizerName}</span>
        </div>

        <div className="flex justify-between border-t pt-3">
          <span>Total Paid:</span>
          <span className="text-xl font-bold">₹{booking.totalAmount}</span>
        </div>
      </div>

      {/* TICKET DOWNLOAD LIST */}
      {booking.ticketUrls && booking.ticketUrls.length > 0 && (
        <div className="mt-8 bg-gray-50 p-5 rounded-xl shadow-inner">
          <h2 className="font-semibold text-gray-800 mb-3">
            Download Your Tickets
          </h2>

          <ul className="space-y-3">
            {booking.ticketUrls.map((url: string, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm"
              >
                <span className="font-medium text-gray-700">
                  Ticket #{index + 1}
                </span>

                <a
                  href={url}
                  download
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-gray-500 text-center">
        You can also view them later in{" "}
        <a href="/profile/bookings" className="underline">
          My Bookings
        </a>.
      </p>
    </div>
  );
}
