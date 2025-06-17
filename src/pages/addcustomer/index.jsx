import React from 'react'

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
import { useFetchCustomerStat } from '../../hooks/queries/customer'

const AddCustomer = () => {
    const { data: applicationData, isPending, isError } = useFetchCustomerStat()
    console.log(applicationData)
    const stats = [
        { label: 'Total Customers', value: applicationData?.total_customers },
        { label: 'Active Customers', value: applicationData?.active_customers },
        { label: 'Inactive Customers', value: applicationData?.inactive_customers },
        { label: 'Customers with Applications', value: applicationData?.customers_with_applications },
        { label: 'Customers Last Month', value: applicationData?.customers_last_month },
        { label: 'Customers This Month', value: applicationData?.customers_this_month }
    ]

    const trend = applicationData?.registration_trend?.map(item => ({
        ...item,
        month: dayjs(item.month).format('MMM YYYY')
    }))

    if (isPending) {
        return <p className="text-center text-gray-600 py-10">Loading customer statistics...</p>
    }

    if (isError) {
        return <p className="text-center text-red-500 py-10">Failed to load customer statistics.</p>
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Customer Statistics</h2>

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

            <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">🏆 Top Customers</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Phone</th>
                                <th className="px-4 py-2">Applications</th>
                                <th className="px-4 py-2">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicationData?.top_customers?.map((customer) => (
                                <tr key={customer.customer_id} className="border-t text-sm">
                                    <td className="px-4 py-2">{customer.customer_name}</td>
                                    <td className="px-4 py-2">{customer.phone_number}</td>
                                    <td className="px-4 py-2">{customer.application_count}</td>
                                    <td className="px-4 py-2">₦{Number(customer.total_value).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AddCustomer
