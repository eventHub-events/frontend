import { ADMIN_API_ROUTES } from "@/constants/admin/adminApiRoutes";

import { apiClient } from "../ApiClient";
import { FinanceOverviewFilter } from "@/interface/admin/finance-payout/financeOverview";


export const adminFinanceOverviewService = {
  fetchOverView: (filters?: FinanceOverviewFilter) => apiClient.get(ADMIN_API_ROUTES.FINANCE_PAYOUT.FETCH_FINANCE_OVERVIEW, {params:{
        from: filters?.from,
        to: filters?.to,
      }, withCredentials: true})
}