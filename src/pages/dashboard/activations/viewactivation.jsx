import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSingleVendorData } from '../../../hooks/queries/loan'
import { handleDeleteVendor, handleUpdateVendorStatus, handleUpdateverification } from '../../../services/loans'
import Button from '../../../components/shared/button'
import CollapsibleSection from '../../../components/application/CollapsibleSection'
import InfoGrid from '../../../components/application/InfoGrid'
import { formatCurrency, formatDate, getStatusBadgeClasses } from '../../../utils/formatters'
import { 
  User, 
  Building, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Pencil,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Globe,
  Shield,
  TrendingUp
} from 'lucide-react'

function ViewActivation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)
  const [isverfied, setisVerified] = useState(false)
  const [interest, setInterest] = useState(0)
  const [isLoad, setIsLoad] = useState(false)

  const { data: vendorData, isPending, isError } = useFetchSingleVendorData(id)

  const [selectedStatus, setSelectedStatus] = useState(vendorData?.account_status || "");
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState(vendorData?.verification_status || "");

  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleChangeVerificationStatus = (e) => {
    setSelectedVerificationStatus(e.target.value);
  };

  const handleSms = (id) => {
    navigate(`/create_sms_notification/${id}`);
  }

  const handleUpdateStatus = async () => {
    if (selectedStatus === "") {
      toast.error("Please select the active status to proceed")
      return
    }
    setIsLoading(true)
    try {
      const response = await handleUpdateVendorStatus(id, {
        account_status: selectedStatus,
      })
      if (response) {
        toast.success("Vendor Status updated successfully")
        queryClient.invalidateQueries(["getsinglevendors", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/edit_vendor/${id}`)
  }

  const handleUpdateVerificationStatus = async () => {
    if (!interest) {
      toast.error("interest rate is required")
      return
    }
    if (selectedVerificationStatus === "") {
      toast.error("Please select the active status to proceed")
      return
    }

    setisVerified(true)
    try {
      const response = await handleUpdateverification(id, {
        verification_status: selectedVerificationStatus,
        verification_notes: "Verification approved by admin",
        interest_rate: Number(interest),
      })
      if (response) {
        toast.success("Verification Status updated successfully")
        queryClient.invalidateQueries(["getsinglevendors", id]);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setisVerified(false)
    }
  }

  const handleDelete = async () => {
    setIsLoad(true)
    try {
      console.log(id)
      const response = await handleDeleteVendor(id, {
        force_delete: false
      })

      toast.success("Vendor deactivated successfully")

    } catch (error) {
      console.log(error)
      const errorMessage =
        error?.response?.data?.message || "Failed to delete application";

      toast.error(errorMessage);
    } finally {
      setIsLoad(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading vendor details...
      </div>
    );
  }

  if (isError || !vendorData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        Failed to load vendor details.
      </div>
    );
  }

  // Extract vendor data
  const vendor = vendorData;
  const business = vendor?.Business;
  const attachments = vendor?.Attachments || [];
  const agent = vendor?.agent;

  // Vendor Statistics Data
  const vendorStats = [
    { key: 'totalApplications', label: 'Total Applications', value: vendor?.statistics?.total_applications || 0 },
    { key: 'totalCustomers', label: 'Total Customers', value: vendor?.statistics?.total_customers || 0 },
    { key: 'totalProducts', label: 'Total Products', value: vendor?.statistics?.total_products || 0 },
  ];

  // Personal Information Data
  const personalInfo = [
    { key: 'fullName', label: 'Full Name', value: vendor?.full_name },
    { key: 'phoneNumber', label: 'Phone Number', value: vendor?.phone_number },
    { key: 'email', label: 'Email', value: vendor?.email },
    { key: 'gender', label: 'Gender', value: vendor?.gender },
    { key: 'dob', label: 'Date of Birth', value: vendor?.dob ? formatDate(vendor.dob, 'date') : null },
    { key: 'bvn', label: 'BVN', value: vendor?.bvn },
    { key: 'address', label: 'Address', value: vendor?.address },
    { key: 'location', label: 'Location', value: vendor?.location },
    { key: 'state', label: 'State', value: vendor?.state },
    { key: 'accountStatus', label: 'Account Status', value: vendor?.account_status },
    { key: 'verificationStatus', label: 'Verification Status', value: vendor?.verification_status },
    { key: 'verifiedAt', label: 'Verified At', value: vendor?.verified_at ? formatDate(vendor.verified_at, 'datetime') : null },
    { key: 'createdAt', label: 'Created At', value: vendor?.created_at ? formatDate(vendor.created_at, 'datetime') : null },
    { key: 'updatedAt', label: 'Last Updated', value: vendor?.updated_at ? formatDate(vendor.updated_at, 'datetime') : null },
  ];

  // Business Information Data
  const businessInfo = [
    { key: 'businessName', label: 'Business Name', value: business?.name },
    { key: 'companyName', label: 'Company Name', value: vendor?.company_name },
    { key: 'businessDescription', label: 'Business Description', value: business?.business_description || vendor?.business_description },
    { key: 'category', label: 'Category', value: business?.category },
    { key: 'subCategory', label: 'Sub Category', value: business?.sub_category },
    { key: 'cacNumber', label: 'CAC Number', value: business?.cac_number },
    { key: 'cacRegistration', label: 'CAC Registration', value: vendor?.cac_registration_number },
    { key: 'taxId', label: 'Tax ID', value: vendor?.tax_identification_number },
    { key: 'timeInBusiness', label: 'Time in Business', value: business?.time_in_business },
    { key: 'monthlyRevenue', label: 'Monthly Revenue', value: business?.monthly_revenue ? formatCurrency(business.monthly_revenue) : null },
    { key: 'website', label: 'Website', value: business?.website || vendor?.website },
    { key: 'socialMedia', label: 'Social Media', value: business?.social_media },
  ];

  // Address Information Data
  const addressInfo = [
    { key: 'streetAddress', label: 'Street Address', value: business?.street_address },
    { key: 'lga', label: 'LGA', value: business?.lga },
    { key: 'state', label: 'State', value: business?.state },
    { key: 'location', label: 'Location', value: vendor?.location },
  ];

  // Bank Information Data
  const bankInfo = [
    { key: 'bankName', label: 'Bank Name', value: vendor?.bank_name },
    { key: 'accountNumber', label: 'Account Number', value: vendor?.account_number },
    { key: 'accountName', label: 'Account Name', value: vendor?.account_name },
    { key: 'bankCode', label: 'Bank Code', value: vendor?.bank_code },
    { key: 'accountVerified', label: 'Account Verified', value: vendor?.account_verified ? 'Yes' : 'No' },
    { key: 'accountVerifiedAt', label: 'Account Verified At', value: vendor?.account_verified_at ? formatDate(vendor.account_verified_at, 'datetime') : null },
  ];

  // Agent Information Data
  const agentInfo = [
    { key: 'agentName', label: 'Agent Name', value: agent ? `${agent.first_name} ${agent.last_name}` : null },
    { key: 'agentEmail', label: 'Agent Email', value: agent?.email },
    { key: 'agentPhone', label: 'Agent Phone', value: agent?.phone_number },
    { key: 'employeeId', label: 'Employee ID', value: agent?.employee_id },
    { key: 'position', label: 'Position', value: agent?.position },
    { key: 'department', label: 'Department', value: agent?.department },
    { key: 'status', label: 'Status', value: agent?.status },
    { key: 'hireDate', label: 'Hire Date', value: agent?.hire_date ? formatDate(agent.hire_date, 'date') : null },
    { key: 'commissionRate', label: 'Commission Rate', value: agent?.commission_rate ? `${agent.commission_rate}%` : null },
  ];

  // Settings Information Data
  const settingsInfo = [
    { key: 'pushNotifications', label: 'Push Notifications', value: vendor?.push_notifications_enabled ? 'Enabled' : 'Disabled' },
    { key: 'emailNotifications', label: 'Email Notifications', value: vendor?.email_notifications_enabled ? 'Enabled' : 'Disabled' },
    { key: 'termsAccepted', label: 'Terms Accepted', value: vendor?.terms_accepted ? 'Yes' : 'No' },
    { key: 'termsAcceptedAt', label: 'Terms Accepted At', value: vendor?.terms_accepted_at ? formatDate(vendor.terms_accepted_at, 'datetime') : null },
    { key: 'interestRate', label: 'Interest Rate', value: vendor?.interest_rate ? `${vendor.interest_rate}%` : null },
  ];

  // Rating Information Data
  const ratingInfo = [
    { key: 'rating', label: 'Rating', value: vendor?.rating ? `${vendor.rating}/5` : null },
    { key: 'reviewCount', label: 'Review Count', value: vendor?.review_count },
    { key: 'totalRatingPoints', label: 'Total Rating Points', value: vendor?.total_rating_points },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Vendor Details
          </h1>
          <p className="text-gray-600 mt-1">
            {vendor?.full_name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(vendor?.account_status)}`}>
            {vendor?.account_status?.toUpperCase()}
          </span>
          <Button
            label="Edit Vendor"
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="px-4 py-2 text-sm"
            icon={Pencil}
          />
        </div>
      </div>

      {/* Vendor Statistics */}
      <div className="mb-6">
        <CollapsibleSection
          title="Vendor Statistics"
          icon={BarChart3}
          defaultExpanded={true}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vendorStats.map((stat) => (
              <div key={stat.key} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      </div>

      {/* Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Information */}
        <CollapsibleSection
          title="Personal Information"
          icon={User}
          badge={vendor?.account_status}
          badgeColor={vendor?.account_status === 'active' ? 'green' : 'yellow'}
          defaultExpanded={true}
        >
          <InfoGrid 
            data={personalInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Business Information */}
        <CollapsibleSection
          title="Business Information"
          icon={Building}
          badge={business?.category}
          badgeColor="blue"
          defaultExpanded={true}
        >
          <InfoGrid 
            data={businessInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Address Information */}
        <CollapsibleSection
          title="Address Information"
          icon={MapPin}
          defaultExpanded={false}
        >
          <InfoGrid 
            data={addressInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Bank Information */}
        <CollapsibleSection
          title="Bank Information"
          icon={CreditCard}
          badge={vendor?.account_verified ? 'Verified' : 'Unverified'}
          badgeColor={vendor?.account_verified ? 'green' : 'yellow'}
          defaultExpanded={false}
        >
          <InfoGrid 
            data={bankInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Agent Information */}
        {agent && (
          <CollapsibleSection
            title="Agent Information"
            icon={User}
            badge={agent?.status}
            badgeColor={agent?.status === 'active' ? 'green' : 'yellow'}
            defaultExpanded={false}
          >
            <InfoGrid 
              data={agentInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Settings Information */}
        <CollapsibleSection
          title="Settings & Preferences"
          icon={Shield}
          defaultExpanded={false}
        >
          <InfoGrid 
            data={settingsInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Rating Information */}
        {vendor?.rating && (
          <CollapsibleSection
            title="Rating & Reviews"
            icon={TrendingUp}
            defaultExpanded={false}
          >
            <InfoGrid 
              data={ratingInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Uploaded Documents */}
        {attachments.length > 0 && (
          <CollapsibleSection
            title="Uploaded Documents"
            icon={FileText}
            badge={`${attachments.length}`}
            badgeColor="blue"
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {attachments.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={doc.url}
                    alt={doc.filename || `Document ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 bg-white border-t text-sm text-gray-600 font-medium text-center">
                    {doc.filename || `Document ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Status Management */}
        <CollapsibleSection
          title="Status Management"
          icon={Shield}
          defaultExpanded={false}
        >
          <div className="space-y-6">
            {/* Account Status Update */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Account Status Update</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Select Status to be updated</label>
                  <select
                    value={selectedStatus}
                    onChange={handleChangeStatus}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <Button
                  label="Update Status"
                  onClick={handleUpdateStatus}
                  variant="solid"
                  size="md"
                  className="text-sm px-6 py-3"
                  loading={isLoading}
                />
              </div>
            </div>

            {/* Verification Status Update */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Verification Status Update</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Interest Rate</label>
                  <input
                    type="number"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter interest rate"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Select Verification Status</label>
                  <select
                    value={selectedVerificationStatus}
                    onChange={handleChangeVerificationStatus}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <Button
                  label="Update Verification Status"
                  onClick={handleUpdateVerificationStatus}
                  variant="solid"
                  size="md"
                  className="text-sm px-6 py-3"
                  loading={isverfied}
                />
              </div>
            </div>
          </div>
        </CollapsibleSection>

        {/* Actions */}
        <CollapsibleSection
          title="Actions"
          icon={Pencil}
          defaultExpanded={false}
        >
          <div className="flex flex-wrap gap-4">
            <Button
              label="Deactivate Vendor"
              onClick={handleDelete}
              variant="outline"
              size="md"
              className="text-red-600 border-red-600 hover:bg-red-50"
              loading={isLoad}
            />
            <Button
              label="Create SMS Application"
              onClick={() => handleSms(id)}
              variant="solid"
              size="md"
              className="bg-green-700 text-white hover:bg-green-800"
            />
            <a
              href="https://search.cac.gov.ng/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                label="Verify CAC"
                variant="outline"
                size="md"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              />
            </a>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}

export default ViewActivation