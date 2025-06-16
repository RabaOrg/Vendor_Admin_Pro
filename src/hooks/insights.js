import { useQuery } from "@tanstack/react-query";
import { handleGetAnalytics, handleInsights } from "../services/insights";
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