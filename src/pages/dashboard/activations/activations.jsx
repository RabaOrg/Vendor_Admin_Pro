import React, { useState } from 'react'
import { useFetchVendorData } from '../../../hooks/queries/loan'
import { Link } from 'react-router-dom'
import { FaEye, } from 'react-icons/fa'
import Button from '../../../components/shared/button'
import { useNavigate } from 'react-router-dom'

function ActivationLists() {
  const { data: activationList, isPending, isError } = useFetchVendorData()
  console.log(activationList)
  const Navigate = useNavigate()

  const handleViewCustomer = (id) => {
    Navigate(`/view_activation/${id}`)
  }
  return (
    <div className='px-6'>


      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-[30px] font-semibold text-black mt-6 mb-4 ">Vendor Management</h1>
          <Link to={"/vendor_statistics"}>
            <Button
              label="View Vendor statistics"
              variant="solid"
              size="md"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
            />
          </Link>
        </div>
        <table className="min-w-full leading-normal ">
          <thead className='bg-[#D5D5D5]'>
            <tr>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                FullName
              </th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                Business Name
              </th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                Email
              </th>

              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Business Catgeory
              </th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Monthly revenue
              </th>

              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Cac Number
              </th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Account Status
              </th>
              <th className="px-4 py-4 w-1/6 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View
              </th>


            </tr>
          </thead>

          {Array.isArray(activationList?.data) && activationList?.data.map((item, index) => (
            <tr className="bg-white" >

              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.first_name} {item.last_name}
                </p>
              </td>

              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.business_name}
                </p>
              </td>
              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.email}
                </p>
              </td>
              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.business_category}
                </p>
              </td>
              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.monthly_revenue}
                </p>
              </td>
              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <p className="font-[500] whitespace-no-wrap text-xs">
                  {item.cac_number}
                </p>
              </td>

              <td className="px-4 py-4 border-b border-gray-200 bg-white text-xs">
                <button
                  className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.status === 'approved'
                    ? 'bg-[#ccf0eb] text-[#00B69B] font-semibold'
                    : item.status === 'pending'
                      ? 'bg-orange-100 text-[#FFA756] font-semibold'
                      : item.status === 'Rejected'
                        ? 'bg-red-300 text-[#EF3826] font-semibold'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {item.status}
                </button>
              </td>
              <td className="px-4 py-4 border-b border-gray-200 bg-white flex">
                <button
                  className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                  aria-label="View"
                  onClick={() => handleViewCustomer(item.id)}
                >
                  <FaEye className="text-gray-500 text-lg" />
                </button>
              </td>





            </tr>
          ))}



          <tbody>




          </tbody>
        </table>





      </div>
      <br />
      <br />
      <br />
      <br />
    </div >
  )
}

export default ActivationLists
