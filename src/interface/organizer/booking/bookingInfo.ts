import { BookingStatus } from "@/enums/organizer/booking";
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
  tickets: BookedTickets[];
  userName: string;
}


export interface BookingFilter {
   title?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  status?: BookingStatus;
  page?: number;
  limit?: number

}

