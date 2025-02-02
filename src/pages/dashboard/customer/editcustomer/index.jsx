import React, { useState } from 'react'
import Button from '../../../../components/shared/button'
import { Card, Label } from 'flowbite-react'
import { useFetchOneCustomer } from '../../../../hooks/queries/customer'
import { useParams } from 'react-router-dom'
import { handleEditCustomer } from '../../../../services/customer'
import { toast } from 'react-toastify'

function EditCustomer() {
    const { id } = useParams()
    const { data: oneCustomer, isPending, isError } = useFetchOneCustomer(id)
    const [loading, setIsLoading] = useState(false)
    const [editCustomer, setEditCustomer] = useState({
        first_name: '',
        last_name: '',
        email: '',
        gender: '',
        bvn: '',
        dob: '',
        phone_number: '',
    })


    const handleInput = (e) => {
        const { name, value } = e.target
        setEditCustomer((prevEditCustomer) => ({
            ...prevEditCustomer,
            [name]: value
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const payload = {
                first_name: editCustomer.first_name || oneCustomer.first_name,
                last_name: editCustomer.last_name || oneCustomer.last_name,
                email: editCustomer.email || oneCustomer.email,
                gender: editCustomer.gender || oneCustomer.gender,
                bvn: editCustomer.bvn || oneCustomer.bvn,
                dob: editCustomer.dob || oneCustomer.dob,
                phone_number: editCustomer.phone_number || oneCustomer.phone_number,
            };


            const response = await handleEditCustomer(id, payload);
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
    const handlecancel = () => {
        Navigate('/customer')
    }

    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-3xl font-semibold">
                    Customers <span className="text-black-400">{'>'}</span> Edit Customer
                </h1>
                <div className='flex gap-3'>
                    <Button
                        label="Cancel"
                        variant="transparent"
                        onClick={handlecancel}
                        size="lg"
                        className="text-sm w-[150px]"
                    />
                    <Button
                        label="Save Changes"
                        variant="solid"
                        size="md"
                        className="text-sm px-6 py-5"
                    />
                </div>
            </div>
            <div >
                <div className='p-4'>
                    <Card className='w-full h-full bg-white'>
                        <h3 className='p-3 px-10'>KYC Details</h3>
                        <div className='w-full border-t-2 border-gray-200'></div>

                        <form className=' px-10' onSubmit={(e) => handleUpdate(e)}>
                            <div className='flex flex-col lg:flex-row gap-7 pb-10 mt-5'>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="first_name" value="First name" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            type="text"
                                            name='first_name'
                                            onChange={(e) => handleInput(e)}
                                            defaultValue={oneCustomer?.first_name || editCustomer.first_name}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="Enter First Name"
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="last_name" value="Last name" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            type="text"
                                            name='last_name'
                                            onChange={(e) => handleInput(e)}


                                            defaultValue={oneCustomer?.last_name || editCustomer.last_name}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder='Enter Last name'
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="email" value="Email Address" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="email"
                                            name="email"
                                            onChange={(e) => handleInput(e)}


                                            defaultValue={oneCustomer?.email || editCustomer.email}
                                            placeholder='Enter Email'
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block text-sm">
                                            <p>What is your customer's gender?</p>
                                        </div>
                                        <div className='flex gap-4'>
                                            <div className='flex gap-1'>
                                                <input
                                                    style={{ color: "#202224", borderRadius: "8px" }}
                                                    type="radio"
                                                    name='gender'
                                                    defaultValue="female"
                                                    onChange={(e) => handleInput(e)}


                                                    checked={oneCustomer?.gender === "female" || oneCustomer?.gender === "female"}
                                                    className="bg-white text-sm text-gray-700 border border-[#A0ACA4] focus:ring-2 focus:ring-[#0f5d30] focus:outline-none"
                                                />
                                                <Label className="text-[#212C25] text-xs font-[500]" value="Female" />
                                            </div>
                                            <div className='flex gap-1'>
                                                <input
                                                    style={{ color: "#202224", borderRadius: "8px" }}
                                                    type="radio"
                                                    name='gender'
                                                    onChange={(e) => handleInput(e)}


                                                    defaultValue="male"
                                                    checked={oneCustomer?.gender === "male" || oneCustomer?.gender === "male"}
                                                    className="bg-white text-sm text-gray-700 border border-[#A0ACA4] focus:ring-2 focus:ring-[#0f5d30] focus:outline-none"
                                                />
                                                <Label className="text-[#212C25] text-xs font-[500]" value="Male" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="bvn" value="Bank Verification Number" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            type="text"
                                            name='bvn'
                                            onChange={(e) => handleInput(e)}


                                            defaultValue={oneCustomer?.bvn || editCustomer.bvn}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="Enter Bvn"
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="dob" value="Date of Birth" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            type="date"
                                            name='dob'
                                            onChange={(e) => handleInput(e)}


                                            defaultValue={oneCustomer?.dob || editCustomer.dob}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder='Enter Date of Birth'
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="phone_number" value="Phone Number" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            type="text"
                                            name='phone_number'
                                            onChange={(e) => handleInput(e)}


                                            defaultValue={oneCustomer?.phone_number || editCustomer.phone_number}
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder='Enter Phone Number'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-7'>
                                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Update KYC Details' loading={loading} />
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default EditCustomer
