import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import Button from '../../../components/shared/button';
import CollapsibleSection from '../../../components/application/CollapsibleSection';
import InfoGrid from '../../../components/application/InfoGrid';
import { useFetchSingleAgent } from '../../../hooks/queries/agent';
import { handleDeleteAgent, handleUpdateAgent } from '../../../services/agent';
import { formatCurrency, formatDate, formatPhoneNumber, getStatusBadgeClasses } from '../../../utils/formatters';
import { usePairedSections } from '../../../hooks/usePairedSections';

import { 
  User, 
  MapPin, 
  FileImage, 
  Edit, 
  Save, 
  Trash2
} from 'lucide-react';

function SingleAgent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [commissionRate, setCommissionRate] = useState('');
  const [monthlySales, setMonthlySales] = useState('');
  
  const { data: vendor, isPending, isError } = useFetchSingleAgent(id);

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'personal-info', pairedWith: 'address-info', defaultExpanded: true },
    { id: 'address-info', pairedWith: 'personal-info', defaultExpanded: true },
    { id: 'documents', pairedWith: 'performance', defaultExpanded: false },
    { id: 'performance', pairedWith: 'documents', defaultExpanded: false },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);

  const handleUpdateStatus = async () => {
    if (commissionRate === '' || monthlySales === '') {
      toast.error('Please fill the fields to proceed');
      return;
    }
    setIsLoading(true);
    try {
      const response = await handleUpdateAgent(id, {
        commission_rate: parseFloat(commissionRate),
        target_monthly_sales: parseFloat(monthlySales),
        notes: 'Updated notes for the agent',
      });
      if (response) {
        toast.success('Agent updated successfully');
        queryClient.invalidateQueries(['AgentSingle', id]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoad(true);
    try {
      await handleDeleteAgent(id);
      toast.success('Agent deactivated successfully');
      navigate('/agent_management');
    } catch (error) {
      console.log(error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete agent';
      toast.error(errorMessage);
    } finally {
      setIsLoad(false);
    }
  };

  const handleSms = (agentId) => {
    // Navigate to SMS application creation for this agent
    navigate(`/sms-applications?agent_id=${agentId}`);
  };

  if (isPending) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Error fetching agent details</p>;
  }

  if (!vendor) {
    return <p className="text-center py-10">Agent not found</p>;
  }

  // Prepare data for sections
  const personalInfo = [
    { key: 'agent_id', label: 'Agent ID', value: vendor.id },
    { key: 'employee_id', label: 'Employee ID', value: vendor.employee_id || 'N/A' },
    { key: 'first_name', label: 'First Name', value: vendor.first_name || 'N/A' },
    { key: 'last_name', label: 'Last Name', value: vendor.last_name || 'N/A' },
    { key: 'department', label: 'Department', value: vendor.department || 'N/A' },
    { key: 'position', label: 'Position', value: vendor.position || 'N/A' },
    { key: 'phone_number', label: 'Phone Number', value: vendor.phone_number ? formatPhoneNumber(vendor.phone_number) : 'N/A' },
    { key: 'email', label: 'Email', value: vendor.email || 'N/A' },
    { key: 'hire_date', label: 'Hire Date', value: vendor.hire_date ? formatDate(vendor.hire_date, 'short') : 'N/A' },
  ];

  const addressInfo = [
    { key: 'address', label: 'Address', value: vendor.address || 'N/A' },
    { key: 'state', label: 'State', value: vendor.state || 'N/A' },
    { key: 'lga', label: 'LGA', value: vendor.lga || 'N/A' },
    { key: 'status', label: 'Account Status', value: vendor.status || 'N/A' },
    { key: 'verification_status', label: 'Verification Status', value: vendor.verification_status || 'N/A' },
    { key: 'created_at', label: 'Created At', value: vendor.created_at ? formatDate(vendor.created_at, 'datetime') : 'N/A' },
  ];

  const performanceInfo = [
    { key: 'commission_rate', label: 'Commission Rate', value: vendor.commission_rate ? `${vendor.commission_rate}%` : 'N/A' },
    { key: 'target_monthly_sales', label: 'Target Monthly Sales', value: vendor.target_monthly_sales ? formatCurrency(vendor.target_monthly_sales) : 'N/A' },
    { key: 'vendor_count', label: 'Vendor Count', value: vendor.vendor_count || 0 },
    { key: 'total_sales', label: 'Total Sales', value: vendor.total_sales ? formatCurrency(vendor.total_sales) : 'N/A' },
    { key: 'notes', label: 'Notes', value: vendor.notes || 'N/A' },
  ];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Agent Details
          </h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(vendor.status)}`}>
            {vendor.status || 'Unknown'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            label="Create SMS Application"
            onClick={() => handleSms(id)}
            variant="solid"
            size="sm"
            className="bg-green-700 hover:bg-green-800"
          />
        </div>
      </div>

      {/* Agent Name */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {`${vendor.first_name || ''} ${vendor.last_name || ''}`.trim() || 'Unnamed Agent'}
        </h2>
        <p className="text-gray-600">
          Agent ID: {vendor.id} | Employee ID: {vendor.employee_id || 'N/A'}
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

        {/* Address Information */}
        <CollapsibleSection
          title="Address & Status"
          icon={MapPin}
          badge={addressInfo.length}
          badgeColor="green"
          defaultExpanded={getSectionState('address-info')}
          onToggle={(isExpanded) => toggleSection('address-info', isExpanded)}
        >
          <InfoGrid 
            data={addressInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Performance Information */}
        <CollapsibleSection
          title="Performance & Sales"
          icon={Edit}
          badge={performanceInfo.length}
          badgeColor="purple"
          defaultExpanded={getSectionState('performance')}
          onToggle={(isExpanded) => toggleSection('performance', isExpanded)}
        >
          <InfoGrid 
            data={performanceInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Documents */}
        {Array.isArray(vendor.business_photos) && vendor.business_photos.length > 0 && (
          <CollapsibleSection
            title="Uploaded Documents"
            icon={FileImage}
            badge={vendor.business_photos.length}
            badgeColor="orange"
            defaultExpanded={getSectionState('documents')}
            onToggle={(isExpanded) => toggleSection('documents', isExpanded)}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {vendor.business_photos.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={doc.url}
                    alt={doc.label || `Document ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 bg-white border-t text-sm text-gray-600 font-medium text-center">
                    {doc.label || `Document ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>

      {/* Agent Update Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Agent Update
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Commission Rate (%)
            </label>
            <input
              type="number"
              placeholder="e.g. 7.5"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Target Monthly Sales
            </label>
            <input
              type="number"
              placeholder="e.g. 1200000"
              value={monthlySales}
              onChange={(e) => setMonthlySales(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <Button
              label="Update Agent"
              onClick={handleUpdateStatus}
              variant="solid"
              size="md"
              icon={Save}
              loading={isLoading}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-start">
        <Button
          label="Deactivate Agent"
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

export default SingleAgent;