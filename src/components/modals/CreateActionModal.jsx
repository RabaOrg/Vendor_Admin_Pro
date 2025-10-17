import React, { useState } from 'react';

// Simple Button component
const Button = ({ children, onClick, className = '', size = 'md', variant = 'primary', disabled = false, type = 'button' }) => {
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
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const CreateActionModal = ({ isOpen, onClose, onSubmit, applicationId }) => {
  const [formData, setFormData] = useState({
    requested_items: [],
    admin_notes: '',
    expires_at: ''
  });

  const predefinedActionTypes = [
    { key: 'address_verification', name: 'Address Verification Report', type: 'document', description: 'Upload address verification document' },
    { key: 'cheques', name: 'Cheques', type: 'document', description: 'Upload cheque images or documents' },
    { key: 'guarantor_bank_statement', name: 'Guarantor Bank Statement', type: 'document', description: 'Upload guarantor bank statement' },
    { key: 'guarantor_id_card', name: 'Guarantor ID Card', type: 'document', description: 'Upload guarantor ID card' },
    { key: 'customer_id_card', name: 'Customer ID Card', type: 'document', description: 'Upload customer ID card' },
    { key: 'customer_bank_statement', name: 'Customer Bank Statement', type: 'document', description: 'Upload customer bank statement' },
    { key: 'business_info_correction', name: 'Business Info Correction', type: 'field', description: 'Correct business information', field_type: 'application_data', field_name: 'business_name' },
    { key: 'guarantor_info_correction', name: 'Guarantor Info Correction', type: 'field', description: 'Correct guarantor information', field_type: 'guarantor_field', field_name: 'name' },
    { key: 'others', name: 'Others', type: 'document', description: 'Other document or information' }
  ];

  const handleActionTypeToggle = (actionType) => {
    setFormData(prev => {
      const isSelected = prev.requested_items.some(item => item.item_key === actionType.key);
      
      if (isSelected) {
        return {
          ...prev,
          requested_items: prev.requested_items.filter(item => item.item_key !== actionType.key)
        };
      } else {
        return {
          ...prev,
          requested_items: [
            ...prev.requested_items,
            {
              item_key: actionType.key,
              name: actionType.name,
              type: actionType.type,
              description: actionType.description,
              required: true,
              field_type: actionType.field_type,
              field_name: actionType.field_name
            }
          ]
        };
      }
    });
  };

  const handleItemChange = (itemKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      requested_items: prev.requested_items.map(item =>
        item.item_key === itemKey ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.requested_items.length === 0) {
      alert('Please select at least one action type');
      return;
    }
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      requested_items: [],
      admin_notes: '',
      expires_at: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Action Request</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Select Action Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predefinedActionTypes.map(actionType => {
                const isSelected = formData.requested_items.some(item => item.item_key === actionType.key);
                return (
                  <div
                    key={actionType.key}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleActionTypeToggle(actionType)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleActionTypeToggle(actionType)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{actionType.name}</div>
                        <div className="text-xs text-gray-600">{actionType.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {formData.requested_items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Selected Items</h3>
              <div className="space-y-3">
                {formData.requested_items.map(item => (
                  <div key={item.item_key} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={item.required}
                            onChange={(e) => handleItemChange(item.item_key, 'required', e.target.checked)}
                            className="rounded"
                          />
                          Required
                        </label>
                      </div>
                    </div>
                    <textarea
                      placeholder="Add specific instructions for this item..."
                      value={item.description}
                      onChange={(e) => handleItemChange(item.item_key, 'description', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes
            </label>
            <textarea
              value={formData.admin_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
              placeholder="Add any additional notes or instructions..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="3"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiration Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formData.requested_items.length === 0}
            >
              Create Action Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActionModal;
