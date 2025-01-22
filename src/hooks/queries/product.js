import { useQuery } from "@tanstack/react-query"
import { handleGetSingleProduct, handleProduct } from "../../services/product"

export const useFetchProduct = () => {
  return useQuery({
    queryFn: () => handleProduct(),
    queryKey: ["Product"]
  })

}
export const useFetchSingleProduct = (id) => {
  return useQuery({
    queryFn: () => handleGetSingleProduct(id),
    queryKey: ["SingleProduct", id]
  })

}