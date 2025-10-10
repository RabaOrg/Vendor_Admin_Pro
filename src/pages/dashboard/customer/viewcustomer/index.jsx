import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import Button from '../../../../components/shared/button';
import CollapsibleSection from '../../../../components/application/CollapsibleSection';
import InfoGrid from '../../../../components/application/InfoGrid';
import { useFetchVendorCustomer } from '../../../../hooks/queries/customer';
import { handleDeleteCustomer, handleUpdateCustomerStatus } from '../../../../services/loans';
import { formatCurrency, formatDate, formatPhoneNumber, getStatusBadgeClasses } from '../../../../utils/formatters';
import { usePairedSections } from '../../../../hooks/usePairedSections';

import { 
  User, 
  Building2, 
  BarChart3, 
  Edit, 
  Trash2, 
  Save,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

function ViewCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const { data: oneCustomer, isPending, isError } = useFetchVendorCustomer(id);
  
  // Extract related data
  const oneBusiness = oneCustomer?.Vendor?.Business;
  const oneVendor = oneCustomer?.Vendor;
  const oneStats = oneCustomer?.statistics;

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'personal-info', pairedWith: 'vendor-info', defaultExpanded: true },
    { id: 'vendor-info', pairedWith: 'personal-info', defaultExpanded: true },
    { id: 'business-info', pairedWith: 'statistics', defaultExpanded: false },
    { id: 'statistics', pairedWith: 'business-info', defaultExpanded: false },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);

  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === "") {
      toast.error("Please select the active status to proceed");
      return;
    }
    setIsLoading(true);
    try {
      const response = await handleUpdateCustomerStatus(id, {
        customer_status: selectedStatus,
      });
      if (response) {
        toast.success("Customer Status updated successfully");
        queryClient.invalidateQueries(["singleCustomer", id]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit_customers/${id}`);
  };

  const handleDelete = async () => {
    setIsLoad(true);
    try {
      const response = await handleDeleteCustomer(id, {
        force_delete: false
      });
      toast.success("Customer deactivated successfully");
    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.data?.message || "Failed to delete customer";
      toast.error(errorMessage);
    } finally {
      setIsLoad(false);
    }
  };

  if (isPending) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10 text-red-500">Error fetching customer details</p>;
  if (!oneCustomer) return <p className="text-center py-10">Customer not found</p>;

  // Prepare data for sections
  const personalInfo = [
    { key: 'id', label: 'Customer ID', value: oneCustomer.id },
    { key: 'full_name', label: 'Full Name', value: oneCustomer.full_name || 'N/A' },
    { key: 'phone_number', label: 'Phone Number', value: oneCustomer.phone_number ? formatPhoneNumber(oneCustomer.phone_number) : 'N/A' },
    { key: 'email', label: 'Email', value: oneCustomer.email || 'N/A' },
    { key: 'bvn', label: 'BVN', value: oneCustomer.bvn || 'N/A' },
    { key: 'dob', label: 'Date of Birth', value: oneCustomer.dob ? formatDate(oneCustomer.dob, 'short') : 'N/A' },
    { key: 'address', label: 'Address', value: oneCustomer.address || 'N/A' },
    { key: 'state', label: 'State', value: oneCustomer.state || 'N/A' },
    { key: 'lga', label: 'LGA', value: oneCustomer.lga || 'N/A' },
    { key: 'customer_status', label: 'Status', value: oneCustomer.customer_status || 'N/A' },
    { key: 'created_at', label: 'Created At', value: oneCustomer.created_at ? formatDate(oneCustomer.created_at, 'datetime') : 'N/A' },
  ];

  const vendorInfo = oneVendor ? [
    { key: 'vendor_id', label: 'Vendor ID', value: oneVendor.id },
    { key: 'vendor_name', label: 'Vendor Name', value: `${oneVendor.first_name || ''} ${oneVendor.last_name || ''}`.trim() || 'N/A' },
    { key: 'vendor_email', label: 'Vendor Email', value: oneVendor.email || 'N/A' },
    { key: 'vendor_phone', label: 'Vendor Phone', value: oneVendor.phone_number ? formatPhoneNumber(oneVendor.phone_number) : 'N/A' },
    { key: 'verification_status', label: 'Verification Status', value: oneVendor.verification_status || 'N/A' },
    { key: 'account_status', label: 'Account Status', value: oneVendor.account_status || 'N/A' },
    { key: 'interest_rate', label: 'Interest Rate', value: oneVendor.interest_rate ? `${oneVendor.interest_rate}%` : 'N/A' },
    { key: 'rating', label: 'Rating', value: oneVendor.rating ? `${oneVendor.rating}/5` : 'N/A' },
    { key: 'created_at', label: 'Vendor Created At', value: oneVendor.created_at ? formatDate(oneVendor.created_at, 'datetime') : 'N/A' },
  ] : [];

  const businessInfo = oneBusiness ? [
    { key: 'business_id', label: 'Business ID', value: oneBusiness.id },
    { key: 'business_name', label: 'Business Name', value: oneBusiness.name || 'N/A' },
    { key: 'business_description', label: 'Description', value: oneBusiness.description || 'N/A' },
    { key: 'website', label: 'Website', value: oneBusiness.website || 'N/A' },
    { key: 'cac_registration', label: 'CAC Registration', value: oneBusiness.cac_registration_number || 'N/A' },
    { key: 'tax_id', label: 'Tax ID', value: oneBusiness.tax_identification_number || 'N/A' },
    { key: 'created_at', label: 'Business Created At', value: oneBusiness.created_at ? formatDate(oneBusiness.created_at, 'datetime') : 'N/A' },
  ] : [];

  const statisticsInfo = oneStats ? [
    { key: 'total_applications', label: 'Total Applications', value: oneStats.total_applications || 0 },
    { key: 'approved_applications', label: 'Approved Applications', value: oneStats.approved_applications || 0 },
    { key: 'completed_applications', label: 'Completed Applications', value: oneStats.completed_applications || 0 },
    { key: 'total_financed_amount', label: 'Total Financed Amount', value: oneStats.total_financed_amount ? formatCurrency(oneStats.total_financed_amount) : formatCurrency(0) },
  ] : [];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Customer Details
          </h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(oneCustomer.customer_status)}`}>
            {oneCustomer.customer_status || 'Unknown'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            label="Edit Customer"
            onClick={handleEdit}
            variant="outline"
            size="sm"
            icon={Edit}
          />
        </div>
      </div>

      {/* Customer Name */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {oneCustomer.full_name || 'Unnamed Customer'}
        </h2>
        <p className="text-gray-600">
          Customer ID: {oneCustomer.id}
        </p>
      </div>

      {/* Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <CollapsibleSection
          title="Personal Information"
          icon={User}
          badge={personalInfo.length}
          badgeColor="blue"
          defaultExpanded={getSectionState('personal-info')}
          onToggle={(isExpanded) => toggleSection('personal-info', isExpanded)}
        >
          <InfoGrid 
            data={personalInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Vendor Information */}
        {oneVendor && (
          <CollapsibleSection
            title="Vendor Information"
            icon={Building2}
            badge={vendorInfo.length}
            badgeColor="green"
            defaultExpanded={getSectionState('vendor-info')}
            onToggle={(isExpanded) => toggleSection('vendor-info', isExpanded)}
          >
            <InfoGrid 
              data={vendorInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Business Information */}
        {oneBusiness && (
          <CollapsibleSection
            title="Business Information"
            icon={Building2}
            badge={businessInfo.length}
            badgeColor="purple"
            defaultExpanded={getSectionState('business-info')}
            onToggle={(isExpanded) => toggleSection('business-info', isExpanded)}
          >
            <InfoGrid 
              data={businessInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Statistics */}
        {oneStats && (
          <CollapsibleSection
            title="Application Statistics"
            icon={BarChart3}
            badge={statisticsInfo.length}
            badgeColor="orange"
            defaultExpanded={getSectionState('statistics')}
            onToggle={(isExpanded) => toggleSection('statistics', isExpanded)}
          >
            <InfoGrid 
              data={statisticsInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}
      </div>

      {/* Status Update Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Status Update
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Select Status to be updated</label>
            <select
              value={selectedStatus}
              onChange={handleChangeStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              label="Update Status"
              onClick={handleUpdateStatus}
              variant="solid"
              size="md"
              icon={Save}
              loading={isLoading}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-start">
        <Button
          label="Delete Customer"
          onClick={handleDelete}
          variant="transparent"
          size="md"
          icon={Trash2}
          loading={isLoad}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        />
      </div>
    </div>
  );
}

export default ViewCustomerDetails;