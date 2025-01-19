

import axios from "axios";
import axiosInstance from "../../store/axiosInstance";


export const handleGetRepayment = async () => {
     const { data } = await axiosInstance.get(`/admin/repayment_plans`);
     
    return data.data
}
export const handleGetloanApplication = async () => {
     const  data  = await axiosInstance.get("/admin/loan-applications");
     
    return data.data
}
export const handleGetActivation = async () => {
     const data  = await axiosInstance.get("/admin/loans");
     
    return data.data
}

export const  handleRepayment = async (formInfo) => {
  return axiosInstance.post(
   "/admin/repayment_plans",
    formInfo
  );
};