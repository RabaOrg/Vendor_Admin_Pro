import { useQuery } from "@tanstack/react-query"
import { handleGetCustomer, handleGetCustomerBusinessDetails, handleOneCustomer, handleGetCustomerFinancialDetails, handleGetCustomerGuarantorDetails, handleGetStates, handleGetCustomerStat, handleVendorCustomer} from "../../services/customer"

export const useFetchCustomer = (page, perPage, search, source) => {
    console.log(page, perPage, search, source)
    return useQuery({
        queryFn: () => handleGetCustomer(page, perPage, search, source),
        queryKey: ["customers", { page, perPage, search, source }],
        
        
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
export const useFetchVendorCustomer = (Id) => {
   
    return useQuery({
        queryFn: () => handleVendorCustomer(Id),
        queryKey: ["singleCustomers", Id ],
        
        
    })

}

