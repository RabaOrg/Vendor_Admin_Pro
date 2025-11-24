import axiosInstance from "../../store/axiosInstance";

export const handleGetNotifications = async (page = 1, limit = 20, filters = {}) => {
  let url = `/api/admin/notifications/in-app?page=${page}&limit=${limit}`;
  
  if (filters.type) {
    url += `&type=${encodeURIComponent(filters.type)}`;
  }
  
  if (filters.is_read !== undefined) {
    url += `&is_read=${filters.is_read}`;
  }
  
  if (filters.related_entity_type) {
    url += `&related_entity_type=${encodeURIComponent(filters.related_entity_type)}`;
  }
  
  if (filters.related_entity_id) {
    url += `&related_entity_id=${filters.related_entity_id}`;
  }
  
  const { data } = await axiosInstance.get(url);
  
  // Return the notifications array directly
  return Array.isArray(data.data) ? data.data : [];
};

export const handleGetUnreadCount = async () => {
  const { data } = await axiosInstance.get(`/api/admin/notifications/in-app/unread-count`);
  
  return data.data;
};

export const handleGetNotificationCounts = async () => {
  const { data } = await axiosInstance.get(`/api/admin/notifications/in-app/counts`);
  
  return data.data;
};

export const handleMarkAsRead = async (notificationId) => {
  return axiosInstance.patch(
    `/api/admin/notifications/in-app/${notificationId}/read`
  );
};

export const handleMarkAllAsRead = async () => {
  return axiosInstance.patch(
    `/api/admin/notifications/in-app/read-all`
  );
};

export const handleDeleteNotification = async (notificationId) => {
  return axiosInstance.delete(
    `/api/admin/notifications/in-app/${notificationId}`
  );
};

