import React from 'react'
import { Card } from 'flowbite-react'
import { Icons } from '../../components/icons/icon'
import { useFetchDashboardInsights } from '../../hooks/insights'

function Dashboard() {
    const { data: dashboardData, isPending, isError } = useFetchDashboardInsights()

    return (
        <>

            <div className="px-7 mt-7">
                <h1 className="text-2xl font-bold text-black mb-8">Dashboard</h1>
                <div className="flex flex-wrap justify-start gap-6">
                    {[
                        {
                            label: "Successful Transactions",
                            value: dashboardData?.successfulTrasactionsCount,
                            icon: "/Icon.png",
                        },
                        {
                            label: "Transaction Volume",
                            value: `₦${dashboardData?.volumeOfTransactions}`,
                            icon: "/iconn.png",
                        },
                        {
                            label: "Total Transactions",
                            value: dashboardData?.totalTransactionsCount,
                            icon: "/iconn1.png",
                        },
                        {
                            label: "Pending Transactions",
                            value: dashboardData?.pendingTransactionCount,
                            icon: "/Icon.png",
                        },
                        {
                            label: "Loan Applications",
                            value: dashboardData?.productLoanApplicationCount,
                            icon: "/iconn.png",
                        },
                        {
                            label: "Active Loans",
                            value: dashboardData?.productLoanCount,
                            icon: "/iconn1.png",
                        },
                    ].map((card, index) => (
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
            </div>




        </>
    )
}

export default Dashboard
