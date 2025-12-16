"use client";

import {
  User,
  Mail,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

 import {
  
  
  MinusCircle
} from "lucide-react";

import { BookingsRow } from "@/interface/common/event-analytics";

interface Props {
  rows: BookingsRow[];
}

 const refundMeta = (status: string) => {
  switch (status) {
    case "succeeded":
      return {
        className: "bg-emerald-50 text-emerald-600",
        icon: CheckCircle,
        label: "Refunded",
      };
    case "pending":
      return {
        className: "bg-yellow-50 text-yellow-600",
        icon: Clock,
        label: "Pending",
      };
    case "failed":
      return {
        className: "bg-red-50 text-red-600",
        icon: XCircle,
        label: "Failed",
      };
    case "none":
    default:
      return {
        className: "bg-gray-100 text-gray-600",
        icon: MinusCircle,
        label: "Not Applicable",
      };
  }
};
export function BookingTable({ rows }: Props) {
  const statusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      case "pending":
      default:
        return "bg-yellow-50 text-yellow-600";
    }
  };

  // const refundBadge = (status: string) => {
  //   switch (status.toLowerCase()) {
  //     case "refunded":
  //       return "bg-blue-50 text-blue-600";
  //     case "not_refunded":
  //     default:
  //       return "bg-gray-100 text-gray-600";
  //   }
  // };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
      

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-center">Tickets</th>
            <th className="p-4 text-right">Amount</th>
            <th className="p-4 text-center">Payment</th>
            <th className="p-4 text-center">Refund</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 text-center">Date</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((b) => (
            <tr
              key={b.id}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* User */}
              <td className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {b.userName}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail size={12} />
                      {b.userEmail}
                    </p>
                  </div>
                </div>
              </td>

              {/* Tickets */}
              <td className="p-4 text-center font-medium">
                {b.tickets}
              </td>

              {/* Amount */}
              <td className="p-4 text-right font-semibold text-emerald-600">
                ₹{b.amount}
              </td>

              {/* Payment Method */}
              <td className="p-4 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                  <CreditCard size={14} />
                  {b.paymentMethod}
                </span>
              </td>

              {/* Refund Status */}
             {/* Refund Status */}
<td className="p-4 text-center">
  {(() => {
    const refund = refundMeta(b.refundStatus);
    const Icon = refund.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${refund.className}`}
      >
        <Icon size={14} />
        {refund.label}
      </span>
    );
  })()}
</td>


              {/* Booking Status */}
              <td className="p-4 text-center">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${statusBadge(
                    b.status
                  )}`}
                >
                  {b.status === "confirmed" && <CheckCircle size={14} />}
                  {b.status === "cancelled" && <XCircle size={14} />}
                  {b.status === "pending-payment" && <Clock size={14} />}
                  {b.status}
                </span>
              </td>

              {/* Date */}
              <td className="p-4 text-center text-gray-500">
                {new Date(b.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}

          {!rows.length && (
            <tr>
              <td
                colSpan={7}
                className="p-6 text-center text-gray-500"
              >
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
