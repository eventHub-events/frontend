export interface ILocation {
   venue: string;
   address: string;
   city: string;
   state: string;
   country: string;
   coordinates?: {lat: number,lng: number}
}