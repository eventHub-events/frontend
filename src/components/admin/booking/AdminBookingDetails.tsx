"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, MapPin, User, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { bookingService_admin } from "@/services/admin/bookingService-admin";

interface AdminBookingDetailsProps {
  bookingId: string;
  onClose?: () => void;
}

export function AdminBookingDetails({ bookingId, onClose }: AdminBookingDetailsProps) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTicketsModal, setShowTicketsModal] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetchBooking();
  }, [bookingId]);

  async function fetchBooking() {
    try {
      setLoading(true);
      const res = await bookingService_admin.getBookingById(bookingId)
      console.log("res", res)
      setBooking(res.data.data);
    } catch (err) {
      console.error("Failed to fetch admin booking details", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">
        Loading booking details…
      </div>
    );

  if (!booking)
    return (
      <div className="p-6 text-center text-red-500">
        Booking not found.
      </div>
    );

  return (
    <div className="w-full h-full p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{booking.eventName}</h2>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Basic Details */}
      <div className="space-y-3 text-gray-700">
        <p className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <b>User:</b> {booking.userName}
        </p>

        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-600" />
          <b>Location:</b> {booking.eventLocation}
        </p>

        <p className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-green-600" />
          <b>Event Date:</b> {booking.eventDate}
        </p>

        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <b>Booked on:</b> {booking.bookingDate}
        </p>

        <p>
          <b>Total Amount:</b> ₹{booking.totalAmount}
        </p>

        <p>
          <b>Payment Status:</b>{" "}
          <Badge variant="default">{booking.paymentStatus}</Badge>
        </p>
      </div>

      <div className="border-t my-4" />

      {/* Tickets */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Tickets</h3>

        {booking.tickets.map((ticket: any, index: number) => (
          <Card key={index} className="mb-3 bg-gray-50">
            <CardContent className="p-4 flex justify-between items-center">

              <div>
                <p className="font-semibold">{ticket.name}</p>
                <p className="text-sm text-gray-600">
                  Qty: {ticket.quantity} × ₹{ticket.price}
                </p>
              </div>

              <Button
                onClick={() => setShowTicketsModal(true)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Files
              </Button>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Modal */}
      <Dialog open={showTicketsModal} onOpenChange={setShowTicketsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Ticket Files
            </DialogTitle>
          </DialogHeader>

          {booking.ticketUrls?.map((url: string, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 border rounded mb-2 bg-gray-100"
            >
              <div>
                <p className="font-medium">
                  {booking.tickets[index].name} Ticket
                </p>
                <p className="text-xs text-gray-500">
                  PDF File — Click to download
                </p>
              </div>

              <a
                href={url}
                target="_blank"
                download={`ticket-${booking.tickets[index].name}.pdf`}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}

          {(!booking.ticketUrls || booking.ticketUrls.length === 0) && (
            <p className="text-center text-sm text-gray-500">
              Tickets are being generated…
            </p>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
