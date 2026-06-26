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
    
//        return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Booking Details - #{details.bookingId}
//         </h1>
//         <Button variant="outline" onClick={() => window.history.back()}>
//           Back to Bookings
//         </Button>
//       </div>

//       {/* Booking Overview */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Booking Overview</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3 text-sm text-gray-700">
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
//             <p>
//               <span className="font-medium">Status:</span>{" "}
//               <span
//                 className={`px-2 py-1 rounded-md text-xs font-semibold ${
//                   bookingStatus === "confirmed"
//                     ? "bg-green-100 text-green-700"
//                     : bookingStatus === "pending-payment"
//                     ? "bg-yellow-100 text-yellow-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 {bookingStatus.toUpperCase()}
//               </span>
//             </p>
//             <p>
//               <span className="font-medium">Date & Time :</span>{" "}
//               {new Date(bookingDate).toLocaleString()}
//             </p>
//             <p>
//               <span className="font-medium">Total Amount:</span> ₹{totalAmount}
//             </p>
//             <p>
//               <span className="font-medium">Payment Method:</span>{" "}
//               {paymentMethod}
//             </p>
//             {paymentId && (
//               <p>
//                 <span className="font-medium">Payment ID:</span> {paymentId}
//               </p>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Event Details */}
//      <Card>
//   <CardHeader>
//     <CardTitle>Event Details</CardTitle>
//   </CardHeader>

//   <CardContent className="space-y-4">

//     <div>
//       <p className="text-sm text-gray-500">Event Name</p>
//       <p className="font-semibold text-gray-900">
//         {details.event.title}
//       </p>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//       <div>
//         <p className="text-sm text-gray-500">
//           Event Duration
//         </p>

//         <p className="font-medium">
//           {details.event.startDate} - {details.event.endDate}
//         </p>
//       </div>

//       <div>
//         <p className="text-sm text-gray-500">
//           Event Time
//         </p>

//         <p className="font-medium">
//           {details.event.startTime} - {details.event.endTime}
//         </p>
//       </div>

//     </div>

//     {/* Attendance Date Highlight */}
//     <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
//       <p className="text-sm font-medium text-yellow-700">
//         Attendance Date
//       </p>

//       <p className="text-lg font-bold text-yellow-900">
//         {details.event.attendanceDate}
//       </p>
//     </div>

//     <div>
//       <p className="text-sm text-gray-500">
//         Venue
//       </p>

//       <p className="font-medium">
//         {details.event.venue}
//       </p>
//     </div>

//   </CardContent>
// </Card>

//       {/* User Details */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Attendee Details</CardTitle>
//         </CardHeader>
//         <CardContent className="text-sm text-gray-700 space-y-2">
//           <p>
//             <span className="font-medium">Name:</span> {details.user.name}
//           </p>
//           <p>
//             <span className="font-medium">Email:</span> {details.user.email}
//           </p>
//           {details.user.phone && (
//             <p>
//               <span className="font-medium">Phone:</span> {details.user.phone}
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Tickets Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Tickets</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left border-collapse">
//               <thead>
//                 <tr className="border-b bg-gray-50 text-gray-700">
//                   <th className="py-2 px-3">Tier Name</th>
//                   <th className="py-2 px-3">Quantity</th>
//                   <th className="py-2 px-3">Price</th>
//                   <th className="py-2 px-3 text-right">Subtotal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {details.tickets.map((ticket, index) => (
//                   <tr
//                     key={index}
//                     className="border-b last:border-none hover:bg-gray-50"
//                   >
//                     <td className="py-2 px-3">{ticket.name}</td>
//                     <td className="py-2 px-3">{ticket.quantity}</td>
//                     <td className="py-2 px-3">₹{ticket.price}</td>
//                     <td className="py-2 px-3 text-right font-medium">
//                       ₹{ticket.subTotal}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <SeparatorHorizontal className="my-3" />

//           <div className="flex justify-end text-sm font-semibold text-gray-800">
//             Total: ₹{totalAmount}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );


