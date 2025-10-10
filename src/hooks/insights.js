import { useQuery } from "@tanstack/react-query";
import { handleGetAnalytics, handleInsights, handleGetRepaymentAnalytics, handleGetAgentAnalytics, handleGetVendorSalesAnalytics, handleGetRevenueAnalytics } from "../services/insights";

export const useFetchDashboardInsights = () => {
  return useQuery({
    queryFn: () => handleInsights(),
    queryKey: ["Dashboard"]
  });
}

export const useFetchDashboardAnalytics = () => {
  return useQuery({
    queryFn: () => handleGetAnalytics(),
    queryKey: ["DashboardAnalytics"]
  });
}

export const useFetchRepaymentAnalytics = ({ period = '30' } = {}) => {
  return useQuery({
    queryFn: () => handleGetRepaymentAnalytics({ period }),
    queryKey: ["RepaymentAnalytics", period]
  });
}

export const useFetchAgentAnalytics = ({ period = '30' } = {}) => {
  return useQuery({
    queryFn: () => handleGetAgentAnalytics({ period }),
    queryKey: ["AgentAnalytics", period]
  });
}

export const useFetchVendorSalesAnalytics = ({ period = '30' } = {}) => {
  return useQuery({
    queryFn: () => handleGetVendorSalesAnalytics({ period }),
    queryKey: ["VendorSalesAnalytics", period]
  });
}

export const useFetchRevenueAnalytics = ({ period = '30' } = {}) => {
  return useQuery({
    queryFn: () => handleGetRevenueAnalytics({ period }),
    queryKey: ["RevenueAnalytics", period]
  });
}