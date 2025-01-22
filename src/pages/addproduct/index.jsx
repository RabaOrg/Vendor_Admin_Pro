import React, { useState } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import { BiUpload } from 'react-icons/bi'
import { handleCreateProduct } from '../../services/product';
import { Formik } from 'formik'

function Addproduct() {
    const [loading, setIsLoading] = useState()
    const Navigate = useNavigate()
    const [product, setProduct] = useState({
        name: "",
        description: "",
        shipping_days_min: null,
        shipping_days_max: null,
        category_id: 25,
        price: "",
        specifications: [],
        interest_rule: [],
        repayment_policies: {
            description: "",
            tenure_unit: "",
            weekly_tenure: { min: null, max: null },
            monthly_tenure: { min: null, max: null },
            down_percentage: { min: null, max: null }
        },

    })
    const addInterestRule = () => {
        setProduct(prevProduct => ({
            ...prevProduct,
            interest_rule: [...prevProduct.interest_rule, { min: null, max: null, rate: null, interval: null }]
        }));
    };
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const newSpecifications = [...product.specifications];
        newSpecifications[index][name] = value;
        setProduct({ ...product, specifications: newSpecifications });
    };

    const addSpecification = () => {
        setProduct({
            ...product,
            specifications: [...product.specifications, { attribute: "", value: "" }]
        });
    };
    const handleChangeInterest = (index, e) => {
        const newInterestRules = [...product.interest_rule];
        newInterestRules[index][e.target.name] = e.target.value;
        setProduct({ ...product, interest_rule: newInterestRules });
    };


    const handleInput = (e) => {
        const { name, value } = e.target
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value
        }))
    }
    const handleInputs = (e) => {
        const { name, value } = e.target;
        const keys = name.split(".");
        setProduct((prevProduct) => {
            let updatedProduct = { ...prevProduct };
            let current = updatedProduct;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updatedProduct;
        });
    };



    // const handleSubmit = async (e) => {
    //     console.log(product)
    //     e.preventDefault();
    //     const payload = {
    //         name: product.name,
    //         description: product.description,
    //         shipping_days_min: Number(product.shipping_days_min),
    //         shipping_days_max: Number(product.shipping_days_max),
    //         category_id: 208,
    //         price: product.price,
    //         specifications: {
    //             weight: product.specifications.weight,
    //             colour: product.specifications.colour
    //         },
    //         interest_rule: {
    //             weekly: product.interest_rule.weekly.map(rule => ({
    //                 min: Number(rule.min),
    //                 max: Number(rule.max),
    //                 rate: Number(rule.rate)
    //             })),
    //             monthly: product.interest_rule.monthly.map(rule => ({
    //                 min: Number(rule.min),
    //                 max: Number(rule.max),
    //                 rate: Number(rule.rate)
    //             }))
    //         },
    //         repayment_policies: {
    //             description: product.repayment_policies.description,
    //             tenure_unit: product.repayment_policies.tenure_unit,
    //             weekly_tenure: {
    //                 min: Number(product.repayment_policies.weekly_tenure.min),
    //                 max: Number(product.repayment_policies.weekly_tenure.max)
    //             },
    //             monthly_tenure: {
    //                 min: Number(product.repayment_policies.monthly_tenure.min),
    //                 max: Number(product.repayment_policies.monthly_tenure.max)
    //             },
    //             down_percentage: {
    //                 min: Number(product.repayment_policies.down_percentage.min),
    //                 max: Number(product.repayment_policies.down_percentage.max)
    //             }
    //         }
    //     }

    //     console.log(payload)
    //     setIsLoading(true)
    //     try {
    //         const response = await handleCreateProduct(payload);
    //         if (response) {
    //             toast.success("Product created successfully")
    //             Navigate('/product')
    //         }

    //         if (!response.ok) {
    //             throw new Error('Failed to submit the product');
    //         }

    //         const result = await response.json();
    //         console.log('Product submitted successfully:', result);


    //         setProduct({
    //             name: "",
    //             description: "",
    //             shipping_days_min: null,
    //             shipping_days_max: null,
    //             category_id: 25,
    //             price: "",
    //             specifications: {
    //                 weight: "",
    //                 colour: ""
    //             },
    //             interest_rule: {
    //                 weekly: [
    //                     { min: null, max: null, rate: null }
    //                 ],
    //                 monthly: [
    //                     { min: null, max: null, rate: null }
    //                 ]
    //             },
    //             repayment_policies: {
    //                 description: "",
    //                 tenure_unit: "",
    //                 weekly_tenure: { min: null, max: null },
    //                 monthly_tenure: { min: null, max: null },
    //                 down_percentage: { min: null, max: null }
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error:', error);
    //     } finally {
    //         setIsLoading(false)
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: product.name,
            description: product.description,
            shipping_days_min: Number(product.shipping_days_min),
            shipping_days_max: Number(product.shipping_days_max),
            category_id: 208,
            price: product.price,
            specifications: product.specifications.map(spec => ({
                [spec.attribute]: spec.value
            })),
            interest_rule: {
                weekly: product.interest_rule.filter(rule => rule.interval === 'weekly').map(rule => ({
                    min: Number(rule.min),
                    max: Number(rule.max),
                    rate: Number(rule.rate)
                })),
                monthly: product.interest_rule.filter(rule => rule.interval === 'monthly').map(rule => ({
                    min: Number(rule.min),
                    max: Number(rule.max),
                    rate: Number(rule.rate)
                }))
            },
            repayment_policies: {
                description: product.repayment_policies.description,
                tenure_unit: product.repayment_policies.tenure_unit,
                weekly_tenure: {
                    min: Number(product.repayment_policies.weekly_tenure.min),
                    max: Number(product.repayment_policies.weekly_tenure.max)
                },
                monthly_tenure: {
                    min: Number(product.repayment_policies.monthly_tenure.min),
                    max: Number(product.repayment_policies.monthly_tenure.max)
                },
                down_percentage: {
                    min: Number(product.repayment_policies.down_percentage.min),
                    max: Number(product.repayment_policies.down_percentage.max)
                }
            }
        };

        console.log(payload);
        setIsLoading(true);
        try {
            const response = await handleCreateProduct(payload);
            if (response) {
                toast.success("Product created successfully");
                Navigate('/product');
            }



        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <div className="flex items-center justify-between p-4">
                <h1 className="text-3xl font-semibold">
                    Products <span className="text-black-400">{'>'}</span> Add Products
                </h1>
                <div className='flex gap-3'>
                    <Button
                        label="Cancel"
                        variant="transparent"
                        size="lg"
                        className="text-sm w-[150px]"
                    />
                    <Button
                        label="Add Products"
                        variant="solid"
                        size="md"
                        className="text-sm px-6 py-5"
                    />
                </div>
            </div>
            <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Product Information</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>

                    <form onSubmit={(e) => handleSubmit(e)} >
                        <div>
                            <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="name" value="Business name" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="name"
                                            type="text"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="Enter Business name"
                                            value={product.name}
                                            name='name'
                                            onChange={handleInput}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_min" value="Shipping Days Min" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="shipping_days_min"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="number"
                                            value={product.shipping_days_min}
                                            name='shipping_days_min'
                                            onChange={handleInput}
                                            placeholder='Enter shipping_days_min'
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="shipping_days_max" value="Shipping Days Max" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="shipping_days_max"
                                            type="number"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            value={product.shipping_days_max}
                                            name='shipping_days_max'
                                            onChange={handleInput}
                                            placeholder='Enter shipping_days_max'

                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="price" value="Price" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="price"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            type="text"
                                            value={product.price}
                                            name='price'
                                            onChange={handleInput}
                                            placeholder='Enter product price'
                                        />

                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                    <div>
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="category" value="Category" />
                                        </div>
                                        <input
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="category"
                                            type="number"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                            placeholder="e.g., Electronics"
                                            name='category_id'
                                            value={product.category_id}
                                            onChange={handleInput}


                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='p-10'>
                                <div className=' flex mt-[-75px]'>
                                    <div className="w-full lg:w-[65%] sm:w-[90%]">
                                        <div className="mb-2 block">
                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                                        </div>
                                        <textarea
                                            style={{ color: "#202224", borderRadius: "8px" }}
                                            id="description"
                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full h-40 resize-none"
                                            placeholder="Describe your product, services, or business needs here..."
                                            name='description'
                                            value={product.description}
                                            onChange={handleInput}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>


                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-10 flex items-center justify-between'>
                                        <span>Specifications</span>
                                        <button
                                            type="button"
                                            className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                                            onClick={addSpecification}
                                        >
                                            + Add Specification
                                        </button>
                                    </h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>
                                    <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>
                                        {product.specifications.length === 0 ? (
                                            <div className="p-10 flex justify-center items-center text-center text-gray-500">No specifications added yet</div>
                                        ) : (
                                            product.specifications.map((spec, index) => (
                                                <div key={index} className="flex flex-col lg:flex-row gap-4 w-full">
                                                    <div className="flex-1">
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`attribute-${index}`} value="Attribute" />
                                                        </div>
                                                        <input
                                                            id={`attribute-${index}`}
                                                            type="text"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            placeholder="Enter attribute (e.g., Weight, Colour)"
                                                            name="attribute"
                                                            value={spec.attribute}
                                                            onChange={(e) => handleChange(index, e)}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`value-${index}`} value="Value" />
                                                        </div>
                                                        <input
                                                            id={`value-${index}`}
                                                            type="text"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            placeholder="Enter value (e.g., 0.15 kg, white)"
                                                            name="value"
                                                            value={spec.value}
                                                            onChange={(e) => handleChange(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </Card>
                            </div>




                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-10 flex justify-between items-center'>
                                        <span>Product Interest Rate Rule</span>
                                        <button
                                            type="button"
                                            className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                                            onClick={addInterestRule}
                                        >
                                            + Add Interest Rule
                                        </button>
                                    </h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>

                                    {product.interest_rule.length === 0 ? (
                                        <div className="p-10 text-center text-gray-500">
                                            No product interval added yet
                                        </div>
                                    ) : (
                                        product.interest_rule.map((rule, index) => (
                                            <div key={index} className='flex flex-col lg:flex-row gap-12 px-10 pb-7 mt-4'>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-min-${index}`} value="Min" />
                                                        </div>
                                                        <input
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-min-${index}`}
                                                            type="number"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="min"
                                                            value={rule.min || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-rate-${index}`} value="Rate" />
                                                        </div>
                                                        <input
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-rate-${index}`}
                                                            type="number"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="rate"
                                                            value={rule.rate || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-max-${index}`} value="Max" />
                                                        </div>
                                                        <input
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-max-${index}`}
                                                            type="number"
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="max"
                                                            value={rule.max || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                                                    <div>
                                                        <div className="mb-2 block">
                                                            <Label className="text-[#212C25] text-xs font-[500]" htmlFor={`interest-rule-interval-${index}`} value="Interval" />
                                                        </div>
                                                        <select
                                                            style={{ color: "#202224", borderRadius: "8px" }}
                                                            id={`interest-rule-interval-${index}`}
                                                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                            name="interval"
                                                            value={rule.interval || ''}
                                                            onChange={(e) => handleChangeInterest(index, e)}
                                                        >
                                                            <option value="" disabled>Select interval</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </Card>
                            </div>





                            <div className='p-4'>
                                <Card className='w-full h-full bg-white'>
                                    <h3 className='p-3 px-10'>Create Repayment Plan</h3>
                                    <div className='w-full border-t-2 border-gray-200'></div>

                                    <div className='flex flex-col lg:flex-row gap-7 pb-10 mt-5 px-10'>
                                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="tenure_unit" value="Tenure Unit" />
                                                </div>
                                                <input
                                                    style={{ color: "#202224", borderRadius: "8px" }}
                                                    type="text"
                                                    value={product.repayment_policies?.tenure_unit ?? ""}
                                                    name='repayment_policies.tenure_unit'
                                                    onChange={handleInputs}
                                                    className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    placeholder="Enter tenure unit"
                                                />
                                            </div>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="weekly_tenure" value="Weekly Tenure" />
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                        type="number"
                                                        value={product.repayment_policies.weekly_tenure.min ?? ""}
                                                        name='repayment_policies.weekly_tenure.min'
                                                        onChange={handleInputs}
                                                        placeholder='Enter weekly tenure min'
                                                    />
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                        type="number"
                                                        value={product.repayment_policies.weekly_tenure.max ?? ""}
                                                        name='repayment_policies.weekly_tenure.max'
                                                        onChange={handleInputs}
                                                        placeholder='Enter weekly tenure max'
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" value="Description" />
                                                </div>
                                                <textarea
                                                    style={{ color: "#202224", borderRadius: "8px" }}
                                                    value={product.repayment_policies.description ?? ""}
                                                    name='repayment_policies.description'
                                                    onChange={handleInputs}
                                                    className="bg-white text-sm p-3 py-14 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    placeholder='Enter description'
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 w-full lg:w-1/2">
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="down_percentage" value="Down Percentage" />
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.down_percentage.min ?? ""}
                                                        name='repayment_policies.down_percentage.min'
                                                        onChange={handleInputs}
                                                        placeholder="Enter down percentage min"
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.down_percentage.max ?? ""}
                                                        name='repayment_policies.down_percentage.max'
                                                        onChange={handleInputs}
                                                        placeholder="Enter down percentage max"
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <div className="mb-2 block">
                                                    <Label className="text-[#212C25] text-xs font-[500]" htmlFor="monthly_tenure" value="Monthly Tenure" />
                                                </div>
                                                <div className='flex gap-2'>
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.monthly_tenure.min ?? ""}
                                                        name='repayment_policies.monthly_tenure.min'
                                                        onChange={handleInputs}
                                                        placeholder='Enter monthly tenure min'
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                    <input
                                                        style={{ color: "#202224", borderRadius: "8px" }}
                                                        type="number"
                                                        value={product.repayment_policies.monthly_tenure.max ?? ""}
                                                        name='repayment_policies.monthly_tenure.max'
                                                        onChange={handleInputs}
                                                        placeholder='Enter monthly tenure max'
                                                        className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>



                            <div className='mb-7 px-10'>
                                <Button type="submit" size='lg' className="text-sm w-[150px]" label='Create Product' loading={loading} />


                            </div>
                        </div>
                    </form>



                </Card>
            </div>


            {/* <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                    <h3 className='p-3 px-10'>Upload Images</h3>
                    <div className='w-full border-t-2 border-gray-200'></div>
                    <div className='flex gap-10 pb-10 py-5 px-10'>
                        <div className='w-[17rem] flex gap-10 h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

                            <div className='flex gap-2'>
                                <button
                                    className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                    aria-label="Edit"
                                >
                                    <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                </button>
                                <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>Location Pictures</p>

                            </div>
                        </div>
                        <div className='w-[17rem] h-12 py-1 mt-4 px-4 rounded-md border-1 border-gray-200 shadow bg-white '>

                            <div className='flex gap-2'>
                                <button
                                    className="flex items-center justify-center mt-1 w-8 h-8 bg-gray-100 border-0 border-gray-300 rounded-full hover:bg-gray-200 focus:outline-none"
                                    aria-label="Edit"
                                >
                                    <BiUpload className="text-gray-500 w-5 h-5 text-lg" />
                                </button>
                                <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>ID Card</p>

                            </div>
                        </div>
                    </div>



                </Card>
            </div> */}


        </div>
    )
}

export default Addproduct
