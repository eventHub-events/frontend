// "use client";

// import React, { useState } from "react";
// import {
//   FaCalendarAlt,
//   FaUser,
//   FaChartLine,
//   FaWallet,
//   FaMapMarkerAlt,
//   FaTicketAlt,
//   FaChevronRight,
//   FaStar,
//   FaRegClock,
// } from "react-icons/fa";

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");

//   const bookings = {
//     upcoming: [
//       {
//         id: 1,
//         title: "Tech Innovation Conference 2025",
//         date: "Mar 15, 2025, 9:00 AM",
//         location: "San Francisco, CA",
//         tickets: 1,
//         price: "$299.00",
//         status: "Upcoming",
//         image: "🎯",
//         category: "Technology",
//       },
//       {
//         id: 2,
//         title: "Music Festival Experience",
//         date: "Apr 22, 2025, 2:00 PM",
//         location: "Austin, TX",
//         tickets: 2,
//         price: "$179.00",
//         status: "Upcoming",
//         image: "🎵",
//         category: "Music",
//       },
//     ],
//     past: [
//       {
//         id: 3,
//         title: "Startup World Expo",
//         date: "Sep 10, 2024, 10:00 AM",
//         location: "New York, NY",
//         tickets: 2,
//         price: "$499.00",
//         status: "Completed",
//         image: "🚀",
//         category: "Business",
//         rating: 4.5,
//       },
//     ],
//     cancelled: [
//       {
//         id: 4,
//         title: "Designers Summit",
//         date: "Aug 5, 2024, 1:00 PM",
//         location: "Los Angeles, CA",
//         tickets: 1,
//         price: "$199.00",
//         status: "Cancelled",
//         image: "📐",
//         category: "Design",
//       },
//     ],
//   };

//   const user = {
//     name: "Sarah Johnson",
//     walletBalance: 256.0,
//     totalBookings: 5,
//     upcomingEvents: 2,
//     attendedEvents: 3,
//     memberSince: "2023",
//   };

//   const summaryCards = [
//     {
//       label: "Total Bookings",
//       value: user.totalBookings,
//       icon: FaCalendarAlt,
//       gradient: "from-blue-500 to-cyan-500",
//       bgColor: "bg-blue-50",
//       iconColor: "text-blue-600",
//       trend: "+2 this month",
//     },
//     {
//       label: "Upcoming Events",
//       value: user.upcomingEvents,
//       icon: FaUser,
//       gradient: "from-purple-500 to-pink-500",
//       bgColor: "bg-purple-50",
//       iconColor: "text-purple-600",
//       trend: "1 next week",
//     },
//     {
//       label: "Events Attended",
//       value: user.attendedEvents,
//       icon: FaChartLine,
//       gradient: "from-green-500 to-emerald-500",
//       bgColor: "bg-green-50",
//       iconColor: "text-green-600",
//       trend: "100% attendance",
//     },
//     {
//       label: "Wallet Balance",
//       value: `$${user.walletBalance.toFixed(2)}`,
//       icon: FaWallet,
//       gradient: "from-orange-500 to-amber-500",
//       bgColor: "bg-orange-50",
//       iconColor: "text-orange-600",
//       trend: "Add funds",
//     },
//   ];

//   const getStatusStyles = (status: string) => {
//     switch (status) {
//       case "Upcoming":
//         return "bg-blue-50 text-blue-700 border border-blue-200";
//       case "Completed":
//         return "bg-green-50 text-green-700 border border-green-200";
//       case "Cancelled":
//         return "bg-red-50 text-red-600 border border-red-200";
//       default:
//         return "bg-gray-50 text-gray-600 border border-gray-200";
//     }
//   };

//   const renderBookingCard = (booking: any) => (
//     <div
//       key={booking.id}
//       className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
//     >
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
//         {/* Left Content */}
//         <div className="flex items-start gap-3 flex-1">
//           <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
//             {booking.image}
//           </div>
          
//           <div className="flex-1 space-y-2">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//               <h3 className="text-base font-semibold text-gray-900 flex-1">
//                 {booking.title}
//               </h3>
//               <div className="flex items-center gap-2">
//                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
//                   {booking.category}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(booking.status)}`}>
//                   {booking.status}
//                 </span>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600">
//               <div className="flex items-center gap-1">
//                 <FaCalendarAlt className="text-blue-500 text-xs" />
//                 <span>{booking.date}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <FaMapMarkerAlt className="text-green-500 text-xs" />
//                 <span>{booking.location}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <FaTicketAlt className="text-purple-500 text-xs" />
//                 <span>{booking.tickets} ticket{booking.tickets > 1 ? "s" : ""}</span>
//               </div>
//             </div>

