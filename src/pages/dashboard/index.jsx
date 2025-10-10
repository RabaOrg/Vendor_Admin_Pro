import React, { useState } from 'react'
import { Card, Button, Spinner } from 'flowbite-react'
import { useFetchDashboardAnalytics, useFetchDashboardInsights, useFetchRepaymentAnalytics, useFetchAgentAnalytics, useFetchVendorSalesAnalytics, useFetchRevenueAnalytics } from '../../hooks/insights'
import { Icons } from '../../components/icons/icon'

// Import new analytics components
import RepaymentStatusChart from '../../components/analytics/RepaymentStatusChart'
import AgentLeaderboard from '../../components/analytics/AgentLeaderboard'
import VendorSalesChart from '../../components/analytics/VendorSalesChart'
import RevenueProjectionChart from '../../components/analytics/RevenueProjectionChart'
import RiskAssessmentWidget from '../../components/analytics/RiskAssessmentWidget'

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
    
    // Fetch all analytics data
    const { data: dashboardInsights } = useFetchDashboardAnalytics()
    const { data: dashboardData, isPending, isError, refetch } = useFetchDashboardInsights({
        period,
        startDate,
        endDate,
    })
    
    // Fetch new analytics
    const { data: repaymentAnalytics, isLoading: repaymentLoading } = useFetchRepaymentAnalytics({ period: '30' })
    const { data: agentAnalytics, isLoading: agentLoading } = useFetchAgentAnalytics({ period: '30' })
    const { data: vendorSalesAnalytics, isLoading: vendorLoading } = useFetchVendorSalesAnalytics({ period: '30' })
    const { data: revenueAnalytics, isLoading: revenueLoading } = useFetchRevenueAnalytics({ period: '30' })
    
    console.log(dashboardInsights)
    console.log(dashboardData)

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
    const { data: datar } = dashboardData || {}
    const { data: datas } = dashboardInsights || {}

    console.log(dashboardData)
    const dataCards = [
        {
            label: 'Daily Active Vendors',
            value: datar?.metrics?.daily_active_vendors,
            icon: '/Icon.png',
        },
        {
            label: 'Pending Application Count',
            value: datar?.metrics?.pending_applications_count,
            icon: '/iconn.png',
        },
        {
            label: 'Recent Error',
            value: datar?.metrics?.recent_errors,
            icon: '/iconn1.png',
        },
        {
            label: 'Approval Rate',
            value: datas?.conversion_funnel?.approval_rate,
            icon: '/Icon.png',
        },
    ]
    console.log(dashboardInsights)

    const dataCardMain = [
        {
            label: 'Completed Applications',
            value: datas?.conversion_funnel?.completed_applications,
            icon: '/iconn.png',
        },
        {
            label: 'Approved Application',
            value: datas?.conversion_funnel?.approved_applications,
            icon: '/iconn1.png',
        },
        {
            label: 'Submission Rate',
            value: datas?.conversion_funnel?.submission_rate,
            icon: '/Icon.png',
        },
        {
            label: 'Submitted Applications',
            value: datas?.conversion_funnel?.submitted_applications,
            icon: '/Icon.png',
        },
        {
            label: 'Total Applications',
            value: datas?.conversion_funnel?.total_applications,
            icon: '/Icon.png',
        },
        {
            label: 'Completion Rate',
            value: datas?.conversion_funnel?.completion_rate,
            icon: '/Icon.png',
        },
    ]

    return (
        <div className="px-7 mt-7">
            <h1 className="text-3xl font-bold text-black mb-8">Dashboard</h1>

            {/* Period Filter Options */}
            {/* <div className="mb-6 flex flex-wrap gap-4">
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
            </div> */}


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

            {/* Dashboard Data Cards - Hidden for now */}
            {/* {dashboardData && (
                <div className="flex flex-wrap justify-start gap-6 mb-8">
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

            {/* Additional Metrics - Hidden for now */}
            {/* {dashboardInsights && (
                <div className="flex flex-wrap justify-start gap-6 mb-8">
                    {dataCardMain.map((card, index) => (
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
            )} */}

            {/* Analytics Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
                
                {/* First Row - Repayment and Agent Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <RepaymentStatusChart 
                        data={repaymentAnalytics} 
                        isLoading={repaymentLoading} 
                    />
                    <AgentLeaderboard 
                        data={agentAnalytics} 
                        isLoading={agentLoading} 
                    />
                </div>

                {/* Second Row - Vendor Sales and Revenue Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <VendorSalesChart 
                        data={vendorSalesAnalytics} 
                        isLoading={vendorLoading} 
                    />
                    <RevenueProjectionChart 
                        data={revenueAnalytics} 
                        isLoading={revenueLoading} 
                    />
                </div>

                {/* Third Row - Risk Assessment */}
                <div className="grid grid-cols-1 gap-6">
                    <RiskAssessmentWidget 
                        data={{
                            repaymentData: repaymentAnalytics,
                            agentData: agentAnalytics,
                            vendorData: vendorSalesAnalytics,
                            revenueData: revenueAnalytics
                        }}
                        isLoading={repaymentLoading || agentLoading || vendorLoading || revenueLoading}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
