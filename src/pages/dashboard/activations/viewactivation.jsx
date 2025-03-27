import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'
import Button from '../../../components/shared/button'
import { toast } from 'react-toastify'
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSingleActivation } from '../../../hooks/queries/loan'
import { useFetchOneCustomer } from '../../../hooks/queries/customer'
import { handleUpdateLoanStatus } from '../../../services/loans'

function ViewActivation() {
  const { id } = useParams()
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false)

  const { data: singleLoanList, isPending, isError } = useFetchSingleActivation(id)
  console.log(singleLoanList)
  const [selectedStatus, setSelectedStatus] = useState(singleLoanList?.status || "");
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleUpdateStatus = async () => {

    setIsLoading(true)
    try {
      const response = await handleUpdateLoanStatus(id, {
        status: selectedStatus,
      })
      if (response) {
        toast.success("Status updated successfully")
        queryClient.invalidateQueries(["activations", id]);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }

  }
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'awaiting_mandate':
        return 'bg-green-100 text-green-800';
      case 'repaid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'outstanding':
        return 'bg-purple-100 text-purple-800';
      case 'awaiting_downpayment':
        return 'bg-yellow-100 text-yellow-800';
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
            Loan Activation Details ({singleLoanList?.customer_name})
          </h2>
          <span
            className={`ml-0 md:ml-4 mt-2 md:mt-0 inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(
              singleLoanList?.status
            )}`}
          >
            {singleLoanList?.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Customer & Product Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Customer & Product Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Loan ID</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.customer_name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.business_name}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created At</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.repayment_period}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Loan Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Down Payment</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.down_payment}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Interest Amount</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.interest_amount}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total Repayment</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.total_repayment}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.product}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Amount</label>
                <input
                  type="text"
                  disabled
                  value={singleLoanList?.product_amount}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created At</label>
                <input
                  type="text"
                  disabled
                  value={new Date(singleLoanList?.created_at).toLocaleDateString()}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>


          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Status Update
            </h3>
            <label className="block text-sm text-gray-600 mb-1">Select Status to be updated</label>
            <select
              value={selectedStatus}
              onChange={handleChangeStatus}
              className="w-full p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              <option value="pending">Pending</option>
              <option value="outstanding">Outstanding</option>
              <option value="repaid">Repaid</option>
              <option value="defaulted">Defaulted</option>
              <option value="deleted">Deleted</option>
              <option value="awaiting_downpayment">Awaiting Downpayment</option>
              <option value="awaiting_mandate">Awaiting Mandate</option>
              <option value="pending_delivery">Pending Delivery</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <Button
            label="Update Status"
            onClick={handleUpdateStatus}
            variant="solid"
            size="md"
            className="text-sm px-6 py-3"
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default ViewActivation
