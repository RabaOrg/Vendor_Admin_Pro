import React from 'react'
import { BiUpload } from 'react-icons/bi'
import { Card } from 'flowbite-react'

function ImageUpload() {
    return (
        <div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-5'>Upload Details</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form className='flex flex-col lg:flex-row gap-12 px-5 pb-14 mt-5'>
                        <div className="w-full lg:w-1/3 mt-5 lg:mt-0">
                            <h3 className='text-sm font-medium'>Uploads</h3>
                            <p className='text-xs text-[#58655D] font-normal'>Upload business location pictures and pin location</p>
                            <div className='flex gap-3'>
                                <div className='w-[17rem] h-12 py-1 mt-4 px-5 rounded-md border-1 border-gray-200 shadow bg-white '>

                                    <div className='flex gap-2'>
                                        <button
                                            className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                            aria-label="Edit"
                                        >
                                            <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                        </button>
                                        <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>Location Pictures</p>

                                    </div>
                                </div>
                                <div className='w-[17rem] h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

                                    <div className='flex gap-2'>
                                        <button
                                            className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                            aria-label="Edit"
                                        >
                                            <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                        </button>
                                        <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>ID Card</p>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </Card>
            </div>

        </div>
    )
}

export default ImageUpload
