"use client";
import React from "react";
import { 
  MdTrendingUp, 
  MdTrendingDown, 
  MdEvent, 
  MdConfirmationNumber, 
  MdAttachMoney, 
  MdPeople,
  MdVisibility,
  MdMoreVert,
  MdCalendarToday,
  MdLocationOn,
  MdAnalytics
} from "react-icons/md";

const OrganizerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 p-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your events today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transform hover:scale-105 transition-all duration-300">
              <MdEvent className="inline mr-2" />
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { 
            label: "Total Events", 
            value: "24", 
            change: "+12%", 
            icon: <MdEvent className="text-2xl" />,
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50"
          },
          { 
            label: "Total Bookings", 
            value: "1,247", 
            change: "+18%", 
            icon: <MdConfirmationNumber className="text-2xl" />,
            color: "from-emerald-500 to-teal-500",
            bgColor: "from-emerald-50 to-teal-50"
          },
          { 
            label: "Total Earnings", 
            value: "$89,420", 
            change: "+25%", 
            icon: <MdAttachMoney className="text-2xl" />,
            color: "from-amber-500 to-orange-500",
            bgColor: "from-amber-50 to-orange-50"
          },
          { 
            label: "Avg. Attendees", 
            value: "156", 
            change: "-2%", 
            icon: <MdPeople className="text-2xl" />,
            color: "from-purple-500 to-pink-500",
            bgColor: "from-purple-50 to-pink-50"
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} p-6 rounded-3xl border border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group`}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/20 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  stat.change.startsWith("+") 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {stat.change.startsWith("+") ? <MdTrendingUp /> : <MdTrendingDown />}
                  {stat.change}
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-2">vs last month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MdAnalytics className="text-violet-600" />
                Revenue Overview
              </h4>
              <p className="text-gray-500 text-sm mt-1">Monthly revenue trends</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MdMoreVert className="text-gray-400" />
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-violet-200 group hover:border-violet-300 transition-colors">
            <div className="text-center">
              <MdAnalytics className="text-4xl text-violet-400 mb-2 mx-auto" />
              <p className="text-violet-600 font-semibold">Revenue Chart</p>
              <p className="text-violet-400 text-sm">Interactive chart coming soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/60 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MdConfirmationNumber className="text-emerald-600" />
                Ticket Sales Trend
              </h4>
              <p className="text-gray-500 text-sm mt-1">Weekly sales performance</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MdMoreVert className="text-gray-400" />
            </button>
          </div>
          <div className="h-64 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-emerald-200 group hover:border-emerald-300 transition-colors">
            <div className="text-center">
              <MdConfirmationNumber className="text-4xl text-emerald-400 mb-2 mx-auto" />
              <p className="text-emerald-600 font-semibold">Sales Chart</p>
              <p className="text-emerald-400 text-sm">Interactive chart coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/60 overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <MdEvent className="text-violet-600" />
                Recent Events
              </h4>
              <p className="text-gray-500 text-sm mt-1">Your latest event activity</p>
            </div>
            <button className="px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-xl font-semibold transition-colors">
              View All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-200/60">
                <th className="text-left py-4 px-8 font-semibold text-gray-700">Event</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Tickets Sold</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { 
                  name: "Tech Conference 2024", 
                  date: "2/15/2024", 
                  status: "upcoming", 
                  tickets: 150, 
                  revenue: "$7,500",
                  location: "San Francisco, CA"
                },
                { 
                  name: "Music Festival", 
                  date: "1/28/2024", 
                  status: "completed", 
                  tickets: 320, 
                  revenue: "$16,000",
                  location: "Austin, TX"
                },
                { 
                  name: "Business Workshop", 
                  date: "2/20/2024", 
                  status: "upcoming", 
                  tickets: 45, 
                  revenue: "$2,250",
                  location: "New York, NY"
                },
              ].map((event, idx) => (
                <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50/50 transition-colors group">
                  <td className="py-6 px-8">
                    <div>
                      <div className="font-semibold text-gray-800 group-hover:text-violet-600 transition-colors">
                        {event.name}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MdLocationOn className="text-xs" />
                        {event.location}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MdCalendarToday className="text-gray-400" />
                      {event.date}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        event.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        event.status === "completed" ? "bg-emerald-500" : "bg-amber-500"
                      }`}></div>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="font-semibold text-gray-700">{event.tickets}</div>
                    <div className="text-xs text-gray-500">tickets</div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="font-semibold text-green-600">{event.revenue}</div>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <button className="inline-flex items-center gap-1 px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105">
                      <MdVisibility />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;