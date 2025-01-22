import axiosInstance from "../../store/axiosInstance";

export const handleProduct = async () => {
  const { data } = await axiosInstance.get("admin/products")
  return data.data
}
export const  handleCreateProduct= async (formInfo) => {
  return axiosInstance.post(
   "/admin/product",
    formInfo
  );
};
export const  handleUpdateProduct= async (formInfo) => {
  return axiosInstance.put(
   "/admin/product",
    formInfo
  );
};
export const handleGetSingleProduct = async (Id) => {
     const { data } = await axiosInstance.get(`/admin/products/${Id}`);
     
    return data
}