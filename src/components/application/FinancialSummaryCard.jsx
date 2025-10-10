import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatPercentage } from "../../utils/formatters";

const FinancialSummaryCard = ({
  financialData,
  className = '',
}) => {
  if (!financialData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          No financial data available
        </div>
      </div>
    );
  }

  const {
    displayPrice,
    managementFee,
    totalWithManagementFee,
    downPayment,
    downPaymentPercent,
    financedAmount,
    interestRate,
    totalInterest,
    monthlyPayment,
    leaseTermMonths,
    leaseTenureUnit,
  } = financialData;

  const financialItems = [
    {
      key: 'displayPrice',
      label: 'Product Price',
      value: displayPrice,
      type: 'currency',
      highlight: true,
    },
    {
      key: 'managementFee',
      label: 'Management Fee',
      value: managementFee,
      type: 'currency',
      subtitle: '5%',
    },
    {
      key: 'totalWithManagementFee',
      label: 'Total with Management Fee',
      value: totalWithManagementFee,
      type: 'currency',
      highlight: true,
    },
    {
      key: 'downPayment',
      label: 'Down Payment',
      value: downPayment,
      type: 'currency',
      subtitle: downPaymentPercent ? `${downPaymentPercent}%` : null,
      highlight: true,
    },
    {
      key: 'financedAmount',
      label: 'Financed Amount',
      value: financedAmount,
      type: 'currency',
      highlight: true,
    },
    {
      key: 'interestRate',
      label: 'Interest Rate',
      value: interestRate,
      type: 'percentage',
    },
    {
      key: 'totalInterest',
      label: 'Total Interest',
      value: totalInterest,
      type: 'currency',
    },
    {
      key: 'leaseTerm',
      label: 'Lease Tenure',
      value: leaseTermMonths,
      type: 'tenure',
      unit: leaseTenureUnit,
    },
    {
      key: 'monthlyPayment',
      label: 'Monthly Repayment',
      value: monthlyPayment,
      type: 'currency',
      highlight: true,
      subtitle: '/month',
    },
  ];

  const renderValue = (item) => {
    const { value, type, subtitle } = item;
    
    if (!value && value !== 0) {
      return <span className="text-gray-400 italic">N/A</span>;
    }

    let formattedValue;
    switch (type) {
      case 'currency':
        formattedValue = formatCurrency(value);
        break;
      case 'percentage':
        formattedValue = formatPercentage(value);
        break;
      case 'tenure':
        formattedValue = `${value} ${item.unit || 'months'}`;
        break;
      default:
        formattedValue = value;
    }

    return (
      <div className="flex items-center space-x-2">
        <span className={item.highlight ? 'text-lg font-semibold text-gray-900' : 'text-base text-gray-900'}>
          {formattedValue}
        </span>
        {subtitle && (
          <span className="text-sm text-gray-500">{subtitle}</span>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Financial Breakdown</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialItems.map((item) => (
          <div key={item.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              {item.label}
            </label>
            <div className={`p-3 rounded-lg ${
              item.highlight 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              {renderValue(item)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-medium text-blue-800 mb-1">Total Investment</div>
          <div className="text-lg font-semibold text-blue-900">
            {formatCurrency(totalWithManagementFee)}
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-800 mb-1">Down Payment</div>
          <div className="text-lg font-semibold text-yellow-900">
            {formatCurrency(downPayment)}
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-sm font-medium text-green-800 mb-1">Monthly Payment</div>
          <div className="text-lg font-semibold text-green-900">
            {formatCurrency(monthlyPayment)}
          </div>
        </div>
      </div>
    </div>
  );
};

FinancialSummaryCard.propTypes = {
  financialData: PropTypes.shape({
    displayPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    managementFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalWithManagementFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    downPayment: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    downPaymentPercent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    financedAmount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    interestRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalInterest: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    monthlyPayment: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    leaseTermMonths: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    leaseTenureUnit: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default FinancialSummaryCard;
