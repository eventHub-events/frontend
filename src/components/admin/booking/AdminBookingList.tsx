
"use client"
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import { BookingStatus } from "@/enums/organizer/booking";
import { bookingService_admin } from "@/services/admin/bookingService-admin";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FiCalendar, FiSearch, FiUser, FiUsers } from "react-icons/fi";
import { GiConsoleController } from "react-icons/gi";
interface BookingAdmin {
   id: string;
   eventTitle: string;
   organizerName: string;
   userName : string;
   userEmail : string;
   totalTickets : number;
   totalAmount : number;
   bookingDate : string;
   status : BookingStatus
}

export default function AdminBookingList () {
  const[bookings, setBookings]  = useState<BookingAdmin[]>([]);
  const[loading, setLoading] =  useState(false);
  const[totalPages, setTotalPages]  = useState(0);
  const[page, setPage] = useState(1);
  const[filters, setFilters] = useState({
     eventTitle : "",
     userName: "",
     status: undefined,
     startDate : "",
     endDate :"",
     search: "",
     organizerName: "",

  })
  const limit = 8;



  const fetchBookings = async (page =1 , appliedFilters= filters) => {
    try{
         setLoading(true);
         console.log("appliedFilters", appliedFilters)
         const query = {
            page,
            limit,
            eventTitle: appliedFilters.search || appliedFilters.eventTitle || "",
            userName : appliedFilters.userName || "",
            status: appliedFilters.status,
            startDate: appliedFilters.startDate,
            endDate: appliedFilters.endDate,
            organizerName: appliedFilters.organizerName
         };
         console.log("query", query)
         const res = await  bookingService_admin.getBookings(query);
         console.log("res" ,res)
         setBookings(res.data.data.bookings);
         setTotalPages(res.data.data.totalPages);
    }catch(err){

    }finally{
       setLoading(false)
    }
  }

  useEffect (() => {
     fetchBookings(page, filters);
  },[page,filters])
  
 const filterConfig = [
    {
       type: "text" as const,
       name: "search",
       label :"Search Events",
       icon  : <FiSearch className="w-4 h-4" />
    },

    {
     type : "select" as const ,
      name: "status",
      label : "Status",
      icon:  <FiUsers className = "w-4 h-4"/>,
      options: ["", "confirmed", "pending-payment", "cancelled", "expired"]
    },
   {
      type: "text" as const,
      name: "organizerName",
      label : "Organizer Name",
      icon : <FiUser className="w-4 h-4"/>
   }
    ,
     {
             type: "text" as const,
             name: "userName",
             label: "User Name",
             icon: <FiUser className="w-4 h-4" />
       },
       {
             type: "date" as const,
             name: "startDate",
             label: "From Date",
             icon: <FiCalendar className="w-4 h-4" />
       },
       {
             type: "date" as const,
             name: "endDate",
             label: "To Date",
             icon: <FiCalendar className="w-4 h-4" />
       },
    


 ]

return(
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>
            {/* Filter Section */}
                   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                     <FilterBar
                       filters={filterConfig}
                       onApply={(values) => {
                         setFilters({ ...filters, ...values });
                         setPage(1);
                       }}
                     />
                   </div>
         
              {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No bookings found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Organizer</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Tickets</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{b.eventTitle}</td>
                  <td className="px-4 py-3">{b.organizerName}</td>
                  <td className="px-4 py-3">
                    {b.userName}
                    <div className="text-xs text-gray-500">{b.userEmail}</div>
                  </td>
                  <td className="px-4 py-3">{b.totalTickets}</td>
                  <td className="px-4 py-3">₹{b.totalAmount}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      b.status === "confirmed"
                        ? "text-green-600"
                        : b.status === "pending-payment"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {b.status}
                  </td>
                  <td className="px-4 py-3">{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => alert(`View ${b.id}`)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination totalPages={totalPages}  currentPage={page} onPageChange={(p) => setPage(p)} />
      </div>
            

      </div>
)

}