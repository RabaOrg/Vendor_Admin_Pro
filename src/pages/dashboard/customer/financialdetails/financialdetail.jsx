import React, { useState } from 'react'
import { useFormik } from 'formik'
import { Label } from 'flowbite-react'
import Button from '../../../../components/shared/button'
import Card from '../../../../components/shared/card'
import { handleFinancialDetailsForm } from '../../../../services/customer'
import { toast } from 'react-toastify'
import EditFinancial from '../editfinancialdetails'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'


function FinancialDetails({ Id }) {
    const [loading, setisLoading] = useState(false)
    const [display, setDisplay] = useState(false)

    const [fId, setFId] = useState("")
    const formik = useFormik({

        initialValues: {
            account_number: "",
            account_name: "",
            bank_name: "",
            bank_code: "",
            bank_uuid: "",
            thrift_master_name: "",
            thrift_master_phone_number: ""
        },

        validationSchema: Yup.object({

            account_name: Yup.string().required("account_name is required"),
            thrift_master_phone_number: Yup.string()
                .max(10, "Must be 10 characters or less")
                .required("Phone number is required"),
            bank_code: Yup.string().required("Bank_code is required"),
            bank_uuid: Yup.string().required("Bank_uuid is required"),
            account_number: Yup.string().required("account_number is required"),
            thrift_master_name: Yup.string().required("Thrift_master_name is required"),
            bank_name: Yup.string().required("Bank_name is required")

        }),
        onSubmit: async (values) => {
            setisLoading(true)
            onMutate(values)

        },
    });
    const { mutate: onMutate, isPending, isError } = useMutation({
        mutationFn: async (values) =>

            handleFinancialDetailsForm(Id, values)

        , onSuccess: ({ data }) => {
            console.log(data)
            toast.success(data.message)

            setisLoading(false)
            if (data) {
                setDisplay(true)
            }
            localStorage.setItem('businessDetailsDisplay', JSON.stringify(true));
            // query.invalidateQueries({ queryKey: ["customers"] })
        }, onError: (error) => {
            setisLoading(false)
            toast.error(error.message)
        }
    })


    return (
        <div>
            {display === false ? <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Financial Details</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form className='px-10' onSubmit={formik.handleSubmit}>
                        <div className='flex flex-col lg:flex-row gap-12 pb-14 mt-5'>

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
                                            value={formik.bank_name}
                                            name='bank_name'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}

                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="name@raba.com"

                                        />
                                        {formik.touched.bank_name && formik.errors.bank_name ? (
                                            <small className="text-red-500">{formik.errors.bank_name}</small>
                                        ) : null}
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
                                        value={formik.account_number}
                                        name='account_number'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}


                                    />
                                    {formik.touched.account_number && formik.errors.account_number ? (
                                        <small className="text-red-500">{formik.errors.account_number}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bank uuid" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        value={formik.bank_uuid}
                                        name='bank_uuid'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"

                                    />
                                    {formik.touched.bank_uuid && formik.errors.bank_uuid ? (
                                        <small className="text-red-500">{formik.errors.bank_uuid}</small>
                                    ) : null}
                                </div>

                            </div>

                            {/* Second Form */}
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bank Code" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        value={formik.bank_code}
                                        name='bank_code'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"

                                    />
                                    {formik.touched.bank_code && formik.errors.bank_code ? (
                                        <small className="text-red-500">{formik.errors.bank_code}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Account Name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        type="text"
                                        value={formik.account_name}
                                        name='account_name'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />
                                    {formik.touched.account_name && formik.errors.account_name ? (
                                        <small className="text-red-500">{formik.errors.account_name}</small>
                                    ) : null}
                                </div>

                            </div>



                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Thrift master name (if any)" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        type="text"
                                        value={formik.thrift_master_name}
                                        name='thrift_master_name'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />
                                    {formik.touched.thrift_master_name && formik.errors.thrift_master_name ? (
                                        <small className="text-red-500">{formik.errors.thrift_master_name}</small>
                                    ) : null}
                                </div>
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

                                            type="text"
                                            name='thrift_master_phone_number'
                                            value={formik.thrift_master_phone_number}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}

                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full ml-3"
                                            placeholder="Enter phone number"

                                        />

                                    </div>
                                    {formik.touched.thrift_master_phone_number && formik.errors.thrift_master_phone_number ? (
                                        <small className="text-red-500">{formik.errors.thrift_master_phone_number}</small>
                                    ) : null}
                                </div>
                                {/* <div>
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

                            </div> */}

                            </div>
                        </div>
                        <div className='mb-7'>
                            <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Financial Details' loading={loading} />


                        </div>
                    </form>
                </Card>
            </div> : <EditFinancial />}

        </div>
    )
}

export default FinancialDetails
