import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '../../../../components/shared/button';
import { Card, Label } from 'flowbite-react';

import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetchOneCustomer } from '../../../../hooks/queries/customer';
import { useParams } from 'react-router-dom';
import { useFetchProduct } from '../../../../hooks/queries/product';
import { handleCreateLoanApplication } from '../../../../services/loans';


function CreateApplication() {
  const [userId, setUserId] = useState("")
  const { id } = useParams()
  const [loading, setIsLoading] = useState(false)
  const { data: singleCustomer } = useFetchOneCustomer(id)
  const { data: productList } = useFetchProduct(1, 50)
  const [display, setDisplay] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')


  console.log(productList)

  const formik = useFormik({
    initialValues: {
      customer: {
        id: Number(id)
      },
      product: {},
      down_payment_percent: null,
      down_payment_amount: null,
      principal: null,
      interest_rate: null,
      tenure_unit: '',
      tenure_value: null,
      repayment_interval: '',
    },
    validationSchema: Yup.object({
      product: Yup.object().required("Product is required"),

      down_payment_percent: Yup.number().required("Down payment percent is required"),
      down_payment_amount: Yup.number().required("Down payment amount is required"),
      principal: Yup.number().required("Principal is required"),
      interest_rate: Yup.number().required("Interest rate is required"),
      tenure_unit: Yup.string().required("Tenure unit is required"),
      tenure_value: Yup.number().required("Tenure value is required"),
      repayment_interval: Yup.string().required("Repayment interval is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      onMutate(values);


    },
  });
  const handleProduct = (e) => {
    const idselected = e.target.value
    const product = productList.data.data.find(item => item.name === idselected)
    setSelectedProduct(product)
    if (product) {
      setSelectedProduct(product);

      const productId = product.id
      const productValue = product ? { productId } : {};
      formik.setFieldValue("product", productValue);
    }

  }



  const { mutate: onMutate, isPending, isError } = useMutation({
    mutationFn: async (values) =>

      handleCreateLoanApplication(values)

    , onSuccess: ({ data }) => {
      console.log(data)
      toast.success(data.message)

      setIsLoading(false)
      if (data) {
        setDisplay(true)
      }
      localStorage.setItem('businessDetailsDisplay', JSON.stringify(true));
      // query.invalidateQueries({ queryKey: ["customers"] })
    }, onError: (error) => {
      setIsLoading(false)
      toast.error(error.message)
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between p-4">
        <h1 className="text-3xl font-semibold">
          Loan<span className="text-black-400">{'>'}</span> Add Loan Application -{singleCustomer?.full_name}
        </h1>
        <div className='flex gap-3'>
          <Button
            label="Cancel"
            variant="transparent"
            size="lg"
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
            <h2 className='p-3 px-10 font-bold'>Create Loan Application for ({singleCustomer?.full_name})</h2>
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
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value=" Principal" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      value={formik.principal}
                      name='principal'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="number"
                      placeholder='Enter principal'
                    />
                    {formik.touched.principal && formik.errors.principal ? (
                      <small className="text-red-500">{formik.errors.principal}</small>
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-2 block ">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="tenure_value" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      type="number"

                      name="tenure_value"

                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.tenure_value}
                      placeholder='Enter tenure_value'

                    />
                    {formik.touched.tenure_value && formik.errors.tenure_value ? (
                      <small className="text-red-500">{formik.errors.tenure_value}</small>
                    ) : null}
                  </div>


                </div>


                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="repayment_interval" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="text"
                      value={formik.repayment_interval}
                      name='repayment_interval'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter repayment_interval"

                    />
                    {formik.touched.repayment_interval && formik.errors.repayment_interval ? (
                      <small className="text-red-500">{formik.errors.repayment_interval}</small>
                    ) : null}
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="down_payment_amount" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="number"
                      value={formik.down_payment_amount}
                      name='down_payment_amount'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder='Enter down_payment_amount'

                    />
                    {formik.touched.down_payment_amount && formik.errors.down_payment_amount ? (
                      <small className="text-red-500">{formik.errors.down_payment_amount}</small>
                    ) : null}
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="down_payment_percent" />
                    </div>
                    <input
                      type="number"
                      value={formik.values.down_payment_percent}
                      name="down_payment_percent"
                      onChange={(e) => formik.setFieldValue('down_payment_percent', Number(e.target.value))}

                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter down_payment_percent"
                    />

                    {formik.touched.down_payment_percent && formik.errors.down_payment_percent ? (
                      <small className="text-red-500">{formik.errors.down_payment_percent}</small>
                    ) : null}
                  </div>



                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="interest_rate" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}

                      type="number"
                      value={formik.interest_rate}
                      name='interest_rate'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter interest_rate"

                    />
                    {formik.touched.interest_rate && formik.errors.interest_rate ? (
                      <small className="text-red-500">{formik.errors.interest_rate}</small>
                    ) : null}
                  </div>


                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Product" />
                    </div>
                    <select className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      name="name" id="" onChange={(e) => handleProduct(e)} value={formik.product}>
                      <option value="">Select a product</option>
                      {Array.isArray(productList?.data?.data) && productList?.data?.data.map((item, index) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>



                    {formik.touched.product && formik.errors.product ? (
                      <small className="text-red-500">{formik.errors.product}</small>
                    ) : null}
                  </div>



                </div>
              </div>
              {selectedProduct && (
                <div className="mt-3 p-4 bg-white-100 rounded-md shadow-md">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedProduct.name}</h3>
                  <p className="text-gray-600 mb-2">Description: {selectedProduct.description}</p>
                  <p className="text-gray-600 mb-2">Price: ${selectedProduct.price}</p>
                  {selectedProduct.display_attachment_url && (
                    <img
                      src={selectedProduct.display_attachment_url.url}
                      alt={selectedProduct.name}
                      className="w-20 h-20 mt-4 rounded-md"
                    />
                  )}
                </div>
              )}

              <div className='mb-7 mt-7'>
                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create loan application' loading={isPending} />


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

export default CreateApplication
