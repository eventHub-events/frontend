"use client";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import {
  Search,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Filters {
  from?: string;
  to?: string;
  bookingStatus?: string;
  paymentMethod?: string;
  refundStatus?: string;
  search?: string;
}

interface Props {
  filters: Filters;
  search: string;
  onSearchChange: (value: string) => void;
  onChange: (filters: Filters) => void;
}

export function AnalyticsFilters({
  filters,
  search,
  onSearchChange,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">

      {/* DATE RANGE */}
      <DatePickerWithRange
        onChange={(range) =>
          onChange({
            ...filters,
            from: range?.from?.toISOString(),
            to: range?.to?.toISOString(),
          })
        }
      />

      {/* BOOKING STATUS */}
      <Select
        value={filters.bookingStatus}
        onValueChange={(value) =>
          onChange({ ...filters, bookingStatus: value })
        }
      >
        <SelectTrigger className="h-10 w-[170px] rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <SelectValue placeholder="Booking Status" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="confirmed">
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-600" />
              Confirmed
            </div>
          </SelectItem>
          <SelectItem value="cancelled">
            <div className="flex items-center gap-2">
              <XCircle size={14} className="text-red-500" />
              Cancelled
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* PAYMENT METHOD */}
      <Select
        value={filters.paymentMethod}
        onValueChange={(value) =>
          onChange({ ...filters, paymentMethod: value })
        }
      >
        <SelectTrigger className="h-10 w-[170px] rounded-xl">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-indigo-500" />
            <SelectValue placeholder="Payment Method" />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="card">
            <div className="flex items-center gap-2">
              <CreditCard size={14} />
              Card
            </div>
          </SelectItem>
          <SelectItem value="upi">
            <div className="flex items-center gap-2">
              💳 UPI
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* SEARCH */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <Input
          placeholder="Search user or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-[220px] pl-9 rounded-xl"
        />
      </div>

    </div>
  );
}
