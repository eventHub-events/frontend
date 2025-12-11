import { ADMIN_API_ROUTES } from "@/constants/admin/adminApiRoutes";

import { apiClient } from "../ApiClient";
import { FinanceOverviewFilter } from "@/interface/admin/finance-payout/financeOverview";
import { TransactionsFilter } from "@/interface/admin/finance-payout/transactions";
import { RefundsFilter } from "@/interface/admin/finance-payout/refund";
import { PayoutsFilter } from "@/interface/admin/finance-payout/payouts";
import { EventRevenueFilter } from "@/interface/admin/finance-payout/event-summary";
import { SubscriptionOverviewFilter, SubscriptionPlansFilter } from "@/interface/admin/finance-payout/subscription";



export const adminFinanceOverviewService = {
  fetchOverView: (filters?: FinanceOverviewFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_FINANCE_OVERVIEW, {params:{
        from: filters?.from,
        to: filters?.to,
      }, withCredentials: true}),

  fetchTransactions :(filters: TransactionsFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_TRANSACTIONS,{params:{...filters}, withCredentials: true}),
  downloadTransactionsPdf: (filters: TransactionsFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.EXPORT_TRANSACTIONS_PDF,{
     params: {...filters},
     withCredentials : true,
     responseType: "blob"
  }),

  fetchRefunds :(filters : RefundsFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_REFUNDS,{params:{...filters}, withCredentials: true}),
  fetchRefundsOverview :(filters? : RefundsFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_REFUNDS_OVERVIEW,{params:{...filters}, withCredentials: true}),
  fetchPayoutOverview:(filters?:{from?: string; to?: string}) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_PAYOUT_OVERVIEW,{params:{...filters}, withCredentials :true}),
  fetchPayouts :(filters?:PayoutsFilter) =>  apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_PAYOUTS,{params:{...filters},withCredentials : true}),
  fetchEventRevenue :(filters: EventRevenueFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_EVENT_REVENUE_SUMMARY,{params :{...filters},withCredentials: true}),

  fetchSubscriptionPlansRevenue:(filter :SubscriptionPlansFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_SUBSCRIPTION_PLAN_REVENUE,{params:{...filter}, withCredentials :true}),
  fetchSubscriptionOverview: (filter?: SubscriptionOverviewFilter) => apiClient. get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_SUBSCRIPTION_OVERVIEW,{params :{...filter}, withCredentials: true})
} 