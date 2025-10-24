export enum EventType  {
     Conference  = 'conference',
     Workshop   = "workshop",
     Sports   = "sports",
     Other  = "other",
     Online  = "online"
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