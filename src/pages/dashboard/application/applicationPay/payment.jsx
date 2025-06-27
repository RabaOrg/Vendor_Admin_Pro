import React from 'react'
import { useFetchApplicationPayment } from '../../../../hooks/queries/loan'
import { useParams } from 'react-router-dom'

function ApplicationPayment() {
  const { id } = useParams()
  const { data: application, isPending, isError } = useFetchApplicationPayment(id)
  console.log(application)
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_downpayment':
        return 'bg-yellow-100 text-yellow-800';
      case 'awaiting_delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="px-6">
      <div className="min-w-full rounded-lg overflow-hidden bg-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Application Payment Details ({application?.application?.customer?.first_name} {application?.application?.customer?.last_name})
          </h2>
          <span
            className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              application?.application?.status
            )}`}
          >
            {application?.application?.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Customer Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input label="Customer ID" value={application?.application?.id} />
              <Input label="First Name" value={application?.application?.customer?.first_name} />
              <Input label="Last Name" value={application?.application?.customer?.last_name} />
              <Input label="Phone Number" value={application?.application?.customer?.phone_number} />
              <Input label="Email" value={application?.application?.customer?.email} />
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Application Info</h3>
            <div className="space-y-4">
              <Input label="Amount" value={application?.application?.amount} />
              <Input label="Down Payment" value={application?.application?.down_payment_amount} />
              <Input label="Monthly Repayment" value={application?.application?.monthly_repayment} />
              <Input label="Lease Tenure" value={application?.application?.lease_tenure} />
              <Input label="Application Reference" value={application?.application?.reference} />
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Vendor Information</h3>
            <div className="space-y-4">
              <Input label="Vendor Name" value={`${application?.application?.vendor?.first_name} ${application?.application?.vendor?.last_name}`} />
            </div>
          </div>

          {/* Payment Transactions */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Payment Transactions</h3>
            {application?.payment_transactions?.map((txn, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 mb-4 rounded">
                <Input label="Amount" value={txn.amount} />
                <Input label="Status" value={txn.status} />
                <Input label="Method" value={txn.payment_method} />
                <Input label="Transaction Ref" value={txn.reference} />
                <Input label="Paid At" value={new Date(txn.paid_at).toLocaleString()} />
                <Input label="Auth Code" value={txn.metadata?.authorization_code} />
              </div>
            ))}
          </div>

          {/* Repayment Schedule */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Repayment Schedule</h3>
            {application?.repayment_schedule?.map((repayment, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 mb-4 rounded">
                <Input label="Installment #" value={repayment.installment_number} />
                <Input label="Due Date" value={new Date(repayment.due_date).toLocaleDateString()} />
                <Input label="Amount Due" value={repayment.amount_due} />
                <Input label="Status" value={repayment.status} />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Repayment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Total Installments" value={application?.summary?.total_installments} />
              <Input label="Pending" value={application?.summary?.pending_installments} />
              <Input label="Paid" value={application?.summary?.paid_installments} />
              <Input label="Overdue" value={application?.summary?.overdue_installments} />
              <Input label="Success Txns" value={application?.summary?.successful_transactions} />
              <Input label="Total Paid" value={application?.summary?.total_paid} />
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}
const Input = ({ label, value }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      disabled
      value={value ?? '—'}
      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
)
export default ApplicationPayment
