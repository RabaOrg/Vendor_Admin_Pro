import React, { useState, useEffect } from 'react'
import { Card, Label, } from 'flowbite-react'
import { Link } from 'react-router-dom'
import Button from '../../../../components/shared/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'

import * as Yup from 'yup'
import { handleRepayment } from '../../../../services/loans'

function RepaymentPlan() {

  const query = useQueryClient()
  const navigate = useNavigate()




  const formik = useFormik({

    initialValues: {
      tenure_unit: "",
      description: "",
      weekly_tenure_min: "",
      weekly_tenure_max: "",
      monthly_tenure_min: "",
      monthly_tenure_max: "",
      down_percent_min: "",
      down_percent_max: ""
    },

    validationSchema: Yup.object({

      tenure_unit: Yup.string().required("Tenure_unit is required"),

      description: Yup.string().required("Description is required"),
      weekly_tenure_max: Yup.string().required("Weekly_tenure_max is required"),
      weekly_tenure_min: Yup.string().required("Weekly_tenure_min is required"),
      monthly_tenure_max: Yup.string().required("Monthly_tenure_max is required"),
      monthly_tenure_min: Yup.string().required("Monthly_tenure_min is required"),
      down_percent_min: Yup.string().required("Down_percent_min is required"),
      down_percent_max: Yup.string().required("Down_percent_max is required")

    }),
    onSubmit: async (values) => {
      onMutate(values)

    },
  });
  const { mutate: onMutate, isPending, isError } = useMutation({
    mutationFn: async (values) =>
      handleRepayment(values)

    , onSuccess: ({ data }) => {
      console.log(data)


      toast.success(data.message)

      navigate('/repayment-plan')
    }, onError: (error) => {
      toast.error(error.message)
    }
  })
  const handleCancel = () => {
    navigate('/repayment-plan')
  }

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-semibold">
          Repayment <span className="text-black-400">{'>'}</span> Add Repayment
        </h1>
        <div className='flex gap-3'>
          <Button
            label="Cancel"
            variant="transparent"
            size="lg"
            onClick={handleCancel}
            className="text-sm w-[150px]"
          />
          <Button
            label="Create Repayment-plan"
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
            <h3 className='p-3 px-10'>Create Repayment Plan</h3>
            <div className='w-full border-t-2 border-gray-200'></div>

            <form className=' px-10' onSubmit={formik.handleSubmit}>
              {/* First Form */}
              <div className='flex flex-col lg:flex-row gap-7 pb-10 mt-5'>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Tenure_unit" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="text"
                      value={formik.tenure_unit}
                      name='tenure_unit'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter tenure_unit"

                    />
                    {formik.touched.tenure_unit && formik.errors.tenure_unit ? (
                      <small className="text-red-500">{formik.errors.tenure_unit}</small>
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value=" Description" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      value={formik.description}
                      name='description'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="text"
                      placeholder='Enter  description'
                    />
                    {formik.touched.description && formik.errors.description ? (
                      <small className="text-red-500">{formik.errors.description}</small>
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-2 block ">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value=" weekly_tenure_min" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="text"
                      id="email"
                      name="weekly_tenure_min"

                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.weekly_tenure_min}
                      placeholder='Enter weekly_tenure_min'

                    />
                    {formik.touched.weekly_tenure_min && formik.errors.weekly_tenure_min ? (
                      <small className="text-red-500">{formik.errors.weekly_tenure_min}</small>
                    ) : null}
                  </div>


                </div>


                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="weekly_tenure_max" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="text"
                      value={formik.weekly_tenure_max}
                      name='weekly_tenure_max'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter weekly_tenure_max"

                    />
                    {formik.touched.weekly_tenure_max && formik.errors.weekly_tenure_max ? (
                      <small className="text-red-500">{formik.errors.weekly_tenure_max}</small>
                    ) : null}
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="monthly_tenure_min" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="number"
                      value={formik.monthly_tenure_min}
                      name='monthly_tenure_min'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder='Enter monthly_tenure_min'

                    />
                    {formik.touched.monthly_tenure_min && formik.errors.monthly_tenure_min ? (
                      <small className="text-red-500">{formik.errors.monthly_tenure_min}</small>
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="monthly_tenure_max" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      value={formik.monthly_tenure_max}
                      name='monthly_tenure_max'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="text"
                      placeholder='Enter monthly_tenure_max'

                    />
                    {formik.touched.monthly_tenure_max && formik.errors.monthly_tenure_max ? (
                      <small className="text-red-500">{formik.errors.monthly_tenure_max}</small>
                    ) : null}
                  </div>



                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="down_percent_min" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="text"
                      value={formik.down_percent_min}
                      name='down_percent_min'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter down_percent_min"

                    />
                    {formik.touched.down_percent_min && formik.errors.down_percent_min ? (
                      <small className="text-red-500">{formik.errors.down_percent_min}</small>
                    ) : null}
                  </div>


                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="down_percent_max" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      value={formik.down_percent_max}
                      name="down_percent_max"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="text"
                      placeholder="Enter down_percent_max"

                    />
                    {formik.touched.down_percent_max && formik.errors.down_percent_max ? (
                      <small className="text-red-500">{formik.errors.down_percent_max}</small>
                    ) : null}
                  </div>



                </div>
              </div>
              <div className='mb-7'>
                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Repayment Plan' loading={isPending} />


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
      </div>
    </div>
  )
}

export default RepaymentPlan
