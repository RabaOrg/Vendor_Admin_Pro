import React from 'react'
import { useState } from 'react'
import Button from '../../../components/shared/button'
import { Link } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useFetchGuarantor } from '../../../hooks/queries/loan'


function GuarantorList() {
  const { data: guarantorList, isPending, isError } = useFetchGuarantor()
  console.log(guarantorList)
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = (id) => {

    setSelectedId(id);

    navigate(`/view_guarantor/${id}`);

  };
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Guarantor<span className="text-black-400">{'>'}</span> View Guarantor's Details
          </h1>
          <div className='flex gap-3'>
            <Link to={"/guarantor_statistics"}>
              <Button
                label="View Guarantor statistics"
                variant="solid"
                size="md"
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
              />
            </Link>
            <Link to={"/guarantor_verification"}>
              <Button
                label="View Guarantor Verification"
                variant="solid"
                size="md"
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
              />
            </Link>
          </div>

        </div>
        <table className="min-w-full leading-normal mt-3">
          <thead className='bg-[#D5D5D5]'>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Vendor's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Customer's Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Product
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Verification
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(guarantorList?.data) &&
              guarantorList.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 
            ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'} 
            hover:bg-gray-200`}
                >
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.application?.vendor?.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.application?.customer?.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.application?.product?.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">₦{Number(item.application?.amount).toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.application?.status === 'completed'
                        ? 'bg-[#ccf0eb] text-[#00B69B] font-semibold'
                        : item.application?.status === 'pending'
                          ? 'bg-orange-100 text-[#FFA756] font-semibold'
                          : item.application?.status === 'rejected'
                            ? 'bg-red-300 text-[#EF3826] font-semibold'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {item.application?.status}
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      className={`font-medium whitespace-no-wrap text-xs px-3 py-1 rounded ${item.verification_status === 'completed'
                        ? 'bg-[#ccf0eb] text-[#00B69B] font-semibold'
                        : item.verification_status === 'pending'
                          ? 'bg-orange-100 text-[#FFA756] font-semibold'
                          : item.verification_status === 'rejected'
                            ? 'bg-red-300 text-[#EF3826] font-semibold'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {item.verification_status}
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 flex">
                    <button
                      className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                      aria-label="View"
                    >
                      <FaEye className="text-gray-500 text-lg" onClick={() => handleRowClick(item.id)} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>


      </div>
    </div>
  )
}

export default GuarantorList
