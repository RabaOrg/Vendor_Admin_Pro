import { useQuery } from "@tanstack/react-query";
import { handleMarketplaceUser } from "../../services/customer";

export const useFetchMarketplaceUser = (userId) => {
  return useQuery({
    queryFn: () => handleMarketplaceUser(userId),
    queryKey: ["marketplaceUser", userId],
    enabled: !!userId
  });
};


