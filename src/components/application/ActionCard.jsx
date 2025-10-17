import React from 'react';

// Simple formatDate function
const formatDate = (dateString, format = 'short') => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (format === 'short') {
    return date.toLocaleDateString();
  }
  return date.toLocaleString();
};

// Simple Button component
const Button = ({ children, onClick, className = '', size = 'md', variant = 'primary', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    transparent: 'text-gray-600 hover:text-gray-800'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const ActionCard = ({ action, onStatusUpdate }) => {
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'customer_responded':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionTypeBadgeClasses = (type) => {
    switch (type) {
      case 'document_request':
        return 'bg-purple-100 text-purple-800';
      case 'data_correction':
        return 'bg-orange-100 text-orange-800';
      case 'mixed':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionTypeBadgeClasses(action.action_type)}`}>
            {action.action_type.replace('_', ' ').toUpperCase()}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(action.status)}`}>
            {action.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(action.created_at, 'short')}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-medium text-gray-900 mb-2">Requested Items:</h4>
        <ul className="space-y-1">
          {action.requested_items?.map((item, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.required ? 'bg-red-500' : 'bg-gray-400'}`}></span>
              <span className="font-medium">{item.name}</span>
              {item.required && <span className="text-red-500 text-xs">(Required)</span>}
            </li>
          ))}
        </ul>
      </div>

      {action.admin_notes && (
        <div className="mb-3">
          <h4 className="font-medium text-gray-900 mb-1">Admin Notes:</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{action.admin_notes}</p>
        </div>
      )}

      {action.customer_notes && (
        <div className="mb-3">
          <h4 className="font-medium text-gray-900 mb-1">Customer Notes:</h4>
          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">{action.customer_notes}</p>
        </div>
      )}

      {action.responses && action.responses.length > 0 && (
        <div className="mb-3">
          <h4 className="font-medium text-gray-900 mb-2">Customer Responses:</h4>
          <div className="space-y-2">
            {action.responses.map((response, index) => (
              <div key={index} className="bg-green-50 p-2 rounded text-sm">
                <div className="font-medium text-green-800">{response.item_key}</div>
                <div className="text-green-600">
                  {response.response_type === 'document_upload' ? 'Document uploaded' : 'Data updated'}
                </div>
                <div className="text-xs text-green-500">
                  {formatDate(response.submitted_at, 'short')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div>
          Created by: {action.creator?.first_name} {action.creator?.last_name}
        </div>
        {action.expires_at && (
          <div>
            Expires: {formatDate(action.expires_at, 'short')}
          </div>
        )}
      </div>

      {action.status === 'pending' && onStatusUpdate && (
        <div className="mt-3 flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onStatusUpdate(action.id, 'resolved')}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Mark as Resolved
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onStatusUpdate(action.id, 'cancelled')}
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionCard;
