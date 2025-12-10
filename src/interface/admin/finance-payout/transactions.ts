export interface TransactionsFilter {
  page: number;
  limit: number;
  from?: string;
  to?: string;
  status?: string;
  eventTitle?: string;
  organizerName?: string;
  userName?: string;

}

export interface TransactionsRow {
  bookingId : string;
  eventId: string;
  eventTitle: string;
  organizerName :string;
  userName :string;
  totalAmount: number;
  platformFee : number;
  organizerAmount: number;
  paymentId: string;
  status: string;
  createdAt: Date;
  paymentMethod: string;
}

export interface TransactionPaginatedResult {
  page: number;
  limit : number;
  total: number;
  totalPages :number;
  data : TransactionsRow[]
}