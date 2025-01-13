import React from 'react'
import Card from '../../../../components/shared/card'
import { BiUpload } from 'react-icons/bi'

function Repayment() {
    return (
        <div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Repayment Information</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                        <div className="flex flex-col gap-4 w-full lg:w-1/2">

                            <div className='w-64 h-12 py-1 px-4 rounded-md border-4 border-white shadow bg-white '>

                                <div className='flex gap-2'>
                                    <button
                                        className="flex items-center justify-center mt-1 w-7 h-7 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                        aria-label="Edit"
                                    >
                                        <BiUpload className="text-gray-500 w-4 h-4 text-lg" />
                                    </button>
                                    <p className='text-xs mt-2 text-[#0A0F0C] font-[500]'>Signature</p>

                                </div>
                            </div>


                        </div>



                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Repayment
