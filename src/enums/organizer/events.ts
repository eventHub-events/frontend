export enum EventType  {
    
     Online  = "online",
     Offline = "offline"
}
export enum TicketStatus {
  
  Active = "Active",
  Inactive = "Inactive"

}
export enum EventStatus {
  Draft = "draft",
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
  Flagged = "flagged",
}
export enum EventVisibility{
      Public = "public",
   Private = "private",
   InviteOnly = "invite-only"
}
export enum EventApprovalStatus {
    Rejected= "rejected",
    Approved = "approved",
    Blocked = "blocked"
}
export enum RefundStatus {
  NONE = 'none',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum PaymentMethod {
  CARD = 'card',
  UPI = 'upi',
}