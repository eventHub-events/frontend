// -------------------------------
// Filters
// -------------------------------
export interface SubscriptionOverviewFilter {
  from?: string | Date;
  to?: string | Date;
}

export interface SubscriptionPlansFilter {
  page?: number;
  limit?: number;
  name?: string;
  from?: string | Date;
  to?: string | Date;
}

// -------------------------------
// Overview Totals
// -------------------------------
export interface SubscriptionOverviewTotals {
  totalRevenue: number;
  activeSubscribers: number;
  totalSubscriptions: number;
}

// -------------------------------
// Trend Types
// -------------------------------
export interface SubscriptionDailyTrend {
  date: string;
  revenue: number;
  count: number;
}

export interface SubscriptionMonthlyTrend {
  month: string;
  revenue: number;
  count: number;
}

export interface SubscriptionYearlyTrend {
  year: string;
  revenue: number;
  count: number;
}

// -------------------------------
// Final Overview Response
// -------------------------------
export interface SubscriptionOverviewResult {
  timeRange: { from: Date; to: Date };
  totals: SubscriptionOverviewTotals;
  trend: {
    daily: SubscriptionDailyTrend[];
    monthly: SubscriptionMonthlyTrend[];
    yearly: SubscriptionYearlyTrend[];
  };
}

// -------------------------------
// Subscription Plan Row (for table)
// -------------------------------
export interface SubscriptionPlanRow {
  _id: string;
  name: string;
  price: number;
  durationInDays: number;
  description: string;

  subscribers: number;
  revenue: number;
  avgRevenue: number;
}

// -------------------------------
// Paginated Subscription Plan Result
// -------------------------------
export interface SubscriptionPlanPaginatedResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: SubscriptionPlanRow[];
}
