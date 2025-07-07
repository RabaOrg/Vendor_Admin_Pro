import { useQuery } from "@tanstack/react-query";
import { handleGetAllTrnsaction, handleGetSingleRecurring } from "../../services/transaction";
import { handleGetRecurring } from "../../services/transaction";

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
export const useFetchAllRecurring = () => {
  
    return useQuery({
        queryFn: () => handleGetRecurring(),
        queryKey: ["recurring"],
        
        
    })

}
export const useFetchAllSingleRecurring = (id) => {
  
    return useQuery({
        queryFn: () => handleGetSingleRecurring(id),
        queryKey: ["singlerecurring"],
        
        
    })

}