import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { calculateLease, calculateLeasePublic } from '../../services/leaseCalculation';

const LeaseCalculatorModal = ({ 
  isOpen, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    productPrice: '',
    downPaymentType: 'percentage', // 'percentage' or 'amount'
    downPaymentValue: '',
    interestRate: '',
    leaseTenure: '',
    leaseTenureUnit: 'month'
  });
  
  const [calculatedData, setCalculatedData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculate = async () => {
    // Validation
    if (!formData.productPrice) {
      toast.error('Product price is required');
      return;
    }

    if (!formData.downPaymentValue) {
      toast.error('Down payment is required');
      return;
    }

    if (!formData.interestRate) {
      toast.error('Interest rate is required');
      return;
    }

    if (!formData.leaseTenure) {
      toast.error('Lease tenure is required');
      return;
    }

    setIsCalculating(true);

    try {
      const productPrice = parseFloat(parseNumberFromDelimited(formData.productPrice));
      const downPaymentValue = formData.downPaymentType === 'amount' ? 
        parseFloat(parseNumberFromDelimited(formData.downPaymentValue)) : 
        parseFloat(formData.downPaymentValue);
      // Note: interestRate input kept for UI parity, but public endpoint ignores it
      // const interestRate = parseFloat(formData.interestRate);
      const leaseTenure = parseInt(formData.leaseTenure);

      // Try AUTHENTICATED calculator first to support custom interest rate
      // If it fails due to auth, gracefully fall back to PUBLIC calculator
      let response;
      try {
        response = await calculateLease({
          product_price: productPrice,
          down_payment_value: downPaymentValue,
          down_payment_type: formData.downPaymentType,
          lease_term_months: leaseTenure,
          custom_interest_rate: parseFloat(formData.interestRate) || undefined
        });
      } catch {
        // Fallback: public endpoint (no custom interest rate support)
        const downPaymentPercentage = formData.downPaymentType === 'amount'
          ? (downPaymentValue / productPrice) * 100
          : downPaymentValue;
        response = await calculateLeasePublic({
          product_price: productPrice,
          down_payment_percentage: downPaymentPercentage,
          lease_term_months: leaseTenure,
          // Try to pass custom_interest_rate for servers that allow it on public path.
          custom_interest_rate: parseFloat(formData.interestRate) || undefined
        });
      }

      // Transform backend response to match frontend expectations
      const result = {
        productPrice: response.data.product_price,
        downPaymentAmount: response.data.down_payment_amount,
        downPaymentPercentage: response.data.down_payment_percentage,
        financedAmount: response.data.calculation_details.final_financed_amount,
        monthlyPayment: response.data.periodic_payment,
        totalLeaseValue: response.data.total_lease_cost,
        managementFee: response.data.calculation_details.management_fee,
        totalInterest: response.data.calculation_details.total_interest,
        interestRate: response.data.interest_rate,
        leaseTenure: leaseTenure,
        leaseTenureUnit: 'month',
        totalPayments: leaseTenure
      };

      setCalculatedData(result);
      toast.success('Lease calculation completed successfully');
    } catch (error) {
      console.error('Error calculating lease:', error);
      toast.error(error.response?.data?.message || 'Error calculating lease. Please check your inputs.');
    } finally {
      setIsCalculating(false);
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

  const resetForm = () => {
    setFormData({
      productPrice: '',
      downPaymentType: 'percentage',
      downPaymentValue: '',
      interestRate: '',
      leaseTenure: '',
      leaseTenureUnit: 'month'
    });
    setCalculatedData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Lease Calculator</h2>
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
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Lease Parameters</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Price (₦) *
                </label>
                <input
                  type="text"
                  name="productPrice"
                  value={formatNumberWithDelimiters(formData.productPrice)}
                  onChange={(e) => {
                    const rawValue = parseNumberFromDelimited(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      productPrice: rawValue
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment Type
                </label>
                <select
                  name="downPaymentType"
                  value={formData.downPaymentType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="amount">Amount (₦)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment {formData.downPaymentType === 'percentage' ? '(%)' : '(₦)'} *
                </label>
                <input
                  type="text"
                  name="downPaymentValue"
                  value={formData.downPaymentType === 'amount' ? 
                    formatNumberWithDelimiters(formData.downPaymentValue) : 
                    formData.downPaymentValue
                  }
                  onChange={(e) => {
                    const rawValue = formData.downPaymentType === 'amount' ? 
                      parseNumberFromDelimited(e.target.value) : 
                      e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      downPaymentValue: rawValue
                    }));
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.downPaymentType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%) *
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter interest rate"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lease Tenure *
                  </label>
                  <input
                    type="number"
                    name="leaseTenure"
                    value={formData.leaseTenure}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter tenure"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    name="leaseTenureUnit"
                    value={formData.leaseTenureUnit}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="month">Months</option>
                    <option value="day">Days</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isCalculating ? 'Calculating...' : 'Calculate Lease'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Calculation Results</h3>
              
              {calculatedData ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Product Price:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.productPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Management Fee (5%):</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.managementFee)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total with Management Fee:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.productPrice + calculatedData.managementFee)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Down Payment:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.downPaymentAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Down Payment %:</span>
                        <span className="font-semibold text-gray-800">
                          {calculatedData.downPaymentPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Financed Amount:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.financedAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Payment:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.monthlyPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Interest:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.totalInterest)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Lease Value:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(calculatedData.totalLeaseValue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lease Term:</span>
                        <span className="font-semibold text-gray-800">
                          {calculatedData.totalPayments} {calculatedData.leaseTenureUnit}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Interest Rate:</span>
                        <span className="font-semibold text-gray-800">
                          {calculatedData.interestRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-500">Enter lease parameters and click &quot;Calculate Lease&quot; to see results</p>
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
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LeaseCalculatorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default LeaseCalculatorModal;
