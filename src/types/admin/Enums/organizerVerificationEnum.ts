export enum KycStatus {
  PENDING = "Pending",
  VERIFIED = "Verified",
  APPROVED ="Approved",
  REJECTED = "Rejected",
   NOT_APPLICABLE = "N/A"
}
export enum UploadDocumentStatus{
   PENDING="Pending",
   APPROVED="Approved",
   REJECTED="Rejected"
}
export const UploadDocumentVerificationStatus = {
  VERIFIED: true,
  REJECTED: false,
} as const;

export type UploadDocumentVerificationStatus = boolean;
