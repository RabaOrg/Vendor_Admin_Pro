import React from 'react'
import { useFetchGuarantorVendor } from '../../../hooks/queries/loan'
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

const GuarantorStatistics = () => {
  const { data: guarantorData, isPending, isError } = useFetchGuarantorVendor()

  const stats = [
    { label: 'Pending Guarantors', value: guarantorData?.data?.guarantors?.pending },
    { label: 'Verified Guarantors', value: guarantorData?.data?.guarantors?.verified },
    { label: 'Rejected Guarantors', value: guarantorData?.data?.guarantors?.rejected },
    { label: 'Guarantors Last Month', value: guarantorData?.data?.guarantors?.last_month },
    { label: 'Guarantors This Month', value: guarantorData?.data?.guarantors?.this_month },
    { label: 'Total Guarantors', value: guarantorData?.data?.guarantors?.total },
    { label: 'Verifications Sent', value: guarantorData?.data?.verifications?.sent },
    { label: 'Verifications Accessed', value: guarantorData?.data?.verifications?.accessed },
    { label: 'Verifications Pending', value: guarantorData?.data?.verifications?.pending },
    { label: 'Verifications Completed', value: guarantorData?.data?.verifications?.completed },
    { label: 'Verifications Expired', value: guarantorData?.data?.verifications?.expired },
    { label: 'Total Verifications', value: guarantorData?.data?.verifications?.total },
  ]

  const trend = guarantorData?.data?.registration_trend?.map(item => ({
    ...item,
    month: dayjs(item.month).format('MMM YYYY')
  }))

  if (isPending) {
    return <p className="text-center text-gray-600 py-10">Loading guarantor statistics...</p>
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load guarantor statistics.</p>
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Guarantor Statistics</h2>

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
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Monthly Registration Trend</h3>
        <div className="w-full h-64">
          {trend?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-10">No trend data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GuarantorStatistics
