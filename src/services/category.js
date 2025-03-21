import axiosInstance from "../../store/axiosInstance";
export const handleCategory = async () => {
   
    const { data } = await axiosInstance.get("/admin/categories");
    
    return data.data
}
export const  handlePostCategory = async (formInfo) => {
  return axiosInstance.post(
   "/admin/category",
    formInfo
  );
};
export const  handlePostCategoryImage = async (id, formInfo) => {
  return axiosInstance.put(
  `/admin/category/${id}`,
    formInfo
  );
};
