export type ReportTargetType = "event" | "organizer"|"user";

export interface CreateReportDTO {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  description?: string;
  reporterId: string;
  reporterName: string;
  reporterRole?: string
}
