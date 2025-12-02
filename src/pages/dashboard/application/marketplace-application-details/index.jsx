import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSingleLoan } from '../../../../hooks/queries/loan';
import Button from '../../../../components/shared/button';
import axiosInstance from '../../../../../store/axiosInstance';
import { handleDeleteApplication, handleUpdateStatus, handleRestoreApplication } from '../../../../services/loans';
import { restartMandate } from '../../../../services/application';

// Import new components
import CollapsibleSection from '../../../../components/application/CollapsibleSection';
import InfoGrid from '../../../../components/application/InfoGrid';
import FinancialSummaryCard from '../../../../components/application/FinancialSummaryCard';
import StatusTimeline from '../../../../components/application/StatusTimeline';
import ActionCard from '../../../../components/application/ActionCard';
import CreateActionModal from '../../../../components/modals/CreateActionModal';

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
  Pencil,
  AlertCircle
} from 'lucide-react';

function MarketplaceApplicationDetails() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [loanData, setLoanData] = useState(null);
  const [userKycData, setUserKycData] = useState(null);
  const [isLoadingKyc, setIsLoadingKyc] = useState(false);
  const queryClient = useQueryClient();
  const [isLoads] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: singleLoan, isPending, isError } = useFetchSingleLoan(id);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'customer-info', pairedWith: 'business-info', defaultExpanded: true },
    { id: 'business-info', pairedWith: 'customer-info', defaultExpanded: true },
    { id: 'vendor-info', pairedWith: 'product-details', defaultExpanded: false },
    { id: 'product-details', pairedWith: 'vendor-info', defaultExpanded: false },
    { id: 'bank-details', pairedWith: 'guarantor-info', defaultExpanded: false },
    { id: 'guarantor-info', pairedWith: 'bank-details', defaultExpanded: false },
    { id: 'actions-section', pairedWith: null, defaultExpanded: false },
    { id: 'uploaded-documents', pairedWith: 'quote-documents', defaultExpanded: false },
    { id: 'quote-documents', pairedWith: 'uploaded-documents', defaultExpanded: false },
    { id: 'quote-document-info', pairedWith: null, defaultExpanded: false },
    { id: 'repayment-plan', pairedWith: 'repayment-schedule', defaultExpanded: false },
    { id: 'payment-mandate', pairedWith: 'repayment-schedule', defaultExpanded: false },
    { id: 'repayment-schedule', pairedWith: 'repayment-plan', defaultExpanded: false },
    { id: 'transactions', pairedWith: 'status-timeline', defaultExpanded: false },
    { id: 'status-timeline', pairedWith: 'transactions', defaultExpanded: false },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/admin/applications/${id}`);
        setLoanData(response.data);
        
        // For marketplace applications, fetch user KYC data
        const appData = response.data?.data;
        if (appData && (appData.user_id || appData.application_type === 'marketplace' || appData.application_source === 'marketplace')) {
          const userId = appData.user_id;
          if (userId) {
            setIsLoadingKyc(true);
            try {
              const kycResponse = await axiosInstance.get(`/api/admin/customers/user/${userId}`);
              setUserKycData(kycResponse.data?.data?.user);
            } catch (kycError) {
              console.error('Error fetching user KYC data:', kycError);
              // Don't show error toast - just log it, as application data might still be useful
            } finally {
              setIsLoadingKyc(false);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load application data');
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

  const handleQuoteDocumentReview = async (documentId, status) => {
    try {
      const response = await axiosInstance.put(`/api/admin/quote-documents/${documentId}/review`, {
        status,
        review_notes: status === 'rejected' ? 'Document rejected by admin' : 'Document approved by admin'
      });

      if (response.data.success) {
        toast.success(`Document ${status} successfully`);
        // Refresh the application data
        const updatedResponse = await axiosInstance.get(`/api/admin/applications/${id}`);
        setLoanData(updatedResponse.data);
      }
    } catch (error) {
      console.log('Quote documents API not available or error reviewing quote document:', error.message);
      toast.error('Quote documents functionality is currently unavailable');
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
      toast.error("Failed to update application status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAction = async (actionData) => {
    try {
      const response = await axiosInstance.post(`/api/admin/applications/${id}/actions`, actionData);
      if (response.status === 201) {
        toast.success('Action created successfully');
        setShowActionModal(false);
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch (error) {
      console.error('Error creating action:', error);
      toast.error('Failed to create action');
    }
  };

  const handleActionStatusUpdate = async (actionId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/api/admin/actions/${actionId}/status`, {
        status: newStatus
      });
      if (response.status === 200) {
        toast.success(`Action ${newStatus === 'resolved' ? 'resolved' : 'cancelled'} successfully`);
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch (error) {
      console.error('Error updating action status:', error);
      toast.error('Failed to update action status');
    }
  };

  const handleRestartMandate = async (mandateId, applicationId) => {
    try {
      await restartMandate(applicationId, 'Admin initiated mandate restart');
      toast.success('Mandate restart initiated successfully');
      queryClient.invalidateQueries(["singleLoanApplication", id]);
    } catch (error) {
      console.error('Error restarting mandate:', error);
      toast.error(error.response?.data?.message || 'Failed to restart mandate');
    }
  };

  const handleGenerateSchedule = async () => {
    setIsGeneratingSchedule(true);
    try {
      const response = await axiosInstance.post(`/api/admin/applications/${id}/generate-schedule`);
      if (response.data.success || response.status === 200) {
        toast.success('Repayment schedule generated successfully');
        const updatedResponse = await axiosInstance.get(`/api/admin/applications/${id}`);
        setLoanData(updatedResponse.data);
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to generate repayment schedule');
    } finally {
      setIsGeneratingSchedule(false);
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

  // Extract data from the API response structure
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
    down_payment_percent,
    monthly_repayment,
    interest_rate,
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
    is_custom_product,
    quote_document_info
  } = applicationData;

  // Calculate next repayment date from schedules
  const getNextRepaymentDate = () => {
    if (!schedules || schedules.length === 0) return 'N/A';

    const nextSchedule = schedules.find(schedule =>
      schedule.status === 'pending' || schedule.status === 'overdue'
    );

    if (nextSchedule && (nextSchedule.dueDate || nextSchedule.due_date)) {
      return formatDate(nextSchedule.dueDate || nextSchedule.due_date, 'short');
    }

    return 'N/A';
  };

  // For marketplace applications, merge Customer data with user KYC data
  // Priority: userKycData > Customer > customer_details
  const customerSource = userKycData ? {
    full_name: `${userKycData.first_name || ''} ${userKycData.last_name || ''}`.trim(),
    email: userKycData.email,
    phone_number: userKycData.phone_number,
    bvn: userKycData.bvn,
    address: userKycData.address,
    state: userKycData.state,
    lga: userKycData.lga,
    dob: userKycData.dob,
    age: userKycData.dob ? Math.floor((new Date() - new Date(userKycData.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null,
    gender: userKycData.gender,
    cac_number: userKycData.cac_number,
    monthly_income: userKycData.monthly_income,
    monthly_expenses: userKycData.monthly_expenses,
    id_card_url: userKycData.id_card_url,
    kyc_status: userKycData.kyc_status || (userKycData.kyc_completed ? 'pending' : 'incomplete'),
    account_status: userKycData.account_status || 'active',
    created_at: userKycData.created_at,
    // Business info from UserBusiness
    business_name: userKycData.business_name || userKycData.UserBusiness?.business_name,
    business_street: userKycData.business_address || userKycData.UserBusiness?.business_address,
    business_city: userKycData.UserBusiness?.city,
    business_landmark: userKycData.UserBusiness?.landmark,
    business_lga: userKycData.UserBusiness?.lga,
    business_state: userKycData.UserBusiness?.state,
    business_tenure: userKycData.UserBusiness?.years_in_business,
    cac_registration_document: userKycData.UserBusiness?.cac_document_url,
    // Guarantor info
    guarantor_name: userKycData.guarantor_name,
    guarantor_phone: userKycData.guarantor_phone,
    guarantor_email: userKycData.guarantor_email,
    guarantor_address: userKycData.guarantor_address,
  } : (Customer || {});

  const customerInfo = [
    { key: 'fullName', label: 'Full Name', value: customerSource?.full_name || (userKycData ? `${userKycData.first_name || ''} ${userKycData.last_name || ''}`.trim() : 'N/A') },
    { key: 'email', label: 'Email', value: customerSource?.email || userKycData?.email || 'N/A' },
    { key: 'phone', label: 'Phone Number', value: customerSource?.phone_number || userKycData?.phone_number || 'N/A' },
    { key: 'bvn', label: 'BVN', value: customerSource?.bvn || userKycData?.bvn || customer_details?.bvn || 'N/A' },
    { key: 'age', label: 'Age', value: customerSource?.age || (userKycData?.dob ? Math.floor((new Date() - new Date(userKycData.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : null) || 'N/A' },
    { key: 'dob', label: 'Date of Birth', value: (customerSource?.dob || userKycData?.dob) ? formatDate(customerSource?.dob || userKycData.dob) : 'N/A' },
    { key: 'gender', label: 'Gender', value: customerSource?.gender || userKycData?.gender || 'N/A' },
    { key: 'address', label: 'Address', value: customerSource?.address || userKycData?.address || customer_details?.address || 'N/A' },
    { key: 'state', label: 'State', value: customerSource?.state || userKycData?.state || customer_details?.state || 'N/A' },
    { key: 'lga', label: 'LGA', value: customerSource?.lga || userKycData?.lga || customer_details?.lga || 'N/A' },
    { key: 'cacNumber', label: 'CAC Number', value: customerSource?.cac_number || userKycData?.cac_number || 'N/A' },
    { key: 'monthlyIncome', label: 'Monthly Income', value: customerSource?.monthly_income || userKycData?.monthly_income ? formatCurrency(customerSource?.monthly_income || userKycData.monthly_income) : 'N/A' },
    { key: 'monthlyExpenses', label: 'Monthly Expenses', value: customerSource?.monthly_expenses || userKycData?.monthly_expenses ? formatCurrency(customerSource?.monthly_expenses || userKycData.monthly_expenses) : 'N/A' },
    { key: 'kycStatus', label: 'KYC Status', value: customerSource?.kyc_status || userKycData?.kyc_status || (userKycData?.kyc_completed ? 'pending' : 'incomplete') || 'pending' },
    { key: 'accountStatus', label: 'Account Status', value: customerSource?.account_status || userKycData?.account_status || customerSource?.customer_status || 'active' },
    { key: 'createdAt', label: 'Customer Since', value: (customerSource?.created_at || userKycData?.created_at) ? formatDate(customerSource?.created_at || userKycData.created_at) : 'N/A' },
  ];

  // Business info - from UserBusiness model via userKycData or customer_details
  // Note: UserBusiness model only has: business_name, business_address, business_phone, business_type, business_email, business_description
  const businessInfoSource = customer_details?.business_info || {};
  const userBusiness = userKycData?.UserBusiness || {};
  
  // Get business name - priority: UserBusiness > User table > customer_details
  const businessName = userBusiness?.business_name || userKycData?.business_name || customerSource?.business_name || businessInfoSource?.business_name;
  
  // Get business address - priority: UserBusiness > User table > customer_details
  const businessAddress = userBusiness?.business_address || userKycData?.business_address || customerSource?.business_street || businessInfoSource?.business_street;
  
  const businessInfo = [
    { key: 'businessName', label: 'Business Name', value: businessName || 'N/A' },
    { key: 'businessAddress', label: 'Business Address', value: businessAddress || 'N/A' },
    { key: 'businessPhone', label: 'Business Phone', value: userBusiness?.business_phone || userKycData?.business_phone || 'N/A' },
    { key: 'businessType', label: 'Business Type', value: userBusiness?.business_type || userKycData?.business_type || 'N/A' },
    { key: 'businessEmail', label: 'Business Email', value: userBusiness?.business_email || userKycData?.business_email || 'N/A' },
    { key: 'businessDescription', label: 'Business Description', value: userBusiness?.business_description || userKycData?.business_description || 'N/A' },
    { key: 'businessDetailsCompleted', label: 'Business Details Completed', value: userBusiness?.is_completed ? 'Yes' : 'No' },
    { key: 'cacDocument', label: 'CAC Document', value: (userKycData?.cac_number || customerSource?.cac_number || businessInfoSource?.has_cac_document) ? 'Uploaded' : 'Not Uploaded' },
  ];

  const vendorInfo = Vendor ? [
    { key: 'vendorName', label: 'Vendor Name', value: Vendor?.first_name && Vendor?.last_name ? `${Vendor.first_name} ${Vendor.last_name}` : 'N/A' },
    { key: 'vendorEmail', label: 'Vendor Email', value: Vendor?.email },
    { key: 'vendorPhone', label: 'Vendor Phone', value: Vendor?.phone_number },
    { key: 'verificationStatus', label: 'Verification Status', value: Vendor?.verification_status },
    { key: 'accountStatus', label: 'Account Status', value: Vendor?.account_status },
    { key: 'interestRate', label: 'Interest Rate', value: Vendor?.interest_rate ? `${Vendor.interest_rate}%` : null },
    { key: 'businessName', label: 'Vendor Business', value: Vendor?.Business?.name },
    { key: 'businessCategory', label: 'Business Category', value: Vendor?.Business?.category },
  ] : [
    { key: 'vendorInfo', label: 'Vendor', value: 'Admin Created' }
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

  // Bank details - from UserFinancialAccount via userKycData or customer_details
  // Get verified account first, then first account
  const verifiedAccount = userKycData?.UserFinancialAccounts?.find(acc => acc.is_verified) || userKycData?.UserFinancialAccounts?.[0];
  const bankInfo = [
    { key: 'bankName', label: 'Bank Name', value: verifiedAccount?.bank_name || customer_details?.bank_details?.bank_name || userKycData?.bank_name || 'N/A' },
    { key: 'accountNumber', label: 'Account Number', value: verifiedAccount?.account_number || customer_details?.bank_details?.account_number || userKycData?.account_number || 'N/A' },
    { key: 'accountName', label: 'Account Name', value: verifiedAccount?.account_name || customer_details?.bank_details?.account_name || userKycData?.account_name || 'N/A' },
    { key: 'bankCode', label: 'Bank Code', value: verifiedAccount?.bank_code || customer_details?.bank_details?.bank_code || userKycData?.bank_code || 'N/A' },
    { key: 'isVerified', label: 'Verification Status', value: verifiedAccount?.is_verified ? 'Verified' : 'Not Verified' },
  ];

  // Guarantors information - from application or user KYC data
  const guarantorsData = applicationData?.Guarantors || [];
  const guarantorsFromApplicationData = application_data?.guarantors || [];
  
  // If no guarantors from application, check user KYC data
  const guarantorFromKyc = (userKycData?.guarantor_name && userKycData?.guarantor_phone) ? [{
    id: 'kyc-guarantor',
    name: userKycData.guarantor_name,
    phone_number: userKycData.guarantor_phone,
    email: userKycData.guarantor_email,
    address: userKycData.guarantor_address,
    relationship: 'guarantor',
    verification_status: 'pending'
  }] : [];

  const allGuarantors = guarantorsData.length > 0 
    ? guarantorsData 
    : (guarantorsFromApplicationData.length > 0 
      ? guarantorsFromApplicationData.map(g => ({
          id: g.id,
          name: g.name,
          phone_number: g.phone,
          email: g.email,
          address: g.address,
          relationship: g.relationship,
          verification_status: g.verification_status
        }))
      : guarantorFromKyc);

  const guarantorInfo = allGuarantors.length > 0 ? allGuarantors.map((guarantor, index) => [
    { key: `name_${index}`, label: `${guarantor.relationship === 'guarantor' ? 'Guarantor' : 'Family Member'} ${index + 1} Name`, value: guarantor.name },
    { key: `phone_${index}`, label: 'Phone', value: guarantor.phone_number },
    { key: `email_${index}`, label: 'Email', value: guarantor.email },
    { key: `address_${index}`, label: 'Address', value: guarantor.address },
    { key: `relationship_${index}`, label: 'Relationship', value: guarantor.relationship },
    { key: `verification_${index}`, label: 'Verification Status', value: guarantor.verification_status || 'pending' }
  ]).flat() : [
    { key: 'no_guarantors', label: 'Guarantors', value: 'No guarantors found' }
  ];

  // Helper function to get the correct product price for marketplace applications
  // For marketplace apps, the 'amount' field incorrectly stores lease total instead of product price
  // The Product.price field contains the actual product price from the Product table
  const getProductPrice = () => {
    // For marketplace applications, use Product.price if available (this is the actual product price)
    if (application_type === 'marketplace' && Product?.price) {
      return parseFloat(Product.price);
    }
    
    // Fallback: Check if we have pricing breakdown with product price
    if (application_data?.pricingBreakdown?.productPrice) {
      return parseFloat(application_data.pricingBreakdown.productPrice);
    }
    
    // Fallback: Check calculation breakdown
    if (application_data?.calculation_breakdown?.display_price) {
      return parseFloat(application_data.calculation_breakdown.display_price);
    }
    
    // Fallback: Calculate from cart items
    if (application_data?.cartItems && Array.isArray(application_data.cartItems) && application_data.cartItems.length > 0) {
      const productPriceTotal = application_data.cartItems.reduce((sum, cartItem) => {
        const unitPrice = parseFloat(cartItem.unitPrice || cartItem.product?.priceInNaira || 0);
        const quantity = parseInt(cartItem.quantity || 1);
        return sum + (unitPrice * quantity);
      }, 0);
      
      if (productPriceTotal > 0) {
        return productPriceTotal;
      }
    }
    
    // Last resort: use stored amount (might be incorrect for old marketplace applications)
    return amount;
  };

  const productPrice = getProductPrice();

  // Recalculate down payment percentage based on product price (not lease total)
  // For marketplace applications, the stored down_payment_percent may be incorrect
  // Note: Down payment is calculated on (product price + 5% management fee), but we display it as % of product price
  // For display purposes, we calculate: down_payment / product_price
  // The actual down payment percentage (including management fee) would be: down_payment / (product_price * 1.05)
  const calculatedDownPaymentPercent = productPrice && down_payment_amount 
    ? Math.round((parseFloat(down_payment_amount) / parseFloat(productPrice)) * 100 * 100) / 100 // Round to 2 decimal places
    : down_payment_percent;

  // Financial data for FinancialSummaryCard
  const financialData = application_data?.calculation_breakdown ? {
    displayPrice: application_data.calculation_breakdown.display_price || productPrice,
    managementFee: application_data.calculation_breakdown.raba_markup,
    totalWithManagementFee: application_data.calculation_breakdown.total_with_markup,
    downPayment: application_data.calculation_breakdown.down_payment || down_payment_amount,
    downPaymentPercent: calculatedDownPaymentPercent, // Use recalculated percentage
    financedAmount: productPrice && down_payment_amount ? parseFloat(productPrice) - parseFloat(down_payment_amount) : application_data.calculation_breakdown.financed_amount,
    interestRate: interest_rate,
    totalInterest: productPrice && down_payment_amount && monthly_repayment && lease_tenure 
      ? (parseFloat(monthly_repayment) * parseInt(lease_tenure)) - (parseFloat(productPrice) - parseFloat(down_payment_amount))
      : application_data.calculation_breakdown.total_interest,
    monthlyPayment: application_data.calculation_breakdown.monthly_payment || monthly_repayment,
    leaseTermMonths: application_data.calculation_breakdown.lease_term_months || lease_tenure,
    leaseTenureUnit: lease_tenure_unit,
  } : null;

  // Application overview data
  const applicationOverview = [
    { key: 'reference', label: 'Application Reference', value: reference || 'N/A' },
    { key: 'applicationType', label: 'Application Type', value: application_type || 'N/A' },
    { key: 'applicationSource', label: 'Application Source', value: application_source || 'marketplace' },
    { key: 'totalAmount', label: 'Total Amount', value: productPrice ? formatCurrency(productPrice) : 'N/A' },
    { key: 'downPayment', label: 'Down Payment', value: down_payment_amount ? formatCurrency(down_payment_amount) : 'N/A' },
    { key: 'downPaymentPercent', label: 'Down Payment %', value: calculatedDownPaymentPercent ? `${calculatedDownPaymentPercent}%` : 'N/A' },
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Marketplace Application Details
            </h1>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              MARKETPLACE
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Reference: {reference} • {customerSource?.full_name || 'N/A'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(status)}`}>
            {status?.replace('_', ' ').toUpperCase()}
          </span>
          <Button
            label="Raise New Action"
            onClick={() => setShowActionModal(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
            icon={AlertCircle}
          />
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
        {/* Customer Information (from User model) */}
        <CollapsibleSection
          title="Customer Information"
          icon={User}
          badge={customerSource?.kyc_status || 'pending'}
          badgeColor={customerSource?.kyc_status === 'approved' ? 'green' : 'yellow'}
          defaultExpanded={getSectionState('customer-info')}
          onToggle={(isExpanded) => toggleSection('customer-info', isExpanded)}
        >
          <InfoGrid
            data={customerInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Business Information (from UserBusiness model) */}
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
        {Vendor && (
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
        )}

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

        {/* Bank Details (from UserFinancialAccount model) */}
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
          title={`Guarantors & Family Members (${allGuarantors.length})`}
          icon={User}
          defaultExpanded={getSectionState('guarantor-info')}
          onToggle={(isExpanded) => toggleSection('guarantor-info', isExpanded)}
        >
          <InfoGrid
            data={guarantorInfo}
            columns={{ mobile: 1, tablet: 2, desktop: 2 }}
          />
        </CollapsibleSection>

        {/* Actions Section */}
        <CollapsibleSection
          title="Action Required Requests"
          icon={AlertCircle}
          badge={applicationData?.actions?.filter(a => a.status === 'pending').length || 0}
          badgeColor="red"
          defaultExpanded={getSectionState('actions-section')}
          onToggle={(isExpanded) => toggleSection('actions-section', isExpanded)}
        >
          <div className="space-y-4">
            {applicationData?.actions && applicationData.actions.length > 0 ? (
              applicationData.actions.map(action => (
                <ActionCard
                  key={action.id}
                  action={action}
                  onStatusUpdate={handleActionStatusUpdate}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">No Action Requests</p>
                <p className="text-sm">No action requests have been raised for this application yet.</p>
              </div>
            )}
            <Button
              onClick={() => setShowActionModal(true)}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              icon={AlertCircle}
            >
              Raise New Action Request
            </Button>
          </div>
        </CollapsibleSection>

        {/* KYC Documents from User model */}
        <CollapsibleSection
          title="KYC Documents"
          icon={FileText}
          badge={(() => {
            let count = 0;
            if (userKycData?.id_card_url || customerSource?.id_card_url) count++;
            if (verifiedAccount?.bank_statement_url || customer_details?.bank_details?.bank_statement_url) count++;
            return count.toString();
          })()}
          badgeColor={userKycData?.id_card_url || customerSource?.id_card_url ? 'green' : 'gray'}
          defaultExpanded={getSectionState('uploaded-documents')}
          onToggle={(isExpanded) => toggleSection('uploaded-documents', isExpanded)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Card from User model */}
            {(userKycData?.id_card_url || customerSource?.id_card_url) && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  ID Card (from KYC)
                </label>
                <div className="border rounded-md p-3 bg-white shadow-sm">
                  <img
                    src={userKycData?.id_card_url || customerSource?.id_card_url}
                    alt="ID Card"
                    className="w-full h-60 object-contain rounded-md mb-3 cursor-pointer hover:opacity-90 transition"
                    onClick={() => setIsViewerOpen(true)}
                  />
                  <a
                    href={userKycData?.id_card_url || customerSource?.id_card_url}
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
                          src={userKycData?.id_card_url || customerSource?.id_card_url}
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

            {/* Bank Statement from UserFinancialAccount */}
            {(verifiedAccount?.bank_statement_url || customer_details?.bank_details?.bank_statement_url) && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Bank Statement
                </label>
                <div className="border rounded-md p-4 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm font-medium break-words overflow-wrap-anywhere">
                        Bank Statement
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {userKycData?.periculum_statement_key 
                          ? `Processed via Periculum (Key: ${userKycData.periculum_statement_key})` 
                          : 'From KYC Submission'}
                      </p>
                    </div>
                    <a
                      href={verifiedAccount?.bank_statement_url || customer_details?.bank_details?.bank_statement_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}

            {!userKycData?.id_card_url && !customerSource?.id_card_url && !verifiedAccount?.bank_statement_url && !customer_details?.bank_details?.bank_statement_url && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">No KYC Documents</p>
                <p className="text-sm">No KYC documents have been uploaded yet.</p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Quote Documents */}
        {applicationData?.quote_documents && Array.isArray(applicationData.quote_documents) && applicationData.quote_documents.length > 0 && (
          <CollapsibleSection
            title="Quote Documents"
            icon={FileText}
            badge={applicationData.quote_documents.length}
            badgeColor="orange"
            defaultExpanded={getSectionState('quote-documents')}
            onToggle={(isExpanded) => toggleSection('quote-documents', isExpanded)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applicationData.quote_documents.map((doc, index) => (
                <div key={index} className="border rounded-md p-4 bg-white shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {doc.filename || 'Unknown Document'}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status || 'pending'}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {doc.document_type || 'document'}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        {doc.created_at && <p>Uploaded: {formatDate(doc.created_at)}</p>}
                        {doc.file_size && <p>Size: {formatFileSize(doc.file_size)}</p>}
                        {doc.reviewed_at && (
                          <p>Reviewed: {formatDate(doc.reviewed_at)}</p>
                        )}
                        {doc.review_notes && (
                          <p className="text-orange-600">Notes: {doc.review_notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {doc.signed_url && (
                        <a
                          href={doc.signed_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors"
                        >
                          Download
                        </a>
                      )}
                      {doc.status === 'pending' && doc.id && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleQuoteDocumentReview(doc.id, 'approved')}
                            className="text-xs text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleQuoteDocumentReview(doc.id, 'rejected')}
                            className="text-xs text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

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

                  {(mandate.status === 'pending' || mandate.status === 'failed' || mandate.status === 'inactive') && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleRestartMandate(mandate.id, id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Restart Mandate
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Repayment Plan */}
        <CollapsibleSection
          title="Repayment Plan"
          icon={BarChart3}
          badge={lease_tenure || 'N/A'}
          badgeColor="blue"
          defaultExpanded={getSectionState('repayment-plan')}
          onToggle={(isExpanded) => toggleSection('repayment-plan', isExpanded)}
        >
          <div className="space-y-4">
            <InfoGrid
              data={[
                { key: 'amount', label: 'Total Amount', value: productPrice ? formatCurrency(productPrice) : 'N/A' },
                { key: 'downPayment', label: 'Down Payment', value: down_payment_amount ? formatCurrency(down_payment_amount) : 'N/A' },
                { key: 'downPaymentPercent', label: 'Down Payment %', value: calculatedDownPaymentPercent ? `${calculatedDownPaymentPercent}%` : 'N/A' },
                { key: 'financedAmount', label: 'Financed Amount', value: productPrice && down_payment_amount ? formatCurrency(parseFloat(productPrice) - parseFloat(down_payment_amount)) : 'N/A' },
                { key: 'monthlyRepayment', label: 'Monthly Repayment', value: monthly_repayment ? formatCurrency(monthly_repayment) : 'N/A' },
                { key: 'interestRate', label: 'Interest Rate', value: interest_rate ? `${interest_rate}%` : 'N/A' },
                { key: 'leaseTenure', label: 'Lease Tenure', value: lease_tenure && lease_tenure_unit ? `${lease_tenure} ${lease_tenure_unit}${lease_tenure > 1 ? 's' : ''}` : 'N/A' },
                { key: 'totalRepayment', label: 'Total Repayment', value: monthly_repayment && lease_tenure ? formatCurrency(parseFloat(monthly_repayment) * parseInt(lease_tenure)) : 'N/A' },
                { key: 'totalInterest', label: 'Total Interest', value: productPrice && down_payment_amount && monthly_repayment && lease_tenure ? formatCurrency((parseFloat(monthly_repayment) * parseInt(lease_tenure)) - (parseFloat(productPrice) - parseFloat(down_payment_amount))) : 'N/A' },
              ]}
              columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            />
          </div>
        </CollapsibleSection>

        {/* Repayment Schedule */}
        <CollapsibleSection
          title="Repayment Schedule"
          icon={CreditCard}
          badge={schedules && schedules.length > 0 ? schedules.length : '0'}
          badgeColor={schedules && schedules.length > 0 ? 'green' : 'gray'}
          defaultExpanded={getSectionState('repayment-schedule')}
          onToggle={(isExpanded) => toggleSection('repayment-schedule', isExpanded)}
        >
          {schedules && schedules.length > 0 ? (
            <div className="space-y-4">
              {/* Schedule Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {schedules.filter(s => s.status === 'paid').length}
                    </div>
                    <div className="text-sm text-gray-600">Paid Installments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {schedules.filter(s => s.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending Installments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {schedules.filter(s => s.status === 'overdue').length}
                    </div>
                    <div className="text-sm text-gray-600">Overdue Installments</div>
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
                {schedules.map((schedule, index) => (
                  <div key={schedule.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-gray-800">
                        Installment #{schedule.installmentNumber || schedule.installment_number}
                      </h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        schedule.status === 'paid' ? 'bg-green-100 text-green-800' :
                        schedule.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {schedule.status?.charAt(0).toUpperCase() + schedule.status?.slice(1)}
                      </span>
                    </div>

                    <InfoGrid
                      data={[
                        { key: 'amountDue', label: 'Amount Due', value: (schedule.amountDue || schedule.amount_due) ? formatCurrency(schedule.amountDue || schedule.amount_due) : 'N/A' },
                        { key: 'dueDate', label: 'Due Date', value: (schedule.dueDate || schedule.due_date) ? formatDate(schedule.dueDate || schedule.due_date, 'short') : 'N/A' },
                        { key: 'paidAmount', label: 'Paid Amount', value: (schedule.paidAmount || schedule.paid_amount) ? formatCurrency(schedule.paidAmount || schedule.paid_amount) : '₦0.00' },
                        { key: 'paidAt', label: 'Paid At', value: (schedule.paidAt || schedule.paid_at) ? formatDate(schedule.paidAt || schedule.paid_at, 'datetime') : 'N/A' },
                        { key: 'paymentReference', label: 'Payment Reference', value: schedule.paymentReference || schedule.payment_reference || 'N/A' },
                        { key: 'failedAttempts', label: 'Failed Attempts', value: schedule.failedAttempts || schedule.failed_attempts || 0 },
                        { key: 'lastAttemptAt', label: 'Last Attempt', value: (schedule.lastAttemptAt || schedule.last_attempt_at) ? formatDate(schedule.lastAttemptAt || schedule.last_attempt_at, 'datetime') : 'N/A' },
                        { key: 'nextAttemptAt', label: 'Next Attempt', value: (schedule.nextAttemptAt || schedule.next_attempt_at) ? formatDate(schedule.nextAttemptAt || schedule.next_attempt_at, 'datetime') : 'N/A' },
                        { key: 'reminderSent', label: 'Reminder Sent', value: (schedule.reminderSent !== undefined ? schedule.reminderSent : schedule.reminder_sent) ? 'Yes' : 'No' },
                        { key: 'reminderSentAt', label: 'Reminder Sent At', value: (schedule.reminderSentAt || schedule.reminder_sent_at) ? formatDate(schedule.reminderSentAt || schedule.reminder_sent_at, 'datetime') : 'N/A' },
                        { key: 'createdAt', label: 'Created At', value: (schedule.createdAt || schedule.created_at) ? formatDate(schedule.createdAt || schedule.created_at, 'datetime') : 'N/A' },
                        { key: 'updatedAt', label: 'Updated At', value: (schedule.updatedAt || schedule.updated_at) ? formatDate(schedule.updatedAt || schedule.updated_at, 'datetime') : 'N/A' },
                      ]}
                      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Repayment Schedule Found</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  {status === 'downpayment_paid' || status === 'down_payment_completed' || status === 'awaiting_delivery'
                    ? 'Repayment schedule will be available once the repayment setup is complete. This usually happens automatically when the mandate is authorized.'
                    : status === 'active' || status === 'completed'
                    ? 'No repayment schedule found for this application. Please contact support if this is unexpected.'
                    : 'Repayment schedule will be generated after down payment is completed.'}
                </p>
                {mandates && mandates.length > 0 && mandates.some(m => m.status === 'authorized') && (
                  <button
                    onClick={handleGenerateSchedule}
                    disabled={isGeneratingSchedule}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isGeneratingSchedule ? 'Generating...' : 'Generate Repayment Schedule'}
                  </button>
                )}
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* Transactions */}
        {transactions && transactions.length > 0 && (
          <CollapsibleSection
            title="Transactions"
            icon={Banknote}
            badge={transactions.length}
            badgeColor="blue"
            defaultExpanded={getSectionState('transactions')}
            onToggle={(isExpanded) => toggleSection('transactions', isExpanded)}
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
              <option value="downpayment_paid">Down Payment Paid</option>
              <option value="awaiting_delivery">Awaiting Delivery</option>
              <option value="active">Active</option>
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

      {/* Action Modal */}
      <CreateActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onSubmit={handleCreateAction}
        applicationId={id}
      />
    </div>
  );
}

export default MarketplaceApplicationDetails;
