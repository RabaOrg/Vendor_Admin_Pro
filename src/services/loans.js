

import axios from "axios";
import axiosInstance from "../../store/axiosInstance";


export const handleGetRepayment = async () => {
     const { data } = await axiosInstance.get(`/admin/repayment_plans`);
     
    return data.data
}
export const handleDeleteApplication= async (id, forminfo) => {
  const { data } = await axiosInstance.delete(`/api/admin/applications/${id}`, {
         data: forminfo,
     });
     
    return data.data
}
export const handleGetloanApplication = async () => {
     const  data  = await axiosInstance.get("/api/admin/applications?page=1&limit=20");
     
    return data.data
}
export const handleGetApplicationStatistics = async () => {
     const  data  = await axiosInstance.get("/api/admin/applications/stats");
     
    return data.data
}
export const handleGetVendortatistics = async () => {
     const  data  = await axiosInstance.get("/api/admin/vendors/stats");
     
    return data.data
}



export const handleGetBankStatement = async (id) => {
     const  data  = await axiosInstance.get(`/admin/users/${id}/bank-statements`);
     
    return data.data
}
export const handleGetSingleLoan = async (id) => {
  const { data } = await axiosInstance.get(`/api/admin/applications/${id}`)
  return data.data;
}
export const handleGetActivation = async () => {
     const data  = await axiosInstance.get("/admin/loans");
     
    return data.data
}
export const handleGetVendors= async () => {
     const data  = await axiosInstance.get("/api/admin/vendors?page=1&limit=20");
     
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
   `/api/admin/applications/${id}/status`, formInfo
  );
};
export const  handleUpdateLoanStatus = async (id, formInfo) => {
  return axiosInstance.put(
   `/admin/loans/${id}/status`, formInfo
  );
};
export const  handleUpdateVendorStatus = async (id, formInfo) => {
  return axiosInstance.patch(
   `/api/admin/vendors/${id}/status`, formInfo
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
export const handleGetSingleVendor = async (id) => {
     const  data  = await axiosInstance.get(`/api/admin/vendors/${id}`);
     
    return data.data.data
}

export const handleGetPaymentOrder = async () => {
     const  data  = await axiosInstance.get(`/admin/payment-analytics`);
     
    return data
}

