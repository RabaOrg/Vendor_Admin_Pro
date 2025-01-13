import React from 'react'
import Button from '../../../../components/shared/button'
import { Card, Label } from 'flowbite-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { handleGuarantorDetailsForm } from '../../../../services/customer'


function Guarantor({ Id }) {
    const query = useQueryClient()
    const formik = useFormik({

        initialValues: {
            name: "",

            phone_number: ""
        },

        validationSchema: Yup.object({


            phone_number: Yup.string()
                .max(12, "Must be 12 characters or less")
                .required("Phone number is required"),
            name: Yup.string().required("Guarantor's name is required"),


        }),
        onSubmit: async (values) => {
            onMutate(values)

        },
    });
    const { mutate: onMutate, isPending, isError } = useMutation({
        mutationFn: async (values) =>
            handleGuarantorDetailsForm(Id, values)

        , onSuccess: ({ data }) => {
            console.log(data)
            console.log(data.data.id)
            setId(data.data.id)
            toast.success(data.message)
            query.invalidateQueries({ queryKey: ["customers"] })

        }, onError: (error) => {
            toast.error(error.message)
        }
    })
    return (
        <div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-5'>Guarantor</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form className='px-5' onSubmit={formik.handleSubmit}
                    >
                        <div className='flex flex-col lg:flex-row gap-12 pb-10 mt-5'>

                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Guarantor Name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email2"
                                        type="text"
                                        value={formik.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="Enter Guarantor's name"

                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <small className="text-red-500">{formik.errors.name}</small>
                                    ) : null}
                                </div>

                            </div>



                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Guarantor's phone number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        value={formik.phone_number}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="Enter Guarantor's phone number"

                                    />
                                    {formik.touched.phone_number && formik.errors.phone_number ? (
                                        <small className="text-red-500">{formik.errors.phone_number}</small>
                                    ) : null}
                                </div>

                            </div>
                        </div>
                        <div className='mb-7'>
                            <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Guarantor Details' loading={isPending} />


                        </div>
                    </form>



                </Card>
            </div>
        </div>
    )
}

export default Guarantor
