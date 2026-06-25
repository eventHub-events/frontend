"use client";

import { useEffect, useState } from "react";
import { UserBookingData } from "@/components/user/payment/payment";
import { bookingService } from "@/services/user/bookingService";
import Link from "next/link";

import {
  Loader2,
  Download,
  // CheckCircle2,
  // CalendarDays,
  // Clock3,
  // MapPin,
  // User,
  // IndianRupee,
  // Ticket,
  // ArrowRight,
  // Sparkles,
} from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-5" />

        <h2 className="text-2xl font-bold text-gray-800">
          Preparing Your Ticket
        </h2>

        <p className="text-gray-500 mt-2">
          Please wait while we generate your ticket...
        </p>
      </div>
    </div>
  );

  if (!booking)
    return (
      <p className="mt-10 text-center text-red-600 text-lg">
        Booking not found.
      </p>
    );

//   return (
//     <div className="max-w-xl mx-auto mt-16 bg-white shadow-xl rounded-2xl p-8">
//       <h1 className="text-3xl font-bold text-green-600 text-center">
//         🎉 Booking Confirmed!
//       </h1>

//       <p className="mt-3 text-center text-gray-700">
//         Your tickets for{" "}
//         <span className="font-semibold">{booking.eventName}</span> are ready.
//       </p>

//       {/* EVENT DETAILS */}
//     {/* EVENT DETAILS */}
// <div className="mt-6 space-y-3 text-gray-700">

//   {/* Event Duration */}
//   <div className="flex justify-between items-start">
//     <span>Event Duration:</span>
//     <span className="font-medium text-right">
//       {new Date(booking.eventStartDate).toLocaleDateString("en-US", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })}{" "}
//       -{" "}
//       {new Date(booking.eventEndDate).toLocaleDateString("en-US", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })}
//     </span>
//   </div>

//   {/* Attendance Date */}
//   <div className="flex justify-between items-start rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2">
//     <span className="font-semibold text-yellow-700">
//       Attendance Date:
//     </span>

//     <span className="font-bold text-yellow-900 text-right">
//       {new Date(booking.attendanceDate).toLocaleDateString("en-US", {
//         weekday: "short",
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })}
//     </span>
//   </div>

//   {/* Event Time */}
//   <div className="flex justify-between">
//     <span>Event Time:</span>
//     <span className="font-medium">
//       {booking.eventStartTime} - {booking.eventEndTime}
//     </span>
//   </div>

//   {/* Location */}
//   <div className="flex justify-between">
//     <span>Location:</span>
//     <span className="font-medium">
//       {booking.eventLocation}
//     </span>
//   </div>

//   {/* Organizer */}
//   <div className="flex justify-between">
//     <span>Organizer:</span>
//     <span className="font-medium">
//       {booking.organizerName}
//     </span>
//   </div>

//   {/* Total */}
//   <div className="flex justify-between border-t pt-3">
//     <span>Total Paid:</span>
//     <span className="text-xl font-bold">
//       ₹{booking.totalAmount}
//     </span>
//   </div>

// </div>

//       {/* TICKET DOWNLOAD LIST */}
//       {booking.ticketUrls && booking.ticketUrls.length > 0 && (
//         <div className="mt-8 bg-gray-50 p-5 rounded-xl shadow-inner">
//           <h2 className="font-semibold text-gray-800 mb-3">
//             Download Your Tickets
//           </h2>

//           <ul className="space-y-3">
//             {booking.ticketUrls.map((url: string, index: number) => (
//               <li
//                 key={index}
//                 className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm"
//               >
//                 <span className="font-medium text-gray-700">
//                   Ticket #{index + 1}
//                 </span>

//                 <a
//                   href={url}
//                   download
//                   className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//                 >
//                   <Download className="w-4 h-4" />
//                   Download
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <p className="mt-6 text-gray-500 text-center">
//         You can also view them later in{" "}
//         <a href="/user/bookings" className="underline">
//           My Bookings
//         </a>.
//       </p>
//     </div>
//   );
// }

