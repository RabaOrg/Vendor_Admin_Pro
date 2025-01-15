import { useQuery } from "@tanstack/react-query"
import {  handleGetloanApplication, handleGetRepayment, handleGetActivation } from "../../services/loans"


export const useFetchRepayment = () => {
   
    return useQuery({
        queryFn: () => handleGetRepayment(),
        queryKey: ["repayment"],
        
        
    })

}
export const useFetchLoanApplication= () => {
   
    return useQuery({
        queryFn: () => handleGetloanApplication(),
        queryKey: ["Application"],
        
        
    })

}
export const useFetchActivation = () => {
   
    return useQuery({
        queryFn: () => handleGetActivation(),
        queryKey: ["activations"]
        
        
    })

}
