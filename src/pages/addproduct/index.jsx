import React from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'
import { BiUpload } from 'react-icons/bi'

function Addproduct() {
    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-3xl font-semibold">
                    Products <span className="text-black-400">{'>'}</span> Add Products
                </h1>
                <div className='flex gap-3'>
                    <Button
                        label="Cancel"
                        variant="transparent"
                        size="lg"
                        className="text-sm w-[150px]"
                    />
                    <Button
                        label="Add Products"
                        variant="solid"
                        size="md"
                        className="text-sm px-6 py-5"
                    />
                </div>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Product Information</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Business name" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email2"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="name@raba.com"
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Business type/category" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="password2"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    type="text"
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Registered? CAC Registration Number" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="password2"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    type="text"
                                    required
                                />
                            </div>
                        </form>
                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Business name" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email2"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="name@raba.com"
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Business type/category" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="password2"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    type="text"
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Registered? CAC Registration Number" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="password2"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    type="text"
                                    required
                                />
                            </div>
                        </form>


                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Month / years in business" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Monthly revenue" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="password3"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    type="text"
                                    placeholder="e.g., $5,000"
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Equipment of interest" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="password2"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    type="text"
                                    required
                                />
                            </div>
                        </form>
                    </div>


                    <div className='p-10 flex mt-[-75px]'>
                        <div className="w-full lg:w-[65%] sm:w-[90%]">
                            <div className="mb-2 block">
                                <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                            </div>
                            <textarea
                                style={{ color: "#202224", borderRadius: "8px" }}
                                id="description"
                                className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-40 resize-none"
                                placeholder="Describe your product, services, or business needs here..."
                                required
                            ></textarea>
                        </div>
                    </div>
                </Card>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Specifications</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Attribute" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email2"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="name@raba.com"
                                    required
                                />
                            </div>

                        </form>



                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Value" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>

                        </form>
                    </div>



                </Card>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Product Interest Rate Rule</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Attribute" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email2"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="name@raba.com"
                                    required
                                />
                            </div>

                        </form>



                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Value" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>

                        </form>
                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Value" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>

                        </form>
                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Value" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>

                        </form>
                    </div>



                </Card>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Upload Images</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>
                    <div className='flex gap-10 pb-10 py-5 px-10'>
                        <div className='w-[17rem] flex gap-10 h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

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



                </Card>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Specifications</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Attribute" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email2"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="name@raba.com"
                                    required
                                />
                            </div>

                        </form>



                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Value" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>

                        </form>

                        <form className="flex flex-col gap-4 w-full lg:w-1/2">
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Value" />
                                </div>
                                <input
                                    style={{ color: "#202224", borderRadius: "8px" }}
                                    id="email3"
                                    type="text"
                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                    placeholder="e.g., 5 years"
                                    required
                                />
                            </div>

                        </form>


                    </div>




                </Card>
            </div>

        </div>
    )
}

export default Addproduct
