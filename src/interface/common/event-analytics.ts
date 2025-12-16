import { BookingStatus } from "@/enums/organizer/booking";
import { PaymentMethod, RefundStatus } from "@/enums/organizer/events";

export interface EventAnalyticsData {
  summary: EventAnalyticsSummary;
  ticketTrend: TrendPoint[];
  revenueTrend: TrendPoint[];
  paymentSplit: { method: string; amount: number }[];
  refundSplit: { status: string; refundedAmount: number }[];
  ticketRevenueSplit : TicketRevenue[];
  ticketTypePerformance : ITicketTypePerformance[];
  topTicketType : ITicketTypePerformance | null;
  bookings : BookingsRow[];
  pagination : {
    total : number;
    page: number;
    limit: number;
    totalPages : number
  }
}


export const SALE_STATUSES = [
  BookingStatus.CONFIRMED,
  BookingStatus.REFUNDED
];

export interface EventAnalyticsSummary {
  ticketsSold: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  organizerRevenue: number;
  platformFee: number;
  paidAmount: number;
  pendingAmount: number;
}
export interface TrendPoint {
  date: string;
  value: number;
}

export interface TicketRevenue {
  name: string;
  value: number;
  [key: string]: string | number;
}
export interface ITicketTypePerformance {
  ticketType : string;
  ticketsSold : number;
  revenue : number
}


export interface BookingsRow {
  id :string;
  userName : string;
  userEmail: string;
  tickets : number;
  amount : number;
  paymentMethod: PaymentMethod|  undefined;
  refundStatus : RefundStatus ;
 status : BookingStatus;
 createdAt : Date;
}
