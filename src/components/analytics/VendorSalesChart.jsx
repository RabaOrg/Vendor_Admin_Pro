import React from 'react';
import { Card } from 'flowbite-react';
import { TrendingUp, TrendingDown, Store, DollarSign, Users, BarChart3 } from 'lucide-react';

const VendorSalesChart = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!data?.data) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <Store className="w-8 h-8 mx-auto mb-2" />
          <p>No vendor sales data available</p>
        </div>
      </Card>
    );
  }

  const { vendor_sales, daily_trends, summary } = data.data;
  const { 
    total_active_vendors, 
    total_sales_value, 
    total_completed_value, 
    average_deal_size, 
    average_approval_rate 
  } = summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Vendor Sales Overview</h3>
        <div className="flex items-center space-x-2">
          <Store className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">{total_active_vendors} Active Vendors</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Sales Value</p>
              <p className="text-xl font-bold text-blue-700">{formatCurrency(total_sales_value)}</p>
            </div>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Completed Value</p>
              <p className="text-xl font-bold text-green-700">{formatCurrency(total_completed_value)}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Avg Deal Size</p>
              <p className="text-xl font-bold text-purple-700">{formatCurrency(average_deal_size)}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Avg Approval Rate</p>
              <p className="text-xl font-bold text-orange-700">{average_approval_rate}%</p>
            </div>
            <Users className="w-6 h-6 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Top Vendors */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Performing Vendors</h4>
        <div className="space-y-3">
          {vendor_sales.slice(0, 8).map((vendor, index) => (
            <div key={vendor.vendor_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{vendor.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getVerificationBadge(vendor.verification_status)}`}>
                      {vendor.verification_status}
                    </span>
                    <span className="text-xs text-gray-500">{vendor.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-gray-900">{vendor.total_applications}</p>
                  <p className="text-xs text-gray-500">Applications</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{vendor.approved_applications}</p>
                  <p className="text-xs text-gray-500">Approved</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">{formatCurrency(vendor.total_sales_value)}</p>
                  <p className="text-xs text-gray-500">Sales Value</p>
                </div>
                <div className="text-center">
                  <span className={`font-medium ${getPerformanceColor(vendor.approval_rate)}`}>
                    {vendor.approval_rate}%
                  </span>
                  <p className="text-xs text-gray-500">Approval Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Sales Trends */}
      {daily_trends && daily_trends.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Sales Trends</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {daily_trends.slice(0, 7).map((trend, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {new Date(trend.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900">{trend.applications_count} applications</span>
                  <span className="text-green-600 font-medium">{formatCurrency(trend.daily_sales_value)}</span>
                  <span className="text-blue-600">{trend.approved_count} approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top Vendor Sales</span>
              <span className="font-medium text-gray-900">
                {vendor_sales.length > 0 ? formatCurrency(vendor_sales[0].total_sales_value) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium text-gray-900">
                {total_sales_value > 0 ? Math.round((total_completed_value / total_sales_value) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Verified Vendors</span>
              <span className="font-medium text-gray-900">
                {vendor_sales.filter(v => v.verification_status === 'verified').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Applications/Vendor</span>
              <span className="font-medium text-gray-900">
                {vendor_sales.length > 0 
                  ? Math.round(vendor_sales.reduce((sum, vendor) => sum + vendor.total_applications, 0) / vendor_sales.length)
                  : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VendorSalesChart;
