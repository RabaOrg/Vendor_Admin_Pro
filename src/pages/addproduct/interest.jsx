import React from 'react'
import { Card, Label } from 'flowbite-react'

function Interest() {
  return (
    <div>
      <div className='p-4'>
        <Card className='w-full h-full bg-white'>
          <h3 className='p-3 px-10'>Product Interest Rate Rule</h3>
          <div className='w-full border-t-2 border-gray-200'></div>
          <div>
            <h3 className='p-3 px-10'>Weekly</h3>
            <div className='flex flex-col lg:flex-row gap-12 px-10 pb-7 '>

              <form className="flex flex-col gap-4 w-full lg:w-1/2">
                <div>
                  <div className="mb-2 block">
                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Min" />
                  </div>
                  <input
                    style={{ color: "#202224", borderRadius: "8px" }}
                    id="email2"
                    type="text"
                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                  />
                </div>

              </form>



              <form className="flex flex-col gap-4 w-full lg:w-1/2">
                <div>
                  <div className="mb-2 block">
                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Max" />
                  </div>
                  <input
                    style={{ color: "#202224", borderRadius: "8px" }}
                    id="email3"
                    type="text"
                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                  />
                </div>

              </form>
              <form className="flex flex-col gap-4 w-full lg:w-1/2">
                <div>
                  <div className="mb-2 block">
                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Rate" />
                  </div>
                  <input
                    style={{ color: "#202224", borderRadius: "8px" }}
                    id="email3"
                    type="text"
                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                  />
                </div>

              </form>

            </div>
          </div>
          <div>
            <h3 className='p-3 px-10'>Monthly</h3>
            <div className='flex flex-col lg:flex-row gap-12 px-10 pb-10 '>

              <form className="flex flex-col gap-4 w-full lg:w-1/2">
                <div>
                  <div className="mb-2 block">
                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Min" />
                  </div>
                  <input
                    style={{ color: "#202224", borderRadius: "8px" }}
                    id="email2"
                    type="text"
                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                  />
                </div>

              </form>



              <form className="flex flex-col gap-4 w-full lg:w-1/2">
                <div>
                  <div className="mb-2 block">
                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Max" />
                  </div>
                  <input
                    style={{ color: "#202224", borderRadius: "8px" }}
                    id="email3"
                    type="text"
                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                  />
                </div>

              </form>
              <form className="flex flex-col gap-4 w-full lg:w-1/2">
                <div>
                  <div className="mb-2 block">
                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Rate" />
                  </div>
                  <input
                    style={{ color: "#202224", borderRadius: "8px" }}
                    id="email3"
                    type="text"
                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                  />
                </div>

              </form>

            </div>
          </div>



        </Card>
      </div>
    </div>
  )
}

export default Interest
