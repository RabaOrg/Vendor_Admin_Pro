
import { useQuery } from "@tanstack/react-query"
import { handleGetOrder, handleGetSingleOrder} from "../../services/order"
export const useFetchOrder = () => {
   
    return useQuery({
        queryFn: () => handleGetOrder(),
        queryKey: ["Orders"],
        
        
    })
    


}
export const useFetchSingleOrder = (id) => {
   
    return useQuery({
        queryFn: () => handleGetSingleOrder(id),
        queryKey: ["Orders", id],
        
        
    })
    


}
// export const useFetchOrderSummary = () => {
   
//     return useQuery({
//         queryFn: () => handleGetOrderSummary(),
//         queryKey: ["OrderSummary"],
        
        
//     })
    


// }

