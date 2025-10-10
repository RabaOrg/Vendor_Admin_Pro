import React from 'react';
import { Card } from 'flowbite-react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, BarChart3 } from 'lucide-react';

const RevenueProjectionChart = ({ data, isLoading }) => {
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
          <DollarSign className="w-8 h-8 mx-auto mb-2" />
          <p>No revenue data available</p>
        </div>
      </Card>
    );
  }

  const { current_revenue, monthly_trends, projections } = data.data;
  const { 
    approved_revenue, 
    completed_revenue, 
    down_payment_revenue, 
    completed_down_payment_revenue,
    approved_count,
    completed_count,
    avg_deal_size,
    completion_rate 
  } = current_revenue;

  const { next_month, next_quarter, next_year, growth_rate } = projections;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGrowthIcon = (rate) => {
    return rate >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getGrowthColor = (rate) => {
    return rate >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics & Projections</h3>
        <div className="flex items-center space-x-2">
          {getGrowthIcon(growth_rate)}
          <span className={`text-sm font-medium ${getGrowthColor(growth_rate)}`}>
            {growth_rate >= 0 ? '+' : ''}{growth_rate}% Growth
          </span>
        </div>
      </div>

      {/* Current Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Approved Revenue</p>
              <p className="text-xl font-bold text-blue-700">{formatCurrency(approved_revenue)}</p>
              <p className="text-xs text-blue-600">{approved_count} deals</p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed Revenue</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(completed_revenue)}</p>
              <p className="text-xs text-green-600">{completed_count} deals</p>
            </div>
            <Target className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Down Payment Revenue</p>
              <p className="text-xl font-bold text-purple-700">{formatCurrency(down_payment_revenue)}</p>
              <p className="text-xs text-purple-600">Immediate cash flow</p>
            </div>
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Avg Deal Size</p>
              <p className="text-xl font-bold text-orange-700">{formatCurrency(avg_deal_size)}</p>
              <p className="text-xs text-orange-600">Per application</p>
            </div>
            <TrendingUp className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Revenue Projections */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Projections</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Next Month</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(next_month)}</p>
                <p className="text-xs text-blue-600">Projected revenue</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Next Quarter</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(next_quarter)}</p>
                <p className="text-xs text-green-600">3-month projection</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Next Year</p>
                <p className="text-2xl font-bold text-purple-700">{formatCurrency(next_year)}</p>
                <p className="text-xs text-purple-600">Annual projection</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      {monthly_trends && monthly_trends.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Revenue Trends</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {monthly_trends.slice(0, 6).map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {new Date(month.month).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(month.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {month.approved_count} approved • {month.completed_count} completed
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(month.approved_revenue)}</p>
                  <p className="text-sm text-green-600">{formatCurrency(month.completed_revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${completion_rate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{completion_rate}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue Growth Rate</span>
              <span className={`text-sm font-medium ${getGrowthColor(growth_rate)}`}>
                {growth_rate >= 0 ? '+' : ''}{growth_rate}%
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Down Payment Rate</span>
              <span className="font-medium text-gray-900">
                {approved_revenue > 0 ? Math.round((down_payment_revenue / approved_revenue) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Revenue Efficiency</span>
              <span className="font-medium text-gray-900">
                {completed_revenue > 0 ? Math.round((completed_revenue / approved_revenue) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RevenueProjectionChart;
