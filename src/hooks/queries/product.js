import { useQuery } from "@tanstack/react-query"
import { handleProduct } from "../../services/product"

export const useFetchProduct = () => {
  return useQuery({
    queryFn: () => handleProduct(),
    queryKey: ["Product"]
  })

}