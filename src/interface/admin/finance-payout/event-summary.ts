// Event revenue domain types used by frontend
export interface IEventRevenueRow {
  eventId: string;
  eventTitle: string;
  organizerName: string;
  ticketsSold: number;
  grossRevenue: number;         
  platformRevenue: number;      
  organizerRevenue: number;     
  refundedAmount: number;
  netRevenue: number;           
}

export interface IEventRevenueResult {
  data: IEventRevenueRow[];
  timeRange: { from: string; to: string };
  totalPages: number
}
export interface EventRevenueFilter {
  page?: number;
  limit?: number;
  organizerName?: string;
  eventTitle?: string;
  from?: string | Date;
  to?: string | Date;
}
