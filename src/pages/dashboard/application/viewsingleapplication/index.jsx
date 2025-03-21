import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetchSingleLoan } from '../../../../hooks/queries/loan';
import Button from '../../../../components/shared/button';
import axiosInstance from '../../../../../store/axiosInstance';
import { handleUpdateStatus } from '../../../../services/loans';

function SingleApplication() {
  const { id } = useParams();
  const [loanData, setLoanData] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const { data: singleLoan, isPending, isError } = useFetchSingleLoan(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/loan-applications/${id}`);
        setLoanData(response.data.data);
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
    setIsLoading(true)
    try {
      const response = await handleUpdateStatus(id, {
        status: "approved"
      })
      if (response) {
        toast.success("Status updated successfully")
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

  return (
    <div className="max-w-6xl mx-auto p-10 ">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
        Loan Application Details ({customer?.name}){' '}
        <span className={`ml-4 inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClasses(status)}`}>
          {status}
        </span>
      </h2>
      <div className="grid grid-cols-1 bg-white rounded-md shadow-sm md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600">Loan ID</label>
              <input
                type="text"
                disabled
                value={loanId}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Status</label>
              <input
                type="text"
                disabled
                value={status}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Created At</label>
              <input
                type="text"
                disabled
                value={new Date(created_at).toLocaleDateString()}
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600">Name</label>
              <input
                type="text"
                disabled
                value={customer?.name}
                className="w-full p-2 border text-gray-700 border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="text"
                disabled
                value={customer?.email}
                className="w-full p-2 border text-gray-700 border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input
                type="text"
                disabled
                value={customer?.phone}
                className="w-full p-2 border text-gray-700 border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="md:col-span-1 flex justify-center items-center">
              <img
                src={product?.display_attachment_url}

                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Product Name</label>
                  <input
                    type="text"
                    disabled
                    value={product?.name}
                    className="w-full p-2 border text-gray-700 border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Product Price</label>
                  <input
                    type="text"
                    disabled
                    value={product?.price}
                    className="w-full p-2 border text-gray-700 border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700">Description</label>
                  <textarea
                    disabled
                    value={product?.description}
                    className="w-full p-2 border text-gray-700 border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Loan Details */}
        <div className="bg-gray-50 p-6 rounded-lg shadow md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Loan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Down Payment (%)</label>
              <input
                type="text"
                disabled
                value={loan_details?.down_payment_percent}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Down Payment Amount</label>
              <input
                type="text"
                disabled
                value={loan_details?.down_payment_amount}
                className="w-full p-3 border text-sm text-gray-700 border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Principal Amount</label>
              <input
                type="text"
                disabled
                value={loan_details?.principal}
                className="w-full p-3 border text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Interest Rate</label>
              <input
                type="text"
                disabled
                value={loan_details?.interest_rate}
                className="w-full p-3 text-gray-700 border text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Interest Amount</label>
              <input
                type="text"
                disabled
                value={loan_details?.interest_amount}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Total Amount To Repay</label>
              <input
                type="text"
                disabled
                value={loan_details?.total_amount_to_repay}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Repayment Amount</label>
              <input
                type="text"
                disabled
                value={loan_details?.repayment_amount}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Tenure unit</label>
              <input
                type="text"
                disabled
                value={loan_details?.tenure_unit}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Repayment Interval</label>
              <input
                type="text"
                disabled
                value={loan_details?.repayment_interval}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Tenure</label>
              <input
                type="text"
                disabled
                value={loan_details?.tenure_value}
                className="w-full p-3 border text-gray-700 text-sm border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
          </div>
        </div>

        {/* Repayment Dates */}
        <div className="bg-gray-50 p-6 rounded-lg shadow md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Repayment Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Start Date</label>
              <input
                type="text"
                disabled
                value={repayment_dates?.start_date}
                className="w-full p-3 border text-sm text-gray-700 border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">End Date</label>
              <input
                type="text"
                disabled
                value={repayment_dates?.end_date}
                className="w-full p-3 border text-sm text-gray-700 border-[#A0ACA4] rounded-md bg-gray-50 focus:outline-none  focus:ring-2 focus:ring-[#0f5d30] "
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Button
          label="Update Status"
          onClick={handleUpdateLoanStatus}
          variant="solid"
          size="md"
          className="text-sm px-6 py-5"
          loading={isLoading}
        />
      </div>
    </div>
  );
}

export default SingleApplication;
