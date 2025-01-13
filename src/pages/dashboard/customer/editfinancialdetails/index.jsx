import React from 'react'
import { useFormik } from 'formik'
import { Label } from 'flowbite-react'
import Button from '../../../../components/shared/button'
import Card from '../../../../components/shared/card'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFetchBusinessFinancialDetails } from '../../../../hooks/queries/customer'
import { handleEditFinancialDetails } from '../../../../services/customer'


function EditFinancial() {
    const { id } = useParams()
    const { data: financialCustomer, isPending, isError } = useFetchBusinessFinancialDetails(id)
    const [loading, setIsLoading] = useState(false)
    const [editCustomerFinance, setEditCustomerFinance] = useState({
        account_number: "",
        account_name: "",
        bank_name: "",
        bank_code: "",
        bank_uuid: "",
        thrift_master_name: "",
        thrift_master_phone_number: ""
    })


    const handleInput = (e) => {
        const { name, value } = e.target
        setEditCustomerFinance((prevEditCustomerFinance) => ({
            ...prevEditCustomerFinance,
            [name]: value
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const payload = {
                name: editCustomerFinance.name || financialCustomer.name,
                category: editCustomerFinance.category || financialCustomer.category,
                cac_number: editCustomerFinance.cac_number || financialCustomer.cac_number,
                time_in_business: editCustomerFinance.time_in_business || financialCustomer.time_in_business,
                equipment_of_interest: editCustomerFinance.equipment_of_interest || financialCustomer.equipment_of_interest,
                monthly_revenue: editCustomerFinance.monthly_revenue || financialCustomer.monthly_revenue,

                state: editCustomerFinance.state || financialCustomer.state,
                lga: editCustomerFinance.lga || financialCustomer.lga,
                street_address: editCustomerFinance.street_address || financialCustomer.street_address,
            };


            const response = await handleEditFinancialDetails(id, payload);
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
                    <h3 className='p-3 px-10'>Financial Details</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form className='px-10' onSubmit={(e) => handleUpdate(e)}>
                        <div className='flex flex-col lg:flex-row gap-12 pb-14 mt-5'>

                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Bank name" />
                                    </div>
                                    <div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="email2"
                                            type="text"
                                            defaultValue={editCustomerFinance.bank_name || financialCustomer?.bank_name}
                                            name='bank_name'
                                            onChange={(e) => handleInput(e)}


                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="name@raba.com"

                                        />

                                    </div>
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Account number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        defaultValue={editCustomerFinance.account_number || financialCustomer?.account_number}
                                        name='account_number'
                                        onChange={(e) => handleInput(e)}



                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bank uuid" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        defaultValue={editCustomerFinance.bank_uuid || financialCustomer?.bank_uuid}
                                        name='bank_uuid'
                                        onChange={(e) => handleInput(e)}


                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"

                                    />

                                </div>

                            </div>


                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Bank Code" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        type="text"
                                        defaultValue={editCustomerFinance.bank_code || financialCustomer?.bank_code}
                                        name='bank_code'
                                        onChange={(e) => handleInput(e)}


                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"

                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Account Name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        type="text"
                                        defaultValue={editCustomerFinance.account_name || financialCustomer?.account_name}
                                        name='account_name'
                                        onChange={(e) => handleInput(e)}


                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />

                                </div>

                            </div>



                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Thrift master name (if any)" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        type="text"
                                        defaultValue={editCustomerFinance.thrift_master_name || financialCustomer?.thrift_master_name}
                                        name='thrift_master_name'
                                        onChange={(e) => handleInput(e)}


                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Thrift master phone number" />
                                    </div>
                                    <div className="relative flex">
                                        <div className="absolute inset-y-0 left-0 top-1 flex items-center pl-2">
                                            <img src="/Nigeria.png" alt="Nigeria Flag" className="w-5 h-5 object-cover" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px", paddingLeft: "2rem" }}
                                            id="country-code"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-20"
                                            value="+234"
                                            readOnly
                                        />
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="phone-number"
                                            type="text"
                                            defaultValue={editCustomerFinance.thrift_master_phone_number}
                                            onChange={(e) => handleInput(e)}


                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full ml-3"
                                            placeholder="Enter phone number"

                                        />

                                    </div>

                                </div>
                                {/* <div>
                                <div className="mb-2 block">
                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Guarantor's phone number" />
                                </div>
                                <div className="relative flex">
                                    <div className="absolute inset-y-0 left-0 top-1 flex items-center pl-2">
                                        <img src="/Nigeria.png" alt="Nigeria Flag" className="w-5 h-5 object-cover" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px", paddingLeft: "2rem" }}
                                        id="country-code"
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-20"
                                        value="+234"
                                        readOnly
                                    />
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="phone-number"
                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full ml-3"
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>

                            </div> */}

                            </div>
                        </div>
                        <div className='mb-7'>
                            <Button type="submit" size='lg' className="text-sm w-[150px]" label='Update Financial Details' loading={isPending} />


                        </div>
                    </form>
                </Card>
            </div>

        </div>
    )
}

export default EditFinancial
