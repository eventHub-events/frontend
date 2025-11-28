// "use client";

// import { useEffect, useState } from "react";
// import { organizerDashboardService } from "@/services/organizer/organizerDashboardService";
// import Pagination from "@/components/ui/Pagination";
// import { EventPerformanceDTO } from "@/types/organizer/dashboard";

// export default function EventPerformanceTable() {
//   const [events, setEvents] = useState<EventPerformanceDTO[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const LIMIT = 5;

//   useEffect(() => {
//     fetchEvents(page);
//   }, [page]);

//   const fetchEvents = async (pageNumber: number) => {
//     setLoading(true);
//     try {
//       const res = await organizerDashboardService.fetchEventPerformance(
//         pageNumber,
//         LIMIT
//       );

//       setEvents(res.data.data.events);
//       setTotalPages(res.data.data.totalPages);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Loading event performance...
//       </div>
//     );

//   return (
//     <div className="bg-white rounded-xl border p-4">
//       <h3 className="text-lg font-semibold mb-4">
//         Event Performance
//       </h3>

//       {events.length === 0 ? (
//         <div className="text-center text-gray-500 py-6">
//           No bookings yet for your events
//         </div>
//       ) : (
//         <>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50">
//                 <tr className="text-left text-gray-600">
//                   <th className="p-3">Event</th>
//                   <th className="p-3">Date</th>
//                   <th className="p-3 text-center">Bookings</th>
//                   <th className="p-3 text-center">Tickets Sold</th>
//                   <th className="p-3 text-right">Revenue</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {events.map((event) => (
//                   <tr
//                     key={event.eventId}
//                     className="border-t hover:bg-gray-50"
//                   >
//                     <td className="p-3 font-medium">
//                       {event.eventTitle}
//                     </td>

//                     <td className="p-3 text-gray-600">
//                       {event.eventDate}
//                     </td>

//                     <td className="p-3 text-center">
//                       {event.bookingsCount}
//                     </td>

//                     <td className="p-3 text-center">
//                       {event.ticketsSold}
//                     </td>

//                     <td className="p-3 text-right font-semibold">
//                       ₹{event.revenue.toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="mt-4">
//             <Pagination
//               currentPage={page}
//               totalPages={totalPages}
//               onPageChange={setPage}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
