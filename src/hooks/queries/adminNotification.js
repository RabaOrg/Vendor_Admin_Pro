import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  handleGetNotifications, 
  handleGetUnreadCount, 
  handleGetNotificationCounts,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleDeleteNotification
} from "../../services/adminNotification";

export const useFetchAdminNotifications = (page = 1, limit = 20, filters = {}) => {
  return useQuery({
    queryFn: () => handleGetNotifications(page, limit, filters),
    queryKey: ["adminNotifications", page, limit, filters],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useFetchUnreadCount = () => {
  return useQuery({
    queryFn: () => handleGetUnreadCount(),
    queryKey: ["adminUnreadCount"],
    refetchInterval: 30000, // Refetch every 30 seconds (same as other endpoints)
  });
};

export const useFetchNotificationCounts = () => {
  return useQuery({
    queryFn: () => handleGetNotificationCounts(),
    queryKey: ["adminNotificationCounts"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleMarkAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
      queryClient.invalidateQueries(["adminUnreadCount"]);
      queryClient.invalidateQueries(["adminNotificationCounts"]);
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleMarkAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
      queryClient.invalidateQueries(["adminUnreadCount"]);
      queryClient.invalidateQueries(["adminNotificationCounts"]);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: handleDeleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["adminNotifications"]);
      queryClient.invalidateQueries(["adminUnreadCount"]);
      queryClient.invalidateQueries(["adminNotificationCounts"]);
    },
  });
};

