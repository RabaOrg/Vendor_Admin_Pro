import { useQuery } from "@tanstack/react-query";
import { handleInsights } from "../services/insights";
export const useFetchDashboardInsights = () => {
  return useQuery({
    queryFn: () => handleInsights(),
    queryKey: ["Product"]
  });
}