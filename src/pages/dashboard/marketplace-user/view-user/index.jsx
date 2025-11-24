import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../store/axiosInstance';

import Button from '../../../../components/shared/button';
import CollapsibleSection from '../../../../components/application/CollapsibleSection';
import InfoGrid from '../../../../components/application/InfoGrid';
import { useFetchMarketplaceUser } from '../../../../hooks/queries/marketplaceUser';
import { formatCurrency, formatDate, formatPhoneNumber } from '../../../../utils/formatters';
import { usePairedSections } from '../../../../hooks/usePairedSections';
import { handleDeleteMarketplaceUser } from '../../../../services/customer';

import { 
  User, 
  Building2, 
  BarChart3, 
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Settings,
  DollarSign,
  RefreshCw,
  Trash2
} from 'lucide-react';

function MarketplaceUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: userData, isPending, isError, refetch } = useFetchMarketplaceUser(id);
  
  // Extract data
  const user = userData?.user;
  const applications = userData?.applications || [];
  const stats = userData?.stats;

  // Modal states
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showKYCStatusModal, setShowKYCStatusModal] = useState(false);
  const [showAccountStatusModal, setShowAccountStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eligibilityAmount, setEligibilityAmount] = useState('');
  const [kycStatus, setKycStatus] = useState('');
  const [kycStatusNotes, setKycStatusNotes] = useState('');
  const [kycEligibilityAmount, setKycEligibilityAmount] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [accountStatusNotes, setAccountStatusNotes] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'personal-info', pairedWith: 'kyc-eligibility', defaultExpanded: true },
    { id: 'kyc-eligibility', pairedWith: 'personal-info', defaultExpanded: true },
    { id: 'business-info', pairedWith: 'financial-info', defaultExpanded: false },
    { id: 'financial-info', pairedWith: 'business-info', defaultExpanded: false },
    { id: 'guarantor-info', pairedWith: 'documents', defaultExpanded: false },
    { id: 'documents', pairedWith: 'actions', defaultExpanded: false },
    { id: 'actions', pairedWith: 'documents', defaultExpanded: false },
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

  const handleUpdateKYCStatus = async () => {
    if (!kycStatus) {
      toast.error('Please select a KYC status');
      return;
    }

    // If status is rejected, notes are required
    if (kycStatus === 'rejected' && !kycStatusNotes.trim()) {
      toast.error('Please enter a reason for rejection');
      return;
    }

    try {
      setIsSaving(true);
      const updateData = {
        kyc_status: kycStatus,
        notes: kycStatusNotes || ''
      };

      // Include eligibility amount if status is approved and amount is provided
      if (kycStatus === 'approved' && kycEligibilityAmount) {
        const amount = parseFloat(kycEligibilityAmount.replace(/,/g, ''));
        if (!isNaN(amount) && amount >= 0) {
          updateData.eligibility_amount = amount;
        }
      }

      await axiosInstance.patch(`/api/admin/kyc/users/${id}/status`, updateData);
      toast.success("KYC status updated successfully");
      setShowKYCStatusModal(false);
      setKycStatus('');
      setKycStatusNotes('');
      setKycEligibilityAmount('');
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error updating KYC status:', error);
      toast.error(error?.response?.data?.message || "Failed to update KYC status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/application-statistics/${applicationId}`);
  };

  const handleUpdateEligibility = async () => {
    if (!eligibilityAmount || eligibilityAmount.trim() === '') {
      toast.error('Please enter an eligibility amount');
      return;
    }
    
    const amount = parseFloat(eligibilityAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount < 0) {
      toast.error('Please enter a valid positive number');
      return;
    }

    try {
      setIsSaving(true);
      await axiosInstance.put(`/api/admin/user-eligibility/${id}/eligibility`, {
        eligibility_amount: amount,
        reason: 'Updated from marketplace user details'
      });
      toast.success("Eligibility amount updated successfully");
      setShowEligibilityModal(false);
      setEligibilityAmount('');
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error updating eligibility:', error);
      toast.error(error?.response?.data?.message || "Failed to update eligibility");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshEligibility = async () => {
    if (!window.confirm('This will refresh the eligibility amount from Periculum. Continue?')) {
      return;
    }

    try {
      await axiosInstance.post(`/api/admin/users/${id}/eligibility/refresh`);
      toast.success("Eligibility refreshed successfully");
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error refreshing eligibility:', error);
      toast.error(error?.response?.data?.message || "Failed to refresh eligibility");
    }
  };

  const handleUpdateAccountStatus = async () => {
    if (!accountStatus) {
      toast.error('Please select an account status');
      return;
    }

    try {
      setIsSaving(true);
      await axiosInstance.patch(`/api/admin/customers/user/${id}/status`, {
        account_status: accountStatus,
        notes: accountStatusNotes || ''
      });
      toast.success("Account status updated successfully");
      setShowAccountStatusModal(false);
      setAccountStatus('');
      setAccountStatusNotes('');
      refetch(); // Refresh user data
    } catch (error) {
      console.error('Error updating account status:', error);
      toast.error(error?.response?.data?.message || "Failed to update account status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(`Are you sure you want to ${forceDelete ? 'permanently delete' : 'deactivate'} this user account? This action ${forceDelete ? 'cannot' : 'can'} be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await handleDeleteMarketplaceUser(id, forceDelete, deleteReason);
      toast.success(response?.data?.message || "User account deleted successfully");
      setShowDeleteModal(false);
      setDeleteReason('');
      setForceDelete(false);
      // Navigate back to customers list after deletion
      setTimeout(() => {
        navigate('/customer');
      }, 1500);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error?.response?.data?.message || "Failed to delete user account");
    } finally {
      setIsDeleting(false);
    }
  };

  const getKycStatusBadge = (status, kycCompleted) => {
    // If KYC is completed but status is incomplete/null, show as 'pending' (awaiting review)
    const effectiveStatus = (kycCompleted && (!status || status === 'incomplete')) ? 'pending' : status;
    
    const statusConfig = {
      'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
      'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
      'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending Review' },
      'under_review': { class: 'bg-blue-100 text-blue-700', text: 'Under Review' },
      'incomplete': { class: 'bg-gray-100 text-gray-700', text: 'Incomplete' }
    };
    const config = statusConfig[effectiveStatus] || statusConfig['incomplete'];
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
    { key: 'kyc_status', label: 'KYC Status', value: getKycStatusBadge(user.kyc_status, user.kyc_completed) },
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
            {getKycStatusBadge(user.kyc_status, user.kyc_completed)}
            {getUserStatusBadge(user.user_status)}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
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
                    Image preview not available. Click &quot;View&quot; to open in new tab.
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

        {/* Actions Section - Beside KYC Documents */}
        <CollapsibleSection
          title="Actions"
          icon={Settings}
          isExpanded={getSectionState('actions')}
          onToggle={() => toggleSection('actions')}
        >
          <div className="space-y-3">
            {/* KYC Actions - Always visible */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">KYC Status</h4>
              <div className="mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.kyc_status === 'approved' ? 'bg-green-100 text-green-700' :
                  user.kyc_status === 'rejected' ? 'bg-red-100 text-red-700' :
                  user.kyc_status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {user.kyc_status ? user.kyc_status.replace('_', ' ').charAt(0).toUpperCase() + user.kyc_status.replace('_', ' ').slice(1) : 'Pending'}
                </span>
              </div>
              <button
                onClick={() => {
                  setKycStatus(user.kyc_status || 'pending');
                  setKycStatusNotes(user.kyc_review_notes || '');
                  setKycEligibilityAmount(user.eligibility_amount ? user.eligibility_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '');
                  setShowKYCStatusModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Update KYC Status
              </button>
            </div>
            
            {/* Account Status Actions */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Account Status</h4>
              <div className="mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.account_status === 'active' ? 'bg-green-100 text-green-700' :
                  user.account_status === 'suspended' ? 'bg-red-100 text-red-700' :
                  user.account_status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {user.account_status ? user.account_status.charAt(0).toUpperCase() + user.account_status.slice(1) : 'Active'}
                </span>
              </div>
              <button
                onClick={() => {
                  setAccountStatus(user.account_status || 'active');
                  setShowAccountStatusModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
              >
                <Settings className="h-4 w-4" />
                Update Account Status
              </button>
            </div>
            
            {/* Eligibility Actions */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Eligibility Actions</h4>
              <button
                onClick={() => {
                  setEligibilityAmount(user.eligibility_amount ? user.eligibility_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '');
                  setShowEligibilityModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                <DollarSign className="h-4 w-4" />
                Update Eligibility
              </button>
              
              {user.periculum_statement_key && (
                <button
                  onClick={handleRefreshEligibility}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh from Periculum
                </button>
              )}
            </div>

            {/* Delete User Action */}
            <div className="space-y-2 pt-2 border-t border-red-200">
              <h4 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h4>
              <button
                onClick={() => {
                  setDeleteReason('');
                  setForceDelete(false);
                  setShowDeleteModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete User Account
              </button>
            </div>
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

      {/* Update Eligibility Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEligibilityModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit User Eligibility</h3>
                <button
                  onClick={() => setShowEligibilityModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm font-medium text-gray-900">User: {user.first_name} {user.last_name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eligibility Amount (NGN)
                </label>
                <input
                  type="text"
                  value={eligibilityAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, '');
                    if (!isNaN(value) || value === '') {
                      setEligibilityAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
                {user.eligibility_amount && (
                  <p className="text-xs text-gray-500 mt-1">Current: ₦{user.eligibility_amount.toLocaleString()}</p>
                )}
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowEligibilityModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEligibility}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update KYC Status Modal */}
      {showKYCStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowKYCStatusModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Update KYC Status</h3>
                <button
                  onClick={() => setShowKYCStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <p className="text-sm font-medium text-gray-900">User: {user.first_name} {user.last_name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Current Status: <span className="font-medium">{user.kyc_status || 'pending'}</span></p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KYC Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={kycStatus}
                  onChange={(e) => setKycStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {kycStatus === 'approved' && 'User KYC will be marked as approved'}
                  {kycStatus === 'rejected' && 'User KYC will be marked as rejected'}
                  {kycStatus === 'under_review' && 'User KYC will be moved to under review'}
                  {kycStatus === 'pending' && 'User KYC will be reset to pending'}
                </p>
              </div>

              {kycStatus === 'approved' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eligibility Amount (NGN) <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={kycEligibilityAmount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/,/g, '');
                      if (!isNaN(value) || value === '') {
                        setKycEligibilityAmount(value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter eligibility amount"
                  />
                  {user.eligibility_amount && (
                    <p className="text-xs text-gray-500 mt-1">Current: ₦{user.eligibility_amount.toLocaleString()}</p>
                  )}
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes {kycStatus === 'rejected' && <span className="text-red-500">*</span>}
                  {kycStatus !== 'rejected' && <span className="text-gray-400">(Optional)</span>}
                </label>
                <textarea
                  value={kycStatusNotes}
                  onChange={(e) => setKycStatusNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={kycStatus === 'rejected' ? 'Enter reason for rejection' : 'Enter notes (optional)'}
                  rows={4}
                  required={kycStatus === 'rejected'}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowKYCStatusModal(false);
                    setKycStatus('');
                    setKycStatusNotes('');
                    setKycEligibilityAmount('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateKYCStatus}
                  disabled={isSaving || !kycStatus || (kycStatus === 'rejected' && !kycStatusNotes.trim())}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? 'Updating...' : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Account Status Modal */}
      {showAccountStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAccountStatusModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Update Account Status</h3>
                <button
                  onClick={() => setShowAccountStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                <p className="text-sm font-medium text-gray-900">User: {user.first_name} {user.last_name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Current Status: <span className="font-medium">{user.account_status || 'active'}</span></p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={accountStatus}
                  onChange={(e) => setAccountStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {accountStatus === 'suspended' && 'User will not be able to log in'}
                  {accountStatus === 'inactive' && 'User will not be able to log in'}
                  {accountStatus === 'pending' && 'User account is pending activation'}
                  {accountStatus === 'active' && 'User can access all features'}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={accountStatusNotes}
                  onChange={(e) => setAccountStatusNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter reason for status change"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowAccountStatusModal(false);
                    setAccountStatus('');
                    setAccountStatusNotes('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAccountStatus}
                  disabled={isSaving || !accountStatus}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? 'Updating...' : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Update Status
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Delete User Account</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                <p className="text-sm font-medium text-red-900">User: {user.first_name} {user.last_name}</p>
                <p className="text-sm text-red-600">{user.email}</p>
                <p className="text-xs text-red-500 mt-1">This action will {forceDelete ? 'permanently delete' : 'deactivate'} the user account</p>
              </div>

              {/* Check for active applications */}
              {stats?.approved_applications > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This user has {stats.approved_applications} approved application(s). 
                    {!forceDelete && ' You may need to use force delete to remove the account.'}
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <label className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={forceDelete}
                    onChange={(e) => setForceDelete(e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Force Delete (Permanent)
                  </span>
                </label>
                <p className="text-xs text-gray-500 ml-6">
                  {forceDelete 
                    ? 'Permanently delete the user account and all associated data. This cannot be undone.'
                    : 'Deactivate the user account. The account can be reactivated later.'}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason {forceDelete && <span className="text-red-500">*</span>}
                  {!forceDelete && <span className="text-gray-400">(Optional)</span>}
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder={forceDelete ? "Enter reason for permanent deletion" : "Enter reason for deactivation (optional)"}
                  rows={3}
                  required={forceDelete}
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                    setForceDelete(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isDeleting || (forceDelete && !deleteReason.trim())}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      {forceDelete ? 'Delete Permanently' : 'Deactivate Account'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MarketplaceUserDetails;


