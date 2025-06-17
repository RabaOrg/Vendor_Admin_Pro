import React from 'react'
import { useState } from 'react'
import Button from '../../../components/shared/button'
import { Link } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useFetchLoanApplication } from '../../../hooks/queries/loan'


function ApplicationList() {
  const { data: applicationData, isPending, isError } = useFetchLoanApplication()
  console.log(applicationData)
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = (id) => {

    setSelectedId(id);

    navigate(`/application-statistics/${id}`);

  };
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Application<span className="text-black-400">{'>'}</span> View Application
          </h1>
          <Link to={"/create_application"}>
            <Button
              label="View Application statistics"
              variant="solid"
              size="md"
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
            />
          </Link>

        </div>
        <table className="min-w-full leading-normal mt-3">
          <thead className='bg-[#D5D5D5]'>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Application Type
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
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(applicationData?.data) &&
              applicationData.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}

                  className={`cursor-pointer transition-all duration-200 
                    ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'} 
                    hover:bg-gray-200`}>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.amount}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.application_type}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.down_payment_amount}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
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

                    >
                      <FaEye className="text-gray-500 text-lg" onClick={handleRowClick} />
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

export default ApplicationList
