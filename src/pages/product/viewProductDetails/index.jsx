import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'

import { useFetchCategory, useFetchSingleProduct } from '../../../hooks/queries/product'
import axiosInstance from '../../../../store/axiosInstance'

function ViewProductDetails() {
  const { id } = useParams()
  const { data: oneProduct, isPending, isError } = useFetchSingleProduct(id)
  const { data: category } = useFetchCategory()
  console.log(category)
  const [categoryName, setcategory] = useState('')


  useEffect(() => {
    handleGetSingleProduct()

  }, [])
  const handleGetSingleProduct = async () => {
    const data = await axiosInstance.get(`/admin/products/${id}`);

    console.log(data)
  }

  const categoryDetails = category?.find(cat => cat.id === oneProduct?.category_id) || {};


  return (
    <div className="px-6">
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
          <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">
            PRODUCT DETAILS <span className="text-black-400">{'>'}</span> {oneProduct?.full_name}
          </h1>
        </div>

        <div className="p-4">
          <div className="w-full h-full bg-white shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold pb-3">PRODUCT DETAILS</h4>
            <div className="w-full border-t-2 border-gray-200 mb-4"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 pb-10 mt-5">

              <div className="flex flex-col gap-4">
                <DetailItem label="Product Name" value={oneProduct?.name} />
                <DetailItem label="Product Price" value={oneProduct?.price} />
                <DetailItem label="Description" value={oneProduct?.description} />
                <DetailItem label="Category" value={categoryDetails.name} />

              </div>


              <div className="flex flex-col gap-4">
                <DetailItem label="Shipping Days Min" value={oneProduct?.shipping_days_min} />
                <DetailItem label="Shipping Days Max" value={oneProduct?.shipping_days_max} />
                <DetailItem label="Repayment plan ID" value={oneProduct?.repayment_policies?.id} />


              </div>
            </div>
            {oneProduct?.specifications && typeof oneProduct.specifications === "object" && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">Product Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(oneProduct.specifications).map(([attribute, value], index) => (
                    <div key={index} className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">



                      <p className="text-sm text-gray-700">
                        {typeof value === 'object' ? (

                          Object.entries(value).map(([subKey, subValue]) => (
                            <div key={subKey}>
                              <strong>{subKey}:</strong> {subValue}
                            </div>
                          ))
                        ) : (
                          // If it's not an object, just display the value
                          value
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}




            {oneProduct?.interest_rule && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">Product Interest Rule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(oneProduct?.interest_rule || {}).map(([interval, rules], index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md"
                    >
                      <span className="text-xs font-semibold text-[#212C25]">Interval</span>
                      <p className="text-sm text-gray-700">{interval}</p>


                      {Array.isArray(rules) && rules.map((rule, ruleIndex) => (
                        <div key={ruleIndex} className="mt-2 p-3 bg-white border rounded-md">
                          <span className="text-xs font-semibold text-[#212C25]">Min Duration:</span>
                          <p className="text-sm text-gray-700">{rule.min}</p>

                          <span className="text-xs font-semibold text-[#212C25] mt-2">Max Duration:</span>
                          <p className="text-sm text-gray-700">{rule.max}</p>

                          <span className="text-xs font-semibold text-[#212C25] mt-2">Rate:</span>
                          <p className="text-sm text-gray-700">{rule.rate}%</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {oneProduct?.repayment_policies && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#212C25] mb-4">Repayment Policies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">

                  {oneProduct.repayment_policies.monthly_tenure && (
                    <div className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Monthly Tenure</span>
                      <p className="text-sm text-gray-700">Min: {oneProduct.repayment_policies.monthly_tenure.min}</p>
                      <p className="text-sm text-gray-700">Max: {oneProduct.repayment_policies.monthly_tenure.max}</p>
                    </div>
                  )}

                  {oneProduct.repayment_policies.weekly_tenure && (
                    <div className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Weekly Tenure</span>
                      <p className="text-sm text-gray-700">Min: {oneProduct.repayment_policies.weekly_tenure.min}</p>
                      <p className="text-sm text-gray-700">Max: {oneProduct.repayment_policies.weekly_tenure.max}</p>
                    </div>
                  )}

                  {oneProduct.repayment_policies.down_percentage && (
                    <div className="flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Down Percentage</span>
                      <p className="text-sm text-gray-700">Min: {oneProduct.repayment_policies.down_percentage.min}</p>
                      <p className="text-sm text-gray-700">Max: {oneProduct.repayment_policies.down_percentage.max}</p>
                    </div>
                  )}

                  {oneProduct.repayment_policies.description && (
                    <div className="col-span-3 flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Description</span>
                      <p className="text-sm text-gray-700">{oneProduct.repayment_policies.description}</p>
                      <p className="text-sm text-gray-700">{oneProduct.repayment_policies.description}</p>
                    </div>
                  )}

                </div>
              </div>
            )}

            <div>

              {oneProduct?.display_attachment && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Main Display Attachment</h4>
                  <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg">
                    <div className="w-full h-80 rounded-lg overflow-hidden flex justify-center items-center bg-gray-50">
                      <img
                        src={oneProduct.display_attachment}
                        alt="Main Display Attachment"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}




              {oneProduct?.attachments && oneProduct.attachments.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-[#212C25] mb-4">Product Attachments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {oneProduct.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex flex-col bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
                      >
                        {/* Image Container to ensure proper display */}
                        <div className="w-full h-52 flex justify-center items-center bg-gray-100">
                          <img
                            src={attachment.url}
                            alt={attachment.title || `Attachment ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="p-4">
                          <h5 className="text-md font-semibold text-gray-900">
                            {attachment.title || `Attachment ${index + 1}`}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>







          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div>
    <label className="text-[#212C25] text-xs font-semibold">{label}</label>
    <p className="bg-gray-100 text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md w-full">
      {value || "N/A"}
    </p>
  </div>
);
export default ViewProductDetails
