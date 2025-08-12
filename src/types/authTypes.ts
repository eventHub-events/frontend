export interface IUser{
  id:string;
  name:string;
  email:string;
  role: "user"|"organizer"|"admin";
  image?:string,
  isVerified?:boolean
}

export interface IOrganizer extends IUser{
companyName?:string;
kycStatus?:"Pending"|"Verified"|"Rejected";

}
export interface IAdmin extends IUser{

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
  _id:string,
  name:string,
  email:string,
  createdAt:Date,
  role:string,
  kycStatus:string,
  isBlocked:boolean

}