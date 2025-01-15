import { useQuery } from "@tanstack/react-query"
import { handleGetCustomer, handleGetCustomerBusinessDetails, handleOneCustomer, handleGetCustomerFinancialDetails} from "../../services/customer"

export const useFetchCustomer = (page, perPage, search) => {
    console.log(page, perPage, search)
    return useQuery({
        queryFn: () => handleGetCustomer(page, perPage, search),
        queryKey: ["customers", { page, perPage, search }],
        
        
    })

}
export const useFetchBusinessCustomerDetails = (Id) => {
  
    return useQuery({
        queryFn: () => handleGetCustomerBusinessDetails(Id),
        queryKey: ["businesscustomers", { Id}],
        
        
    })

}
export const useFetchBusinessFinancialDetails = (Id) => {
  
    return useQuery({
        queryFn: () => handleGetCustomerFinancialDetails(Id),
        queryKey: ["financialcustomers", { Id}],
        
        
    })

}
export const useFetchOneCustomer = (Id) => {
   
    return useQuery({
        queryFn: () => handleOneCustomer(Id),
        queryKey: ["OneCustomers", { Id }],
        
        
    })

}

