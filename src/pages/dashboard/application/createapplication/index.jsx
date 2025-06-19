import React from 'react'
import { useState } from 'react'
import { useFetchApplication } from '../../../../hooks/queries/loan'

const CreateApplication = () => {
  const { data: applicationData, isPending, isError } = useFetchApplication()

  const stats = [
    { label: 'Total Applications', value: applicationData?.data?.total_applications },
    { label: 'Approved Applications', value: applicationData?.data?.approved_applications },
    { label: 'Pending Applications', value: applicationData?.data?.pending_applications },
    { label: 'Awaiting Delivery', value: applicationData?.data?.awaiting_delivery_applications },
    { label: 'Awaiting Downpayment', value: applicationData?.data?.awaiting_downpayment_applications },
    { label: 'Cancelled Applications', value: applicationData?.data?.cancelled_applications },
    { label: 'Completed Applications', value: applicationData?.data?.completed_applications },
    { label: 'Rejected Applications', value: applicationData?.data?.rejected_applications },
    { label: 'Processing Applications', value: applicationData?.data?.processing_applications },
    { label: 'Submitted Applications', value: applicationData?.data?.submitted_applications },
    {
      label: 'Average Amount (₦)',
      value: applicationData?.data?.average_amount?.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
      })
    },
    {
      label: 'Total Value (₦)',
      value: applicationData?.data?.total_value?.toLocaleString('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
      })
    }
  ]

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading application statistics...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load application statistics.</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{stat.value ?? '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreateApplication
