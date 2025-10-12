  export  interface UserProfileUpdatePayload  {
          user?:{
            name?:string,
            phone?: string,
            userId?: string
          },
          profile?: {
            address?:  {
                line1?:string;
                line2?: string;
                city: string;
                state: string;
                country: string;
                 pin: string;
            }
            image?: string
           }
          }

  export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pin: string;
}

  export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: Address;
  image: string;
  memberSince: string;
  favorites: string[];
  profileId: string;
  twoFAEnabled: boolean;
}

export type FormFieldName = "name" | "phone" | "address.line1" | "address.line2" | "address.city" | "address.state" | "address.country" | "address.pin";
