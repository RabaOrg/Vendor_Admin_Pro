import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetchAllSingleRecurring } from '../../../hooks/queries/transaction';
import CollapsibleSection from '../../../components/application/CollapsibleSection';
import InfoGrid from '../../../components/application/InfoGrid';
import { formatCurrency, formatDate, formatPhoneNumber, getStatusBadgeClasses } from '../../../utils/formatters';
import { usePairedSections } from '../../../hooks/usePairedSections';

import { 
  FileText, 
  User, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  Building2,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

function SingleRecurring() {
  const { id } = useParams();
  const { data: singleRecurring, isPending, isError } = useFetchAllSingleRecurring(id);

  // Define paired sections configuration
  const pairedSectionsConfig = [
    { id: 'application-details', pairedWith: 'customer-info', defaultExpanded: true },
    { id: 'customer-info', pairedWith: 'application-details', defaultExpanded: true },
    { id: 'card-details', pairedWith: 'schedule-summary', defaultExpanded: false },
    { id: 'schedule-summary', pairedWith: 'card-details', defaultExpanded: false },
    { id: 'statistics', pairedWith: 'vendor-info', defaultExpanded: false },
    { id: 'vendor-info', pairedWith: 'statistics', defaultExpanded: false },
  ];

  // Use the paired sections hook
  const { toggleSection, getSectionState } = usePairedSections(pairedSectionsConfig);

  if (isPending) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Error fetching transaction details</p>;
  }

  if (!singleRecurring) {
    return <p className="text-center py-10">Transaction not found</p>;
  }

  const { application, card_details, customer, schedule_summary, upcoming_payments, statistics, vendor } = singleRecurring;

  // Prepare data for sections
  const applicationDetails = application ? [
    { key: 'application_id', label: 'Application ID', value: application.id },
    { key: 'reference', label: 'Reference', value: application.reference || 'N/A' },
    { key: 'amount', label: 'Amount', value: application.amount ? formatCurrency(application.amount) : 'N/A' },
    { key: 'down_payment', label: 'Down Payment', value: application.down_payment_amount ? formatCurrency(application.down_payment_amount) : 'N/A' },
    { key: 'lease_tenure', label: 'Lease Tenure', value: application.lease_tenure ? `${application.lease_tenure} ${application.lease_tenure_unit || 'months'}` : 'N/A' },
    { key: 'monthly_repayment', label: 'Monthly Repayment', value: application.monthly_repayment ? formatCurrency(application.monthly_repayment) : 'N/A' },
    { key: 'interest_rate', label: 'Interest Rate', value: application.interest_rate ? `${application.interest_rate}%` : 'N/A' },
    { key: 'status', label: 'Status', value: application.status || 'N/A' },
    { key: 'approved_at', label: 'Approved At', value: application.approved_at ? formatDate(application.approved_at, 'datetime') : 'N/A' },
    { key: 'created_at', label: 'Created At', value: application.created_at ? formatDate(application.created_at, 'datetime') : 'N/A' },
  ] : [];

  const customerInfo = customer ? [
    { key: 'customer_id', label: 'Customer ID', value: customer.id },
    { key: 'customer_name', label: 'Name', value: customer.name || 'N/A' },
    { key: 'customer_phone', label: 'Phone Number', value: customer.phone_number ? formatPhoneNumber(customer.phone_number) : 'N/A' },
    { key: 'customer_email', label: 'Email', value: customer.email || 'N/A' },
    { key: 'customer_address', label: 'Address', value: customer.address || 'N/A' },
    { key: 'customer_state', label: 'State', value: customer.state || 'N/A' },
    { key: 'customer_lga', label: 'LGA', value: customer.lga || 'N/A' },
  ] : [];

  const cardDetails = card_details ? [
    { key: 'bank', label: 'Bank', value: card_details.bank || 'N/A' },
    { key: 'card_type', label: 'Card Type', value: card_details.card_type || 'N/A' },
    { key: 'authorization_code', label: 'Authorization Code', value: card_details.authorization_code || 'N/A' },
    { key: 'masked_pan', label: 'Masked PAN', value: card_details.masked_pan || 'N/A' },
    { key: 'expiry_month', label: 'Expiry Month', value: card_details.expiry_month || 'N/A' },
    { key: 'expiry_year', label: 'Expiry Year', value: card_details.expiry_year || 'N/A' },
  ] : [];

  const scheduleSummary = schedule_summary ? [
    { key: 'total_installments', label: 'Total Installments', value: schedule_summary.total_installments || 0 },
    { key: 'pending', label: 'Pending', value: schedule_summary.pending || 0 },
    { key: 'paid', label: 'Paid', value: schedule_summary.paid || 0 },
    { key: 'overdue', label: 'Overdue', value: schedule_summary.overdue || 0 },
    { key: 'total_amount', label: 'Total Amount', value: schedule_summary.total_amount ? formatCurrency(schedule_summary.total_amount) : 'N/A' },
    { key: 'paid_amount', label: 'Paid Amount', value: schedule_summary.paid_amount ? formatCurrency(schedule_summary.paid_amount) : 'N/A' },
    { key: 'remaining_amount', label: 'Remaining Amount', value: schedule_summary.remaining_amount ? formatCurrency(schedule_summary.remaining_amount) : 'N/A' },
  ] : [];

  const statisticsInfo = statistics ? [
    { key: 'completion_percentage', label: 'Completion %', value: statistics.completion_percentage ? `${statistics.completion_percentage}%` : 'N/A' },
    { key: 'next_payment_date', label: 'Next Payment Date', value: statistics.next_payment_date ? formatDate(statistics.next_payment_date, 'short') : 'N/A' },
    { key: 'next_payment_amount', label: 'Next Payment Amount', value: statistics.next_payment_amount ? formatCurrency(statistics.next_payment_amount) : 'N/A' },
    { key: 'total_paid', label: 'Total Paid', value: statistics.total_paid ? formatCurrency(statistics.total_paid) : 'N/A' },
    { key: 'remaining_amount', label: 'Remaining Amount', value: statistics.remaining_amount ? formatCurrency(statistics.remaining_amount) : 'N/A' },
  ] : [];

  const vendorInfo = vendor ? [
    { key: 'vendor_id', label: 'Vendor ID', value: vendor.id },
    { key: 'vendor_name', label: 'Vendor Name', value: vendor.name || 'N/A' },
    { key: 'vendor_email', label: 'Email', value: vendor.email || 'N/A' },
    { key: 'vendor_phone', label: 'Phone Number', value: vendor.phone_number ? formatPhoneNumber(vendor.phone_number) : 'N/A' },
    { key: 'vendor_address', label: 'Address', value: vendor.address || 'N/A' },
    { key: 'vendor_state', label: 'State', value: vendor.state || 'N/A' },
  ] : [];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Transaction Details
          </h1>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClasses(singleRecurring.status)}`}>
            {singleRecurring.status || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Transaction Reference */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {application?.reference || 'Transaction Reference'}
        </h2>
        <p className="text-gray-600">
          Transaction ID: {id}
        </p>
      </div>

      {/* Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Application Details */}
        {application && (
          <CollapsibleSection
            title="Application Details"
            icon={FileText}
            badge={applicationDetails.length}
            badgeColor="blue"
            defaultExpanded={getSectionState('application-details')}
            onToggle={(isExpanded) => toggleSection('application-details', isExpanded)}
          >
            <InfoGrid 
              data={applicationDetails}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Customer Information */}
        {customer && (
          <CollapsibleSection
            title="Customer Information"
            icon={User}
            badge={customerInfo.length}
            badgeColor="green"
            defaultExpanded={getSectionState('customer-info')}
            onToggle={(isExpanded) => toggleSection('customer-info', isExpanded)}
          >
            <InfoGrid 
              data={customerInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Card Details */}
        {card_details && (
          <CollapsibleSection
            title="Card Details"
            icon={CreditCard}
            badge={cardDetails.length}
            badgeColor="purple"
            defaultExpanded={getSectionState('card-details')}
            onToggle={(isExpanded) => toggleSection('card-details', isExpanded)}
          >
            <InfoGrid 
              data={cardDetails}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Schedule Summary */}
        {schedule_summary && (
          <CollapsibleSection
            title="Schedule Summary"
            icon={Calendar}
            badge={scheduleSummary.length}
            badgeColor="orange"
            defaultExpanded={getSectionState('schedule-summary')}
            onToggle={(isExpanded) => toggleSection('schedule-summary', isExpanded)}
          >
            <InfoGrid 
              data={scheduleSummary}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Statistics */}
        {statistics && (
          <CollapsibleSection
            title="Statistics"
            icon={BarChart3}
            badge={statisticsInfo.length}
            badgeColor="red"
            defaultExpanded={getSectionState('statistics')}
            onToggle={(isExpanded) => toggleSection('statistics', isExpanded)}
          >
            <InfoGrid 
              data={statisticsInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}

        {/* Vendor Information */}
        {vendor && (
          <CollapsibleSection
            title="Vendor Information"
            icon={Building2}
            badge={vendorInfo.length}
            badgeColor="indigo"
            defaultExpanded={getSectionState('vendor-info')}
            onToggle={(isExpanded) => toggleSection('vendor-info', isExpanded)}
          >
            <InfoGrid 
              data={vendorInfo}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
            />
          </CollapsibleSection>
        )}
      </div>

      {/* Upcoming Payments */}
      {upcoming_payments && upcoming_payments.length > 0 && (
        <div className="mt-8">
          <CollapsibleSection
            title="Upcoming Payments"
            icon={Calendar}
            badge={upcoming_payments.length}
            badgeColor="yellow"
            defaultExpanded={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming_payments.map((payment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">
                    Installment #{payment.installment_number}
                  </h4>
                  <InfoGrid 
                    data={[
                      { key: 'amount_due', label: 'Amount Due', value: payment.amount_due ? formatCurrency(payment.amount_due) : 'N/A' },
                      { key: 'due_date', label: 'Due Date', value: payment.due_date ? formatDate(payment.due_date, 'short') : 'N/A' },
                      { key: 'status', label: 'Status', value: payment.status || 'N/A' },
                    ]}
                    columns={{ mobile: 1, tablet: 1, desktop: 1 }}
                  />
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </div>
  );
}

export default SingleRecurring;