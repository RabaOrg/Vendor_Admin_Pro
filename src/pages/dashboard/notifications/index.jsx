import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
import { useFetchAdminNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from '../../../hooks/queries/adminNotification';
import { toast } from 'react-toastify';
import Button from '../../../components/shared/button';

function AdminNotifications() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [filters, setFilters] = useState({
    is_read: undefined,
    type: '',
    related_entity_type: ''
  });

  const { data: notificationsData, isLoading, refetch } = useFetchAdminNotifications(page, limit, filters);
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead.mutateAsync(notificationId);
      toast.success('Notification marked as read');
      refetch();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
      toast.success('All notifications marked as read');
      refetch();
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification.mutateAsync(notificationId);
        toast.success('Notification deleted');
        refetch();
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2 text-sm">Manage and view all system notifications</p>
        </div>
        {notifications.filter(n => !n.is_read).length > 0 && (
          <Button
            label="Mark All as Read"
            onClick={handleMarkAllAsRead}
            variant="solid"
            size="md"
            className="bg-green-700 text-white"
            icon={<CheckCheck className="w-4 h-4" />}
            loading={markAllAsRead.isPending}
          />
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.is_read === undefined ? 'all' : filters.is_read ? 'read' : 'unread'}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('is_read', value === 'all' ? undefined : value === 'read');
            }}
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="new_customer">New Customer</option>
            <option value="new_vendor">New Vendor</option>
            <option value="new_application">New Application</option>
            <option value="application_status_change">Status Change</option>
            <option value="application_approved">Application Approved</option>
            <option value="application_rejected">Application Rejected</option>
            <option value="customer_created_marketplace">Customer from Marketplace</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.related_entity_type || 'all'}
            onChange={(e) => handleFilterChange('related_entity_type', e.target.value)}
          >
            <option value="all">All Entities</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="application">Application</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          New
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {getTypeLabel(notification.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatDate(notification.created_at)}</span>
                      {notification.related_entity_type && notification.related_entity_id && (
                        <span>
                          {notification.related_entity_type} #{notification.related_entity_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {page}</span>
            <button
              onClick={() => setPage(prev => prev + 1)}
              disabled={notifications.length < limit}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNotifications;

