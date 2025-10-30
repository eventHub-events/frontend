import { BookedTickets } from "@/interface/user/booking";

export interface BookingInfo {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  organizerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  tickets: BookedTickets[]
}


