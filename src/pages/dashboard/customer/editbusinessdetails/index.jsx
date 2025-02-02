import React, { useState } from 'react'
import Button from '../../../../components/shared/button'
import { Card, Label } from 'flowbite-react'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { useFetchBusinessCustomerDetails, useFetchOneCustomer } from '../../../../hooks/queries/customer'
import { useParams } from 'react-router-dom'
import { handleEditCustomerBusiness, handleBusinessDetailsForm } from '../../../../services/customer'
import { toast } from 'react-toastify'

function EditBusinessDetails() {
    const { id } = useParams()
    const { data: businessCustomer, isPending, isError } = useFetchBusinessCustomerDetails(id)
    const [loading, setIsLoading] = useState(false)
    const [editCustomer, setEditCustomer] = useState({
        name: "",
        category: "",
        cac_number: "",
        time_in_business: "",
        equipment_of_interest: "",
        monthly_revenue: "",
        state: "",
        lga: "",
        street_address: ""
    })


    const handleInput = (e) => {
        const { name, value } = e.target
        setEditCustomer((prevEditCustomer) => ({
            ...prevEditCustomer,
            [name]: value
        }))
    }

    // const handleUpdate = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true)
    //     try {
    //         const payload = {
    //             name: editCustomer.name || businessCustomer.name,
    //             category: editCustomer.category || businessCustomer.category,
    //             cac_number: editCustomer.cac_number || businessCustomer.cac_number,
    //             time_in_business: editCustomer.time_in_business || businessCustomer.time_in_business,
    //             equipment_of_interest: editCustomer.equipment_of_interest || businessCustomer.equipment_of_interest,
    //             monthly_revenue: editCustomer.monthly_revenue || businessCustomer.monthly_revenue,

    //             state: editCustomer.state || businessCustomer.state,
    //             lga: editCustomer.lga || businessCustomer.lga,
    //             street_address: editCustomer.street_address || businessCustomer.street_address,
    //         };


    //         const response = await handleEditCustomerBusiness(id, payload);
    //         console.log(response);
    //         console.log('Customer updated successfully:', response.data);

    //         toast.success(response.data.message);

    //     } catch (error) {
    //         console.error('Error updating customer:', error);

    //         toast.error('Error updating customer. Please try again.');
    //     } finally {
    //         setIsLoading(false)
    //     }
    // };
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                name: editCustomer.name || businessCustomer?.name,
                category: editCustomer.category || businessCustomer?.category,
                cac_number: editCustomer.cac_number || businessCustomer?.cac_number,
                time_in_business: editCustomer.time_in_business || businessCustomer?.time_in_business,
                equipment_of_interest: editCustomer.equipment_of_interest || businessCustomer?.equipment_of_interest,
                monthly_revenue: editCustomer.monthly_revenue || businessCustomer?.monthly_revenue,
                state: editCustomer.state || businessCustomer?.state,
                lga: editCustomer.lga || businessCustomer?.lga,
                street_address: editCustomer.street_address || businessCustomer?.street_address,
            };

            let response;

            if (!businessCustomer) {

                response = await handleBusinessDetailsForm(id, payload);
                toast.success('Business details updated successfully!');
            } else {
                console.log(businessCustomer?.id)
                response = await handleEditCustomerBusiness(id, businessCustomer?.id, payload);
                toast.success('Business details updated successfully!');
            }

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error updating business details:', error);
            toast.error('Error saving business details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white '>

                    <h3 className='p-3 px-10'>Business Details :</h3>


                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form className='px-10' onSubmit={(e) => handleUpdate(e)}>

                        <div className='flex flex-col lg:flex-row gap-12 pb-14 mt-5'>
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email2" value="Business name" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}

                                        type="text"
                                        defaultValue={editCustomer.name || businessCustomer?.name}
                                        name='name'
                                        onChange={(e) => handleInput(e)}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="Enter Business Name"

                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Business type/category" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="type"
                                        defaultValue={editCustomer.category || businessCustomer?.category}
                                        name='category'
                                        onChange={(e) => handleInput(e)}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Business Type'

                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block ">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Registered? CAC Registration Number" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        defaultValue={editCustomer.cac_number || businessCustomer?.cac_number}
                                        name='cac_number'
                                        onChange={handleInput}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Reg No'

                                    />

                                </div>
                            </div>


                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="Month / years in business" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}


                                        defaultValue={editCustomer.time_in_business || businessCustomer?.time_in_business}
                                        name='time_in_business'
                                        onChange={(e) => handleInput(e)}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Months'

                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Monthly revenue" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        defaultValue={editCustomer.monthly_revenue || businessCustomer?.monthly_revenue}
                                        name='monthly_revenue'
                                        onChange={(e) => handleInput(e)}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter Monthly revenue'

                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Equipment of interest" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        defaultValue={editCustomer.equipment_of_interest || businessCustomer?.equipment_of_interest}
                                        name='equipment_of_interest'
                                        onChange={(e) => handleInput(e)}

                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        type="text"
                                        placeholder='Enter equipment of interval'

                                    />

                                </div>
                            </div>
                            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email3" value="State" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="email3"
                                        defaultValue={editCustomer.state || businessCustomer?.state}
                                        name='state'
                                        onChange={(e) => handleInput(e)}

                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                        placeholder="name@raba.com"

                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password3" value="Local government area" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password3"
                                        name='lga'
                                        defaultValue={editCustomer.lga || businessCustomer?.lga}
                                        onChange={(e) => handleInput(e)}

                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />

                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label className="text-[#212C25] text-xs font-[500]" htmlFor="password2" value="Street address" />
                                    </div>
                                    <input
                                        style={{ color: "#202224", borderRadius: "8px" }}
                                        id="password2"
                                        name='street_address'
                                        defaultValue={editCustomer.street_address || businessCustomer?.street_address}
                                        onChange={(e) => handleInput(e)}

                                        type="text"
                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"


                                    />

                                </div>
                            </div>
                        </div>



                        <div className='mb-7'>
                            <Button type="submit" size='lg' className="text-sm w-[150px]" label='Update Business Details' loading={loading} />


                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default EditBusinessDetails