return (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-indigo-50 py-12 px-4">

    <div className="max-w-5xl mx-auto">

      {/* Success Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 shadow-2xl">

        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />

       <div className="relative px-6 py-5 text-center text-white">

          <div className="mx-auto mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-lg shadow-lg border border-white/30">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-14 w-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>

          </div>

          <h1 className="text-5xl font-black tracking-tight">
            Booking Confirmed!
          </h1>

          <p className="mt-4 text-lg text-white/90">
            Your payment was successful and your tickets are ready.
          </p>

        </div>

      </div>

      {/* Event Banner */}

    {/* Event Summary */}

<div className="mt-8 rounded-3xl bg-white shadow-xl border border-gray-100 p-8">

  <div className="flex items-center gap-5">

    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-lg">
      🎉
    </div>

    <div className="flex-1">

      <p className="text-sm uppercase tracking-widest text-indigo-600 font-semibold">
        Event
      </p>

      <h2 className="text-3xl font-black text-gray-900 mt-1">
        {booking.eventName}
      </h2>

      <p className="text-gray-500 mt-2">
        Organized by{" "}
        <span className="font-semibold text-gray-700">
          {booking.organizerName}
        </span>
      </p>

    </div>

  </div>

</div>

      {/* Booking Details */}

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Event Duration */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">

          <div className="text-sm uppercase tracking-widest text-gray-400">
            Event Duration
          </div>

          <div className="mt-3 text-xl font-bold text-gray-900">

            {new Date(
              booking.eventStartDate
            ).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}

            {" - "}

            {new Date(
              booking.eventEndDate
            ).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}

          </div>

        </div>

        {/* Attendance Date */}

        <div className="rounded-2xl border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 p-6 shadow-xl">

          <div className="text-sm uppercase tracking-widest text-yellow-700">
            Attendance Date
          </div>

          <div className="mt-3 text-2xl font-black text-yellow-900">

            {new Date(
              booking.attendanceDate
            ).toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}

          </div>

        </div>

        {/* Event Time */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">

          <div className="text-sm uppercase tracking-widest text-gray-400">
            Event Time
          </div>

          <div className="mt-3 text-xl font-bold text-gray-900">

            {booking.eventStartTime} - {booking.eventEndTime}

          </div>

        </div>

        {/* Venue */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">

          <div className="text-sm uppercase tracking-widest text-gray-400">
            Venue
          </div>

          <div className="mt-3 text-xl font-bold text-gray-900">

            {booking.eventLocation}

          </div>

        </div>

      </div>

      {/* Payment Card */}

      <div className="mt-8 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-2xl">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-green-100">
              Payment Successful
            </p>

            <h2 className="mt-2 text-4xl font-black">
              ₹{booking.totalAmount}
            </h2>

          </div>

          <div className="rounded-full bg-white/20 p-5 backdrop-blur">

            💳

          </div>

        </div>

      </div>
            {/* Booking Progress */}

      <div className="mt-10 rounded-3xl bg-white shadow-xl p-8">

        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Booking Status
        </h2>

        <div className="space-y-8">

          <div className="flex items-center gap-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
              ✓
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Payment Successful
              </h3>

              <p className="text-gray-500 text-sm">
                Your payment has been received successfully.
              </p>
            </div>

          </div>

          <div className="ml-6 h-8 border-l-2 border-dashed border-green-300" />

          <div className="flex items-center gap-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
              ✓
            </div>

            <div>

              <h3 className="font-bold text-gray-900">
                Booking Confirmed
              </h3>

              <p className="text-gray-500 text-sm">
                Your seats have been reserved.
              </p>

            </div>

          </div>

          <div className="ml-6 h-8 border-l-2 border-dashed border-blue-300" />

          <div className="flex items-center gap-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg">
              ✓
            </div>

            <div>

              <h3 className="font-bold text-gray-900">
                Ticket Generated
              </h3>

              <p className="text-gray-500 text-sm">
                Your QR ticket is ready for download.
              </p>

            </div>

          </div>

          <div className="ml-6 h-8 border-l-2 border-dashed border-purple-300" />

          <div className="flex items-center gap-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
              🎉
            </div>

            <div>

              <h3 className="font-bold text-gray-900">
                Ready to Attend
              </h3>

              <p className="text-gray-500 text-sm">
                Present your QR ticket at the venue.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Download Tickets */}

      {booking.ticketUrls && booking.ticketUrls.length > 0 && (

        <div className="mt-10 rounded-3xl bg-white shadow-xl p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                Your Tickets
              </h2>

              <p className="text-gray-500">
                Download and save your tickets.
              </p>

            </div>

            <div className="rounded-full bg-blue-100 p-4">

              🎟

            </div>

          </div>

          <div className="space-y-5">

            {booking.ticketUrls.map((url, index) => (

              <div
                key={index}
                className="rounded-2xl border border-gray-200 p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div>

                    <h3 className="text-xl font-bold text-gray-900">
                      Ticket #{index + 1}
                    </h3>

                    <p className="text-gray-500 mt-2">
                      QR Entry Ticket
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Valid
                      </span>

                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                        Entry Pass
                      </span>

                    </div>

                  </div>

                  <a
                    href={url}
                    download
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition"
                  >

                    <Download className="mr-2 h-5 w-5" />

                    Download Ticket

                  </a>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}
            {/* Quick Tips */}

      <div className="mt-10 rounded-3xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 p-8 shadow-lg">

        <h2 className="text-2xl font-bold text-gray-900 mb-5">
          Before You Go
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              ✅
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Arrive Early
              </h3>

              <p className="text-sm text-gray-600">
                Please arrive at least 30 minutes before the event starts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              🎟
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Carry Your Ticket
              </h3>

              <p className="text-sm text-gray-600">
                Present the QR ticket at the entrance for verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              🪪
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Valid ID
              </h3>

              <p className="text-sm text-gray-600">
                Keep a valid government-issued ID for entry if requested.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              📱
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                Save Offline
              </h3>

              <p className="text-sm text-gray-600">
               { "Download your ticket now so it's available without internet"}.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Action Buttons */}

    <div className="mt-10 flex flex-col md:flex-row gap-5">

  <Link
    href="/user/bookings"
    className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 py-4 text-center text-white font-bold shadow-xl hover:scale-[1.02] transition-all duration-300"
  >
    📖 View My Bookings
  </Link>

  <Link
    href="/user/events"
    className="flex-1 rounded-2xl border-2 border-gray-200 bg-white py-4 text-center font-bold text-gray-800 hover:border-indigo-500 hover:text-indigo-600 transition-all duration-300"
  >
    🎉 Explore More Events
  </Link>

</div>

      {/* Support */}

      {/* <div className="mt-10 rounded-2xl bg-white border border-gray-200 shadow-lg p-6 text-center">

        <h3 className="text-xl font-bold text-gray-900">
          Need Help?
        </h3>

        <p className="text-gray-500 mt-2">
          If you face any issues regarding your booking, please contact our support team.
        </p>

        <button
          className="mt-5 rounded-xl bg-gray-900 text-white px-6 py-3 font-semibold hover:bg-black transition"
        >
          Contact Support
        </button>

      </div> */}

      {/* Footer */}

      <div className="mt-12 text-center">

        <p className="text-gray-500 text-sm">
          Thank you for choosing <span className="font-semibold text-indigo-600">EventHub</span>.
        </p>

        <p className="text-gray-400 text-xs mt-2">
          We wish you an amazing event experience! 🎉
        </p>

      </div>

    </div>
  </div>
);
}