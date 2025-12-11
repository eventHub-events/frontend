"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import Pagination from "@/components/ui/Pagination";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

import { format } from "date-fns";
import { RefundRow } from "@/interface/admin/finance-payout/refund";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";

export default function RefundTable() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    eventTitle: "",
    organizerName: "",
    paymentMethod: "",
    userName: "",
    from: undefined as string | undefined,
    to: undefined as string | undefined,
  });

  const [data, setData] = useState<RefundRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRefunds = async () => {
    setLoading(true);
    const res = await adminFinanceOverviewService.fetchRefunds(filters);
    
    setData(res.data.data.data);
    setTotalPages(res.data.data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchRefunds();
  }, [filters]);

  const onDateChange = (range: DateRange | undefined) => {
    setFilters({
      ...filters,
      from: range?.from?.toISOString(),
      to: range?.to?.toISOString(),
      page: 1,
    });
  };

  return (
    <div className="space-y-6">

      {/* FILTERS */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          <Input placeholder="Event Title"
            value={filters.eventTitle}
            onChange={(e) => setFilters({ ...filters, eventTitle: e.target.value, page: 1 })}
          />

          <Input placeholder="Organizer Name"
            value={filters.organizerName}
            onChange={(e) => setFilters({ ...filters, organizerName: e.target.value, page: 1 })}
          />

          <Select
            value={filters.status}
            onValueChange={(val) => setFilters({ ...filters, status: val, page: 1 })}
          >
            <SelectTrigger><SelectValue placeholder="Refund Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="succeeded">Processed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange onChange={onDateChange} />

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "BookingId",
                    "Event",
                    // "Organizer",
                    "User",
                    "Refunded Amount",
                    "Status",
                    "Refund Date",
                    "Payment Method",
                    "Payment ID",
                    "Refund ID"
                  ].map((title) => (
                    <th key={title} className="px-5 py-3 text-left font-bold border-b">{title}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-6">Loading...</td></tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.bookingId} className="hover:bg-gray-50">
                      <td className="px-5 py-3">{item.bookingId}</td>
                      <td className="px-5 py-3">{item.eventTitle}</td>
                      {/* <td className="px-5 py-3">{item.organizerName}</td> */}
                      <td className="px-5 py-3">{item.userName}</td>
                      <td className="px-5 py-3 text-red-600 font-semibold">₹{item.refundedAmount}</td>
                      <td className="px-5 py-3">{item.refundStatus}</td>
                      <td className="px-5 py-3">{item.refundDate ? format(new Date(item.refundDate),"dd MMM yyyy") : "-"}</td>
                      <td className="px-5 py-3">{item.paymentMethod}</td>
                      <td className="px-5 py-3">{item.paymentId}</td>
                      <td className="px-5 py-3">{item.refundId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Pagination
        totalPages={totalPages}
        currentPage={filters.page}
        onPageChange={(p) => setFilters({ ...filters, page: p })}
      />

    </div>
  );
}
