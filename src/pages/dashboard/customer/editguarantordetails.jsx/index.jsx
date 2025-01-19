import React from 'react'
import { useState } from 'react'
import { Card, Label } from 'flowbite-react'
import Button from '../../../../components/shared/button'


import { handleEditGuarantorDetails } from '../../../../services/customer'
import { useParams } from 'react-router-dom'
import { useFetchGuarantorDetails } from '../../../../hooks/queries/customer'

function EditGuarantor() {
  const { id } = useParams()

  const { data: guarantorData, isPending, isError } = useFetchGuarantorDetails(id)
  const [loading, setIsLoading] = useState(false)
  const [editGuarantor, setGuarantor] = useState({
    name: "",

    phone_number: ""
  })
  const handleInput = (e) => {
    const { name, value } = e.target
    setGuarantor((prevGuarantor) => ({
      ...prevGuarantor,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const payload = {
        name: editGuarantor.name || guarantorData.name,
        phone_number: editGuarantor.phone_number || guarantorData.phone_number
      };


      const response = await handleEditGuarantorDetails(id, payload);
      console.log(response);
      console.log('Customer updated successfully:', response.data);

      toast.success(response.data.message);

    } catch (error) {
      console.error('Error updating customer:', error);

      toast.error('Error updating customer. Please try again.');
    } finally {
      setIsLoading(false)
    }
  };
  return (
    <div>
      <div className='p-4'>
        <Card className='w-full h-full bg-white'>
          <h3 className='p-3 px-5'>Guarantor</h3>
          <div className='w-full border-t-2 border-gray-200'></div>

          <form className='px-5' onSubmit={(e) => handleUpdate(e)}
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
                    defaultValue={editGuarantor.name || guarantorData?.name}
                    name='name'
                    onChange={(e) => handleInput(e)}

                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                    placeholder="Enter Guarantor's name"

                  />

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
                    type="number"
                    defaultValue={editGuarantor.phone_number || guarantorData?.phone_number}
                    name='phone_number'
                    onChange={(e) => handleInput(e)}

                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                    placeholder="Enter Guarantor's phone number"

                  />

                </div>

              </div>
            </div>
            <div className='mb-7'>
              <Button type="submit" size='lg' className="text-sm w-[150px]" label='Update Guarantor Details' loading={isPending} />


            </div>
          </form>



        </Card>
      </div>
    </div>
  )
}

export default EditGuarantor
