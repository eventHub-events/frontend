export enum ReportTypes {
  EVENT ="event",
  USER = "user",
  ORGANIZER = "organizer",
 CHAT_MESSAGE = "chat_message" 
}

export enum ReportStatus {
    PENDING ="pending",
    REVIEWED = "reviewed",
    ACTION_TAKEN = "action-taken",
    IGNORED = "ignored"
}
export enum ReportActions {
  BLOCK ="block",
  WARN ="warn",
  NOT_NEEDED ="not needed"
}



export interface ReportData{
             reporterId: string;
             reporterName: string;
             reporterRole?: string;
             targetId: string;
             targetType: ReportTypes;
             reason: string;
             action: ReportActions;
             description?: string;
             status: ReportStatus;
             adminNote?: string;
             reported?:  Date;
              updatedAt?: Date;
              id?: string;
              chatId?:string;
              senderId?: string;
              senderName?: string;
              messageSnapshot?:string

}

export interface AdminActionPayload {
  reportId:  string;
  status: ReportStatus;
  adminNote?: string;
  action : ReportActions;
  adminId?: string;
  targetId?: string;

}