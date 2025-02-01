import axiosInstance from "../../store/axiosInstance";
export const handleGetAllTrnsaction = async (start_date, end_date, page, perPage) => {
   
    const { data } = await axiosInstance.get(`/admin/transaction?start_date=${start_date}&end_date=${end_date}&page=${page}&perPage=${perPage}`);
    
    return data.data
}
export const handleGetTrnsaction = async ( page, perPage) => {
   
    const { data } = await axiosInstance.get(`/admin/transaction?page=${page}&perPage=${perPage}`);
    
    return data.data
}
