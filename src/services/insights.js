import axiosInstance from "../../store/axiosInstance";

export const handleInsights = async ({ period = '30days', startDate, endDate } = {}) => {
  let url = "/admin/insight";
  
  // For default 30 days, no query parameters are needed.
  if (period !== '30days') {
    if (period === 'custom') {
      if (!startDate || !endDate) {
        throw new Error("Please provide both startDate and endDate for a custom range.");
      }
      url += `?start_date=${startDate}&end_date=${endDate}`;
    } else {
      // For 90 days or lifetime scenarios.
      url += `?period=${period}`;
    }
  }

  const { data } = await axiosInstance.get(url);
  return data;
}
