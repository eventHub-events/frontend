export const documentTypes = ["AadharCard", "PANCard", "BusinessCertificate"];


export interface DocumentVerifiedType{
  _id:string;
  organizerId?:string;
  type:string;
  uploadedAt:Date;
  status:"Pending"|"Rejected"|"Approved";
  verified:true;
  reviewedAt:Date;
  reason:string;
}