import axiosInstance from "../../store/axiosInstance";

export const handleCustomerForm = async (formInfo) => {
  return axiosInstance.post(
   "/admin/create-user",
    formInfo
  );
};
export const handleBusinessDetailsForm = async (Id, formInfo) => {
  
  return axiosInstance.post(
   `/admin/add-business/${Id}`,
    formInfo
  );
};
export const handleFinancialDetailsForm = async (Id, formInfo) => {
  console.log(Id)
  return axiosInstance.post(
   `/admin/add-financial-details/${Id}`,
    formInfo
  );
};
export const handleGuarantorDetailsForm = async (Id ,formInfo) => {
  return axiosInstance.post(
   `/admin/add-guarantor/${Id}`,
    formInfo
  );
};
export const handleEditCustomer = async (Id ,formInfo) => {
  return axiosInstance.put(
   `/admin/user/${Id}`,
    formInfo
  );
};
export const handleEditCustomerBusiness = async (user_Id , Id, formInfo) => {
  return axiosInstance.put(
   `/admin/user/${user_Id}/business/${Id}`,
    formInfo
  );
};

export const handleOneCustomer = async (Id) => {
   
    const { data } = await axiosInstance.get(`/admin/user/${Id}`);
    
    return data.data
}

export const handleGetCustomer = async (page, perPage, search) => {
    console.log(page, perPage, search, "from fetch")
    const { data } = await axiosInstance.get(`/admin/user?page=${page}&perPage=${perPage}&search=${search || ""}`);
    
    return data.data
}
export const handleGetCustomerBusinessDetails = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/user/${Id}`);
     
    return data.data.Business
}
export const handleGetCustomerFinancialDetails = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/user/${Id}`);
     
    return data.data.Financial
}
export const handleEditFinancialDetails = async (Id, fid) => {
     const { data } = await axiosInstance.put(`admin/user/${Id}/financial-account/${fid}`);
     
    return data.data.Financial
}
export const handleEditGuarantorDetails = async (Id, Gid) => {
     const { data } = await axiosInstance.put(`/admin/user/${Id}/guarantor/${Gid}`);
     
    return data.data
}




