import axiosInstance from "../../store/axiosInstance";
export const handleInsights = async () => {
   
    const { data } = await axiosInstance.get("/admin/insight");
    
    return data
}
