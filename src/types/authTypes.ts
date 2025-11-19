import { KycStatus } from "./admin/Enums/organizerVerificationEnum";

export interface IUser{
  id:string;
  name:string;
  email:string;
  role: "user"|"organizer"|"admin";
  image?:string,
  isVerified?:boolean,
  
}

export interface IOrganizer extends IUser{
companyName?:string;
kycStatus?: KycStatus
isKycResubmitted : boolean;
stripeOnboarded?: boolean 

}
export interface IAdmin extends IUser{

  role:"admin"
}


export interface IUserLoginPayload {
  email:string;
  password:string;
}

export interface IUSerLoginResponse {
  success:boolean;
  statusCode:number;
  message:string;
  data:IUser

}
export interface ILogoutResponse{
  success:boolean;
  message:string
}
export interface IGetMeResponse {
  success:boolean;
  data:IUser;
}

export interface IUserInfo{
  id:string,
  name:string,
  email:string,
  createdAt:Date,
  role:string,
  kycStatus:string,
  isBlocked:boolean

}