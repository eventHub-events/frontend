"use client";

import { useEffect, useState } from "react";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import Pagination from "@/components/ui/Pagination";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {  TransactionsRow } from "@/interface/admin/finance-payout/transactions";


export default function TransactionsTable() {
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    status: string;
    eventTitle: string;
    organizerName: string;
    from: string | undefined;
    to: string | undefined;
  }>({
    page: 1,
    limit: 10,
    status: "",
    eventTitle: "",
    organizerName: "",
    from: undefined,
    to: undefined,
  });

  const [data, setData] = useState<TransactionsRow[]| null>(null);
  const [loading, setLoading] = useState(true);
  const[page,setPage] = useState(1)
  const[totalPages,setTotalPages] = useState(1);
  

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await adminFinanceOverviewService.fetchTransactions(filters);
    
      setData(res.data.data.data);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const onDateChange = (range: DateRange | undefined) => {
    setFilters({
      ...filters,
      from: range?.from ? range.from.toISOString() : undefined,
      to: range?.to ? range.to.toISOString() : undefined,
      page: 1,
    });
  };

  const handleDownloadPDF  = async () => {
     try{
           const res = await adminFinanceOverviewService.downloadTransactionsPdf(filters);
           const blob = new Blob([res.data], {type : "application/pdf"});
           const url =  window.URL.createObjectURL(blob);

           const a = document.createElement("a");
           a.href = url;
           a.download = `transactions_${Date.now()}.pdf`;
           a.click();
           a.remove();

           window.URL.revokeObjectURL(url);
           

     }catch(err){
       console.log(err)
     }
  }

  return (
    <div className="space-y-6">

      {/* FILTERS */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          <Input
            placeholder="Search Event"
            value={filters.eventTitle}
            onChange={(e) =>
              setFilters({ ...filters, eventTitle: e.target.value, page: 1 })
            }
          />

          <Input
            placeholder="Organizer Name"
            value={filters.organizerName}
            onChange={(e) =>
              setFilters({ ...filters, organizerName: e.target.value, page: 1 })
            }
          />

          <Select
            onValueChange={(val) =>
              setFilters({ ...filters, status: val, page: 1 })
            }
            value={filters.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="payment-failed">Payment Failed</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange onChange={onDateChange} />
        </CardContent>
                 {/* PDF BUTTON */}
  <div className="flex justify-end pr-4 pb-2">
    <button
      onClick={handleDownloadPDF}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
    >
      Download PDF
    </button>
  </div>
      </Card>

      {/* TABLE */}
      {/* TABLE */}
<Card>
  <CardContent className="p-0">
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {[
                "BookingId",
                "EventId",
                "EventTitle",
                "Organizer",
                "User",
                "TotalAmount",
                "Platform Fee",
                "Organizer Amount",
                "Status",
                "Date",
                "Payment Method",
                "PaymentId",
              ].map((title) => (
                <th
                  key={title}
                  className="px-5 py-4 text-left font-bold text-black border-b"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-8 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="py-8 text-center text-gray-500"
                >
                  No results found
                </td>
              </tr>
            ) : (
              data?.map((t: TransactionsRow) => (
                <tr
                  key={t.bookingId}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-5 py-4 font-medium text-gray-800">
                    {t.bookingId}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {t.eventId}
                  </td>

                  <td className="px-5 py-4 text-gray-900 font-medium">
                    {t.eventTitle}
                  </td>

                  <td className="px-5 py-4">{t.organizerName}</td>
                  <td className="px-5 py-4">{t.userName}</td>

                  <td className="px-5 py-4 font-semibold text-green-700">
                    ₹{t.totalAmount}
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    ₹{t.platformFee}
                  </td>

                  <td className="px-5 py-4 font-medium text-blue-700">
                    ₹{t.organizerAmount}
                  </td>

                  <td className="px-5 py-4 capitalize">
                    <span
                      className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          t.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : t.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : t.status === "refunded"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {t.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-gray-700">
                    {format(new Date(t.createdAt), "dd MMM yyyy")}
                  </td>

                  <td className="px-5 py-4 capitalize">
                    {t.paymentMethod}
                  </td>

                  <td className="px-5 py-4">{t.paymentId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </CardContent>
</Card>


      {/* PAGINATION */}
      {data && (
         <Pagination
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={(p) => setPage(p)}
                />
      )}
    </div>
  );
}
