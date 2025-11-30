




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
        eventDate : string;
        organizerName: string;
        eventVenue : string;
        userName: string;
        organizerId: string;
        eventImages: string[];

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

