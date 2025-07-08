import React from 'react'
import { useState } from 'react'
import { useFetchRepayment } from '../../../hooks/queries/loan'
import { Link } from 'react-router-dom'
import Button from '../../../components/shared/button'
import { useNavigate } from 'react-router-dom'
import { useFetchAllRecurring } from '../../../hooks/queries/transaction'

function TransactionList() {
  const { data: repaymentPlan, isPending, IsError } = useFetchAllRecurring()
  const [selectedId, setSelectedId] = useState(null);
  const Navigate = useNavigate()
  const handleRowClick = (id) => {

    setSelectedId(id);

    Navigate(`/recurring_debit/${id}`);

  };
  return (
    <div className='px-6'>


      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Recurring Debits
          </h1>

        </div>
        <table className="min-w-full leading-normal mt-3 ">
          <thead className='bg-[#D5D5D5]'>
            <tr>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                ID
              </th>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Customer's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Vendor's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Monthly_Payment
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                failed_charges
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Next_charge_date
              </th>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>


            </tr>
          </thead>





          <tbody>
            {Array.isArray(repaymentPlan) && repaymentPlan.length > 0 ? (
              repaymentPlan.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'
                    } hover:bg-gray-200`}
                >
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-[500] whitespace-no-wrap text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-[500] whitespace-no-wrap text-xs">{item.customer_name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-[500] whitespace-no-wrap text-xs">{item.vendor_name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-[500] whitespace-no-wrap text-xs">{item.monthly_amount}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-[500] whitespace-no-wrap text-xs">{item.failed_charges}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-[500] whitespace-no-wrap text-xs">
                      {new Date(item.next_charge_date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.status === 'approved'
                        ? 'bg-[#ccf0eb] text-[#00B69B]'
                        : item.status === 'pending'
                          ? 'bg-orange-100 text-[#FFA756]'
                          : item.status === 'submitted'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : item.status === 'awaiting_downpayment'
                                ? 'bg-orange-100 text-[#FFA756]'
                                : item.status === 'awaiting delivery'
                                  ? 'bg-orange-100 text-[#FFA756]'
                                  : item.status === 'processing'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.status === 'cancelled'
                                      ? 'bg-red-100 text-red-600'
                                      : item.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : item.status === 'inactive'
                                          ? 'bg-red-300 text-[#EF3826]'
                                          : 'bg-gray-200 text-gray-700'
                        } font-semibold`}
                    >
                      {item.status}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 text-sm py-6 border-b border-gray-200"
                >
                  No repayment plans available at this time.
                </td>
              </tr>
            )}
          </tbody>

        </table>





      </div>
    </div>
  )
}

export default TransactionList