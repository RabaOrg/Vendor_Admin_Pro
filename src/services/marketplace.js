import axiosInstance from '../store/axiosInstance';

// Marketplace Reviews API functions
export const handleGetMarketplaceReviews = async ({ page = 1, limit = 20, status, rating, dealer_id, search }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (status) params.append('status', status);
  if (rating) params.append('rating', rating);
  if (dealer_id) params.append('dealer_id', dealer_id);
  if (search) params.append('search', search);
  
  const { data } = await axiosInstance.get(
    `/api/admin/marketplace/reviews?${params.toString()}`
  );
  return data;
};

export const handleGetMarketplaceReviewStats = async () => {
  const { data } = await axiosInstance.get('/api/admin/marketplace/reviews/stats');
  return data;
};

export const handleGetMarketplaceReviewById = async (reviewId) => {
  const { data } = await axiosInstance.get(`/api/admin/marketplace/reviews/${reviewId}`);
  return data;
};

export const handleModerateReview = async (reviewId, action, adminNotes = null) => {
  const { data } = await axiosInstance.patch(
    `/api/admin/marketplace/reviews/${reviewId}/moderate`,
    { action, admin_notes: adminNotes }
  );
  return data;
};

export const handleDeleteReview = async (reviewId) => {
  const { data } = await axiosInstance.delete(`/api/admin/marketplace/reviews/${reviewId}`);
  return data;
};

// Categories API functions (using existing admin categories endpoint)
export const handleGetCategories = async ({ page = 1, limit = 20, search } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (search) params.append('search', search);
  
  const { data } = await axiosInstance.get(`/api/admin/categories?${params.toString()}`);
  return data;
};

export const handleCreateCategory = async (categoryData) => {
  const { data } = await axiosInstance.post('/api/admin/categories', categoryData);
  return data;
};

export const handleUpdateCategory = async (categoryId, categoryData) => {
  const { data } = await axiosInstance.put(`/api/admin/categories/${categoryId}`, categoryData);
  return data;
};

export const handleDeleteCategory = async (categoryId) => {
  const { data } = await axiosInstance.delete(`/api/admin/categories/${categoryId}`);
  return data;
};

// KYC Management API functions (using existing admin KYC endpoint)
export const handleGetKycUsers = async ({ page = 1, limit = 20, status, search } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  
  const { data } = await axiosInstance.get(`/api/admin/kyc/users?${params.toString()}`);
  return data;
};

export const handleGetKycUserDetails = async (userId) => {
  const { data } = await axiosInstance.get(`/api/admin/kyc/users/${userId}`);
  return data;
};

export const handleApproveKyc = async (userId) => {
  const { data } = await axiosInstance.patch(`/api/admin/kyc/users/${userId}/approve`);
  return data;
};

export const handleRejectKyc = async (userId) => {
  const { data } = await axiosInstance.patch(`/api/admin/kyc/users/${userId}/reject`);
  return data;
};

export const handleMoveKycToReview = async (userId) => {
  const { data } = await axiosInstance.patch(`/api/admin/kyc/users/${userId}/review`);
  return data;
};

// Eligibility Settings API functions (using existing admin user-eligibility endpoint)
export const handleGetEligibilitySettings = async () => {
  const { data } = await axiosInstance.get('/api/admin/user-eligibility');
  return data;
};

export const handleUpdateEligibilitySettings = async (settingsData) => {
  const { data } = await axiosInstance.put('/api/admin/user-eligibility', settingsData);
  return data;
};

export const handleGetEligibilityStats = async () => {
  const { data } = await axiosInstance.get('/api/admin/user-eligibility/stats');
  return data;
};

// Product Marketplace Status API functions
export const handleToggleProductMarketplaceStatus = async (productId, enabled) => {
  const { data } = await axiosInstance.patch(`/api/admin/products/${productId}/marketplace`, {
    marketplace_enabled: enabled
  });
  return data;
};

export const handleGetProductsByMarketplaceStatus = async ({ page = 1, limit = 20, marketplace_enabled, search } = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (marketplace_enabled !== undefined) params.append('marketplace_enabled', marketplace_enabled);
  if (search) params.append('search', search);
  
  const { data } = await axiosInstance.get(`/api/admin/products?${params.toString()}`);
  return data;
};
