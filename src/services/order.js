import axiosInstance from "../../store/axiosInstance";

export const handleGetOrder = async () => {
     const { data } = await axiosInstance.get(`/admin/orders`);
     
    return data.data
}

export const handleGetSingleOrder = async (id) => {
     const { data } = await axiosInstance.get(`/admin/orders/${id}`);
     
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