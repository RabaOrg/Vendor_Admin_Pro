import React from 'react'
import { useFetchRepayment } from '../../../hooks/queries/loan'
import { Link } from 'react-router-dom'
import Button from '../../../components/shared/button'

function RepaymentMainPlan() {
  const { data: repaymentPlan, isPending, IsError } = useFetchRepayment()

  console.log(repaymentPlan)
  return (
    <div className='px-6'>


      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Repayment <span className="text-black-400">{'>'}</span> Add Repayment-Plan
          </h1>
          <div className='flex gap-3'>

            <Link to={'/create_repayment_plan'}> <Button
              label="Create Repayment-plan"
              variant="solid"

              size="md"
              className="text-sm px-6 py-5"
            /></Link>
          </div>
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
                down_paid_amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount_Due
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Created At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Due At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>


            </tr>
          </thead>

          {Array.isArray(repaymentPlan) && repaymentPlan.map((item, index) => (
            <tr className="bg-white" >

              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.id}
                </p>
              </td>

              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.customer_name}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.vendor_name}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.paid_amount}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.amount_due}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {new Date(item.due_date).toLocaleDateString()}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 text-xs">
                <button
                  className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.status === 'approved'
                    ? 'bg-[#ccf0eb] text-[#00B69B] font-semibold'
                    : item.status === 'pending'
                      ? 'bg-orange-100 text-[#FFA756] font-semibold'
                      : item.status === 'submitted'
                        ? 'bg-green-100 text-green-700 font-semibold'
                        : item.status === 'active'
                          ? 'bg-green-100 text-green-600 font-semibold'
                          : item.status === 'awaiting_downpayment'
                            ? 'bg-orange-100 text-[#FFA756] font-semibold'
                            : item.status === 'awaiting delivery'
                              ? 'bg-orange-100 text-[#FFA756] font-semibold'
                              : item.status === 'processing'
                                ? 'bg-purple-100 text-purple-700 font-semibold'
                                : item.status === 'cancelled'
                                  ? 'bg-red-100 text-red-600 font-semibold'
                                  : item.status === 'completed'
                                    ? 'bg-green-100 text-green-800 font-semibold'
                                    : item.status === 'Rejected'
                                      ? 'bg-red-300 text-[#EF3826] font-semibold'
                                      : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {item.status}
                </button>
              </td>



            </tr>
          ))}



          <tbody>




          </tbody>
        </table>





      </div>
    </div>
  )
}

export default RepaymentMainPlan