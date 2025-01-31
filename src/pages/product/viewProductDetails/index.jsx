import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'

import { useFetchSingleProduct } from '../../../hooks/queries/product'

function ViewProductDetails() {
  const { id } = useParams()
  const { data: oneProduct, isPending, isError } = useFetchSingleProduct(id)
  console.log(oneProduct)
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
                <DetailItem label="Business Name" value={oneProduct?.name} />
                <DetailItem label="Product Price" value={oneProduct?.price} />
                <DetailItem label="Description" value={oneProduct?.description} />
              </div>


              <div className="flex flex-col gap-4">
                <DetailItem label="Shipping Days Min" value={oneProduct?.shipping_days_min} />
                <DetailItem label="Shipping Days Max" value={oneProduct?.shipping_days_max} />

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


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


                  {oneProduct.repayment_policies.description && (
                    <div className="col-span-2 flex flex-col bg-gray-100 p-4 border border-[#A0ACA4] rounded-md">
                      <span className="text-xs font-semibold text-[#212C25]">Description</span>
                      <p className="text-sm text-gray-700">{oneProduct.repayment_policies.description}</p>
                    </div>
                  )}

                </div>
              </div>
            )}




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
