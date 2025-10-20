import axiosInstance from '../../store/axiosInstance';
import axios from 'axios';

/**
 * Calculate lease terms using backend service
 * @param {Object} params - Calculation parameters
 * @param {number} params.product_price - Product price
 * @param {number} params.down_payment_percentage - Down payment percentage
 * @param {number} params.lease_term_months - Lease term in months
 * @param {number} [params.custom_interest_rate] - Custom interest rate (optional)
 * @returns {Promise<Object>} - Calculation results
 */
export const calculateLease = async (params) => {
  // Use a no-logout client to avoid global 401 logout; still sends token
  const token = (await import('../../store/store')).useAuthStore.getState().token;
  const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  client.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  const { data } = await client.post('/api/lease-calculator', params);
  return data;
};

/**
 * Calculate lease terms for public use (no authentication required)
 * @param {Object} params - Calculation parameters
 * @param {number} params.product_price - Product price
 * @param {number} params.down_payment_percentage - Down payment percentage
 * @param {number} params.lease_term_months - Lease term in months
 * @param {number} [params.vendor_id] - Vendor ID (optional)
 * @returns {Promise<Object>} - Calculation results
 */
export const calculateLeasePublic = async (params) => {
  const { data } = await axiosInstance.post('/api/lease-calculator/public', params);
  return data;
};

/**
 * Get vendor's current interest rate
 * @returns {Promise<Object>} - Interest rate information
 */
export const getVendorInterestRate = async () => {
  const { data } = await axiosInstance.get('/api/lease-calculator/interest-rate');
  return data;
};
