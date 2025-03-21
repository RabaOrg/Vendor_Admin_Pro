

import { useQuery } from "@tanstack/react-query"
import { handleCategory } from "../../services/category"

export const useFetchCategory = () => {
  
    return useQuery({
        queryFn: () => handleCategory(),
        queryKey: ["category"],
        
        
    })

}