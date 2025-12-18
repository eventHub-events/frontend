"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Payment, { UserBookingData } from "@/components/user/payment/payment";
import { bookingService } from "@/services/user/bookingService";

export default function PaymentConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<UserBookingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      try {
        const res = await bookingService.fetchBookingById(bookingId);
        setBooking(res.data.data);
      } catch (err) {
        console.error(err);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="p-10 text-center">Loading booking...</div>;
  }

  if (!booking) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        Booking not found
      </div>
    );
  }

  return <Payment booking={booking} />;
}
