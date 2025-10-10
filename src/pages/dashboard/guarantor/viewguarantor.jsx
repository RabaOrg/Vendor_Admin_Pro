import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import Button from '../../../components/shared/button';
import CollapsibleSection from '../../../components/application/CollapsibleSection';
import InfoGrid from '../../../components/application/InfoGrid';
import axiosInstance from '../../../../store/axiosInstance';
import { handleUpdateGuarantorStatus } from '../../../services/loans';
import { useFetchSingleGuarantor } from '../../../hooks/queries/loan';
import { formatCurrency, formatDate, formatPhoneNumber, getStatusBadgeClasses } from '../../../utils/formatters';
import { usePairedSections } from '../../../hooks/usePairedSections';

import { 
  User, 
  Package, 
  Shield, 
  CheckCircle, 
  Edit, 
  Save,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

function ViewGuarantor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loanData, setLoanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  const { data: singleGuarantor, isPending, isError } = useFetchSingleGuarantor(id);

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'customer-info', pairedWith: 'product-info', defaultExpanded: true },
    { id: 'product-info', pairedWith: 'customer-info', defaultExpanded: true },
    { id: 'guarantor-details', pairedWith: 'verifications', defaultExpanded: false },
    { id: 'verifications', pairedWith: 'guarantor-details', defaultExpanded: false },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);

  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/guarantors/${id}`);
        setLoanData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit_guarantor/${id}`);
  };

  const handleUpdateLoanStatus = async () => {
    if (selectedStatus === singleGuarantor?.data?.verification_status) {
      toast.error("Please select a different status to update");
      return;
    }

    setIsLoading(true);
    try {
      const response = await handleUpdateGuarantorStatus(id, {
        verification_status: selectedStatus,
      });
      if (response) {
        toast.success("Status updated successfully");
        setLoanData((prevData) => ({
          ...prevData,
          verification_status: selectedStatus,
        }));
        queryClient.invalidateQueries(["singleguarantor", id]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading guarantor details.
      </div>
    );
  }

  if (!singleGuarantor?.data) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No guarantor data found.
      </div>
    );
  }

  const guarantorData = singleGuarantor.data;
  const application = guarantorData.application;
  const customer = application?.customer;
  const product = application?.product;
  const verifications = guarantorData.verifications || [];

  // Prepare data for sections
  const customerInfo = customer ? [
    { key: 'customer_id', label: 'Customer ID', value: customer.id },
    { key: 'customer_name', label: 'Customer Name', value: customer.name || 'N/A' },
    { key: 'customer_email', label: 'Customer Email', value: customer.email || 'N/A' },
    { key: 'customer_phone', label: 'Customer Phone', value: customer.phone_number ? formatPhoneNumber(customer.phone_number) : 'N/A' },
    { key: 'customer_address', label: 'Customer Address', value: customer.address || 'N/A' },
    { key: 'customer_state', label: 'Customer State', value: customer.state || 'N/A' },
    { key: 'customer_lga', label: 'Customer LGA', value: customer.lga || 'N/A' },
  ] : [];

  const productInfo = product ? [
    { key: 'product_id', label: 'Product ID', value: product.id },
    { key: 'product_name', label: 'Product Name', value: product.name || 'N/A' },
    { key: 'product_price', label: 'Product Price', value: product.price ? formatCurrency(product.price) : 'N/A' },
    { key: 'product_description', label: 'Description', value: product.description || 'N/A' },
    { key: 'product_category', label: 'Category', value: product.category || 'N/A' },
  ] : [];

  const guarantorDetails = [
    { key: 'guarantor_id', label: 'Guarantor ID', value: guarantorData.id },
    { key: 'guarantor_name', label: 'Guarantor Name', value: guarantorData.name || 'N/A' },
    { key: 'guarantor_phone', label: 'Phone Number', value: guarantorData.phone_number ? formatPhoneNumber(guarantorData.phone_number) : 'N/A' },
    { key: 'guarantor_address', label: 'Address', value: guarantorData.address || 'N/A' },
    { key: 'relationship', label: 'Relationship', value: guarantorData.relationship || 'N/A' },
    { key: 'verification_status', label: 'Verification Status', value: guarantorData.verification_status || 'N/A' },
    { key: 'created_at', label: 'Created At', value: guarantorData.created_at ? formatDate(guarantorData.created_at, 'datetime') : 'N/A' },
  ];

  const verificationInfo = verifications.length > 0 ? [
    { key: 'backup_contact', label: 'Backup Contact Info', value: verifications[0]?.backup_contact_info || 'N/A' },
    { key: 'communication_method', label: 'Communication Method', value: verifications[0]?.communication_method || 'N/A' },
    { key: 'contact_info', label: 'Contact Info', value: verifications[0]?.contact_info || 'N/A' },
    { key: 'verification_status', label: 'Verification Status', value: verifications[0]?.status || 'N/A' },
    { key: 'verified_at', label: 'Verified At', value: verifications[0]?.verified_at ? formatDate(verifications[0].verified_at, 'datetime') : 'N/A' },
  ] : [];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Guarantor Details
          </h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(guarantorData.verification_status)}`}>
            {guarantorData.verification_status || 'Unknown'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            label="Edit Guarantor"
            onClick={handleEdit}
            variant="outline"
            size="sm"
            icon={Edit}
          />
        </div>
      </div>

      {/* Guarantor Name */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {guarantorData.name || 'Unnamed Guarantor'}
        </h2>
        <p className="text-gray-600">
          Guarantor ID: {guarantorData.id}
        </p>
      </div>

      {/* Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Information */}
        {customer && (
          <CollapsibleSection
            title="Customer Information"
            icon={User}
            badge={customerInfo.length}
            badgeColor="blue"
            defaultExpanded={getSectionState('customer-info')}
            onToggle={(isExpanded) => toggleSection('customer-info', isExpanded)}
          >
            <InfoGrid 
              data={customerInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Product Information */}
        {product && (
          <CollapsibleSection
            title="Product Information"
            icon={Package}
            badge={productInfo.length}
            badgeColor="green"
            defaultExpanded={getSectionState('product-info')}
            onToggle={(isExpanded) => toggleSection('product-info', isExpanded)}
          >
            <InfoGrid 
              data={productInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Guarantor Details */}
        <CollapsibleSection
          title="Guarantor Details"
          icon={Shield}
          badge={guarantorDetails.length}
          badgeColor="purple"
          defaultExpanded={getSectionState('guarantor-details')}
          onToggle={(isExpanded) => toggleSection('guarantor-details', isExpanded)}
        >
          <InfoGrid 
            data={guarantorDetails}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Verifications */}
        {verifications.length > 0 && (
          <CollapsibleSection
            title="Verifications"
            icon={CheckCircle}
            badge={verificationInfo.length}
            badgeColor="orange"
            defaultExpanded={getSectionState('verifications')}
            onToggle={(isExpanded) => toggleSection('verifications', isExpanded)}
          >
            <InfoGrid 
              data={verificationInfo}
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
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              label="Update Status"
              onClick={handleUpdateLoanStatus}
              variant="solid"
              size="md"
              icon={Save}
              loading={isLoading}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewGuarantor;