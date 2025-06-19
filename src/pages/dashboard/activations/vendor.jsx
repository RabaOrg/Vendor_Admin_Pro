import React from 'react'
import { useFetchVendor } from '../../../hooks/queries/loan'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import dayjs from 'dayjs'

const VendorManagement = () => {
  const { data: applicationData, isPending, isError } = useFetchVendor()

  const stats = [
    { label: 'Active Vendors', value: applicationData?.data?.active_vendors },
    { label: 'Suspended Vendors', value: applicationData?.data?.suspended_vendors },
    { label: 'Total Vendors', value: applicationData?.data?.total_vendors },
    { label: 'Vendors Last Month', value: applicationData?.data?.vendors_last_month },
    { label: 'Vendors This Month', value: applicationData?.data?.vendors_this_month },
    { label: 'Verified Vendors', value: applicationData?.data?.verified_vendors },
    { label: 'Approved Verifications', value: applicationData?.data?.verification_stats?.approved },
    { label: 'Pending Verifications', value: applicationData?.data?.verification_stats?.pending },
    { label: 'Rejected Verifications', value: applicationData?.data?.verification_stats?.rejected },
    { label: 'Under Review', value: applicationData?.data?.verification_stats?.under_review }
  ]

  const trend = applicationData?.data?.registration_trend?.map(item => ({
    ...item,
    month: dayjs(item.month).format('MMM YYYY')
  }))

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading vendor statistics...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load vendor statistics.</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Vendor Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-800 mt-2">{stat.value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Registration Trend</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default VendorManagement
