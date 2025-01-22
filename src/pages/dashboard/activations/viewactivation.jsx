import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'

import { useFetchSingleActivation } from '../../../hooks/queries/loan'
import { useFetchOneCustomer } from '../../../hooks/queries/customer'

function ViewActivation() {
  const { id } = useParams()

  const { data: singleLoanList, isPending, isError } = useFetchSingleActivation(id)
  console.log(singleLoanList)
  return (
    <div className="px-6">
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
          <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">
            ACTIVATIONS<span className="text-black-400">{'>'}</span> {singleLoanList?.customer_name}
          </h1>
        </div>


        <div className='p-4'>
          <Card className='w-full h-full bg-white'>
            <h3 className='p-3 px-10'>Activation List</h3>
            <div className='w-full border-t-2 border-gray-200'></div>

            <form className=' px-10' >

              <div className='flex flex-col lg:flex-row gap-7 pb-10 mt-5'>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Business Name" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.business_name}</p>

                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Customer Name" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.customer_name}</p>
                  </div>

                  <div>
                    <div className="mb-2 block ">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Down-Payment" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.down_payment}</p>
                  </div>
                  <div>



                  </div>

                </div>


                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Product" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.product}</p>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Interest_amount" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.interest_amount}</p>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Total_repayment" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.total_repayment}</p>
                  </div>



                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Customer Id" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.id}</p>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Status" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.status}</p>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Loan Application Id" />
                    </div>
                    <p className='text-sm font-normal'>{singleLoanList?.loan_application_id}</p>
                  </div>



                </div>
              </div>


            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ViewActivation
