import axiosInstance from "../../store/axiosInstance";

export const handleInsights = async ({ period = '30days', startDate, endDate } = {}) => {
  let url = "/api/admin/dashboard/health";
  
  
  if (period !== '30days') {
    if (period === 'custom') {
      if (!startDate || !endDate) {
        throw new Error("Please provide both startDate and endDate for a custom range.");
      }
      url += `?start_date=${startDate}&end_date=${endDate}`;
    } else {
     
      url += `?period=${period}`;
    }
  }

  const { data } = await axiosInstance.get(url);
  return data;
}
export const handleGetAnalytics = async () => {
     const  data  = await axiosInstance.get("/api/admin/dashboard/analytics?period=30");
     
    return data.data
}

export const handleGetRepaymentAnalytics = async ({ period = '30' } = {}) => {
  const { data } = await axiosInstance.get(`/api/admin/dashboard/repayment-analytics?period=${period}`);
  return data;
}

export const handleGetAgentAnalytics = async ({ period = '30' } = {}) => {
  const { data } = await axiosInstance.get(`/api/admin/dashboard/agent-analytics?period=${period}`);
  return data;
}

export const handleGetVendorSalesAnalytics = async ({ period = '30' } = {}) => {
  const { data } = await axiosInstance.get(`/api/admin/dashboard/vendor-sales-analytics?period=${period}`);
  return data;
}

export const handleGetRevenueAnalytics = async ({ period = '30' } = {}) => {
  const { data } = await axiosInstance.get(`/api/admin/dashboard/revenue-analytics?period=${period}`);
  return data;
}

