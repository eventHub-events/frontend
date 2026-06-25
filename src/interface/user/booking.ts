




export interface BookedTickets {
    name: string;
    quantity: number;
    price: number;
}



export interface BookingPayload {
   
        eventId : string;
        userId:  string;
        tickets: BookedTickets[];
        eventTitle: string;
        eventStartDate : string;
        eventEndDate:string;
        organizerName: string;
        eventVenue : string;
        userName: string;
        organizerId: string;
        eventImages: string[];
        userEmail?:string;
        stripeAccountId : string;
        attendanceDate:string;
        eventStartTime:string;
        eventEndTime:string

}

export interface BookingsFilter {
    title?: string;
    startDate?: string;
  endDate?: string;
  status?: string;
   page?: number;
  limit?: number;
  organizerName?: string;
}

