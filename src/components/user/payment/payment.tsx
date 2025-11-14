"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import ProtectedRoute from "../auth/RoleProtection";
import { paymentService } from "@/services/user/paymentService";
import { BookingStatus } from "@/enums/organizer/booking";

export interface UserBookingData {
  bookingId?: string;
  eventId: string;
  eventName: string;
  eventImages?: string[];
  eventDate: string;
  eventLocation: string;
  organizerName: string;
  tickets: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentStatus: BookingStatus;
  paymentMethod?: string;
  bookingDate?: Date;
  userName?: string;
  ticketUrls?: string[];
}

export default function Payment({ booking }: { booking: UserBookingData }) {
  const [loading, setLoading] = useState(false);

  const handlePayNow = async () => {
    try {
      setLoading(true);
        console.log("bookingid", booking.bookingId)
      const res = await paymentService.paymentCheckout(booking.bookingId!);
      console.log("res", res)

      if (res.data.data.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err) {
      console.log(err);
      
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center px-4">
        <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl bg-white/70 backdrop-blur-xl border border-gray-200">
          
          {/* HEADER */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Complete Your Payment
          </h1>

          <p className="text-gray-600 mb-6 text-sm">
            Review your booking details and proceed to secure payment.
          </p>

          {/* EVENT IMAGE */}
          {booking.eventImages?.length ? (
            <img
              src={booking.eventImages[0]}
              alt="Event Banner"
              className="w-full h-40 object-cover rounded-xl mb-6 shadow-md"
            />
          ) : null}

          <div className="space-y-4 mb-8">
            
            {/* EVENT NAME */}
            <div className="flex justify-between">
              <span className="text-gray-500">Event</span>
              <span className="font-medium text-gray-900">{booking.eventName}</span>
            </div>

            {/* EVENT DATE */}
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900">
                {new Date(booking.eventDate).toLocaleDateString()}
              </span>
            </div>

            {/* EVENT LOCATION */}
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-medium text-gray-900">{booking.eventLocation}</span>
            </div>

            {/* ORGANIZER */}
            <div className="flex justify-between">
              <span className="text-gray-500">Organizer</span>
              <span className="font-medium text-gray-900">{booking.organizerName}</span>
            </div>

            {/* TICKET BREAKDOWN */}
            <div className="border-t pt-4 space-y-2">
              <span className="text-gray-500">Ticket Details</span>

              <div className="space-y-2">
                {booking.tickets.map((ticket, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {ticket.name} × {ticket.quantity}
                    </span>
                    <span className="font-medium text-gray-800">
                      ₹{ticket.price * ticket.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL AMOUNT */}
            <div className="flex justify-between border-t pt-4">
              <span className="text-gray-500">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{booking.totalAmount}
              </span>
            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl 
            bg-black text-white font-semibold text-lg transition-all 
            hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
