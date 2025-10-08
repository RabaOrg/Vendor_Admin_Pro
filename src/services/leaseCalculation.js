import axiosInstance from '../../store/axiosInstance';

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
  const { data } = await axiosInstance.post('/api/lease-calculator', params);
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
