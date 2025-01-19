import React, { useState } from 'react'
import Card from '../../components/shared/card'
import Button from '../../components/shared/button'
import { Checkbox, Label, TabItem, TextInput } from "flowbite-react";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import { BiUpload } from "react-icons/bi";
import { Link } from 'react-router-dom';

import { FaSearch } from 'react-icons/fa';
import { useFetchProduct } from '../../hooks/queries/product';


function Product() {
    const { data: productData, isPending, isError } = useFetchProduct()
    console.log(productData)

    return (

        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">

                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">
                        Products
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
                    <Link to={"/addproduct"}> <Button
                        label="Add New Product"
                        variant="solid"
                        size="md"
                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                    /></Link>
                </div>


                <div className="overflow-x-auto hidden md:block">
                    <table className="min-w-full leading-normal rounded-md rounded-t-md border-gray-200">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Image
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Product Name
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Category
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Price
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Updated At
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Status
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {Array.isArray(productData) && productData.map((item, index) => {
                                const { id, display_attachment_url, name, price, updated_at, category } = item;
                                return (
                                    <tr className="bg-white">
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                            <img className="w-11 h-11" src={display_attachment_url.url} alt="Product" />
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                            <p className="font-[500] whitespace-no-wrap text-xs">{name}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                            <p className="font-[500] whitespace-no-wrap text-xs">{category}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                            <p className="font-[500] whitespace-no-wrap text-xs">{price}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                            <p className="font-[500] whitespace-no-wrap text-xs">{new Date(updated_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                                            <span className="relative inline-block px-8 py-2 font-semibold bg-[#ccf0eb] leading-tight rounded-md">
                                                <span aria-hidden className="absolute inset-0 text-[#00B69B] opacity-50 rounded-lg" />
                                                <span className="relative text-[#00B69B]">Active</span>
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white flex">
                                            <button
                                                className="flex items-center justify-center w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none"
                                                aria-label="Edit"
                                            >
                                                <FaEdit className="text-gray-500 text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}


                        </tbody>
                    </table>
                </div>


                <div className="md:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div className="bg-white px-4 rounded-lg shadow-md">

                            <div className='flex justify-between mt-5'>
                                <div>
                                    <img className="rounded-full w-6 h-6 mt-1 " src="/image.png" alt="" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold ">Apple Watch Series 4</h2>
                                    <p className="text-xs text-gray-600">Digital Product</p>
                                    <h2 className="text-sm font-semibold ">Apple Watch Series 4</h2>

                                </div>

                                <button className='bg-[#ccf0eb] px-4 h-5 rounded-md  text-xs text-[#00B69B] mt-1 '>Active</button>
                            </div>
                            <div className=" flex justify-end">
                                <button
                                    className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                                    aria-label="Edit"

                                >
                                    <FaEdit className="text-gray-500 text-lg" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Product
