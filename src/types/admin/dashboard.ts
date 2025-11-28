// application/DTOs/admin/dashboard/AdminDashboardDTO.ts


// 👤 Users
export interface UserMetricsDTO {
  totalUsers: number;
  activeUsers: number;
  totalOrganizers: number;
  activeOrganizers: number;
  pendingOrganizerVerification: number;
}
export type ReportRange = "daily" | "monthly" | "yearly";
// 💳 Bookings & Revenue
export interface BookingRevenueDTO {
  totalRevenue: number;
  platformRevenue: number;
  organizerRevenue: number;
  bookingsCount: number;
  timeline: BookingTimelineItemDTO[];
}

// 📦 Subscriptions
export interface SubscriptionMetricsDTO {
  totalRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  timeline: SubscriptionTimelineItemDTO[];
}

// 💰 Payout
export interface PayoutMetricsDTO {
  pendingAmount: number;
  pendingCount: number;
}

// 🧠 Dashboard Root DTO
export interface AdminDashboardDTO {
  users: UserMetricsDTO;
  bookings: BookingRevenueDTO;
  subscriptions: SubscriptionMetricsDTO;
  payouts: PayoutMetricsDTO;
}
// application/DTOs/admin/dashboard/AdminDashboardTimelineDTO.ts

export interface BookingTimelineItemDTO {
  dateLabel: string;
  totalRevenue: number;
  platformRevenue: number;
  organizerRevenue: number;
  bookingsCount: number;
}

export interface SubscriptionTimelineItemDTO {
  dateLabel: string;
  revenue: number;
  subscriptions: number;
}
