import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingDetailsInfo } from "@/interface/organizer/booking/bookingInfo";
import { useAppSelector } from "@/redux/hooks";
import { bookingService_organizer } from "@/services/organizer/bookingService";
import { Loader2, SeparatorHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function BookingDetails () {
  
  const { bookingId} = useParams();
  const[details, setDetails] = useState<BookingDetailsInfo | null>(null);
  const[loading, setLoading] = useState(true);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const organizerId =  organizer?.id;

  useEffect(() => {
      if(!bookingId) return ;
    const fetchBookingDetails = async () => {
       try{
              if(!organizerId) return 
             const  res = await bookingService_organizer.fetchBookingsById(organizerId, bookingId as string);
             console.log("resss", res)
          setDetails(res.data.data)
       }catch(err){
         console.log(err)
       }finally{
          setLoading(false)
       }
    }
    fetchBookingDetails();
  
  },[bookingId, organizerId])

   if(loading){
     return (
          <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
     )
    }
     if (!details)
      return (
         <div className="text-center text-gray-600 mt-10">
           Booking details not found.
         </div>
    );

     const { bookingStatus, bookingDate, totalAmount, paymentMethod, paymentId } =
    details;
    
       return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Booking Details - #{details.bookingId}
        </h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Bookings
        </Button>
      </div>

      {/* Booking Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-md text-xs font-semibold ${
                  bookingStatus === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : bookingStatus === "pending-payment"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {bookingStatus.toUpperCase()}
              </span>
            </p>
            <p>
              <span className="font-medium">Date & Time :</span>{" "}
              {new Date(bookingDate).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Total Amount:</span> ₹{totalAmount}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {paymentMethod}
            </p>
            {paymentId && (
              <p>
                <span className="font-medium">Payment ID:</span> {paymentId}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-medium">Event Name:</span> {details.event.title}
          </p>
          <p>
            <span className="font-medium">Date & Time:</span>{" "}
            {details.event.date} at {details.event.time}
          </p>
          <p>
            <span className="font-medium">Venue:</span> {details.event.venue}
          </p>
        </CardContent>
      </Card>

      {/* User Details */}
      <Card>
        <CardHeader>
          <CardTitle>Attendee Details</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-medium">Name:</span> {details.user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {details.user.email}
          </p>
          {details.user.phone && (
            <p>
              <span className="font-medium">Phone:</span> {details.user.phone}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tickets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700">
                  <th className="py-2 px-3">Tier Name</th>
                  <th className="py-2 px-3">Quantity</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {details.tickets.map((ticket, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-none hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">{ticket.name}</td>
                    <td className="py-2 px-3">{ticket.quantity}</td>
                    <td className="py-2 px-3">₹{ticket.price}</td>
                    <td className="py-2 px-3 text-right font-medium">
                      ₹{ticket.subTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SeparatorHorizontal className="my-3" />

          <div className="flex justify-end text-sm font-semibold text-gray-800">
            Total: ₹{totalAmount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

   