return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 shadow-2xl">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-8">

          <div>
            <p className="text-indigo-100 uppercase tracking-[0.25em] text-sm">
              Organizer Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Booking Details
            </h1>

            <p className="text-indigo-100 mt-2">
              Booking ID
              <span className="font-semibold ml-2">
                #{details.bookingId}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6 lg:mt-0">

            <span
              className={`px-5 py-2 rounded-full text-sm font-bold shadow-lg ${
                bookingStatus === "confirmed"
                  ? "bg-green-500 text-white"
                  : bookingStatus === "pending-payment"
                  ? "bg-yellow-400 text-black"
                  : "bg-red-500 text-white"
              }`}
            >
              {bookingStatus.toUpperCase()}
            </span>

            <Button
              variant="secondary"
              className="rounded-xl bg-white hover:bg-slate-100 text-slate-800"
              onClick={() => window.history.back()}
            >
              ← Back
            </Button>

          </div>

        </div>

      </div>

      {/* ================= BOOKING OVERVIEW ================= */}

      <Card className="rounded-3xl border-0 shadow-xl">

        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Booking Overview
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

            <div className="rounded-2xl bg-blue-50 p-5 border border-blue-100">
              <p className="text-sm text-slate-500">
                Booking Date
              </p>

              <h3 className="mt-2 font-bold text-slate-800">
                {new Date(bookingDate).toLocaleString()}
              </h3>
            </div>

            <div className="rounded-2xl bg-green-50 p-5 border border-green-100">
              <p className="text-sm text-slate-500">
                Payment Status
              </p>

              <h3 className="mt-2 font-bold text-green-700">
                {bookingStatus.toUpperCase()}
              </h3>
            </div>

            <div className="rounded-2xl bg-purple-50 p-5 border border-purple-100">
              <p className="text-sm text-slate-500">
                Payment Method
              </p>

              <h3 className="mt-2 font-bold">
                {paymentMethod}
              </h3>
            </div>

            <div className="rounded-2xl bg-orange-50 p-5 border border-orange-100">
              <p className="text-sm text-slate-500">
                Total Amount
              </p>

              <h3 className="mt-2 text-2xl font-black text-orange-600">
                ₹{totalAmount}
              </h3>
            </div>

            <div className="rounded-2xl bg-slate-100 p-5 border">

              <p className="text-sm text-slate-500">
                Payment ID
              </p>

              <h3 className="mt-2 font-semibold break-all">
                {paymentId || "-"}
              </h3>

            </div>

          </div>

        </CardContent>

      </Card>


{/* ================= EVENT DETAILS ================= */}

<Card className="rounded-3xl border-0 shadow-xl overflow-hidden">

  <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600">
    <CardTitle className="text-2xl font-bold text-white">
      🎉 Event Details
    </CardTitle>
  </CardHeader>

  <CardContent className="p-8">

    <div className="space-y-8">

      <div>
        <p className="text-sm uppercase tracking-wider text-slate-500">
          Event Name
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-800">
          {details.event.title}
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-2xl border bg-slate-50 p-5">

          <p className="text-sm text-slate-500">
            📅 Event Duration
          </p>

          <h3 className="mt-2 font-bold text-lg">
            {details.event.startDate}
          </h3>

          <p className="text-slate-400 text-sm mt-1">
            to
          </p>

          <h3 className="font-bold text-lg">
            {details.event.endDate}
          </h3>

        </div>

        <div className="rounded-2xl border bg-slate-50 p-5">

          <p className="text-sm text-slate-500">
            🕒 Event Time
          </p>

          <h3 className="mt-2 text-xl font-bold">
            {details.event.startTime}
          </h3>

          <p className="text-slate-400 text-sm">
            to
          </p>

          <h3 className="text-xl font-bold">
            {details.event.endTime}
          </h3>

        </div>

      </div>

      {/* Attendance Date */}

      <div className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-100 p-6 shadow">

        <p className="uppercase tracking-widest text-yellow-700 text-sm font-semibold">
          Attendance Date
        </p>

        <h2 className="mt-2 text-3xl font-black text-yellow-900">
          {details.event.attendanceDate}
        </h2>

        <p className="mt-2 text-yellow-700">
          The attendee has booked tickets for this date.
        </p>

      </div>

      <div className="rounded-2xl bg-slate-50 border p-5">

        <p className="text-sm text-slate-500">
          📍 Venue
        </p>

        <h3 className="mt-2 font-bold text-lg">
          {details.event.venue}
        </h3>

      </div>

    </div>

  </CardContent>

