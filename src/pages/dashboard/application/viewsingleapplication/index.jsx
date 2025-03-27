import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useQueryClient } from "@tanstack/react-query";
import { useFetchBankStatement, useFetchSingleLoan } from '../../../../hooks/queries/loan';
import Button from '../../../../components/shared/button';
import axiosInstance from '../../../../../store/axiosInstance';
import { handleUpdateStatus } from '../../../../services/loans';

function SingleApplication() {
  const { id } = useParams();
  const [loanData, setLoanData] = useState(null);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)
  const { data: singleLoan, isPending, isError } = useFetchSingleLoan(id);
  const [showPreview, setShowPreview] = useState(false);
  const [bankId, setBankId] = useState('')
  const [selectedStatus, setSelectedStatus] = useState("");
  const { data: bankStatement } = useFetchBankStatement(bankId)


  console.log(bankStatement)
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/loan-applications/${id}`);
        setLoanData(response.data.data);
        console.log(response.data.data.customer.id)
        setBankId(response.data.data.customer.id)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);


  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading application.
      </div>
    );
  if (!loanData)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No application data found.
      </div>
    );
  const handleUpdateLoanStatus = async () => {
    if (selectedStatus === singleLoan?.status) {
      toast.error("Please select a different status to update");
      return;
    }

    setIsLoading(true)
    try {
      const response = await handleUpdateStatus(id, {
        status: selectedStatus,
      })
      if (response) {
        toast.success("Status updated successfully")
        setLoanData((prevData) => ({
          ...prevData,
          status: selectedStatus,
        }));
        queryClient.invalidateQueries(["singleLoanApplication", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const { id: loanId, customer, product, loan_details, repayment_dates, status, created_at } =
    loanData;
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const handleViewStatement = async () => {
    try {
      const statementUrl = bankStatement.data[0].statement_url;
      const response = await axiosInstance.get(statementUrl, { responseType: 'blob' });
      const fileBlob = new Blob([response.data], { type: response.data.type || 'application/pdf' });
      const localUrl = URL.createObjectURL(fileBlob);
      setPreviewUrl(localUrl);
      setShowPreview(true);
    } catch (error) {
      console.error("Error fetching statement for preview:", error);
      toast.error("Unable to load statement preview.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Loan Application Details ({customer?.name})
          </h2>
          <span
            className={`inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              status
            )}`}
          >
            {status}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Loan ID</label>
                <input
                  type="text"
                  disabled
                  value={loanId}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <input
                  type="text"
                  disabled
                  value={status}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created At</label>
                <input
                  type="text"
                  disabled
                  value={new Date(created_at).toLocaleDateString()}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  disabled
                  value={customer?.name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="text"
                  disabled
                  value={customer?.email}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  disabled
                  value={customer?.phone}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-center items-center">
                <img
                  src={product?.display_attachment_url}
                  alt={product?.name}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                    <input
                      type="text"
                      disabled
                      value={product?.name}
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Product Price</label>
                    <input
                      type="text"
                      disabled
                      value={product?.price}
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <textarea
                      disabled
                      value={product?.description}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment (%)</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.down_payment_percent}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment Amount</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.down_payment_amount}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Principal Amount</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.principal}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Interest Rate</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.interest_rate}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Interest Amount</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.interest_amount}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Amount To Repay</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.total_amount_to_repay}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Repayment Amount</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.repayment_amount}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tenure Unit</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.tenure_unit}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Repayment Interval</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.repayment_interval}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Tenure</label>
                <input
                  type="text"
                  disabled
                  value={loan_details?.tenure_value}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
            </div>
          </div>

          {/* Repayment Schedule */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Repayment Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <input
                  type="text"
                  disabled
                  value={repayment_dates?.start_date}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <input
                  type="text"
                  disabled
                  value={repayment_dates?.end_date}
                  className="w-full p-3 border border-[#A0ACA4] rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f5d30]"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Status Update</h3>
            <label className="block text-sm text-gray-600 mb-1">
              Select Status to be updated
            </label>
            <select
              value={selectedStatus}
              onChange={handleChangeStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              <option value="approved">approved</option>
              <option value="in_review">in_review</option>
              <option value="pending">pending</option>
              <option value="rejected">rejected</option>

            </select>
          </div>
          {bankStatement?.data?.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Bank Statement</h3>
              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Filename:</strong> {bankStatement.data[0].metadata.original_filename}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Uploaded On:</strong>
                  <strong>Filename:</strong> {new Date(bankStatement.data[0].metadata.upload_date).toLocaleString()}

                </p>
                <p className="text-sm text-gray-600">
                  <strong>File Size:</strong> {(bankStatement.data[0].metadata.file_size / 1024).toFixed(2)} KB
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {bankStatement.data[0].status}
                </p>
              </div>
              <div className="flex gap-4">
                {/* <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-black text-white text-sm px-4 py-2 rounded"
                >
                  {showPreview ? "Hide Preview" : "View Statement"}
                </button> */}
                <a
                  href={bankStatement.data[0].statement_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-[#0f5D30] text-white text-sm px-4 py-2 rounded">
                    Download Statement
                  </button>
                </a>
              </div>
              {showPreview && (
                <div className="mt-4">
                  <iframe
                    src={bankStatement.data[0].statement_url}
                    width="100%"
                    height="600px"
                    title="Bank Statement Preview"
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6">
          <Button
            label="Update Status"
            onClick={handleUpdateLoanStatus}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />
        </div>
      </div>
    </div>

  );
}

export default SingleApplication;
