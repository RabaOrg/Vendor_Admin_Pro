import React from 'react'

import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import Button from '../../../components/shared/button'
import { Link } from 'react-router-dom'
import Card from '../../../components/shared/card'
import { Checkbox, Label, TextInput } from "flowbite-react";
import { FaUpload } from 'react-icons/fa';
import { BiUpload } from "react-icons/bi";
import { FaSearch } from 'react-icons/fa';




function Customer() {
    return (


        <div className='px-6'>


            <div className="inline-block min-w-full  rounded-lg overflow-hidden">
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">
                        Customer
                    </h1>


                    <div className="relative w-full md:w-[700px]">
                        <input
                            type="text"
                            placeholder="Search product name"
                            className="w-full px-3 py-2 pl-8 mt-1 text-xs font-[400] text-[#202224] rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none"
                        />
                        <span className="absolute left-3 top-[22px] transform -translate-y-1/2 text-gray-400">
                            <FaSearch />
                        </span>
                    </div>
                    <Link to={"/addcustomer"}> <Button
                        label="Create Customer"
                        variant="solid"
                        size="md"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                    /></Link>

                </div>
                <table className="min-w-full leading-normal ">
                    <thead>
                        <tr>

                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                                ID
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Business name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Date created
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                state
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                                Status
                            </th>


                        </tr>
                    </thead>

                    <tr className="bg-white" >

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                1
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white  text-sm">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Apple Watch Series 4
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Digital Product
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                #690, 000
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                14 Feb 2025
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <span className="relative inline-block px-8 py-2 font-semibold bg-[#ccf0eb] leading-tight rounded-md">
                                <span aria-hidden className="absolute inset-0  text-[#00B69B] opacity-50 rounded-lg" />
                                <span className="relative text-[#00B69B]">Active</span>
                            </span>
                        </td>


                    </tr>
                    <tr className="bg-white" >

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                2
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white  text-sm">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Apple Watch Series 4
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Digital Product
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                #690, 000
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                14 Feb 2025
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <span className="relative inline-block px-7 py-2 font-semibold bg-[#e0d4fc] leading-tight rounded-md">
                                <span aria-hidden className="absolute inset-0  bg-[#e0d4fc] opacity-50 rounded-lg" />
                                <span className="relative text-[#6226EF]">Inactive</span>
                            </span>
                        </td>

                    </tr>
                    <tr className="bg-white" >

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                3
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white  text-sm">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Apple Watch Series 4
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Digital Product
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                #690, 000
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                14 Feb 2025
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <span className="relative inline-block px-8 py-2 font-semibold bg-[#ccf0eb] leading-tight rounded-md">
                                <span aria-hidden className="absolute inset-0  text-[#00B69B] opacity-50 rounded-lg" />
                                <span className="relative text-[#00B69B]">Active</span>
                            </span>
                        </td>

                    </tr>
                    <tr className="bg-white" >

                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                4
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white  text-sm">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Apple Watch Series 4
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                Digital Product
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                #690, 000
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <p className="font-[500] whitespace-no-wrap text-xs">
                                14 Feb 2025
                            </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                            <span className="relative inline-block px-7 py-2 font-semibold bg-[#e0d4fc] leading-tight rounded-md">
                                <span aria-hidden className="absolute inset-0  bg-[#e0d4fc] opacity-50 rounded-lg" />
                                <span className="relative text-[#6226EF]">Inactive</span>
                            </span>
                        </td>

                    </tr>

                    <tbody>




                    </tbody>
                </table>





            </div>
        </div>
    )
}

export default Customer