</Card>

{/* ================= ATTENDEE DETAILS ================= */}

<Card className="rounded-3xl border-0 shadow-xl overflow-hidden">

  <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600">

    <CardTitle className="text-2xl text-white">
      👤 Attendee Details
    </CardTitle>

  </CardHeader>

  <CardContent className="p-8">

    <div className="grid md:grid-cols-3 gap-6">

      <div className="rounded-2xl bg-slate-50 border p-5">

        <p className="text-sm text-slate-500">
          Full Name
        </p>

        <h3 className="mt-2 text-lg font-bold">
          {details.user.name}
        </h3>

      </div>

      <div className="rounded-2xl bg-slate-50 border p-5">

        <p className="text-sm text-slate-500">
          Email Address
        </p>

        <h3 className="mt-2 font-semibold break-all">
          {details.user.email}
        </h3>

      </div>

      <div className="rounded-2xl bg-slate-50 border p-5">

        <p className="text-sm text-slate-500">
          Phone Number
        </p>

        <h3 className="mt-2 font-semibold">
          {details.user.phone || "-"}
        </h3>

      </div>

    </div>

  </CardContent>

</Card>
{/* ================= TICKETS ================= */}

<Card className="rounded-3xl border-0 shadow-xl overflow-hidden">

  <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600">

    <CardTitle className="text-2xl text-white">
      🎟 Ticket Summary
    </CardTitle>

  </CardHeader>

<CardContent className="p-8">

  <div className="space-y-5">

    {details.tickets.map((ticket) => (

      <div
        key={ticket.name}
        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300"
      >

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* Left */}

          <div className="flex items-center gap-5">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-3xl shadow-lg">
              🎟️
            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-800">
                {ticket.name}
              </h3>

              <p className="text-slate-500 mt-1">
                Event Ticket
              </p>

            </div>

          </div>

          {/* Right */}

          <div className="grid grid-cols-3 gap-8">

            <div className="text-center">

              <p className="text-xs uppercase tracking-wider text-slate-400">
                Quantity
              </p>

              <h4 className="mt-2 text-2xl font-black text-slate-800">
                {ticket.quantity}
              </h4>

            </div>

            <div className="text-center">

              <p className="text-xs uppercase tracking-wider text-slate-400">
                Price
              </p>

              <h4 className="mt-2 text-2xl font-black text-indigo-600">
                ₹{ticket.price}
              </h4>

            </div>

            <div className="text-center">

              <p className="text-xs uppercase tracking-wider text-slate-400">
                Total
              </p>

              <h4 className="mt-2 text-2xl font-black text-green-600">
                ₹{ticket.subTotal}
              </h4>

            </div>

          </div>

        </div>

      </div>

    ))}

  </div>

  <SeparatorHorizontal className="my-8" />

  <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white shadow-xl">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-indigo-100 uppercase tracking-widest text-sm">
          Payment Summary
        </p>

        <h2 className="mt-2 text-4xl font-black">
          ₹{totalAmount}
        </h2>

      </div>

      <div>

        <span
          className={`rounded-full px-5 py-2 text-sm font-bold ${
            bookingStatus === "confirmed"
              ? "bg-green-500"
              : bookingStatus === "pending-payment"
              ? "bg-yellow-400 text-black"
              : "bg-red-500"
          }`}
        >
          {bookingStatus.toUpperCase()}
        </span>

      </div>

    </div>

  </div>

</CardContent>
</Card>

</div>
</div>
);

}

   


