import React, { useState } from 'react'
import { AiFillDelete } from "react-icons/ai";
import { useEffect } from 'react'
import { Label } from 'flowbite-react'
import Button from '../../components/shared/button'
import Card from '../../components/shared/card'
import { FaMinus } from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom'
import { BiUpload } from 'react-icons/bi'
import { handleCreateProduct, handleDeleteProduct, handleDisplayProductImage, handleUpdateProduct } from '../../services/product';
import { useFetchSingleProduct } from '../../hooks/queries/product'

function EditProduct() {
  const [loading, setIsLoading] = useState()
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoad, setIsLoad] = useState(false);
  const { id } = useParams()
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const { data: singleProduct, isPending, isError } = useFetchSingleProduct(id)
  const Navigate = useNavigate()
  const [imageId, setImageId] = useState("")
  const [product, setProduct] = useState({
    id: id,
    name: '',
    description: '',
    shipping_days_min: null,
    shipping_days_max: null,
    category_id: '',
    price: '',
    specifications: [],
    interest_rule: {},
    repayment_policies: {}
  });

  console.log(singleProduct)



  const [specifications, setSpecifications] = useState(singleProduct?.specifications || {});
  const [newSpecificationKey, setNewSpecificationKey] = useState("");
  const [newSpecificationValue, setNewSpecificationValue] = useState("");

  const MAX_ATTACHMENTS = 5;
  useEffect(() => {
    if (singleProduct) {
      setProduct({
        id: singleProduct.id,
        name: singleProduct.name || '',
        description: singleProduct.description || '',
        shipping_days_min: singleProduct.shipping_days_min ?? null,
        shipping_days_max: singleProduct.shipping_days_max ?? null,
        category_id: singleProduct.category_id || '',
        price: singleProduct.price || '',
        specifications: singleProduct.specifications || [],
        interest_rule: singleProduct.interest_rule || {},
        repayment_policies: singleProduct.repayment_policies || {}
      });
    }
  }, [singleProduct]);
  const onDelete = async (attachmentId, attachmentUrl) => {
    const payload = {
      attachment_type: "products",
      image: attachmentUrl,
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await handleDeleteProduct(attachmentId, id, payload);
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };



  const handleChange = (specIndex, subIndex, field, newValue) => {
    setProduct((prevProduct) => {
      const updatedSpecifications = prevProduct.specifications.map((spec, index) => {
        if (index === specIndex) {
          const entries = Object.entries(spec);
          const [oldKey, oldValue] = entries[subIndex];

          const updatedSpec = { ...spec };

          if (field === 'attribute') {

            delete updatedSpec[oldKey];
            updatedSpec[newValue] = oldValue;
          } else {

            updatedSpec[oldKey] = newValue;
          }

          return updatedSpec;
        }
        return spec;
      });

      return {
        ...prevProduct,
        specifications: updatedSpecifications,
      };
    });
  };











  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error("Please select an image to upload.");
      return;
    }

    const base64Image = preview.split(",")[1];

    try {
      setIsLoad(true);
      console.log(base64Image);
      const response = await handle
      ProductImage({
        attachment_type: "products",
        image: base64Image,
      });

      if (response && response.status === 200) {
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload the image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setIsLoad(false);
      setSelectedImage(null);
      setPreview(null);
    }
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
    const keys = name.split('.');

    setProduct((prevProduct) => {
      let updatedProduct = { ...prevProduct };
      let nested = updatedProduct;


      for (let i = 0; i < keys.length - 1; i++) {
        nested[keys[i]] = { ...nested[keys[i]] };
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = value;

      return updatedProduct;
    });
  };
  const handleInterestChange = (interval, index, field, value) => {
    setProduct((prevProduct) => {

      const updatedRules = prevProduct.interest_rule[interval].map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      );

      return {
        ...prevProduct,
        interest_rule: {
          ...prevProduct.interest_rule,
          [interval]: updatedRules,
        },
      };
    });
  };





  const handleSubmit = async (e) => {
    console.log(product)
    e.preventDefault();
    const payload = {
      name: product.name || singleProduct?.name,
      description: product.description || singleProduct?.description,
      shipping_days_min: Number(product.shipping_days_min) || singleProduct?.shipping_days_min,
      shipping_days_max: Number(product.shipping_days_max) || singleProduct?.shipping_days_max,
      category_id: 208,
      price: product.price || singleProduct?.price,
      // specifications: product.specifications.map(spec => ({
      //   [spec.attribute]: spec.value
      // })),
      interest_rule: {
        weekly: product.interest_rule.filter(rule => rule.interval === 'weekly').map(rule => ({
          min: rule.min ? Number(rule.min) : 0,
          max: rule.max ? Number(rule.max) : 0,
          rate: rule.rate ? Number(rule.rate) : 0,
        })),
        monthly: product.interest_rule.filter(rule => rule.interval === 'monthly').map(rule => ({
          min: rule.min ? Number(rule.min) : 0,
          max: rule.max ? Number(rule.max) : 0,
          rate: rule.max ? Number(rule.rate) : 0,
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
    console.log(payload)
    try {
      const response = await handleUpdateProduct(payload);
      console.log(response)
      if (response.data) {
        setImageId(response.data.id)
        console.log(response.data.id)
        toast.success("Product created successfully");

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
          Products <span className="text-black-400">{'>'}</span> Update Products
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
          <h3 className='p-3 px-10'>Update Product Information</h3>
          <div className='w-full border-t-2 border-gray-200'></div>

          <form onSubmit={(e) => handleSubmit(e)} >
            <div>
              <div className='flex flex-col lg:flex-row gap-12 px-10 pb-14 mt-5'>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                  <div>
                    <div className="mb-2 block">
                      <Label className="text-[#212C25] text-xs font-[500]" htmlFor="name" value="Product name" />
                    </div>
                    <input
                      style={{ color: "#202224", borderRadius: "8px" }}
                      id="name"
                      type="text"
                      className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                      placeholder="Enter Business name"
                      defaultValue={singleProduct?.name || product.name}
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
                      defaultValue={singleProduct?.shipping_days_max
                        || product.shipping_days_min}
                      name='shipping_days_min'
                      onChange={handleInput}
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
                      defaultValue={singleProduct?.shipping_days_max || product.shipping_days_max}
                      name='shipping_days_max'
                      onChange={handleInput}
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
                      type="number"
                      defaultValue={singleProduct?.price || product.price}
                      name='price'
                      onChange={handleInput}
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
                      defaultValue={singleProduct?.category_id || product.category_id}
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
                      defaultValue={singleProduct?.description || product.description}
                      onChange={handleInput}
                    ></textarea>
                  </div>
                </div>
              </div>



              <div className="p-4">
                <Card className="w-full h-full bg-white">
                  <h3 className="p-3 px-7 flex items-center justify-between">
                    <span>Update Specifications</span>
                    {/* <button
                      type="button"
                      className="bg-[#0f5d30] text-white px-4 py-2 rounded"
                      onClick={addSpecification}
                    >
                      + Add Specification
                    </button> */}
                  </h3>
                  <div className="w-full border-t-2 border-gray-200"></div>
                  <div className="flex flex-col lg:flex-row gap-12 px-7 pb-14 mt-5">
                    {singleProduct?.specifications && singleProduct.specifications.length === 0 ? (
                      <div className="p-10 flex justify-center items-center text-center text-gray-500">
                        No specifications added yet
                      </div>
                    ) : (
                      singleProduct?.specifications.map((spec, index) => (
                        <div key={index} className="flex-col lg:flex-row gap-4 w-full">
                          {Object.entries(spec).map(([attribute, value], subIndex) => (
                            <div key={subIndex} className="flex flex-col lg:flex-row gap-4 w-full">

                              <div className="flex-1">
                                <label className="text-[#212C25] text-xs font-[500]">Attribute</label>
                                <input
                                  type="text"
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  placeholder="Enter attribute (e.g., Weight, Colour)"
                                  defaultValue={attribute}
                                  onChange={(e) => handleChange(index, subIndex, 'attribute', e.target.value)}
                                />
                              </div>


                              <div className="flex-1">
                                <label className="text-[#212C25] text-xs font-[500]">Value</label>
                                <input
                                  type="text"
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  placeholder="Enter value (e.g., 0.15 kg, white)"
                                  defaultValue={value}
                                  onChange={(e) => handleChange(index, subIndex, 'value', e.target.value)}
                                />
                              </div>
                            </div>
                          ))}

                        </div>
                      ))
                    )}
                  </div>

                </Card>
              </div>


              <div className='p-4'>
                <Card className='w-full h-full bg-white'>
                  <h3 className='p-3 px-7 flex justify-between items-center'>
                    <span>Update Product Interest Rate Rule</span>
                  </h3>
                  <div className='w-full border-t-2 border-gray-200'></div>

                  {Object.keys(singleProduct?.interest_rule || {}).length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                      No product interval added yet
                    </div>
                  ) : (
                    Object.entries(singleProduct?.interest_rule || {}).map(([interval, rules]) => (
                      <div key={interval} className="mt-4">
                        <h4 className="px-7 text-lg font-semibold text-[#212C25] capitalize">{interval}</h4>

                        {rules.map((rule, index) => (
                          <div key={index} className='flex flex-col lg:flex-row gap-12 px-7 pb-7 mt-4'>
                            <div className="flex flex-col gap-4 w-full lg:w-1/3">
                              <div>
                                <div className="mb-2 block">
                                  <Label className="text-[#212C25] text-xs font-[500]" value="Min" />
                                </div>
                                <input
                                  style={{ color: "#202224", borderRadius: "8px" }}
                                  type="number"
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  defaultValue={rule.min}
                                  onChange={(e) => handleInterestChange(interval, index, 'min', e.target.value)} // Pass correct arguments
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full lg:w-1/3">
                              <div>
                                <div className="mb-2 block">
                                  <Label className="text-[#212C25] text-xs font-[500]" value="Max" />
                                </div>
                                <input
                                  style={{ color: "#202224", borderRadius: "8px" }}
                                  type="number"
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  defaultValue={rule.max}
                                  onChange={(e) => handleInterestChange(interval, index, 'max', e.target.value)} // Pass correct arguments
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full lg:w-1/3">
                              <div>
                                <div className="mb-2 block">
                                  <Label className="text-[#212C25] text-xs font-[500]" value="Rate" />
                                </div>
                                <input
                                  style={{ color: "#202224", borderRadius: "8px" }}
                                  type="number"
                                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                                  defaultValue={rule.rate}
                                  onChange={(e) => handleInterestChange(interval, index, 'rate', e.target.value)} // Pass correct arguments
                                />
                              </div>
                            </div>
                          </div>
                        ))}

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
                          defaultValue={product?.repayment_policies?.tenure_unit || singleProduct?.repayment_policies?.tenure_unit || "week"} // Use product state, fallback to singleProduct
                          name='repayment_policies.tenure_unit'
                          onChange={handleInputs} // Update state on change
                          className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          placeholder="Enter tenure unit"
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="weekly_tenure" defaultValue="Weekly Tenure" />
                        </div>
                        <div className='flex gap-2'>
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                            type="number"
                            defaultValue={product?.repayment_policies?.weekly_tenure?.min || singleProduct?.repayment_policies?.weekly_tenure?.min || 0} // Fallback to singleProduct
                            name='repayment_policies.weekly_tenure.min'
                            onChange={handleInputs} // Update state on change
                            placeholder='Enter weekly tenure min'
                          />
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                            type="number"
                            defaultValue={product?.repayment_policies?.weekly_tenure?.max || singleProduct?.repayment_policies?.weekly_tenure?.max || 0} // Fallback to singleProduct
                            name='repayment_policies.weekly_tenure.max'
                            onChange={handleInputs} // Update state on change
                            placeholder='Enter weekly tenure max'
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="Monthly_tenure" defaultValue="Monthly Tenure" />
                        </div>
                        <div className='flex gap-2'>
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                            type="number"
                            defaultValue={product?.repayment_policies?.monthly_tenure?.min || singleProduct?.repayment_policies?.monthly_tenure?.min || 0} // Fallback to singleProduct
                            name='repayment_policies.monthly_tenure.min'
                            onChange={handleInputs} // Update state on change
                            placeholder='Enter monthly tenure min'
                          />
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                            type="number"
                            defaultValue={product?.repayment_policies?.monthly_tenure?.max || singleProduct?.repayment_policies?.monthly_tenure?.max || 0} // Fallback to singleProduct
                            name='repayment_policies.monthly_tenure.max'
                            onChange={handleInputs} // Update state on change
                            placeholder='Enter monthly tenure max'
                          />
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="description" defaultValue="Description" />
                        </div>
                        <textarea
                          style={{ color: "#202224", borderRadius: "8px" }}
                          defaultValue={product?.repayment_policies?.description || singleProduct?.repayment_policies?.description || ''} // Fallback to singleProduct
                          name='repayment_policies.description'
                          onChange={handleInputs} // Update state on change
                          className="bg-white text-sm p-3 py-14 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          placeholder='Enter description'
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                      <div>
                        <div className="mb-2 block">
                          <Label className="text-[#212C25] text-xs font-[500]" htmlFor="down_percentage" defaultValue="Down Percentage" />
                        </div>
                        <div className='flex gap-2'>
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            type="number"
                            defaultValue={product?.repayment_policies?.down_percentage?.min || singleProduct?.down_percentage?.min || 0} // Fallback to singleProduct
                            name='repayment_policies.down_percentage.min'
                            onChange={handleInputs} // Update state on change
                            placeholder="Enter down percentage min"
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          />
                          <input
                            style={{ color: "#202224", borderRadius: "8px" }}
                            type="number"
                            defaultValue={product?.repayment_policies?.down_percentage?.max || singleProduct?.down_percentage?.max || 0} // Fallback to singleProduct
                            name='repayment_policies.down_percentage.max'
                            onChange={handleInputs} // Update state on change
                            placeholder="Enter down percentage max"
                            className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>




              <div className='mb-7 px-10'>
                <Button type="submit" size='lg' className="text-sm w-[150px]" label="Update Product" loading={loading} />


              </div>
            </div>
          </form>



        </Card>
      </div>


      <div className="p-4">
        <Card className="w-full h-full bg-white">
          <h3 className="p-3 px-10">Update Display Attachment Image</h3>
          <div className="w-full border-t-2 border-gray-200"></div>

          {/* Attachments List */}
          <div className="flex flex-wrap gap-4 p-6">
            {singleProduct?.attachments?.map((attachment) => (
              <div
                key={attachment.id}
                className="relative w-40 h-40 border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={attachment.url}
                  alt="Attachment"
                  className="w-full h-full object-cover"
                />
                {/* Delete Button */}
                <button
                  onClick={() => onDelete(attachment.id, attachment.url)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                >
                  <AiFillDelete size={18} />
                </button>
              </div>
            ))}

            {/* Upload Button (Show only if under MAX_ATTACHMENTS) */}
            {singleProduct?.attachments.length < MAX_ATTACHMENTS && (
              <div className="relative w-40 h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg hover:bg-gray-100 transition">
                <label className="flex flex-col items-center cursor-pointer">
                  <BiUpload size={24} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Preview and Upload Selected Image */}
          {preview && (
            <div className="flex flex-col items-center mt-4">
              <img
                src={preview}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-md"
              />
              <Button
                onClick={handleUpload}
                size="sm"
                label='Upload'
                className="mt-2"
                disabled={isLoad}
              >
                {isLoad ? "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
        </Card>
      </div>
      {/* <div className='p-4'>
        <Card className='w-full h-full bg-white'>
          <h3 className='p-3 px-10'>Other Attachments</h3>
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
                <p className='text-xs mt-3 text-[#0A0F0C] font-[500]'>Update Image 1 </p>
                <img className='w-6 h-6 mt-2 rounded-md' src={singleProduct?.attachment} alt="" />

              </div>
            </div>

          </div>



        </Card>
      </div> */}


    </div>
  )
}

export default EditProduct
