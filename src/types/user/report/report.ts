export type ReportTargetType = "event" | "organizer"|"user"|"chat_message";

export interface CreateReportDTO {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description?: string;
  reporterId: string;
  reporterName: string;
  reporterRole?: string;
  senderId?: string;
  senderName?: string;
  chatId? :string;
    mode?:"private"|"community";
    messageSnapshot?: string
}
