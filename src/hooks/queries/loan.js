import { useQuery } from "@tanstack/react-query"
import {  handleGetloanApplication, handleGetRepayment, handleGetActivation, handleGetSingleloanApplication } from "../../services/loans"


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
export const useFetchSingleActivation = (id) => {
   
    return useQuery({
        queryFn: () => handleGetSingleloanApplication(id),
        queryKey: ["activations", id]
        
        
    })

}
