import { ADMIN_API_ROUTES } from "@/constants/admin/adminApiRoutes";

import { apiClient } from "../ApiClient";
import { FinanceOverviewFilter } from "@/interface/admin/finance-payout/financeOverview";
import { TransactionsFilter } from "@/interface/admin/finance-payout/transactions";
import { RefundsFilter } from "@/interface/admin/finance-payout/refund";


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
  fetchRefundsOverview :(filters? : RefundsFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_REFUNDS_OVERVIEW,{params:{...filters}, withCredentials: true})
} 