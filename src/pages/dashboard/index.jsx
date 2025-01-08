import React from 'react'
import { Card } from 'flowbite-react'
import { Icons } from '../../components/icons/icon'

function Dashboard() {
    return (
        <>

            <div className="px-7 mt-7">
                <h1 className="text-2xl font-bold text-black mb-8">Dashboard</h1>
                <div className="flex flex-wrap justify-start gap-6">
                    {[
                        {
                            label: "Active Subscription",
                            value: "156",
                            icon: "/Icon.png",
                        },
                        {
                            label: "Repayment Dues",
                            value: "#20,000",
                            icon: "/iconn.png",
                        },
                        {
                            label: "Total Activation",
                            value: "198",
                            icon: "/iconn1.png",
                        },
                        {
                            label: "Payment Received",
                            value: "#30,000,303",
                            icon: "/Icon.png",
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
