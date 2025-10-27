import { useState } from 'react'
import Button from '../../../components/shared/button'
import { Link } from 'react-router-dom'
import { FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { useFetchLoanApplication } from '../../../hooks/queries/loan'
import RecalculationModal from '../../../components/modals/RecalculationModal'
import CreateSmsModal from '../../../components/modals/CreateSmsModal'


function ApplicationList() {
  const [page, setPage] = useState(1);
  const [applicationTypeFilter, setApplicationTypeFilter] = useState("");
  const [isRecalculationModalOpen, setIsRecalculationModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  const { data: applicationData, refetch } = useFetchLoanApplication({ page, limit: 10, application_type: applicationTypeFilter })
  console.log(applicationData)
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const handleRowClick = (id) => {

    setSelectedId(id);

    navigate(`/application-statistics/${id}`);

  };
  const handleRecalculateClick = (application) => {
    setSelectedApplication(application);
    setIsRecalculationModalOpen(true);
  };

  const handleRecalculationSuccess = () => {
    refetch(); // Refresh the application list
  };

  const handleSmsSuccess = () => {
    refetch(); // Refresh the application list
  };


  const handleViewPayment = (id) => {

    setSelectedId(id);

    navigate(`/application_payment/${id}`);

  };
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Application<span className="text-black-400">{'>'}</span> View Application
          </h1>
          <div className="flex gap-3">
            <Button
              label="Create SMS Application"
              variant="solid"
              size="md"
              onClick={() => setIsSmsModalOpen(true)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 mt-4 md:mt-0"
            />
            <Link to={"/create_application"}>
              <Button
                label="View Application statistics"
                variant="solid"
                size="md"
                className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
              />
            </Link>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mt-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Application Type:</label>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={applicationTypeFilter}
              onChange={(e) => {
                setApplicationTypeFilter(e.target.value);
                setPage(1); // Reset to first page when filtering
              }}
            >
              <option value="">All Types</option>
              <option value="vendor_created">Vendor Created</option>
              <option value="customer_created">Customer Created</option>
              <option value="sms_link">SMS Link</option>
              <option value="marketplace">Marketplace</option>
            </select>
          </div>
        </div>
        
        <table className="min-w-full leading-normal mt-3">
          <thead className="bg-[#D5D5D5]">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Vendor&apos;s Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Customer&apos;s Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Application Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Source
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
                Edit
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View Application
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                View Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(applicationData?.data) && applicationData.data.length > 0 ? (
              applicationData.data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item.id)}
                  className={`cursor-pointer transition-all duration-200 ${selectedId === item.id ? 'bg-blue-200' : 'bg-white'
                    } hover:bg-gray-200`}
                >
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.id}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.vendor?.name || '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.customer?.name || '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">₦{Number(item.amount).toLocaleString()}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.application_type}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.application_type === 'marketplace' ? 'bg-blue-100 text-blue-700' :
                      item.application_type === 'sms_link' ? 'bg-purple-100 text-purple-700' :
                      item.application_type === 'customer_created' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.application_type === 'marketplace' ? 'Marketplace' :
                       item.application_type === 'sms_link' ? 'SMS Link' :
                       item.application_type === 'customer_created' ? 'Customer' :
                       'Vendor'}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">{item.down_payment_amount ?? '—'}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <p className="font-medium whitespace-no-wrap text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
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
                                  : item.status === 'downpayment_paid'
                                    ? 'bg-green-100 text-green-700'
                                    : item.status === 'awaiting delivery'
                                  ? 'bg-orange-100 text-[#FFA756]'
                                  : item.status === 'processing'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.status === 'cancelled'
                                      ? 'bg-red-100 text-red-600'
                                      : item.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : item.status === 'Rejected'
                                          ? 'bg-red-300 text-[#EF3826]'
                                          : 'bg-gray-200 text-gray-700'
                        } font-semibold`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRecalculateClick(item);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200"
                      title="Recalculate Application"
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                  </td>

                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(item.id);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                      title="View Application"
                    >
                      <FaEye className="text-gray-500" />
                    </button>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPayment(item.id);
                      }}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                      title="View Payment"
                    >
                      <FaEye className="text-gray-500" />
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={11}
                  className="text-center text-gray-500 text-sm py-6 border-b border-gray-200"
                >
                  No applications found at this time.
                </td>
              </tr>
            )}
          </tbody>


        </table>

      </div>
      <br />
      <br />
      {applicationData?.meta?.total_pages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-700'} rounded-lg`}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {page} of {applicationData.meta.total_pages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, applicationData.meta.total_pages))}
            disabled={page === applicationData.meta.total_pages}
            className={`px-4 py-2 text-white ${page === applicationData.meta.total_pages ? 'bg-gray-400' : 'bg-green-800 hover:bg-green-700'} rounded-lg`}
          >
            Next
          </button>
        </div>

      )}
      <RecalculationModal
        isOpen={isRecalculationModalOpen}
        onClose={() => setIsRecalculationModalOpen(false)}
        application={selectedApplication}
        onSuccess={handleRecalculationSuccess}
      />

      <CreateSmsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        onSuccess={handleSmsSuccess}
      />

    </div>
  )
}

export default ApplicationList
