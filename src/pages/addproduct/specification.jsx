import React from 'react'
import { Card, Label } from 'flowbite-react'
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Yup from 'yup'

function Specifications() {
  const formik = useFormik({

    initialValues: {
      weight: "",
      colour: ""
    },

    validationSchema: Yup.object({
      weight: Yup.string().required("Weight is required"),
      colour: Yup.number().required("Colour is required"),

    }),

    onSubmit: async (values) => {
      setIsLoading(true);
      onMutate(values);


    },


  });
  return (
    <div>
      <div className='p-4'>
        <Card className='w-full h-full bg-white'>
          <h3 className='p-3 px-10'>Specifications</h3>
          <div className='w-full border-t-2 border-gray-200'></div>

          <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>

            <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div>
                <div className="mb-2 block">
                  <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Weight" />
                </div>
                <input
                  style={{ color: "#202224", borderRadius: "8px" }}
                  id="email2"
                  type="text"
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter weight of product"
                  required
                />
              </div>

            </div>



            <div className="flex flex-col gap-4 w-full lg:w-1/2">
              <div>
                <div className="mb-2 block">
                  <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Colour" />
                </div>
                <input
                  style={{ color: "#202224", borderRadius: "8px" }}
                  id="email3"
                  type="text"
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter colour of product"
                  required
                />
              </div>

            </div>
          </div>



        </Card>
      </div>
    </div>
  )
}

export default Specifications
