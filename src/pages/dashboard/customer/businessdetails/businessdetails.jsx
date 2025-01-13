import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { Card, Label } from 'flowbite-react';
import Button from '../../../../components/shared/button';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import EditBusinessDetails from '../editbusinessdetails';
import { handleBusinessDetailsForm } from '../../../../services/customer';

function BusinessDetails({ Id }) {
    const [userId, setUserId] = useState("")
    const [loading, setIsLoading] = useState(false)
    const [display, setDisplay] = useState(false)
    const formik = useFormik({

        initialValues: {
            name: "",
            category: "",
            cac_number: "",
            time_in_business: "",
            equipment_of_interest: "",
            monthly_revenue: "",
            state: "",
            lga: "",
            street_address: ""
        },

        validationSchema: Yup.object({

            name: Yup.string().required("Business name is required"),
            category: Yup.string().required("Category is required"),
            cac_number: Yup.string().required("cac_number is required"),
            time_in_business: Yup.string().required("time_in_business is required"),
            equipment_of_interest: Yup.string().required("equipment_of_interest required"),
            monthly_revenue: Yup.string().required("monthly_revenue is required"),
            state: Yup.string().required("State is required"),
            lga: Yup.string().required("LGA is required"),
            street_address: Yup.string().required("Street Address is required"),

        }),
        onSubmit: async (values) => {
            setIsLoading(true);
            onMutate(values);


        },
    });
    const { mutate: onMutate, isPending, isError } = useMutation({
        mutationFn: async (values) =>

            handleBusinessDetailsForm(Id, values)

        , onSuccess: ({ data }) => {
            console.log(data)
            toast.success(data.message)

            setIsLoading(false)
            setDisplay(true)
            // query.invalidateQueries({ queryKey: ["customers"] })
        }, onError: (error) => {
            setIsLoading(false)
            toast.error(error.message)
        }
    })

    return (
        <div>
            {display ? <div className='p-4'>
                <Card className='w-full h-full bg-white '>

                    <h3 className='p-3 px-10'>Business Details :</h3>


                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form className='px-10' onSubmit={formik.handleSubmit}>

                        <div className='flex flex-col lg:flex-row gap-12 pb-14 mt-5'>
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Business name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}

                                        type="name"
                                        value={formik.name}
                                        name='name'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="Enter Business Name"

                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <small className="text-red-500">{formik.errors.name}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Business type/category" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="type"
                                        value={formik.category}
                                        name='category'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Business Type'

                                    />
                                    {formik.touched.category && formik.errors.category ? (
                                        <small className="text-red-500">{formik.errors.category}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block ">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Registered? CAC Registration Number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        value={formik.cac_number}
                                        name='cac_number'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Reg No'

                                    />
                                    {formik.touched.cac_number && formik.errors.cac_number ? (
                                        <small className="text-red-500">{formik.errors.cac_number}</small>
                                    ) : null}
                                </div>
                            </div>


                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Month / years in business" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}


                                        value={formik.time_in_business}
                                        name='time_in_business'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Months'

                                    />
                                    {formik.touched.time_in_business && formik.errors.time_in_business ? (
                                        <small className="text-red-500">{formik.errors.time_in_business}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Monthly revenue" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        value={formik.monthly_revenue}
                                        name='monthly_revenue'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Monthly revenue'

                                    />
                                    {formik.touched.monthly_revenue && formik.errors.monthly_revenue ? (
                                        <small className="text-red-500">{formik.errors.monthly_revenue}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Equipment of interest" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        value={formik.equipment_of_interest}
                                        name='equipment_of_interest'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter equipment of interval'

                                    />
                                    {formik.touched.equipment_of_interest && formik.errors.equipment_of_interest ? (
                                        <small className="text-red-500">{formik.errors.equipment_of_interest}</small>
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="State" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        value={formik.state}
                                        name='state'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"

                                    />
                                    {formik.touched.state && formik.errors.state ? (
                                        <small className="text-red-500">{formik.errors.state}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Local government area" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        name='lga'
                                        value={formik.lga}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />
                                    {formik.touched.lga && formik.errors.lga ? (
                                        <small className="text-red-500">{formik.errors.lga}</small>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Street address" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        name='street_address'
                                        value={formik.street_address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />
                                    {formik.touched.street_address && formik.errors.street_address ? (
                                        <small className="text-red-500">{formik.errors.street_address}</small>
                                    ) : null}
                                </div>
                            </div>
                        </div>



                        <div className='mb-7'>
                            <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Business Details' loading={loading} />


                        </div>
                    </form>
                </Card>
            </div> : <EditBusinessDetails />}
        </div>
    )
}

export default BusinessDetails
