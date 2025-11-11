import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, ArrowLeft, ExternalLink } from 'lucide-react';
import axiosInstance from '../../../../store/axiosInstance';
import { toast } from 'react-toastify';

function SmsLinkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [smsLink, setSmsLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSmsLinkDetails();
  }, [id]);

  const fetchSmsLinkDetails = async () => {
    try {
      setLoading(true);
      // Fetch from the applications endpoint with include_sms_links
      const { data } = await axiosInstance.get(`/api/admin/applications?include_sms_links=true&limit=1000`);
      
      // Find the SMS link with matching link_id
      const foundLink = data.data?.find(item => 
        item.is_sms_link && item.link_id === id
      );
      
      if (foundLink) {
        setSmsLink(foundLink);
      } else {
        toast.error('SMS link not found');
        navigate('/application');
      }
    } catch (error) {
      console.error('Error fetching SMS link details:', error);
      toast.error('Failed to load SMS link details');
      navigate('/application');
    } finally {
      setLoading(false);
    }
  };

  const getApplicationUrl = () => {
    if (!smsLink?.token) return '';
    // Use the API base URL and construct the customer-facing application URL
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin;
    return `${baseUrl}/application/${smsLink.token}`;
  };

  const handleCopyUrl = async () => {
    const url = getApplicationUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy URL');
    }
  };

  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'pending_customer_completion':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Loading SMS link details...</p>
        </div>
      </div>
    );
  }

  if (!smsLink) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">SMS link not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/application')}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Applications
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Title Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                SMS Application Link Details
              </h1>
              <p className="text-blue-100">Reference: {smsLink.reference || `SMS-${smsLink.link_id}`}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusBadgeClasses(smsLink.status)}`}>
              {smsLink.status?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Application URL Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              Application URL
            </h2>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 flex items-center">
                <code className="flex-1 text-sm text-gray-700 break-all">
                  {getApplicationUrl()}
                </code>
              </div>
              <button
                onClick={handleCopyUrl}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Vendor Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Vendor Name</label>
                  <p className="text-gray-800">{smsLink.vendor?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Business Name</label>
                  <p className="text-gray-800">{smsLink.vendor?.business_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <p className="text-gray-800">{smsLink.vendor?.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Vendor ID</label>
                  <p className="text-gray-800">{smsLink.vendor?.id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Recipient Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Customer Name</label>
                  <p className="text-gray-800">{smsLink.customer?.name || 'Pending Customer'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <p className="text-gray-800">{smsLink.customer?.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <p className="text-gray-800">{smsLink.customer?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Customer ID</label>
                  <p className="text-gray-800">{smsLink.customer?.id || 'Pending'}</p>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                  <p className="text-gray-800">{smsLink.product?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                  <p className="text-gray-800">
                    {smsLink.product?.price || smsLink.amount 
                      ? `₦${Number(smsLink.product?.price || smsLink.amount).toLocaleString()}` 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <p className="text-gray-800">{smsLink.product?.category || 'Custom'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Product ID</label>
                  <p className="text-gray-800">{smsLink.product?.id || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Application Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Application ID</label>
                  <p className="text-gray-800">{smsLink.id || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Reference</label>
                  <p className="text-gray-800">{smsLink.reference || `SMS-${smsLink.link_id}`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Link ID</label>
                  <p className="text-gray-800">{smsLink.link_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Application Type</label>
                  <p className="text-gray-800">{smsLink.application_type || 'sms_link'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
                  <p className="text-gray-800">
                    {smsLink.amount ? `₦${Number(smsLink.amount).toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                  <p className="text-gray-800">{formatDate(smsLink.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Expires At</label>
                  <p className="text-gray-800">{formatDate(smsLink.expires_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsLinkDetails;

