import { useQuery } from "@tanstack/react-query"
import { handleGetCustomer, handleGetCustomerBusinessDetails, handleOneCustomer, handleGetCustomerFinancialDetails, handleGetCustomerGuarantorDetails, handleGetStates, handleGetCustomerStat} from "../../services/customer"

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
export const useFetchStates = () => {
  
    return useQuery({
        queryFn: () => handleGetStates(),
        queryKey: ["businesscustomers"],
        
        
    })

}
export const useFetchCustomerStat = () => {
  
    return useQuery({
        queryFn: () => handleGetCustomerStat(),
        queryKey: ["getcustomerstat"],
        
        
    })

}
export const useFetchBusinessFinancialDetails = (Id) => {
  
    return useQuery({
        queryFn: () => handleGetCustomerFinancialDetails(Id),
        queryKey: ["financialcustomers", { Id}],
        
        
    })

}
export const useFetchGuarantorDetails = (Id) => {
    return useQuery({
        queryFn: () => {
            if (!Id) {
                console.warn("useFetchGuarantorDetails called with invalid Id:", Id);
                return null; 
            }
            return handleGetCustomerGuarantorDetails(Id);
        },
        queryKey: ["guarantorscustomers", { Id }],
        enabled: !!Id,
    });
};

export const useFetchOneCustomer = (Id) => {
   
    return useQuery({
        queryFn: () => handleOneCustomer(Id),
        queryKey: ["OneCustomers", Id ],
        
        
    })

}

