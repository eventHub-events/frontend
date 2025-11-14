"use client";

import Link from "next/link";

export default function BookingCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <h1 className="text-3xl font-bold text-red-600">❌ Payment Canceled</h1>

      <p className="text-gray-700 mt-3 max-w-md">
        You canceled the payment process. No money was charged for this booking.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          href="/events"
          className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          🔙 Back to Events
        </Link>

        <Link
          href="/profile/bookings"
          className="px-5 py-3 bg-gray-200 text-black rounded-lg shadow hover:bg-gray-300 transition"
        >
          📄 My Bookings
        </Link>
      </div>
    </div>
  );
}
