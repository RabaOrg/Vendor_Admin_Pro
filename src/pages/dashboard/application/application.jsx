import React from 'react'
import { useFetchLoanApplication } from '../../../hooks/queries/loan'


function ApplicationList() {
  const { data: applicationData, isPending, isError } = useFetchLoanApplication()
  console.log(applicationData)
  return (
    <div className='px-6'>


      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <h1 className="text-[30px] font-semibold text-black mt-6 mb-4 ">Activation</h1>
        <table className="min-w-full leading-normal ">
          <thead className='bg-[#D5D5D5]'>
            <tr>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                ID
              </th>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Products
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Down Payment
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>


            </tr>
          </thead>

          {Array.isArray(applicationData) && applicationData.map((item, index) => (
            <tr className="bg-white" >

              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.id}
                </p>
              </td>

              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.business_name}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.product}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.down_payment}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                <button
                  className={`font-[500] whitespace-no-wrap text-xs px-3 py-1 rounded ${item.status === "approved"
                    ? "bg-[#ccf0eb] text-[#00B69B] font-semibold"
                    : item.status === "pending"
                      ? "bg-orange-100 text-[#FFA756] font-semibold"
                      : item.status === "Rejected"
                        ? "bg-red-300 text-[#EF3826] font-semibold"
                        : "bg-gray-200 text-gray-700"
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
    </div >
  )
}

export default ApplicationList
