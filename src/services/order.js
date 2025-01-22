import axiosInstance from "../../store/axiosInstance";

export const handleGetOrder = async () => {
     const { data } = await axiosInstance.get(`/admin/orders`);
     
    return data.data
}
// export const handleGetOrderSummary = async () => {
//      const { data } = await axiosInstance.get("/orders/stats/summary");
     
//     return data
// }