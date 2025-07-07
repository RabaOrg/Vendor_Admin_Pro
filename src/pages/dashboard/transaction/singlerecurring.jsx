import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetchAllSingleRecurring } from '../../../hooks/queries/transaction'

function SingleRecurring() {
  const { id } = useParams()
  const { data: singleRecurring } = useFetchAllSingleRecurring(id)
  console.log(singleRecurring)
  if (!singleRecurring) return null;

  const { application, card_details, customer, schedule_summary, upcoming_payments, statistics, vendor } = singleRecurring;
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-300 text-red-800';

      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'default':
        return 'bg-gray-500 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="px-6">
      <div className="min-w-full rounded-lg overflow-hidden bg-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Vendor Details ({vendor?.name})
          </h2>
          <span
            className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              singleRecurring?.status
            )}`}
          >
            {singleRecurring?.status}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

          {/* Application Details */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Application Details</h3>
            <div className="space-y-4">
              <Input label="Application ID" value={application?.id} />
              <Input label="Reference" value={application?.reference} />
              <Input label="Amount" value={application?.amount} />
              <Input label="Down Payment" value={application?.down_payment_amount} />
              <Input label="Lease Tenure" value={application?.lease_tenure} />
              <Input label="Monthly Repayment" value={application?.monthly_repayment} />
              <Input label="Interest Rate" value={application?.interest_rate + "%"} />
              <Input label="Status" value={application?.status} />
              <Input label="Approved At" value={new Date(application?.approved_at).toLocaleString()} />
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input label="Name" value={customer?.name} />
              <Input label="Phone Number" value={customer?.phone_number} />
              <Input label="Email" value={customer?.email} />
              <Input label="Address" value={customer?.address} />
            </div>
          </div>

          {/* Card Details */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Card Details</h3>
            <div className="space-y-4">
              <Input label="Bank" value={card_details?.bank} />
              <Input label="Card Type" value={card_details?.card_type} />
              <Input label="Authorization Code" value={card_details?.authorization_code} />
              <Input label="Masked PAN" value={card_details?.masked_pan} />
            </div>
          </div>

          {/* Schedule Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Schedule Summary</h3>
            <div className="space-y-4">
              <Input label="Total Installments" value={schedule_summary?.total_installments} />
              <Input label="Pending" value={schedule_summary?.pending} />
              <Input label="Paid" value={schedule_summary?.paid} />
              <Input label="Overdue" value={schedule_summary?.overdue} />
            </div>
          </div>

          {/* Upcoming Payments */}
          {schedule_summary && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Payments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schedule_summary.upcoming_payments?.map((payment, index) => (
                  <div key={index} className="border p-4 rounded-md shadow-sm">
                    <Input label="Installment #" value={payment.installment_number} />
                    <Input label="Amount Due" value={payment.amount_due} />
                    <Input label="Due Date" value={new Date(payment.due_date).toLocaleDateString()} />
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Statistics */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Statistics</h3>
            <div className="space-y-4">
              <Input label="Completion %" value={statistics?.completion_percentage + "%"} />
              <Input label="Next Payment Date" value={new Date(statistics?.next_payment_date).toLocaleDateString()} />
              <Input label="Next Payment Amount" value={statistics?.next_payment_amount} />
              <Input label="Total Paid" value={statistics?.total_paid} />
              <Input label="Remaining Amount" value={statistics?.remaining_amount} />
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Vendor Details</h3>
            <div className="space-y-4">
              <Input label="Vendor Name" value={vendor?.name} />
              <Input label="Email" value={vendor?.email} />
              <Input label="Phone Number" value={vendor?.phone_number} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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

export default SingleRecurring
