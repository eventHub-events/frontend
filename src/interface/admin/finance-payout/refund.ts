export interface RefundsFilter {
   page?: number;
   limit?: number;
   from?: string | Date;
   to?: string| Date;
   status?: string;
   eventTitle?: string;
   organizerName?: string;
   paymentMethod?: string;
   userName?: string;

}

export interface RefundRow {
   bookingId :string;
   eventId :string;
   eventTitle :string;
   userName :string;
   refundedAmount: number;
   refundStatus?: string;
   refundDate?: Date;
   paymentMethod?: string;
   paymentId?: string;
   createdAt?: string;
   refundId?: string;
}

export interface RefundPaginatedResult {
    page : number;
    limit : number;
    total : number;
    totalPages : number;
    data : RefundRow[];
}

export interface RefundOverviewTotals {
    totalRefundedAmount : number;
    refundCount : number;
    refundsPending: number;
    refundsProcessed : number;

}
export interface RefundTrendDaily {
  date: string;       
  amount: number;
  count: number;
}

export interface RefundTrendMonthly {
  month: string;      
  amount: number;
  count: number;
}

export interface RefundTrendYearly {
  year: string;       
  amount: number;
  count: number;
}


export interface RefundOverviewResult {
   timeRange: {from : Date; to: Date};
   totals : RefundOverviewTotals;
   trend:{
     daily : RefundTrendDaily[];
     monthly : RefundTrendMonthly[];
     yearly : RefundTrendYearly[]
   };
}
export type RefundTrendRange = "daily" | "monthly" | "yearly";
