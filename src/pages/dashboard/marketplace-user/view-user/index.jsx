import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../../../store/axiosInstance';

import Button from '../../../../components/shared/button';
import CollapsibleSection from '../../../../components/application/CollapsibleSection';
import InfoGrid from '../../../../components/application/InfoGrid';
import { useFetchMarketplaceUser } from '../../../../hooks/queries/marketplaceUser';
import { formatCurrency, formatDate, formatPhoneNumber, getStatusBadgeClasses } from '../../../../utils/formatters';
import { usePairedSections } from '../../../../hooks/usePairedSections';

import { 
  User, 
  Building2, 
  BarChart3, 
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

function MarketplaceUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: userData, isPending, isError, refetch } = useFetchMarketplaceUser(id);
  
  // Extract data
  const user = userData?.user;
  const applications = userData?.applications || [];
  const guarantors = userData?.guarantors || [];
  const stats = userData?.stats;

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'personal-info', pairedWith: 'kyc-eligibility', defaultExpanded: true },
    { id: 'kyc-eligibility', pairedWith: 'personal-info', defaultExpanded: true },
    { id: 'business-info', pairedWith: 'financial-info', defaultExpanded: false },
    { id: 'financial-info', pairedWith: 'business-info', defaultExpanded: false },
    { id: 'guarantor-info', pairedWith: 'documents', defaultExpanded: false },
    { id: 'documents', pairedWith: 'guarantor-info', defaultExpanded: false },
    { id: 'applications', pairedWith: 'statistics', defaultExpanded: true },
    { id: 'statistics', pairedWith: 'applications', defaultExpanded: true },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);

  const handleApproveApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to approve this application?')) {
      return;
    }

    try {
      await axiosInstance.patch(`/api/admin/applications/${applicationId}/status`, {
        status: 2, // approved status code
        notes: 'Approved from marketplace user details'
      });
      toast.success("Application approved successfully");
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error(error?.response?.data?.message || "Failed to approve application");
    }
  };

  const handleRejectApplication = async (applicationId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await axiosInstance.patch(`/api/admin/applications/${applicationId}/status`, {
        status: 1, // rejected status code
        notes: reason
      });
      toast.success("Application rejected successfully");
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(error?.response?.data?.message || "Failed to reject application");
    }
  };

  const handleApproveKYC = async () => {
    if (!window.confirm('Are you sure you want to approve this user\'s KYC?')) {
      return;
    }

    try {
      await axiosInstance.patch(`/api/admin/kyc/users/${id}/approve`, {
        notes: 'KYC approved from marketplace user details'
      });
      toast.success("KYC approved successfully");
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast.error(error?.response?.data?.message || "Failed to approve KYC");
    }
  };

  const handleRejectKYC = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      await axiosInstance.patch(`/api/admin/kyc/users/${id}/reject`, {
        notes: reason
      });
      toast.success("KYC rejected successfully");
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      toast.error(error?.response?.data?.message || "Failed to reject KYC");
    }
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/application-statistics/${applicationId}`);
  };

  const getKycStatusBadge = (status) => {
    const statusConfig = {
      'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
      'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
      'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      'incomplete': { class: 'bg-gray-100 text-gray-700', text: 'Incomplete' }
    };
    const config = statusConfig[status] || statusConfig['incomplete'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getUserStatusBadge = (userStatus) => {
    const statusConfig = {
      'has_active_lease': { class: 'bg-green-100 text-green-700', text: 'Active Lease' },
      'pending_application': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending Application' },
      'no_applications': { class: 'bg-gray-100 text-gray-700', text: 'No Applications' },
      'all_rejected': { class: 'bg-red-100 text-red-700', text: 'All Rejected' }
    };
    const config = statusConfig[userStatus] || statusConfig['no_applications'];
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getApplicationStatusBadge = (status) => {
    const statusMap = {
      0: { class: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      1: { class: 'bg-red-100 text-red-700', text: 'Rejected' },
      2: { class: 'bg-green-100 text-green-700', text: 'Approved' },
      3: { class: 'bg-blue-100 text-blue-700', text: 'Down Payment Paid' },
      4: { class: 'bg-purple-100 text-purple-700', text: 'Processing' },
      5: { class: 'bg-green-100 text-green-800', text: 'Active' },
      6: { class: 'bg-orange-100 text-orange-700', text: 'Awaiting Delivery' },
      7: { class: 'bg-red-100 text-red-600', text: 'Cancelled' },
      8: { class: 'bg-green-100 text-green-900', text: 'Completed' }
    };
    const config = statusMap[status] || { class: 'bg-gray-100 text-gray-700', text: 'Unknown' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  if (isPending) return <p className="text-center py-10">Loading user details...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Error fetching user details</p>;
  if (!user) return <p className="text-center py-10">User not found</p>;

  // Prepare data for sections
  const personalInfo = [
    { key: 'id', label: 'User ID', value: user.id },
    { key: 'full_name', label: 'Full Name', value: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A' },
    { key: 'phone_number', label: 'Phone Number', value: user.phone_number ? formatPhoneNumber(user.phone_number) : 'N/A' },
    { key: 'email', label: 'Email', value: user.email || 'N/A' },
    { key: 'bvn', label: 'BVN', value: user.bvn || 'N/A' },
    { key: 'dob', label: 'Date of Birth', value: user.dob ? formatDate(user.dob, 'short') : 'N/A' },
    { key: 'gender', label: 'Gender', value: user.gender || 'N/A' },
    { key: 'address', label: 'Residential Address', value: user.address || 'N/A' },
    { key: 'state', label: 'State', value: user.state || 'N/A' },
    { key: 'lga', label: 'LGA', value: user.lga || 'N/A' },
    { key: 'verified_at', label: 'Email Verified At', value: user.verified_at ? formatDate(user.verified_at, 'datetime') : 'Not Verified' },
    { key: 'created_at', label: 'Registered At', value: user.created_at ? formatDate(user.created_at, 'datetime') : 'N/A' },
  ];

  const kycEligibilityInfo = [
    { key: 'kyc_status', label: 'KYC Status', value: getKycStatusBadge(user.kyc_status) },
    { key: 'kyc_completed', label: 'KYC Completed', value: user.kyc_completed ? 'Yes' : 'No' },
    { key: 'eligibility_amount', label: 'Eligibility Amount', value: user.eligibility_amount ? formatCurrency(user.eligibility_amount) : 'N/A' },
    { key: 'eligibility_status', label: 'Eligibility Status', value: user.eligibility_status || 'N/A' },
    { key: 'periculum_dti', label: 'Debt-to-Income Ratio (DTI)', value: user.periculum_dti ? `${user.periculum_dti}%` : 'N/A' },
    { key: 'periculum_affordability', label: 'Periculum Affordability', value: user.periculum_affordability ? formatCurrency(user.periculum_affordability) : 'N/A' },
    { key: 'eligibility_fetched_at', label: 'Eligibility Last Updated', value: user.eligibility_fetched_at ? formatDate(user.eligibility_fetched_at, 'datetime') : 'N/A' },
    { key: 'kyc_reviewed_at', label: 'KYC Reviewed At', value: user.kyc_reviewed_at ? formatDate(user.kyc_reviewed_at, 'datetime') : 'N/A' },
  ];

  const businessInfo = user.business_name || user.business_type ? [
    { key: 'business_name', label: 'Business Name', value: user.business_name || 'N/A' },
    { key: 'business_type', label: 'Business Type', value: user.business_type || 'N/A' },
    { key: 'business_address', label: 'Business Address', value: user.business_address || 'N/A' },
    { key: 'business_phone', label: 'Business Phone', value: user.business_phone ? formatPhoneNumber(user.business_phone) : 'N/A' },
    { key: 'business_email', label: 'Business Email', value: user.business_email || 'N/A' },
    { key: 'cac_number', label: 'CAC Number', value: user.cac_number || 'N/A' },
    { key: 'business_description', label: 'Business Description', value: user.business_description || 'N/A' },
    { key: 'business_details_completed', label: 'Business Details Completed', value: user.business_details_completed ? 'Yes' : 'No' },
  ] : [];

  const financialInfo = [
    { key: 'monthly_income', label: 'Monthly Income', value: user.monthly_income ? formatCurrency(user.monthly_income) : 'N/A' },
    { key: 'monthly_expenses', label: 'Monthly Expenses', value: user.monthly_expenses ? formatCurrency(user.monthly_expenses) : 'N/A' },
    { key: 'other_income_sources', label: 'Other Income Sources', value: user.other_income_sources || 'N/A' },
    { key: 'existing_loans', label: 'Existing Loans', value: user.existing_loans || 'N/A' },
    { key: 'loan_amounts', label: 'Loan Amounts', value: user.loan_amounts || 'N/A' },
    { key: 'divider', label: '', value: '' },
    { key: 'account_name', label: 'Bank Account Name', value: user.account_name || 'N/A' },
    { key: 'account_number', label: 'Account Number', value: user.account_number || 'N/A' },
    { key: 'bank_name', label: 'Bank Name', value: user.bank_name || 'N/A' },
    { key: 'is_verified', label: 'Account Verified', value: user.is_verified ? 'Yes ✓' : 'No' },
  ];

  const guarantorInfo = user.guarantor_name ? [
    { key: 'guarantor_name', label: 'Guarantor Name', value: user.guarantor_name || 'N/A' },
    { key: 'guarantor_phone', label: 'Guarantor Phone', value: user.guarantor_phone ? formatPhoneNumber(user.guarantor_phone) : 'N/A' },
    { key: 'guarantor_email', label: 'Guarantor Email', value: user.guarantor_email || 'N/A' },
    { key: 'guarantor_address', label: 'Guarantor Address', value: user.guarantor_address || 'N/A' },
  ] : [];

  const statisticsInfo = stats ? [
    { key: 'total_applications', label: 'Total Applications', value: stats.total_applications || 0 },
    { key: 'approved_applications', label: 'Approved Applications', value: stats.approved_applications || 0 },
    { key: 'pending_applications', label: 'Pending Applications', value: stats.pending_applications || 0 },
    { key: 'rejected_applications', label: 'Rejected Applications', value: stats.rejected_applications || 0 },
  ] : [];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Marketplace User Details
          </h1>
          <div className="flex gap-2 flex-wrap">
            {getKycStatusBadge(user.kyc_status)}
            {getUserStatusBadge(user.user_status)}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {user.kyc_status === 'pending' && (
            <>
              <button
                onClick={handleApproveKYC}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Approve KYC
              </button>
              <button
                onClick={handleRejectKYC}
                className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject KYC
              </button>
            </>
          )}
          <Button
            label="Back to Customers"
            onClick={() => navigate('/customer')}
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      {/* User Name */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {user.first_name || ''} {user.last_name || ''} 
        </h2>
        <p className="text-gray-600">
          User ID: {user.id} | Email: {user.email || 'N/A'}
        </p>
      </div>

      {/* Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Personal Information */}
        <CollapsibleSection
          title="Personal Information"
          icon={User}
          isExpanded={getSectionState('personal-info')}
          onToggle={() => toggleSection('personal-info')}
        >
          <InfoGrid data={personalInfo} />
        </CollapsibleSection>

        {/* KYC & Eligibility Status */}
        <CollapsibleSection
          title="KYC & Eligibility Status"
          icon={CheckCircle}
          isExpanded={getSectionState('kyc-eligibility')}
          onToggle={() => toggleSection('kyc-eligibility')}
        >
          <InfoGrid data={kycEligibilityInfo} />
        </CollapsibleSection>

        {/* Business Information */}
        {businessInfo.length > 0 && (
          <CollapsibleSection
            title="Business Information"
            icon={Building2}
            isExpanded={getSectionState('business-info')}
            onToggle={() => toggleSection('business-info')}
          >
            <InfoGrid data={businessInfo} />
          </CollapsibleSection>
        )}

        {/* Financial Information */}
        <CollapsibleSection
          title="Financial Information"
          icon={BarChart3}
          isExpanded={getSectionState('financial-info')}
          onToggle={() => toggleSection('financial-info')}
        >
          <InfoGrid data={financialInfo} />
        </CollapsibleSection>

        {/* Guarantor Information */}
        {guarantorInfo.length > 0 && (
          <CollapsibleSection
            title="Guarantor Information"
            icon={User}
            isExpanded={getSectionState('guarantor-info')}
            onToggle={() => toggleSection('guarantor-info')}
          >
            <InfoGrid data={guarantorInfo} />
          </CollapsibleSection>
        )}

        {/* Documents */}
        <CollapsibleSection
          title="KYC Documents"
          icon={FileText}
          isExpanded={getSectionState('documents')}
          onToggle={() => toggleSection('documents')}
        >
          <div className="space-y-4">
            {/* ID Card Document */}
            {user.id_card_url ? (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">ID Card Document</p>
                      <p className="text-xs text-gray-500">Uploaded</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={user.id_card_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </a>
                    <a
                      href={user.id_card_url}
                      download
                      className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                  </div>
                </div>
                {/* Image Preview */}
                <div className="mt-3">
                  <img 
                    src={user.id_card_url} 
                    alt="ID Card" 
                    className="w-full max-w-md rounded border border-gray-300 shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-2 hidden">
                    Image preview not available. Click "View" to open in new tab.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">ID Card Document</p>
                    <p className="text-xs text-red-600">Not uploaded yet</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Statement Document */}
            {user.bank_statement_url ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bank Statement</p>
                    <p className="text-xs text-gray-500">
                      {user.periculum_statement_key 
                        ? `Processed via Periculum (Key: ${user.periculum_statement_key})` 
                        : 'Uploaded'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={user.bank_statement_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View
                  </a>
                  <a
                    href={user.bank_statement_url}
                    download
                    className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                  {user.periculum_statement_key && (
                    <div className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-green-600 rounded ml-2">
                      <CheckCircle className="h-3 w-3" />
                      Processed
                    </div>
                  )}
                </div>
              </div>
            ) : user.periculum_statement_key ? (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Bank Statement</p>
                    <p className="text-xs text-purple-600">
                      Processed via Periculum (Key: {user.periculum_statement_key})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 text-xs text-white bg-green-600 rounded">
                  <CheckCircle className="h-3 w-3" />
                  Processed
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Bank Statement</p>
                    <p className="text-xs text-red-600">Not uploaded yet</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Applications */}
        <CollapsibleSection
          title={`Applications (${applications.length})`}
          icon={FileText}
          isExpanded={getSectionState('applications')}
          onToggle={() => toggleSection('applications')}
          className="lg:col-span-2"
        >
          {applications.length > 0 ? (
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">Application #{app.reference || app.id}</h4>
                        {getApplicationStatusBadge(app.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="font-medium">Vendor:</span> {app.vendor_name || 'N/A'}</p>
                        <p><span className="font-medium">Product:</span> {app.product_name || 'N/A'}</p>
                        <p><span className="font-medium">Amount:</span> {formatCurrency(app.amount || 0)}</p>
                        <p><span className="font-medium">Down Payment:</span> {formatCurrency(app.down_payment || 0)}</p>
                        <p><span className="font-medium">Tenure:</span> {app.tenure || 0} {app.tenure_unit || 'months'}</p>
                        <p><span className="font-medium">Monthly Payment:</span> {formatCurrency(app.monthly_repayment || 0)}</p>
                        <p><span className="font-medium">Created:</span> {formatDate(app.created_at, 'short')}</p>
                        {app.customer_created && (
                          <p><span className="font-medium text-green-600">Customer Record Created</span></p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                      {app.status === 0 && (
                        <>
                          <button
                            onClick={() => handleApproveApplication(app.id)}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectApplication(app.id)}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewApplication(app.id)}
                        className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No applications submitted yet</p>
          )}
        </CollapsibleSection>

        {/* Statistics */}
        <CollapsibleSection
          title="Statistics"
          icon={BarChart3}
          isExpanded={getSectionState('statistics')}
          onToggle={() => toggleSection('statistics')}
          className="lg:col-span-2"
        >
          <InfoGrid data={statisticsInfo} />
        </CollapsibleSection>
      </div>
    </div>
  );
}

export default MarketplaceUserDetails;


