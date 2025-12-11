

export interface FinanceOverviewFilter {
   from?: string;
   to?: string;
}

export interface FinanceOverviewTotals {
  grossTicketSales : number;
  totalRefunds : number;
  platformRevenueFromTickets : number;
  organizerRevenueFromTickets : number;

  totalBookings : number;
  confirmedBookings : number;
  cancelledBookings : number;
  failedPayments: number;
  refundedBookings :number;
}
 export interface FinanceDailyTrend {
  date: string;      // "2025-02-01"
  revenue: number;   // platformFee that day
  refunds: number;   // refundedAmount that day
  bookings: number;  // confirmed bookings that day
}

export interface FinanceMonthlyTrend {
  month: string;     // "2025-02"
  revenue: number;
  refunds: number;
}

export interface FinanceYearlyTrend {
  year: string;   // "2024"
  revenue: number;
  refunds: number;
}

export interface FinanceOverviewPayouts {
  pendingPayoutAmount: number;     
  paidPayoutAmount: number;        
}

export interface FinanceOverviewSubscription {
  subscriptionRevenue : number;
  totalSubscription : number;
}
export interface SubscriptionTrendDaily {
  date: string;
  revenue: number;
}

export interface SubscriptionTrendMonthly {
  month: string;
  revenue: number;
}

export interface SubscriptionTrendYearly {
  year: string;
  revenue: number;
}
export interface FinanceOverviewTrend {
  daily: FinanceDailyTrend[];
  monthly: FinanceMonthlyTrend[];
  yearly: FinanceYearlyTrend[];

  subscriptionDaily: SubscriptionTrendDaily[];
  subscriptionMonthly: SubscriptionTrendMonthly[];
  subscriptionYearly: SubscriptionTrendYearly[];
}


export interface FinanceOverviewResults {
   timeRange : {
    from: Date;
    to: Date;
   };
   totals :FinanceOverviewTotals;
   subscription : FinanceOverviewSubscription;
   payouts :FinanceOverviewPayouts;
   trend:  FinanceOverviewTrend;
}