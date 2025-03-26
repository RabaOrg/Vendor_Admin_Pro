import React, { useState } from 'react'
import { Card, Button, Spinner } from 'flowbite-react'
import { useFetchDashboardInsights } from '../../hooks/insights'
import { Icons } from '../../components/icons/icon'

const periodOptions = [
    { label: '30 Days', value: '30days' },
    { label: '90 Days', value: '90days' },
    { label: 'Lifetime', value: 'lifetime' },
    { label: 'Custom', value: 'custom' },
]

function Dashboard() {
    const [period, setPeriod] = useState('30days')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    const { data: dashboardData, isPending, isError, refetch } = useFetchDashboardInsights({
        period,
        startDate,
        endDate,
    })

    const handlePeriodChange = (value) => {
        setPeriod(value)

        if (value !== 'custom') {
            setStartDate('')
            setEndDate('')
            refetch()
        }
    }

    const handleCustomFetch = () => {
        if (startDate && endDate) {
            refetch()
        }
    }

    const dataCards = [
        {
            label: 'Successful Transactions',
            value: dashboardData?.successfulTrasactionsCount,
            icon: '/Icon.png',
        },
        {
            label: 'Transaction Volume',
            value: `₦${dashboardData?.volumeOfTransactions}`,
            icon: '/iconn.png',
        },
        {
            label: 'Total Transactions',
            value: dashboardData?.totalTransactionsCount,
            icon: '/iconn1.png',
        },
        {
            label: 'Pending Transactions',
            value: dashboardData?.pendingTransactionCount,
            icon: '/Icon.png',
        },
        {
            label: 'Loan Applications',
            value: dashboardData?.productLoanApplicationCount,
            icon: '/iconn.png',
        },
        {
            label: 'Active Loans',
            value: dashboardData?.productLoanCount,
            icon: '/iconn1.png',
        },
    ]

    return (
        <div className="px-7 mt-7">
            <h1 className="text-3xl font-bold text-black mb-8">Dashboard</h1>

            {/* Period Filter Options */}
            <div className="mb-6 flex flex-wrap gap-4">
                {periodOptions.map((option) => (
                    <Button
                        key={option.value}
                        color={period === option.value ? 'success' : 'light'}
                        onClick={() => handlePeriodChange(option.value)}
                        className="capitalize"
                    >
                        {option.label}
                    </Button>
                ))}
            </div>

            {/* Custom Date Range Inputs */}
            {period === 'custom' && (
                <div className="flex gap-4 mb-6 items-center">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-green-300 rounded p-2 focus:ring focus:ring-green-200"
                        placeholder="Start Date"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-green-800 rounded p-2 focus:ring focus:ring-[#0f5D30]"
                        placeholder="End Date"
                    />
                    <Button onClick={handleCustomFetch} style={{ backgroundColor: "#0f5D30" }}>
                        Apply
                    </Button>
                </div>
            )}
            {/* Loading State */}
            {isPending && (
                <div className="flex justify-center items-center">
                    <Spinner size="lg" />
                </div>
            )}

            {/* Error State */}
            {isError && <p className="text-red-500">Error fetching dashboard data.</p>}

            {/* Dashboard Data Cards */}
            {dashboardData && (
                <div className="flex flex-wrap justify-start gap-6">
                    {dataCards.map((card, index) => (
                        <Card
                            key={index}
                            extra="!flex-row flex-grow items-center rounded-[20px]"
                            className="card-dashboard w-[262px] h-[161px]"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium text-sm text-[#202224]">
                                        {card.label}
                                    </p>
                                    <h4 className="text-2xl font-semibold text-navy-700 mt-4">
                                        {card.value}
                                    </h4>
                                </div>
                                <img className="w-10 h-10" src={card.icon} alt="" />
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dashboard
