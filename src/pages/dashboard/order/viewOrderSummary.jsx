import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFetchSingleOrder } from '../../../hooks/queries/order';
import Button from '../../../components/shared/button';
import { useQueryClient } from "@tanstack/react-query";

import { handleUpdateOrders } from '../../../services/order';
// import { useFetchOrderSummary } from '../../../hooks/queries/order'

function ViewOrderSummary() {
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient();
  const { data: singleOrder, isPending, isError } = useFetchSingleOrder(id)
  const [selectedStatus, setSelectedStatus] = useState(singleOrder?.status || "");
  const handleChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
  };
  // const { data: orderSummary, isPending, isError } = useFetchOrderSummary()
  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        Error loading order.
      </div>
    );
  if (!singleOrder)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        No order data found.
      </div>
    );
  const handleUpdateOrder = async () => {
    setIsLoading(true);
    try {

      const response = await handleUpdateOrders(id, { status: selectedStatus, });
      if (response) {
        toast.success('Status updated successfully');
        queryClient.invalidateQueries(["Orders", id]);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error updating status');
    } finally {
      setIsLoading(false);
    }
  };
  const {

    User,
    Product,
    State,
    status,
    amount,
    payment_provider,
    created_at,
    payment_initiated_at,
    reference,
    updated_at,
  } = singleOrder;
  const getStatusBadgeClasses = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="px-6">
      <div className="min-w-full rounded-lg overflow-hidden bg-white shadow-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b">
          <h2 className="text-3xl font-bold text-gray-800">
            Order Details ({User ? `${User.first_name} ${User.last_name}` : 'Unknown'})
          </h2>
          <span
            className={`inline-block px-4 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${getStatusBadgeClasses(status)}`}
          >
            {status}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">First Name</label>
                <input
                  type="text"
                  disabled
                  value={User?.first_name}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Last Name</label>
                <input
                  type="text"
                  disabled
                  value={User?.last_name}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="text"
                  disabled
                  value={User?.email}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Phone Number</label>
                <input
                  type="text"
                  disabled
                  value={User?.phone_number}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Order Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Amount</label>
                <input
                  type="text"
                  disabled
                  value={amount}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Payment Provider</label>
                <input
                  type="text"
                  disabled
                  value={payment_provider}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Reference</label>
                <input
                  type="text"
                  disabled
                  value={reference}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Created At</label>
                <input
                  type="text"
                  disabled
                  value={new Date(created_at).toLocaleDateString()}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Last Updated</label>
                <input
                  type="text"
                  disabled
                  value={new Date(updated_at).toLocaleDateString()}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Product Name</label>
                <input
                  type="text"
                  disabled
                  value={Product?.name || ''}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Product Price</label>
                <input
                  type="text"
                  disabled
                  value={Product?.price || ''}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Description</label>
                <textarea
                  disabled
                  value={Product?.description || ''}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* State Information */}
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">State Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">State Name</label>
                <input
                  type="text"
                  disabled
                  value={State?.name || ''}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Delivery Price</label>
                <input
                  type="text"
                  disabled
                  value={State?.delivery_price || ''}
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Status Update */}
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
              <option value="unpaid">unpaid</option>
              <option value="paid">paid</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
              <option value="failed">failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-8">
        <Button
          label="Update Status"
          onClick={handleUpdateOrder}
          variant="solid"
          size="md"
          loading={isLoading}
        />
      </div>
    </div>

  );
}



export default ViewOrderSummary
