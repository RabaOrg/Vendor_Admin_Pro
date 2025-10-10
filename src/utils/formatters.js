/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a number as Nigerian Naira currency
 * @param {number|string} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., ₦1,820,000.00)
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₦0.00';
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '₦0.00';
  
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Format a number as percentage
 * @param {number|string} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string (e.g., 50.00%)
 */
export const formatPercentage = (value, decimals = 2) => {
  if (!value && value !== 0) return '0.00%';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0.00%';
  
  return `${numValue.toFixed(decimals)}%`;
};

/**
 * Format a date string consistently
 * @param {string|Date} dateString - The date to format
 * @param {string} format - Format type ('short', 'long', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const options = {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    datetime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  };
  
  return new Intl.DateTimeFormat('en-NG', options[format] || options.short).format(date);
};

/**
 * Format lease tenure as readable text
 * @param {number|string} value - The tenure value
 * @param {string} unit - The tenure unit (month, week, etc.)
 * @returns {string} Formatted tenure string (e.g., "6 months")
 */
export const formatTenure = (value, unit) => {
  if (!value && value !== 0) return 'N/A';
  
  const numValue = typeof value === 'string' ? parseInt(value) : value;
  
  if (isNaN(numValue)) return 'N/A';
  
  const unitText = numValue === 1 ? unit : `${unit}s`;
  return `${numValue} ${unitText}`;
};

/**
 * Format Nigerian phone number
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Handle Nigerian phone numbers
  if (cleaned.startsWith('234') && cleaned.length === 12) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234${cleaned.substring(1)}`;
  } else if (cleaned.length === 10 && ['7', '8', '9'].includes(cleaned[0])) {
    return `+234${cleaned}`;
  }
  
  return phone; // Return original if can't format
};

/**
 * Format file size in human readable format
 * @param {number|string} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "2.1 MB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return 'N/A';
  
  const numBytes = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  
  if (isNaN(numBytes) || numBytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  
  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Get status badge color classes
 * @param {string} status - The status string
 * @returns {string} Tailwind CSS classes for status badge
 */
export const getStatusBadgeClasses = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  
  switch (status.toLowerCase()) {
    case 'approved':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'submitted':
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'in_review':
    case 'pending':
    case 'awaiting_downpayment':
    case 'awaiting_delivery':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return 'N/A';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Check if a value is empty or null
 * @param {any} value - Value to check
 * @returns {boolean} True if value is empty/null
 */
export const isEmpty = (value) => {
  return value === null || value === undefined || value === '' || 
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0);
};
