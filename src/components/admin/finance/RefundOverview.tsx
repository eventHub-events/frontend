"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

import { RefundOverviewResult } from "@/interface/admin/finance-payout/refund";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";

import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

export default function RefundOverview() {
  const [overview, setOverview] = useState<RefundOverviewResult | null>(null);

  const [filters, setFilters] = useState<{
    from?: string;
    to?: string;
  }>({});

  const fetchOverview = async () => {
    try {
      const res = await adminFinanceOverviewService.fetchRefundsOverview(filters);
      setOverview(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [filters]);

  if (!overview) return <p>Loading...</p>;

  const { totals } = overview;

  const onDateChange = (range: DateRange | undefined) => {
    setFilters({
      from: range?.from ? range.from.toISOString() : undefined,
      to: range?.to ? range.to.toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-6">

      {/* DATE FILTER */}
      <Card>
        <CardContent className="p-4">
          <DatePickerWithRange onChange={onDateChange} />
        </CardContent>
      </Card>

      {/* REFUND SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Total Refund Amount</p>
            <h2 className="text-xl font-bold text-red-600">
              ₹{totals.totalRefundedAmount??0}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Refund Count</p>
            <h2 className="text-xl font-bold">{totals.refundCount ?? 0}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Pending Refunds</p>
            <h2 className="text-xl font-bold text-orange-600">
              {totals.refundsPending}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-gray-500 text-sm">Processed Refunds</p>
            <h2 className="text-xl font-bold text-green-600">
              {totals.refundsProcessed??0}
            </h2>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