//             {booking.rating && (
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar
//                       key={i}
//                       className={`text-xs ${
//                         i < Math.floor(booking.rating)
//                           ? "text-amber-400 fill-current"
//                           : "text-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-xs text-gray-600">
//                   {booking.rating}/5.0
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Content */}
//         <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end lg:items-end gap-2 lg:gap-1 lg:text-right">
//           <div className="space-y-1">
//             <div className="text-lg font-bold text-gray-900">{booking.price}</div>
//             <div className="text-xs text-gray-500">Order #{booking.id.toString().padStart(6, '0')}</div>
//           </div>
          
//           <div className="flex gap-1">
//             <button className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium hover:bg-blue-100 transition-colors">
//               Details
//             </button>
//             {booking.status === "Upcoming" && (
//               <button className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100 transition-colors">
//                 Cancel
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       {/* Welcome Section */}
//       <div className="mb-6">
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
//           <span>Dashboard</span>
//           <FaChevronRight className="text-xs" />
//           <span className="text-blue-600 font-medium">My Bookings</span>
//         </div>
        
//         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-1">
//               Welcome back, {user.name}!
//             </h1>
//             <p className="text-gray-600 text-sm">
//               Manage your bookings and discover amazing new events
//             </p>
//           </div>
          
//           <div className="flex gap-2">
//             <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:border-gray-400 transition-colors">
//               Explore Events
//             </button>
//             <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white text-sm font-medium hover:shadow-md transition-all">
//               Book New Event
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//         {summaryCards.map((card) => (
//           <div 
//             key={card.label}
//             className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">{card.label}</p>
//                 <p className="text-xl font-bold text-gray-900 mb-1">{card.value}</p>
//                 <p className={`text-xs font-medium ${
//                   card.trend.includes('+') ? 'text-green-500' : 'text-blue-500'
//                 }`}>
//                   {card.trend}
//                 </p>
//               </div>
//               <div className={`p-2 rounded-lg ${card.bgColor}`}>
//                 <card.icon size={18} className={card.iconColor} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Bookings Section */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 mb-1">My Bookings</h2>
//               <p className="text-gray-600 text-sm">Manage your upcoming events and view past booking history</p>
//             </div>
            
//             <div className="flex gap-2">
//               <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:border-gray-400">
//                 Filter
//               </button>
//               <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:border-gray-400">
//                 Sort
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-4 pt-4">
//           <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
//             {(['upcoming', 'past', 'cancelled'] as const).map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-4 py-2 rounded-md text-sm font-semibold transition-all flex items-center gap-1 ${
//                   activeTab === tab
//                     ? 'bg-white text-blue-600 shadow-sm'
//                     : 'text-gray-600 hover:text-gray-900'
//                 }`}
//               >
//                 {tab === 'upcoming' && (
//                   <>
//                     <FaRegClock className="text-xs" />
//                     Upcoming ({bookings.upcoming.length})
//                   </>
//                 )}
//                 {tab === 'past' && (
//                   <>
//                     <FaCalendarAlt className="text-xs" />
//                     Past ({bookings.past.length})
//                   </>
//                 )}
//                 {tab === 'cancelled' && (
//                   <>
//                     <FaChartLine className="text-xs" />
//                     Cancelled ({bookings.cancelled.length})
//                   </>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Booking Cards */}
//         <div className="p-4">
//           <div className="space-y-3">
//             {bookings[activeTab].length > 0 ? (
//               bookings[activeTab].map((booking) => renderBookingCard(booking))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
//                   <FaCalendarAlt className="text-xl text-gray-400" />
//                 </div>
//                 <h3 className="text-base font-semibold text-gray-900 mb-1">No bookings found</h3>
//                 <p className="text-gray-600 text-sm mb-4">You don't have any {activeTab} events at the moment.</p>
//                 <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
//                   Explore Events
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-4 text-center">
//         <p className="text-xs text-gray-500">
//           Need help? Contact our support team at support@eventhub.com
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;