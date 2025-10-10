import React from 'react';
import { Card } from 'flowbite-react';
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle } from 'lucide-react';

const RepaymentStatusChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!data?.data) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p>No repayment data available</p>
        </div>
      </Card>
    );
  }

  const { repayment_summary, daily_trends } = data.data;
  const { 
    total_schedules, 
    paid_installments, 
    pending_installments, 
    overdue_installments,
    total_paid_amount,
    total_pending_amount,
    total_overdue_amount,
    payment_rate 
  } = repayment_summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Repayment Status Overview</h3>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">{payment_rate}% Payment Rate</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Paid Installments</p>
              <p className="text-2xl font-bold text-green-700">{paid_installments}</p>
              <p className="text-xs text-green-600">{formatCurrency(total_paid_amount)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Installments</p>
              <p className="text-2xl font-bold text-yellow-700">{pending_installments}</p>
              <p className="text-xs text-yellow-600">{formatCurrency(total_pending_amount)}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue Installments</p>
              <p className="text-2xl font-bold text-red-700">{overdue_installments}</p>
              <p className="text-xs text-red-600">{formatCurrency(total_overdue_amount)}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Paid</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${total_schedules > 0 ? (paid_installments / total_schedules) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {total_schedules > 0 ? Math.round((paid_installments / total_schedules) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pending</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${total_schedules > 0 ? (pending_installments / total_schedules) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {total_schedules > 0 ? Math.round((pending_installments / total_schedules) * 100) : 0}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Overdue</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${total_schedules > 0 ? (overdue_installments / total_schedules) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {total_schedules > 0 ? Math.round((overdue_installments / total_schedules) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trends */}
      {daily_trends && daily_trends.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Payment Trends</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {daily_trends.slice(0, 7).map((trend, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(trend.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{trend.payments_count} payments</span>
                  <span className="text-green-600 font-medium">{formatCurrency(trend.total_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default RepaymentStatusChart;
