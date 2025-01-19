import axiosInstance from "../../store/axiosInstance";

export const handleProduct = async () => {
  const { data } = await axiosInstance.get("admin/products")
  return data.data
}