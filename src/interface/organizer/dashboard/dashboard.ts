export interface ITicketsOverview {
  totalTicketsSold: number;
  totalBookings: number;
  cancelledTickets: number;
  refundedTickets: number;
  dailyTrend: { date: string; tickets: number }[];
}

export interface IEarningsOverview {
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  platformFee: number;
  organizerEarnings: number;
  dailyRevenueTrend: { date: string; amount: number }[];
}

export interface IOrganizerEventRow {
  eventId: string;
  eventTitle: string;
  ticketsSold: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  organizerRevenue: number;
  platformFee: number;
 payoutPending: number,
    payoutReceived: number
}

export interface IOrganizerEventPerformance {
  totalEvents: number;
  data: IOrganizerEventRow[];
}

export interface IOrganizerPayoutRow {
  bookingId: string;
  payoutAmount: number;
  payoutStatus: "pending" | "paid";
  payoutDueDate?: string;
  payoutDate?: string;
}

export interface IOrganizerPayoutSummary {
  totalPendingAmount: number;
  totalPaidAmount: number;
  data: IOrganizerPayoutRow[];
}

export interface IOrganizerSubscriptionSummary {
  planName: string;
  price: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface IOrganizerKycDocument {
  type: string;
  url: string;
  status: string;   // Pending | Approved | Rejected
  reason?: string;
  uploadedAt: Date
}

export interface IOrganizerKycStatus {
   kycStatus: "Pending" | "Approved" | "Rejected" | "N/A";
  isKycResubmitted: boolean;
  documents: IOrganizerKycDocument[];
}

export interface IOrganizerDashboardOverview {
  tickets: ITicketsOverview;
  earnings: IEarningsOverview;
  events: IOrganizerEventPerformance;
  payouts: IOrganizerPayoutSummary;
  subscription: IOrganizerSubscriptionSummary | null;
  kyc: IOrganizerKycStatus;
}
export interface OrganizerDashboardFilter {
  
  from?: string | Date;
  to?: string | Date;
}