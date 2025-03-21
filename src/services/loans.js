

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
export const handleGetSingleLoan = async (id) => {
  const { data } = await axiosInstance.get(`/admin/loan-applications/${id}`)
  return data.data;
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
export const  handleUpdateStatus = async (id, formInfo) => {
  return axiosInstance.patch(
   `/admin/loan-applications/${id}/status`, formInfo
  );
};
export const  handleCreateLoanApplication = async (formInfo) => {
  return axiosInstance.post(
   "/admin/loanapplication/creation",
    formInfo
  );
};
export const handleGetSingleloanApplication = async (id) => {
     const  data  = await axiosInstance.get(`/admin/loans/${id}`);
     
    return data.data.data
}
