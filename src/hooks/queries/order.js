
import { useQuery } from "@tanstack/react-query"
import { handleGetOrder} from "../../services/order"
export const useFetchOrder = () => {
   
    return useQuery({
        queryFn: () => handleGetOrder(),
        queryKey: ["Orders"],
        
        
    })
    


}
// export const useFetchOrderSummary = () => {
   
//     return useQuery({
//         queryFn: () => handleGetOrderSummary(),
//         queryKey: ["OrderSummary"],
        
        
//     })
    


// }

