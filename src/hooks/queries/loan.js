import { useQuery } from "@tanstack/react-query"
import {  handleGetloanApplication, handleGetRepayment, handleGetActivation, handleGetSingleloanApplication, handleGetSingleLoan, handleGetBankStatement, handleGetPaymentOrder } from "../../services/loans"


export const useFetchRepayment = () => {
   
    return useQuery({
        queryFn: () => handleGetRepayment(),
        queryKey: ["repayment"],
        
        
    })

}
export const useFetchProductOrder= () => {
   
    return useQuery({
        queryFn: () => handleGetPaymentOrder(),
        queryKey: ["productLoan"],
        
        
    })

}
export const useFetchLoanApplication= (id) => {
   
    return useQuery({
        queryFn: () => handleGetloanApplication(id),
        queryKey: ["Application", id],
        
        
    })

}

export const useFetchSingleLoan= (id) => {
  return useQuery({
    queryFn: () => handleGetSingleLoan(id),
    queryKey: ["singleLoanApplication", id]
  });
}
export const useFetchBankStatement= (id) => {
  return useQuery({
    queryFn: () => handleGetBankStatement(id),
    queryKey: ["singleBankStatement", id]
  });
}


export const useFetchActivation = () => {
   
    return useQuery({
        queryFn: () => handleGetActivation(),
        queryKey: ["getactivations"]
        
        
    })

}
export const useFetchSingleActivation = (id) => {
   
    return useQuery({
        queryFn: () => handleGetSingleloanApplication(id),
        queryKey: ["activations", id]
        
        
    })

}
