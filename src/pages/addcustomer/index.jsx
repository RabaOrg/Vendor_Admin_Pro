import React, { useState } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'
import FinancialDetails from '../dashboard/customer/financialdetails/financialdetail'
import BusinessDetails from '../dashboard/customer/businessdetails/businessdetails'
import { toast } from 'react-toastify'
import { BiUpload } from 'react-icons/bi'

import { useNavigate } from 'react-router-dom'


import { useAuthStore } from '../../../store/store'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { handleCustomerForm } from '../../services/customer'
import Guarantor from '../dashboard/customer/guarantor'
import ImageUpload from '../dashboard/uploadimage'


function Addcustomer() {

    const [id, setId] = useState("")
    const query = useQueryClient()
    const navigate = useNavigate()




    const formik = useFormik({

        initialValues: {
            phone_number: "",
            first_name: "",
            last_name: "",
            email: "",
            gender: "",
            dob: "",
            bvn: ""
        },

        validationSchema: Yup.object({

            email: Yup.string().email("Invalid email address").required("Email is required"),
            phone_number: Yup.string()
                .max(12, "Must be 12 characters or less")
                .required("Phone number is required"),
            first_name: Yup.string().required("First name is required"),
            last_name: Yup.string().required("Last name is required"),
            gender: Yup.string().required("Gender is required"),
            bvn: Yup.string().required("Bvn is required"),
            dob: Yup.string().required("Dob is required")

        }),
        onSubmit: async (values) => {
            onMutate(values)

        },
    });
    const { mutate: onMutate, isPending, isError } = useMutation({
        mutationFn: async (values) =>
            handleCustomerForm(values)

        , onSuccess: ({ data }) => {
            console.log(data)
            console.log(data.data.id)
            setId(data.data.id)
            toast.success(data.message)
            query.invalidateQueries({ queryKey: ["customers"] })
            navigate('/customer')
        }, onError: (error) => {
            toast.error(error.message)
        }
    })





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
            <div >
                <div className='p-4'>
                    <Card className='w-full h-full bg-white'>
                        <h3 className='p-3 px-10'>KYC Details</h3>
                        <div className='w-full border-t-2 border-gray-200'></div>

                        <form className=' px-10' onSubmit={formik.handleSubmit}>
                            {/* First Form */}
                            <div className='flex flex-col lg:flex-row gap-7 pb-10 mt-5'>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="First name" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}

                                            type="text"
                                            value={formik.first_name}
                                            name='first_name'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="Enter First Name"

                                        />
                                        {formik.touched.first_name && formik.errors.first_name ? (
                                            <small className="text-red-500">{formik.errors.first_name}</small>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Last name" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}

                                            value={formik.last_name}
                                            name='last_name'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="text"
                                            placeholder='Enter Last name'
                                        />
                                        {formik.touched.last_name && formik.errors.last_name ? (
                                            <small className="text-red-500">{formik.errors.last_name}</small>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="mb-2 block ">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Email Address" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}

                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="email"
                                            id="email"
                                            name="email"

                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            placeholder='Enter Email'

                                        />
                                        {formik.touched.email && formik.errors.email ? (
                                            <small className="text-red-500">{formik.errors.email}</small>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="mb-2 block text-sm">
                                            <p>What is your customer's gender?</p>
                                        </div>
                                        <div className='flex gap-4'>

                                            <div className='flex gap-1'>

                                                <input
                                                    style={{ color: "#202224", borderRadius: "8px" }}

                                                    type="radio"
                                                    value="female"
                                                    // checked={formik.gender === "female"}
                                                    name='gender'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className="bg-white text-sm text-gray-700 border border-[#A0ACA4] focus:ring-2 focus:ring-[#0f5d30] focus:outline-none"


                                                />

                                                <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Female" />
                                            </div>
                                            <div className='flex gap-1'>
                                                <input
                                                    style={{ color: "#202224", borderRadius: "8px" }}

                                                    type="radio"
                                                    // checked={formik.gender === "male"}
                                                    value="male"
                                                    name='gender'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className="bg-white text-sm text-gray-700 border border-[#A0ACA4] focus:ring-2 focus:ring-[#0f5d30] focus:outline-none "


                                                />

                                                <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Male" />
                                            </div>
                                        </div>
                                        {formik.touched.gender && formik.errors.gender ? (
                                            <small className="text-red-500">{formik.errors.gender}</small>
                                        ) : null}

                                    </div>

                                </div>


                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bank verfication number" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}

                                            type="text"
                                            value={formik.bvn}
                                            name='bvn'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="Enter Bvn"

                                        />
                                        {formik.touched.bvn && formik.errors.bvn ? (
                                            <small className="text-red-500">{formik.errors.bvn}</small>
                                        ) : null}
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Date of Birth" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}

                                            type="date"
                                            value={formik.dob}
                                            name='dob'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder='Enter Date of Birth'

                                        />
                                        {formik.touched.dob && formik.errors.dob ? (
                                            <small className="text-red-500">{formik.errors.dob}</small>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Phone Number" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}

                                            value={formik.phone_number}
                                            name='phone_number'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="text"
                                            placeholder='Enter Phone_Number'

                                        />
                                        {formik.touched.phone_number && formik.errors.phone_number ? (
                                            <small className="text-red-500">{formik.errors.phone_number}</small>
                                        ) : null}
                                    </div>



                                </div>
                            </div>
                            <div className='mb-7'>
                                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create KYC Details' loading={isPending} />


                            </div>


                        </form>
                    </Card>
                </div>
                {/* <div className='p-4'>
                    <Card className='w-full h-full bg-white'>
                        <h3 className='p-3 px-10'>Upload Details</h3>
                        <div className='w-full border-t-2 border-gray-200'></div>

                        <form className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>
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
                <BusinessDetails Id={id} />
                <FinancialDetails Id={id} />

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
                </div> */}
                <BusinessDetails />
                <FinancialDetails />
                <Guarantor />
                <ImageUpload />
            </div>



        </div>
    )
}

export default Addcustomer
