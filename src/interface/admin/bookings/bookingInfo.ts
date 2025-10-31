import { BookingStatus } from "@/enums/organizer/booking";


export interface AdminBookingFilterOptions {
    userName?: string;
    status?: BookingStatus;
    organizerName?: string;
    startDate?: string;
    endDate?:string;
    eventTitle?: string;
    page?: number;
    limit?: number;
}