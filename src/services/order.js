import axiosInstance from "../../store/axiosInstance";

export const handleGetOrder = async () => {
     const { data } = await axiosInstance.get(`/api/admin/payments/transactions?page=1&limit=20`);
     
    return data.data
}

export const handleGetSingleOrder = async () => {
     const { data } = await axiosInstance.get(`/api/admin//payments/stats`);
     
    return data.data
}
export const handleUpdateOrders = async (id, formInfo) => {
     const { data } = await axiosInstance.put(`/admin/orders/${id}/status`, formInfo);
     
    return data.data
}
// export const handleGetOrderSummary = async () => {
//      const { data } = await axiosInstance.get("/orders/stats/summary");
     
//     return data
// }