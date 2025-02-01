import { useQueries } from "@tanstack/react-query";
import { handleGetAllTrnsaction } from "../../services/transaction";

export const useFetchTransactionDetails = (start_date, end_date, page, perPage) => {
  
    return useQuery({
        queryFn: () => handleGetAllTrnsaction(start_date, end_date, page, perPage),
        queryKey: ["businesstransaction", { start_date, end_date, page, perPage}],
        
        
    })

}
export const useFetchAllTransactionDetails = ( page, perPage) => {
  
    return useQuery({
        queryFn: () => handleGetAllTrnsaction( page, perPage),
        queryKey: ["businessAlltransaction", { page, perPage}],
        
        
    })

}