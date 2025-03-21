import { useQuery } from "@tanstack/react-query"
import {  handleGetloanApplication, handleGetRepayment, handleGetActivation, handleGetSingleloanApplication, handleGetSingleLoan } from "../../services/loans"


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
export const useFetchSingleLoan= (id) => {
  return useQuery({
    queryFn: () => handleGetSingleLoan(id),
    queryKey: ["singleLoanApplication", id]
  });
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
