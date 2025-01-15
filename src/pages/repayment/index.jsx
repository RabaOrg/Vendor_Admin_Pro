import React from 'react'
import { useFetchRepayment } from '../../hooks/queries/loan'

function Repayment() {
    const { data: repaymentPlan, isPending, IsError } = useFetchRepayment()

    console.log(repaymentPlan)
    return (
        <div className='px-6'>


            <div className="inline-block min-w-full  rounded-lg overflow-hidden">
                <h1 className="text-[30px] font-semibold text-black mt-6 mb-4 ">Repayment Plans</h1>
                <table className="min-w-full leading-normal ">
                    <thead className='bg-[#D5D5D5]'>
                        <tr>

                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                                ID
                            </th>

                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Tenure Unit
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Max Downplay(%)
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Min Downplay(%)
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Created By
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Updated AT
                            </th>


                        </tr>
                    </thead>

                    {Array.isArray(repaymentPlan) && repaymentPlan.map((item, index) => (
                        <tr className="bg-white" >

                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                <p className="font-[500] whitespace-no-wrap text-xs">
                                    {item.id}
                                </p>
                            </td>

                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                <p className="font-[500] whitespace-no-wrap text-xs">
                                    {item.tenure_unit}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                <p className="font-[500] whitespace-no-wrap text-xs">
                                    {item.down_percent_max}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                <p className="font-[500] whitespace-no-wrap text-xs">
                                    {item.down_percent_min}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                <p className="font-[500] whitespace-no-wrap text-xs">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                <p className="font-[500] whitespace-no-wrap text-xs">
                                    {new Date(item.updated_at).toLocaleDateString()}
                                </p>
                            </td>


                        </tr>
                    ))}



                    <tbody>




                    </tbody>
                </table>





            </div>
        </div>
    )
}

export default Repayment
