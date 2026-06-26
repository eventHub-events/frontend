import { BookingStatus } from "@/enums/organizer/booking";
import { BookedTickets } from "@/interface/user/booking";

export interface BookingInfo {
  id: string;
  eventTitle: string;
  eventStartDate: string;
  eventEndDate: string;
  attendanceDate:string;
  eventStartTime:string;
  eventEndTime:string;
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
  eventId?: string;
  page?: number;
  limit?: number

}
 export interface BookingDetailsInfo {
    bookingId: string;
    bookingStatus: BookingStatus;
    bookingDate : string;
    totalAmount :number;
    paymentMethod?: string;
    paymentId? :string;

    tickets : {
       name : string;
       quantity: number;
       price : number;
       subTotal : number;
    }[]

    event : {
       eventId : string;
       title :string;
       startDate: string;
       endDate: string;
       startTime? :string;
       endTime? :string;
       venue: string;
       attendanceDate:string;
     },
     user : {
       name: string;
       email?: string;
       phone?: string;
     }
 }
