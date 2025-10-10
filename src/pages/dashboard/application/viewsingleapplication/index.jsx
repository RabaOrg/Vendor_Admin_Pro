import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSingleLoan } from '../../../../hooks/queries/loan';
import Button from '../../../../components/shared/button';
import axiosInstance from '../../../../../store/axiosInstance';
import { handleDeleteApplication, handleUpdateStatus, handleRestoreApplication } from '../../../../services/loans';

// Import new components
import CollapsibleSection from '../../../../components/application/CollapsibleSection';
import InfoGrid from '../../../../components/application/InfoGrid';
import FinancialSummaryCard from '../../../../components/application/FinancialSummaryCard';
import StatusTimeline from '../../../../components/application/StatusTimeline';

// Import utility functions
import { 
  formatCurrency, 
  formatDate, 
  formatFileSize,
  getStatusBadgeClasses
} from '../../../../utils/formatters';

// Import custom hook for paired sections
import { usePairedSections } from '../../../../hooks/usePairedSections';

// Import icons
import { 
  User, 
  Building, 
  ShoppingBag, 
  FileText,
  CreditCard,
  Banknote,
  Link,
  BarChart3,
  Pencil
} from 'lucide-react';

function SingleApplication() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [loanData, setLoanData] = useState(null);
  const queryClient = useQueryClient();
  const [isLoads] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: singleLoan, isPending, isError } = useFetchSingleLoan(id);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'customer-info', pairedWith: 'business-info', defaultExpanded: true },
    { id: 'business-info', pairedWith: 'customer-info', defaultExpanded: true },
    { id: 'vendor-info', pairedWith: 'product-details', defaultExpanded: false },
    { id: 'product-details', pairedWith: 'vendor-info', defaultExpanded: false },
    { id: 'bank-details', pairedWith: 'guarantor-info', defaultExpanded: false },
    { id: 'guarantor-info', pairedWith: 'bank-details', defaultExpanded: false },
    { id: 'uploaded-documents', pairedWith: 'payment-mandate', defaultExpanded: false },
    { id: 'payment-mandate', pairedWith: 'uploaded-documents', defaultExpanded: false },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/applications/${id}`);
        setLoanData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleEdit = () => {
    Navigate(`/edit_application/${id}`);
  };

  const handleDelete = async () => {
    try {
      const response = await handleDeleteApplication(id, {
        reason: "Invalid application data"
      });
      if (response) {
        toast.success("Application deleted successfully");
        Navigate("/application");
      }
    } catch {
      toast.error("Failed to delete application");
    }
  };

  const handleRestore = async () => {
    try {
      const response = await handleRestoreApplication(id);
      if (response) {
        toast.success("Application restored successfully");
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch {
      toast.error("Failed to restore application");
    }
  };

  const handleUpdateLoanStatus = async () => {
    if (selectedStatus === singleLoan?.status) {
      toast.error("Please select a different status to update");
      return;
    }

    setIsLoading(true);
    try {
      const response = await handleUpdateStatus(id, {
        status: selectedStatus,
      });
      if (response) {
        toast.success("Status updated successfully");
        setLoanData((prevData) => ({
          ...prevData,
          status: selectedStatus,
        }));
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch {
      toast.error("Failed to restore application");
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
        Error loading application.
          </div>
    );
  }

  if (!loanData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No application data found.
              </div>
    );
  }

  // Extract data from the API response structure - the actual data is in loanData.data
  const applicationData = loanData?.data;
  
  if (!applicationData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No application data found in response.
              </div>
    );
  }
  
  const { 
    reference, 
    status, 
    application_type,
    amount,
    down_payment_amount,
    monthly_repayment,
    lease_tenure,
    lease_tenure_unit,
    created_at,
    updated_at,
    Customer,
    Vendor,
    Product,
    application_data,
    documents,
    customer_details,
    mandates,
    transactions,
    schedules,
    sms_link,
    upload_summary,
    application_source,
    is_custom_product
  } = applicationData;

  // Calculate next repayment date from schedules
  const getNextRepaymentDate = () => {
    if (!schedules || schedules.length === 0) return 'N/A';
    
    // Find the first unpaid schedule
    const nextSchedule = schedules.find(schedule => 
      schedule.status === 'pending' || schedule.status === 'overdue'
    );
    
    if (nextSchedule && nextSchedule.due_date) {
      return formatDate(nextSchedule.due_date, 'short');
    }
    
    return 'N/A';
  };

  // Prepare data for different sections
  const customerInfo = [
    { key: 'fullName', label: 'Full Name', value: Customer?.full_name },
    { key: 'email', label: 'Email', value: Customer?.email },
    { key: 'phone', label: 'Phone Number', value: Customer?.phone_number },
    { key: 'bvn', label: 'BVN', value: Customer?.bvn },
    { key: 'age', label: 'Age', value: Customer?.age },
    { key: 'dob', label: 'Date of Birth', value: Customer?.dob ? formatDate(Customer.dob) : null },
    { key: 'address', label: 'Address', value: Customer?.address },
    { key: 'state', label: 'State', value: Customer?.state },
    { key: 'lga', label: 'LGA', value: Customer?.lga },
    { key: 'customerStatus', label: 'Customer Status', value: Customer?.customer_status },
    { key: 'createdAt', label: 'Customer Since', value: Customer?.created_at ? formatDate(Customer.created_at) : null },
  ];

  const businessInfo = [
    { key: 'businessName', label: 'Business Name', value: Customer?.business_name },
    { key: 'businessStreet', label: 'Business Street', value: Customer?.business_street },
    { key: 'businessCity', label: 'Business City', value: Customer?.business_city },
    { key: 'businessLandmark', label: 'Business Landmark', value: Customer?.business_landmark },
    { key: 'businessLga', label: 'Business LGA', value: Customer?.business_lga },
    { key: 'businessState', label: 'Business State', value: Customer?.business_state },
    { key: 'businessTenure', label: 'Business Tenure', value: Customer?.business_tenure },
    { key: 'cacDocument', label: 'CAC Document', value: Customer?.cac_registration_document ? 'Uploaded' : 'Not Uploaded' },
  ];

  const vendorInfo = [
    { key: 'vendorName', label: 'Vendor Name', value: Vendor?.first_name && Vendor?.last_name ? `${Vendor.first_name} ${Vendor.last_name}` : 'N/A' },
    { key: 'vendorEmail', label: 'Vendor Email', value: Vendor?.email },
    { key: 'vendorPhone', label: 'Vendor Phone', value: Vendor?.phone_number },
    { key: 'verificationStatus', label: 'Verification Status', value: Vendor?.verification_status },
    { key: 'accountStatus', label: 'Account Status', value: Vendor?.account_status },
    { key: 'interestRate', label: 'Interest Rate', value: Vendor?.interest_rate ? `${Vendor.interest_rate}%` : null },
    { key: 'businessName', label: 'Vendor Business', value: Vendor?.Business?.name },
    { key: 'businessCategory', label: 'Business Category', value: Vendor?.Business?.category },
    { key: 'businessSubCategory', label: 'Sub Category', value: Vendor?.Business?.sub_category },
    { key: 'cacNumber', label: 'CAC Number', value: Vendor?.Business?.cac_number },
    { key: 'timeInBusiness', label: 'Time in Business', value: Vendor?.Business?.time_in_business },
    { key: 'monthlyRevenue', label: 'Monthly Revenue', value: Vendor?.Business?.monthly_revenue ? formatCurrency(Vendor.Business.monthly_revenue) : null },
    { key: 'businessState', label: 'Business State', value: Vendor?.Business?.state },
    { key: 'businessLga', label: 'Business LGA', value: Vendor?.Business?.lga },
    { key: 'businessAddress', label: 'Business Address', value: Vendor?.Business?.street_address },
  ];

  const productInfo = [
    { key: 'productName', label: 'Product Name', value: Product?.name },
    { key: 'description', label: 'Description', value: Product?.description },
    { key: 'category', label: 'Category', value: Product?.category },
    { key: 'price', label: 'Product Price', value: Product?.price ? formatCurrency(Product.price) : null },
    { key: 'shippingDaysMin', label: 'Min Shipping Days', value: Product?.shipping_days_min },
    { key: 'shippingDaysMax', label: 'Max Shipping Days', value: Product?.shipping_days_max },
    { key: 'stock', label: 'Stock', value: Product?.stock },
    { key: 'featured', label: 'Featured', value: Product?.featured ? 'Yes' : 'No' },
    { key: 'leaseEligible', label: 'Lease Eligible', value: Product?.lease_eligible ? 'Yes' : 'No' },
    { key: 'approvalStatus', label: 'Approval Status', value: Product?.approval_status },
    { key: 'isCustom', label: 'Custom Product', value: is_custom_product ? 'Yes' : 'No' },
  ];

  const bankInfo = [
    { key: 'bankName', label: 'Bank Name', value: customer_details?.bank_details?.bank_name },
    { key: 'accountNumber', label: 'Account Number', value: customer_details?.bank_details?.account_number },
    { key: 'accountName', label: 'Account Name', value: customer_details?.bank_details?.account_name },
    { key: 'bankCode', label: 'Bank Code', value: customer_details?.bank_details?.bank_code },
  ];

  const guarantorInfo = [
    { key: 'name', label: 'Guarantor Name', value: customer_details?.guarantor?.name },
    { key: 'phone', label: 'Guarantor Phone', value: customer_details?.guarantor?.phone },
    { key: 'email', label: 'Guarantor Email', value: customer_details?.guarantor?.email },
    { key: 'address', label: 'Guarantor Address', value: customer_details?.guarantor?.address },
    { key: 'whatsapp', label: 'WhatsApp', value: customer_details?.guarantor?.whatsapp },
    { key: 'primaryMethod', label: 'Primary Communication', value: customer_details?.guarantor?.communication_preferences?.primaryMethod },
    { key: 'smsAvailable', label: 'SMS Available', value: customer_details?.guarantor?.communication_preferences?.smsAvailable ? 'Yes' : 'No' },
    { key: 'whatsappAvailable', label: 'WhatsApp Available', value: customer_details?.guarantor?.communication_preferences?.whatsappAvailable ? 'Yes' : 'No' },
    { key: 'emailAvailable', label: 'Email Available', value: customer_details?.guarantor?.communication_preferences?.emailAvailable ? 'Yes' : 'No' },
  ];

  // Financial data for FinancialSummaryCard
  const financialData = application_data?.calculation_breakdown ? {
    displayPrice: application_data.calculation_breakdown.display_price,
    managementFee: application_data.calculation_breakdown.management_fee,
    totalWithManagementFee: application_data.calculation_breakdown.total_with_management_fee,
    downPayment: application_data.calculation_breakdown.down_payment,
    downPaymentPercent: application_data.calculation_breakdown.down_payment_percent,
    financedAmount: application_data.calculation_breakdown.financed_amount,
    interestRate: application_data.calculation_breakdown.monthly_interest_rate,
    totalInterest: application_data.calculation_breakdown.total_interest,
    monthlyPayment: application_data.calculation_breakdown.monthly_payment,
    leaseTermMonths: application_data.calculation_breakdown.lease_term_months,
    leaseTenureUnit: lease_tenure_unit,
  } : null;

  // Application overview data
  const applicationOverview = [
    { key: 'reference', label: 'Application Reference', value: reference || 'N/A' },
    { key: 'applicationType', label: 'Application Type', value: application_type || 'N/A' },
    { key: 'applicationSource', label: 'Application Source', value: application_source || 'N/A' },
    { key: 'totalAmount', label: 'Total Amount', value: amount ? formatCurrency(amount) : 'N/A' },
    { key: 'downPayment', label: 'Down Payment', value: down_payment_amount ? formatCurrency(down_payment_amount) : 'N/A' },
    { key: 'monthlyRepayment', label: 'Monthly Repayment', value: monthly_repayment ? formatCurrency(monthly_repayment) : 'N/A' },
    { key: 'leaseTenure', label: 'Lease Tenure', value: lease_tenure && lease_tenure_unit ? `${lease_tenure} ${lease_tenure_unit}s` : 'N/A' },
    { key: 'nextRepaymentDate', label: 'Next Repayment Date', value: getNextRepaymentDate() },
    { key: 'createdAt', label: 'Created At', value: created_at ? formatDate(created_at, 'datetime') : 'N/A' },
    { key: 'updatedAt', label: 'Last Updated', value: updated_at ? formatDate(updated_at, 'datetime') : 'N/A' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Application Details
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Reference: {reference} • {Customer?.full_name}
          </p>
              </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(status)}`}>
            {status?.replace('_', ' ').toUpperCase()}
          </span>
          <Button
            label="Edit Application"
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            icon={Pencil}
                />
              </div>
              </div>

      {/* Application Overview - Always Visible */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          Application Overview
        </h2>
        <InfoGrid 
          data={applicationOverview}
          columns={{ mobile: 1, tablet: 2, desktop: 2 }}
                />
              </div>

      {/* Financial Summary - Expanded by default */}
      {financialData && (
        <div className="mb-6">
          <FinancialSummaryCard financialData={financialData} />
              </div>
      )}

      {/* Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Customer Information */}
        <CollapsibleSection
          title="Customer Information"
          icon={User}
          badge={Customer?.customer_status}
          badgeColor="green"
          defaultExpanded={getSectionState('customer-info')}
          onToggle={(isExpanded) => toggleSection('customer-info', isExpanded)}
        >
          <InfoGrid 
            data={customerInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Business Information */}
        <CollapsibleSection
          title="Business Information"
          icon={Building}
          defaultExpanded={getSectionState('business-info')}
          onToggle={(isExpanded) => toggleSection('business-info', isExpanded)}
        >
          <InfoGrid 
            data={businessInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Vendor Information */}
        <CollapsibleSection
          title="Vendor Information"
          icon={Building}
          badge={Vendor?.verification_status}
          badgeColor={Vendor?.verification_status === 'approved' ? 'green' : 'yellow'}
          defaultExpanded={getSectionState('vendor-info')}
          onToggle={(isExpanded) => toggleSection('vendor-info', isExpanded)}
        >
          <InfoGrid 
            data={vendorInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Product Details */}
        <CollapsibleSection
          title="Product Details"
          icon={ShoppingBag}
          badge={Product?.approval_status}
          badgeColor={Product?.approval_status === 'approved' ? 'green' : 'yellow'}
          defaultExpanded={getSectionState('product-details')}
          onToggle={(isExpanded) => toggleSection('product-details', isExpanded)}
        >
          <InfoGrid 
            data={productInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Bank Details */}
        <CollapsibleSection
          title="Bank Details"
          icon={CreditCard}
          defaultExpanded={getSectionState('bank-details')}
          onToggle={(isExpanded) => toggleSection('bank-details', isExpanded)}
        >
          <InfoGrid 
            data={bankInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Guarantor Information */}
        <CollapsibleSection
          title="Guarantor Information"
          icon={User}
          defaultExpanded={getSectionState('guarantor-info')}
          onToggle={(isExpanded) => toggleSection('guarantor-info', isExpanded)}
        >
          <InfoGrid 
            data={guarantorInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Uploaded Documents */}
        <CollapsibleSection
          title="Uploaded Documents"
          icon={FileText}
          badge={upload_summary?.total_documents || 0}
          badgeColor="blue"
          defaultExpanded={getSectionState('uploaded-documents')}
          onToggle={(isExpanded) => toggleSection('uploaded-documents', isExpanded)}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Card */}
            {documents?.id_card && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ID Card
                </label>
                <div className="border rounded-md p-3 bg-white shadow-sm">
                      <img
                    src={documents.id_card.signed_url}
                        alt="ID Card"
                        className="w-full h-60 object-contain rounded-md mb-3 cursor-pointer hover:opacity-90 transition"
                        onClick={() => setIsViewerOpen(true)}
                      />
                      <a
                    href={documents.id_card.signed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline"
                        download
                      >
                        Download ID Card
                      </a>
                      {isViewerOpen && (
                        <div
                          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                          onClick={() => setIsViewerOpen(false)}
                        >
                          <div className="relative">
                            <img
                          src={documents.id_card.signed_url}
                              alt="ID Card Large View"
                              className="max-w-[90vw] max-h-[90vh] rounded-md shadow-lg"
                            />
                            <button
                              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow hover:bg-gray-200 transition"
                              onClick={() => setIsViewerOpen(false)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                  )}
                </div>
              </div>
            )}

            {/* Bank Statement */}
            {documents?.bank_statement && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Bank Statement
                </label>
                <div className="border rounded-md p-4 bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">
                      {documents.bank_statement.original_filename || 'Bank Statement'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Uploaded on {formatDate(documents.bank_statement.upload_timestamp)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Size: {formatFileSize(documents.bank_statement.size)}
                    </p>
                  </div>
                  <a
                    href={documents.bank_statement.signed_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}

            {/* CAC Document */}
            {documents?.cac_document && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  CAC Document
                </label>
                <div className="border rounded-md p-4 bg-white shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 text-sm font-medium">
                      {documents.cac_document.original_filename || 'CAC Document'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Uploaded on {formatDate(documents.cac_document.upload_timestamp)}
                    </p>
                  </div>
                  <a
                    href={documents.cac_document.signed_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                    >
                      Download
                    </a>
                </div>
              </div>
                  )}
                </div>

          {/* Upload Summary */}
          {upload_summary && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Upload Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Documents:</span>
                  <span className="ml-2 font-medium">{upload_summary.total_documents}</span>
              </div>
                <div>
                  <span className="text-gray-600">Successful:</span>
                  <span className="ml-2 font-medium text-green-600">{upload_summary.upload_summary_details?.successful}</span>
                </div>
                <div>
                  <span className="text-gray-600">Failed:</span>
                  <span className="ml-2 font-medium text-red-600">{upload_summary.upload_summary_details?.failed}</span>
                </div>
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <span className="ml-2 font-medium text-green-600">{upload_summary.documents_upload_completed ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* Payment Mandate */}
        {mandates && mandates.length > 0 && (
          <CollapsibleSection
            title="Payment Mandate"
            icon={CreditCard}
            badge={mandates[0]?.status}
            badgeColor={mandates[0]?.status === 'active' ? 'green' : 'yellow'}
            defaultExpanded={getSectionState('payment-mandate')}
            onToggle={(isExpanded) => toggleSection('payment-mandate', isExpanded)}
          >
            <div className="space-y-4">
              {mandates.map((mandate, index) => (
                <div key={mandate.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Mandate #{mandate.id}
                  </h4>
                  <InfoGrid 
                    data={[
                      { key: 'amount', label: 'Amount', value: mandate.amount ? formatCurrency(mandate.amount) : null },
                      { key: 'frequency', label: 'Frequency', value: mandate.frequency },
                      { key: 'status', label: 'Status', value: mandate.status },
                      { key: 'reference', label: 'Reference', value: mandate.reference },
                      { key: 'mandateId', label: 'Mandate ID', value: mandate.mandateId },
                      { key: 'authorizationUrl', label: 'Authorization URL', value: mandate.authorizationUrl },
                      { key: 'successfulDebits', label: 'Successful Debits', value: mandate.successfulDebits },
                      { key: 'failedDebits', label: 'Failed Debits', value: mandate.failedDebits },
                      { key: 'totalDebits', label: 'Total Debits', value: mandate.totalDebits },
                      { key: 'lastDebitDate', label: 'Last Debit Date', value: mandate.lastDebitDate ? formatDate(mandate.lastDebitDate) : null },
                      { key: 'expiresAt', label: 'Expires At', value: mandate.expiresAt ? formatDate(mandate.expiresAt) : null },
                      { key: 'createdAt', label: 'Created At', value: mandate.createdAt ? formatDate(mandate.createdAt) : null },
                    ]}
                    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                  />
            </div>
              ))}
          </div>
          </CollapsibleSection>
        )}

        {/* Transactions */}
        {transactions && transactions.length > 0 && (
          <CollapsibleSection
            title="Transactions"
            icon={Banknote}
            badge={transactions.length}
            badgeColor="blue"
            defaultExpanded={false}
          >
            <div className="space-y-4">
              {transactions.map((txn, index) => (
                <div key={txn.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Transaction #{txn.id}
                  </h4>
                  <InfoGrid 
                    data={[
                      { key: 'amount', label: 'Amount', value: txn.amount ? formatCurrency(txn.amount) : null },
                      { key: 'status', label: 'Status', value: txn.status },
                      { key: 'transactionType', label: 'Transaction Type', value: txn.transactionType },
                      { key: 'paymentMethod', label: 'Payment Method', value: txn.paymentMethod },
                      { key: 'reference', label: 'Reference', value: txn.reference },
                      { key: 'paystackReference', label: 'Paystack Reference', value: txn.paystackReference },
                      { key: 'createdAt', label: 'Created At', value: txn.createdAt ? formatDate(txn.createdAt, 'datetime') : null },
                      { key: 'processedAt', label: 'Processed At', value: txn.processedAt ? formatDate(txn.processedAt, 'datetime') : null },
                      { key: 'updatedAt', label: 'Updated At', value: txn.updatedAt ? formatDate(txn.updatedAt, 'datetime') : null },
                    ]}
                    columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                  />
                  
                  {/* Card Details */}
                  {txn.metadata?.card_details && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-semibold text-gray-700 mb-3">Card Details</h5>
                      <InfoGrid 
                        data={[
                          { key: 'bank', label: 'Bank', value: txn.metadata.card_details.bank },
                          { key: 'brand', label: 'Brand', value: txn.metadata.card_details.brand },
                          { key: 'cardType', label: 'Card Type', value: txn.metadata.card_details.card_type },
                          { key: 'last4', label: 'Last 4', value: txn.metadata.card_details.last4 },
                          { key: 'expiry', label: 'Expiry', value: `${txn.metadata.card_details.exp_month || ""}/${txn.metadata.card_details.exp_year || ""}` },
                        ]}
                        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* SMS Link */}
        {sms_link && (
          <CollapsibleSection
            title="SMS Link"
            icon={Link}
            badge={sms_link.status}
            badgeColor={sms_link.status === 'active' ? 'green' : 'gray'}
            defaultExpanded={false}
          >
            <InfoGrid 
              data={[
                { key: 'token', label: 'Token', value: sms_link.token },
                { key: 'url', label: 'URL', value: sms_link.url },
                { key: 'status', label: 'Status', value: sms_link.status },
                { key: 'expiresAt', label: 'Expires At', value: sms_link.expires_at ? formatDate(sms_link.expires_at) : 'Never' },
              ]}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            />
          </CollapsibleSection>
        )}
      </div>

      {/* Status Update Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Status Update</h3>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">
              Select Status to be updated
            </label>
            <select
              value={selectedStatus}
              onChange={handleChangeStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
              <option value="awaiting_downpayment">Awaiting Down Payment</option>
              <option value="awaiting_delivery">Awaiting Delivery</option>
              <option value="processing">Processing</option>
            </select>
          </div>
          <Button
            label="Update Status"
            onClick={handleUpdateLoanStatus}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
          <Button
            label="Delete Application"
            onClick={handleDelete}
            variant="transparent"
            size="md"
            className="text-sm px-6 py-3 text-red-600 hover:text-red-800"
            loading={isLoading}
          />
          <Button
            label="Restore Application"
            onClick={handleRestore}
            variant="outline"
            size="md"
            className="text-sm px-6 py-3 text-green-600 border-green-600 hover:bg-green-50"
            loading={isLoads}
          />
        </div>

      {/* Status Timeline */}
      <div className="mt-6">
        <StatusTimeline applicationData={applicationData} />
      </div>
    </div>
  );
}

export default SingleApplication;