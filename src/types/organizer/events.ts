import { EventType, TicketStatus } from "@/enums/organizer/events";

export interface EventCreationForm {
    organizerId: string;
    title: string;
    type: EventType;
    categoryId: string;
    description: string;
    location:ILocation;
    totalCapacity: number;
    startDate: Date;
    endDate: Date;
    images: string[];
    tickets: ITicketTier[];
    startTime?: string;
    endTime?: string;
    featured?: boolean;
    createdBy?: string;
    tags?:string[];
    waitingListEnabled?: boolean;
}

export interface ILocation {
     venue: string;
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {lat: number,lng: number}
}


  

export interface ITicketTier {
  name: string;
  price: number;
  totalSeats: number;
  bookedSeats?: number;
  description?: string;
  status: TicketStatus;
  benefits: string[];
  saleStartDate?: Date;
  saleEndDate?: Date;
  maxTicketPerUser?: number;
  isRefundable?: boolean

}


