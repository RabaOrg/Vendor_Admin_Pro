import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Label } from 'flowbite-react'
import { useFetchOneCustomer } from '../../../../hooks/queries/customer'

function ViewCustomerDetails() {
  const { id } = useParams()
  const { data: oneCustomer, isPending, isError } = useFetchOneCustomer(id)
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
          <Card className='w-full h-full bg-white'>
            <h4 className='p-3 px-10'>KYC DETAILS</h4>
            <div className='w-full border-t-2 border-gray-200'></div>

            <form className=' px-10' >

              <div className='flex flex-col lg:flex-row gap-7 pb-10 mt-5'>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Customer Name" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.full_name}</p>

                  </div>



                  <div>
                    <div className="mb-2 block ">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Customer ID" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.id}</p>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Age" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.age}</p>
                  </div>
                  <div>



                  </div>

                </div>


                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Phone Number" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.phone_number}</p>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Email" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.email}</p>
                  </div>
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bvn" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.bvn}</p>
                  </div>




                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Date of Birth" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.dob}</p>
                  </div>

                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Gender" />
                    </div>
                    <p className='text-sm font-normal'>{oneCustomer?.gender}</p>
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

export default ViewCustomerDetails
