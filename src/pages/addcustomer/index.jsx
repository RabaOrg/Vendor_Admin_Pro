import React, { useState } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'
import { BiUpload } from 'react-icons/bi'
import { useAuthStore } from '../../../store/store'

function Addcustomer() {
    const { createCustomers, loading } = useAuthStore()
    const [customerDetails, setCustomerDetails] = useState({
        phone_number: "",
        first_name: "",
        last_name: "",
        email: "",
        gender: "",
        dob: "",
        bvn: ""
    })
    const [businessDetails, setBusinessDetails] = useState({
        name: "",
        category: "",
        cac_number: "",
        time_in_business: "",
        equipment_of_interest: "",
        monthly_revenue: "",
        state: "",
        lga: "",
        street_address: ""
    })
    const [financialDetails, setFinancialDetails] = useState({
        account_number: "",
        account_name: "",
        bank_name: "",
        bank_code: "",
        bank_uuid: "",
        thrift_master_name: "",
        thrift_master_phone_number: ""
    })
    const handleSubmit = () => {
        try {

        } catch (error) {

        }
    }
    const handleInput = (e) => {
        const { name, value } = e.target
        setCustomerDetails((prevCustomerDetails) => ({
            ...prevCustomerDetails,
            [name]: value
        }
        ))

    }
    const handleBusinessDetails = (e) => {
        const { name, value } = e.target
        setBusinessDetails({ ...businessDetails, [name]: value })

    }
    const handleFinancialBusiness = (e) => {
        const { name, value } = e.target
        setFinancialDetails((prevFinancialDetails) = ({
            ...prevFinancialDetails,
            [name]: value
        }))
    }



    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-3xl font-semibold">
                    Customers <span className="text-black-400">{'>'}</span> Add Customer
                </h1>
                <div className='flex gap-3'>
                    <Button
                        label="Cancel"
                        variant="transparent"
                        size="lg"
                        className="text-sm w-[150px]"
                    />
                    <Button
                        label="Create Customer"
                        variant="solid"
                        disabled
                        size="md"
                        className="text-sm px-6 py-5"
                    />
                </div>
            </div>
            <form >
                <div className='p-4'>
                    <Card className='w-full h-full bg-white'>
                        <h3 className='p-3 px-10'>KYC Details</h3>
                        <div className='w-full border-t-2 border-gray-200'></div>

                        <form className='flex flex-col lg:flex-row gap-7 px-10 pb-14 mt-5' onSubmit={(e) => handleSubmit(e)}>
                            {/* First Form */}
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="First name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email2"
                                        type="email"
                                        value={customerDetails.first_name}
                                        name='first_name'
                                        onChange={(e) => handleInput(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Last name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        value={customerDetails.last_name}
                                        name='last_name'
                                        onChange={(e) => handleInput(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="textss"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block ">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Email Address" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="password"
                                        value={customerDetails.email}
                                        name='email'
                                        onChange={(e) => handleInput(e)}
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block text-sm">
                                        <p>What is your customer's gender?</p>
                                    </div>
                                    <div className='flex gap-4'>

                                        <div className='flex gap-1'>

                                            <input
                                                style={{ color: "#202224", borderRadius: "8px" }}
                                                id="password2"
                                                type="radio"
                                                value="female"
                                                checked={customerDetails.gender === "female"}
                                                name='gender'
                                                onChange={(e) => handleInput(e)}
                                                className="bg-white text-sm text-gray-700 border border-[#A0ACA4] focus:ring-2 focus:ring-[#0f5d30] focus:outline-none"

                                                required
                                            />
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Female" />
                                        </div>
                                        <div className='flex gap-1'>
                                            <input
                                                style={{ color: "#202224", borderRadius: "8px" }}
                                                id="password2"
                                                type="radio"
                                                checked={customerDetails.gender === "male"}
                                                value="male"
                                                name='gender'
                                                onChange={(e) => handleInput(e)}
                                                className="bg-white text-sm text-gray-700 border border-[#A0ACA4] focus:ring-2 focus:ring-[#0f5d30] focus:outline-none "

                                                required
                                            />
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Male" />
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bank verfication number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        value={customerDetails.bvn}
                                        name='bvn'
                                        onChange={(e) => handleInput(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Date of Birth" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        type="date"
                                        value={customerDetails.dob}
                                        name='dob'
                                        onChange={(e) => handleInput(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"

                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Residential Address" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        value={customerDetails.address}
                                        name='address'
                                        onChange={(e) => handleInput(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="password"
                                        required
                                    />
                                </div>



                            </div>


                            <div className="w-full lg:w-1/3 mt-5 lg:mt-0">
                                <h3 className='text-sm font-medium'>Uploads</h3>
                                <p className='text-xs text-[#58655D] font-normal'>Upload business location pictures and pin location</p>
                                <div className='w-[17rem] h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

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
                        </form>
                    </Card>
                </div>
                <div className='p-4'>
                    <Card className='w-full h-full bg-white'>
                        <h3 className='p-3 px-10'>Business Details</h3>
                        <div className='w-full border-t-2 border-gray-200'></div>

                        <form className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Business name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email2"
                                        type="email"
                                        value={businessDetails.name}
                                        name='name'
                                        onChange={(e) => handleBusinessDetails(e)}
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
                                        id="type"
                                        value={businessDetails.category}
                                        name='category'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block ">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Registered? CAC Registration Number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        value={businessDetails.cac_number}
                                        name='cac_number'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Second div */}
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Month / years in business" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}


                                        value={businessDetails.time_in_business}
                                        name='time_in_business'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
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
                                        value={businessDetails.monthly_revenue}
                                        name='monthly_revenue'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
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
                                        value={businessDetails.equipment_of_interest}
                                        name='equipment_of_interest'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Upload Section */}
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="State" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        value={businessDetails.state}
                                        name='state'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Local government area" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        name='lga'
                                        value={businessDetails.lga}
                                        onChange={(e) => handleBusinessDetails(e)}
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"

                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Street address" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        name='street_address'
                                        value={businessDetails.street_address}
                                        onChange={(e) => handleBusinessDetails(e)}
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"

                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
                <div className='p-4'>
                    <Card className='w-full h-full bg-white'>
                        <h3 className='p-3 px-10'>Financial Details</h3>
                        <div className='w-full border-t-2 border-gray-200'></div>

                        <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Bank name" />
                                    </div>
                                    <div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="email2"
                                            type="text"
                                            value={financialDetails.bank_name}
                                            name='bank_name'
                                            onChange={(e) => handleFinancialBusiness(e)}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="name@raba.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Account number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        value={financialDetails.account_number}
                                        name='account_number'
                                        onChange={(e) => handleFinancialBusiness(e)}
                                        required
                                    />
                                </div>

                            </div>

                            {/* Second Form */}
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Thrift master name (if any)" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        value={financialDetails.thrift_master_name}
                                        name='thrift_master_name'
                                        onChange={(e) => handleFinancialBusiness(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Guarantor's name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        type="text"
                                        value={financialDetails.thrift_master_name}
                                        name='thrift_master_name'
                                        onChange={(e) => handleBusinessDetails(e)}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"

                                        required
                                    />
                                </div>

                            </div>


                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Thrift master phone number" />
                                    </div>
                                    <div className="relative flex">
                                        <div className="absolute inset-y-0 left-0 top-1 flex items-center pl-2">
                                            <img src="/Nigeria.png" alt="Nigeria Flag" className="w-5 h-5 object-cover" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px", paddingLeft: "2rem" }}
                                            id="country-code"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-20"
                                            value="+234"
                                            readOnly
                                        />
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="phone-number"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full ml-3"
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Guarantor's phone number" />
                                    </div>
                                    <div className="relative flex">
                                        <div className="absolute inset-y-0 left-0 top-1 flex items-center pl-2">
                                            <img src="/Nigeria.png" alt="Nigeria Flag" className="w-5 h-5 object-cover" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px", paddingLeft: "2rem" }}
                                            id="country-code"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-20"
                                            value="+234"
                                            readOnly
                                        />
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="phone-number"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full ml-3"
                                            placeholder="Enter phone number"
                                            required
                                        />
                                    </div>

                                </div>

                            </div>
                        </div>
                    </Card>
                </div>
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
            </form>



        </div>
    )
}

export default Addcustomer
