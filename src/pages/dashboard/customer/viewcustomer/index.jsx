import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'
import { useFetchBusinessCustomerDetails, useFetchBusinessFinancialDetails, useFetchGuarantorDetails, useFetchOneCustomer } from '../../../../hooks/queries/customer'

function ViewCustomerDetails() {
  const { id } = useParams()
  const { data: oneCustomer, isPending, isError } = useFetchOneCustomer(id)
  const { data: oneBusiness } = useFetchBusinessCustomerDetails(id)
  const { data: oneFinance } = useFetchBusinessFinancialDetails(id)
  const { data: oneGuarantor } = useFetchGuarantorDetails(id)
  console.log(oneCustomer)
  return (
    <div className="px-6">
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
          <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">
            CUSTOMER DETAILS<span className="text-black-400">{'>'}</span> {oneCustomer?.full_name}
          </h1>
        </div>


        <div className='p-4'>
          {/* CUSTOMER KYC DETAILS */}
          <div className="w-full h-full bg-white shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold pb-3">CUSTOMER KYC DETAILS</h4>
            <div className="w-full border-t-2 border-gray-200 mb-4"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pb-10 mt-5">
              <div className="flex flex-col gap-4">
                <DetailItem label="Customer ID" value={oneCustomer?.id} />
                <DetailItem label="Full Name" value={oneCustomer?.full_name} />
                <DetailItem label="Age" value={oneCustomer?.age} />
                <DetailItem label="Age" value={oneCustomer?.phone_number} />
              </div>

              <div className="flex flex-col gap-4">
                <DetailItem label="Phone Number" value={oneCustomer?.phone_number} />
                <DetailItem label="Email" value={oneCustomer?.email} />
                <DetailItem label="BVN" value={oneCustomer?.bvn} />
              </div>

              <div className="flex flex-col gap-4">
                <DetailItem label="Gender" value={oneCustomer?.gender} />
                <DetailItem label="Date of Birth" value={oneCustomer?.dob} />
                <DetailItem label="KYC Status" value={oneCustomer?.kyc_completed ? "Completed" : "Pending"} />

              </div>
            </div>
          </div>

          {/* BUSINESS DETAILS */}
          {oneBusiness && (
            <div className="w-full h-full bg-white shadow-md rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold pb-3">BUSINESS DETAILS</h4>
              <div className="w-full border-t-2 border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pb-10 mt-5">
                <div className="flex flex-col gap-4">
                  <DetailItem label="Business ID" value={oneBusiness?.id} />
                  <DetailItem label="Business Name" value={oneBusiness?.name} />
                  <DetailItem label="Category" value={oneBusiness?.category} />
                  <DetailItem label="CAC Number" value={oneBusiness?.cac_number} />

                </div>

                <div className="flex flex-col gap-4">
                  <DetailItem label="State" value={oneBusiness?.state} />
                  <DetailItem label="LGA" value={oneBusiness?.lga} />
                  <DetailItem label="Street Address" value={oneBusiness?.street_address} />
                  <DetailItem label="Created At" value={new Date(oneBusiness?.created_at).toLocaleDateString()} />
                </div>

                <div className="flex flex-col gap-4">
                  <DetailItem label="Monthly Revenue" value={`₦${oneBusiness?.monthly_revenue}`} />
                  <DetailItem label="Equipment of Interest" value={oneBusiness?.equipment_of_interest} />
                  <DetailItem label="Time in Business (Years)" value={oneBusiness?.time_in_business} />
                  <DetailItem label="Registered" value={oneBusiness?.isCompleted ? "Yes" : "No"} />


                </div>
              </div>
            </div>
          )}
          {oneFinance && (
            <div className="w-full h-full bg-white shadow-md rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold pb-3">FINANCIAL DETAILS</h4>
              <div className="w-full border-t-2 border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pb-10 mt-5">
                <div className="flex flex-col gap-4">
                  <DetailItem label="Account Name" value={oneFinance?.account_name} />
                  <DetailItem label="Account Number" value={oneFinance?.account_number} />
                  <DetailItem label="Bank Name" value={oneFinance?.bank_name} />
                </div>

                <div className="flex flex-col gap-4">
                  <DetailItem label="Bank Code" value={oneFinance?.bank_code} />
                  <DetailItem label="Bank UUID" value={oneFinance?.bank_uuid} />
                  <DetailItem label="Thrift Master Name" value={oneFinance?.thrift_master_name} />
                </div>

                <div className="flex flex-col gap-4">
                  <DetailItem label="Thrift Master Phone" value={oneFinance?.thrift_master_phone_number} />
                  <DetailItem label="Created At" value={new Date(oneFinance?.created_at).toLocaleDateString()} />
                  <DetailItem label="Updated At" value={new Date(oneFinance?.updated_at).toLocaleDateString()} />
                </div>
              </div>
            </div>
          )}
          {oneGuarantor && (
            <div className="w-full h-full bg-white shadow-md rounded-lg p-6 mt-6">
              <h4 className="text-lg font-semibold pb-3">GUARANTOR DETAILS</h4>
              <div className="w-full border-t-2 border-gray-200 mb-4"></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 pb-10 mt-5">
                <div className="flex flex-col gap-4">
                  <DetailItem label="Guarantor Name" value={oneGuarantor?.name} />
                  <DetailItem label="Phone Number" value={oneGuarantor?.phone_number} />
                </div>

                <div className="flex flex-col gap-4">
                  <DetailItem label="Guarantor ID" value={oneGuarantor?.id} />
                  <DetailItem label="User ID" value={oneGuarantor?.user_id} />
                </div>

                <div className="flex flex-col gap-4">
                  <DetailItem label="Created At" value={new Date(oneGuarantor?.created_at).toLocaleDateString()} />
                  <DetailItem label="Updated At" value={new Date(oneGuarantor?.updated_at).toLocaleDateString()} />
                </div>
              </div>
            </div>


          )}
        </div>

      </div>
    </div>


  )
}
const DetailItem = ({ label, value }) => (
  <div>
    <label className="text-[#212C25] text-xs font-semibold">{label}</label>
    <p className="bg-gray-100 text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md w-full">
      {value || "N/A"}
    </p>
  </div>
);

export default ViewCustomerDetails
