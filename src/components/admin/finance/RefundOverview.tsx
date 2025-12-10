"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { RefundOverviewResult } from "@/interface/admin/finance-payout/refund";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";

export default function RefundOverview() {
  const [overview, setOverview] = useState<RefundOverviewResult | null>(null);

  const fetchOverview = async () => {
    try {
      const res = await adminFinanceOverviewService.fetchRefundsOverview();
      setOverview(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (!overview) return <p>Loading...</p>;

  const { totals } = overview;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card><CardContent className="p-4">
        <p className="text-gray-500 text-sm">Total Refund Amount</p>
        <h2 className="text-xl font-bold text-red-600">₹{totals.totalRefundAmount}</h2>
      </CardContent></Card>

      <Card><CardContent className="p-4">
        <p className="text-gray-500 text-sm">Refund Count</p>
        <h2 className="text-xl font-bold">{totals.refundedCount}</h2>
      </CardContent></Card>

      <Card><CardContent className="p-4">
        <p className="text-gray-500 text-sm">Pending Refunds</p>
        <h2 className="text-xl font-bold text-orange-600">{totals.refundsPending}</h2>
      </CardContent></Card>

      <Card><CardContent className="p-4">
        <p className="text-gray-500 text-sm">Processed Refunds</p>
        <h2 className="text-xl font-bold text-green-600">{totals.refundProcessed}</h2>
      </CardContent></Card>
    </div>
  );
}
