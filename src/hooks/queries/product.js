import { useQuery } from "@tanstack/react-query";
import { handleGetCategories, handleGetSingleLoan, handleGetSingleProduct, handleMetaProduct, handleProduct } from "../../services/product";

export const useFetchProduct = (page, perPage) => {
  return useQuery({
    queryFn: () => handleProduct(page, perPage),
    queryKey: ["Product", page, perPage]
  });
}
export const useFetchMetaProduct = (page, perPage) => {
  return useQuery({
    queryFn: () => handleMetaProduct(page, perPage),
    queryKey: ["ProductMeta", page, perPage]
  });
}


export const useFetchSingleProduct = (id) => {
  return useQuery({
    queryFn: () => handleGetSingleProduct(id),
    queryKey: ["SingleProduct", id]
  });
}
export const useFetchCategory = () => {
  return useQuery({
    queryFn: () =>handleGetCategories(),
    queryKey: ["category"]
  });
}
