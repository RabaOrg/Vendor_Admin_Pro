import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { handleRecalculateApplication, handleApplyRecalculation } from '../../services/loans';

const RecalculationModal = ({ 
  isOpen, 
  onClose, 
  application, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    newProductPrice: '',
    newDownPayment: '',
    newDownPaymentType: 'amount', // 'percentage' or 'amount'
    newInterestRate: '',
    newLeaseTenure: ''
  });
  
  const [originalData, setOriginalData] = useState({
    newProductPrice: '',
    newDownPayment: '',
    newDownPaymentType: 'amount',
    newInterestRate: '',
    newLeaseTenure: ''
  });
  
  const [recalculatedData, setRecalculatedData] = useState(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Initialize form data when application changes
  useEffect(() => {
    if (application && isOpen) {
      const initialData = {
        newProductPrice: application.amount || '',
        newDownPayment: application.down_payment_amount || '',
        newDownPaymentType: 'amount',
        newInterestRate: application.interest_rate || '',
        newLeaseTenure: application.lease_tenure || ''
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setRecalculatedData(null);
    }
  }, [application, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get only changed values
  const getChangedValues = () => {
    const changedValues = {};
    
    if (formData.newProductPrice !== originalData.newProductPrice) {
      changedValues.newProductPrice = formData.newProductPrice;
    }
    if (formData.newDownPayment !== originalData.newDownPayment) {
      changedValues.newDownPayment = formData.newDownPayment;
    }
    if (formData.newDownPaymentType !== originalData.newDownPaymentType) {
      changedValues.newDownPaymentType = formData.newDownPaymentType;
    }
    if (formData.newInterestRate !== originalData.newInterestRate) {
      changedValues.newInterestRate = formData.newInterestRate;
    }
    if (formData.newLeaseTenure !== originalData.newLeaseTenure) {
      changedValues.newLeaseTenure = formData.newLeaseTenure;
    }
    
    return changedValues;
  };

  // Format number with delimiters
  const formatNumberWithDelimiters = (value) => {
    if (!value) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return number.toLocaleString('en-US');
  };

  // Parse number from delimited string
  const parseNumberFromDelimited = (value) => {
    if (!value) return '';
    return value.replace(/,/g, '');
  };

  const handleRecalculate = async () => {
    const changedValues = getChangedValues();
    
    if (Object.keys(changedValues).length === 0) {
      toast.error('Please modify at least one value before recalculating');
      return;
    }

    setIsRecalculating(true);
    try {
      // Convert delimited values back to numbers for API
      const apiData = {};
      Object.keys(changedValues).forEach(key => {
        if (key === 'newProductPrice' || key === 'newDownPayment') {
          apiData[key] = parseNumberFromDelimited(changedValues[key]);
        } else {
          apiData[key] = changedValues[key];
        }
      });
      
      // Always include newDownPaymentType when newDownPayment is provided
      if (apiData.newDownPayment !== undefined) {
        apiData.newDownPaymentType = formData.newDownPaymentType;
      }

      const response = await handleRecalculateApplication(application.id, apiData);
      setRecalculatedData(response.data);
      toast.success('Application recalculated successfully');
    } catch (error) {
      console.error('Error recalculating application:', error);
      toast.error(error.response?.data?.message || 'Failed to recalculate application');
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!recalculatedData) {
      toast.error('Please recalculate first before applying changes');
      return;
    }

    const changedValues = getChangedValues();
    
    if (Object.keys(changedValues).length === 0) {
      toast.error('No changes to apply');
      return;
    }

    setIsApplying(true);
    try {
      // Convert delimited values back to numbers for API
      const apiData = {};
      Object.keys(changedValues).forEach(key => {
        if (key === 'newProductPrice' || key === 'newDownPayment') {
          apiData[key] = parseNumberFromDelimited(changedValues[key]);
        } else {
          apiData[key] = changedValues[key];
        }
      });
      
      // Always include newDownPaymentType when newDownPayment is provided
      if (apiData.newDownPayment !== undefined) {
        apiData.newDownPaymentType = formData.newDownPaymentType;
      }

      await handleApplyRecalculation(application.id, apiData);
      toast.success('Changes applied successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error(error.response?.data?.message || 'Failed to apply changes');
    } finally {
      setIsApplying(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recalculate Application</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Values</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Price (₦)
                  {formData.newProductPrice !== originalData.newProductPrice && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Modified</span>
                  )}
                </label>
                <input
                  type="text"
                  name="newProductPrice"
                  value={formatNumberWithDelimiters(formData.newProductPrice)}
                  onChange={(e) => {
                    const rawValue = parseNumberFromDelimited(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      newProductPrice: rawValue
                    }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    formData.newProductPrice !== originalData.newProductPrice 
                      ? 'border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter product price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                  {formData.newDownPayment !== originalData.newDownPayment && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Modified</span>
                  )}
                </label>
                <div className="flex space-x-2 mb-2">
                  <select
                    name="newDownPaymentType"
                    value={formData.newDownPaymentType}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="amount">Amount (₦)</option>
                  </select>
                  <input
                    type="text"
                    name="newDownPayment"
                    value={formatNumberWithDelimiters(formData.newDownPayment)}
                    onChange={(e) => {
                      const rawValue = parseNumberFromDelimited(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        newDownPayment: rawValue
                      }));
                    }}
                    className={`flex-grow border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                      formData.newDownPayment !== originalData.newDownPayment 
                        ? 'border-blue-500 focus:ring-blue-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder={formData.newDownPaymentType === 'percentage' ? 'e.g., 20' : 'e.g., 200,000'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                  {formData.newInterestRate !== originalData.newInterestRate && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Modified</span>
                  )}
                </label>
                <input
                  type="number"
                  name="newInterestRate"
                  value={formData.newInterestRate}
                  onChange={handleInputChange}
                  step="0.1"
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    formData.newInterestRate !== originalData.newInterestRate 
                      ? 'border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter interest rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Tenure (Months)
                  {formData.newLeaseTenure !== originalData.newLeaseTenure && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Modified</span>
                  )}
                </label>
                <input
                  type="number"
                  name="newLeaseTenure"
                  value={formData.newLeaseTenure}
                  onChange={handleInputChange}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    formData.newLeaseTenure !== originalData.newLeaseTenure 
                      ? 'border-blue-500 focus:ring-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter lease tenure"
                />
              </div>

              <button
                onClick={handleRecalculate}
                disabled={isRecalculating || Object.keys(getChangedValues()).length === 0}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isRecalculating ? 'Recalculating...' : 'Recalculate'}
              </button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Recalculated Results</h3>
              
              {recalculatedData ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Financed Amount</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency(Number(recalculatedData.financedAmount) || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Down Payment</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency(Number(recalculatedData.downPayment) || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Repayment</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency(Number(recalculatedData.monthlyRepayment) || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Management Fee</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency(Number(recalculatedData.managementFee) || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Lease Value</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {formatCurrency(Number(recalculatedData.totalLeaseValue) || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {Number(recalculatedData.interestRate) || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Lease Tenure</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {recalculatedData.leaseTenure || 0} {recalculatedData.leaseTenureUnit || 'months'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Down Payment %</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {recalculatedData.downPaymentPercentage ? Number(recalculatedData.downPaymentPercentage).toFixed(1) : '0.0'}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleApplyChanges}
                    disabled={isApplying}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isApplying ? 'Applying Changes...' : 'Apply Changes'}
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500">Click &quot;Recalculate&quot; to see updated values</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

RecalculationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  application: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    down_payment_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    interest_rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lease_tenure: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onSuccess: PropTypes.func
};

export default RecalculationModal;
