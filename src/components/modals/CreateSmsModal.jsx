import React from 'react'
import { useFormik } from 'formik'
import { Label } from 'flowbite-react'
import Button from '../shared/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { handleAddSmsNotification } from '../../services/notification'
import { useFetchVendorData } from '../../hooks/queries/loan'

function CreateSmsModal({ isOpen, onClose, onSuccess }) {
  const queryClient = useQueryClient()
  const [apiResponse, setApiResponse] = React.useState(null)

  // Fetch vendors for dropdown
  const { data: vendorData, isPending: isLoadingVendors, isError: vendorError } = useFetchVendorData({ page: 1, limit: 100 })

  const formik = useFormik({
    initialValues: {
      vendor_id: "",
      recipient_phone: "",
      product_name: "",
      product_price: "",
      custom_message: "",
      recipient_email: "",
    },
    validationSchema: Yup.object({
      vendor_id: Yup.string().required("Vendor is required"),
      recipient_phone: Yup.string().required("Recipient phone is required"),
      product_name: Yup.string().required("Product name is required"),
      product_price: Yup.string().required("Product price is required"),
      custom_message: Yup.string(),
      recipient_email: Yup.string().email("Invalid email format").required("Recipient email is required"),
    }),
    onSubmit: async (values) => {
      onMutate(values)
    },
  })

  const { mutate: onMutate, isPending } = useMutation({
    mutationFn: async (values) => handleAddSmsNotification(values),
    onSuccess: ({ data }) => {
      setApiResponse(data)
      toast.success(data.message)
      formik.resetForm()
      setApiResponse(null)
      onSuccess?.()
      onClose()
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || error.message
      setApiResponse({ status: "error", message: errMsg })
      toast.error(errMsg)
    },
  })

  const handleClose = () => {
    formik.resetForm()
    setApiResponse(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Create SMS Application</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {apiResponse && (
            <div
              className={`p-3 mb-4 text-sm rounded-md ${
                apiResponse.status === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {apiResponse.message}
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Vendor Selection */}
              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="vendor_id"
                  value="Select Vendor"
                />
                <select
                  name="vendor_id"
                  value={formik.values.vendor_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoadingVendors}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isLoadingVendors ? 'Loading vendors...' : 'Select a vendor'}
                  </option>
                  {Array.isArray(vendorData?.data?.data) && vendorData.data.data.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.business_name || vendor.first_name + ' ' + vendor.last_name}
                    </option>
                  ))}
                </select>
                {formik.touched.vendor_id && formik.errors.vendor_id && (
                  <small className="text-red-500">{formik.errors.vendor_id}</small>
                )}
              </div>

              {/* Recipient Phone */}
              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="recipient_phone"
                  value="Recipient Phone"
                />
                <input
                  type="text"
                  name="recipient_phone"
                  value={formik.values.recipient_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Recipient Phone"
                />
                {formik.touched.recipient_phone && formik.errors.recipient_phone && (
                  <small className="text-red-500">{formik.errors.recipient_phone}</small>
                )}
              </div>

              {/* Product Name */}
              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="product_name"
                  value="Product Name"
                />
                <input
                  type="text"
                  name="product_name"
                  value={formik.values.product_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Product Name"
                />
                {formik.touched.product_name && formik.errors.product_name && (
                  <small className="text-red-500">{formik.errors.product_name}</small>
                )}
              </div>

              {/* Recipient Email */}
              <div>
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="recipient_email"
                  value="Recipient Email"
                />
                <input
                  type="email"
                  name="recipient_email"
                  value={formik.values.recipient_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter recipient email"
                />
                {formik.touched.recipient_email && formik.errors.recipient_email && (
                  <small className="text-red-500">{formik.errors.recipient_email}</small>
                )}
              </div>

              {/* Product Price */}
              <div className="md:col-span-2">
                <Label
                  className="text-[#212C25] text-xs font-[500] mb-2 block"
                  htmlFor="product_price"
                  value="Product Price"
                />
                <input
                  type="text"
                  name="product_price"
                  value={formik.values.product_price ? Number(formik.values.product_price).toLocaleString() : ''}
                  onChange={(e) => {
                    // Remove commas and non-numeric characters except decimal point
                    const numericValue = e.target.value.replace(/[^\d.]/g, '');
                    formik.setFieldValue('product_price', numericValue);
                  }}
                  onBlur={formik.handleBlur}
                  className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                  placeholder="Enter Product Price"
                />
                {formik.touched.product_price && formik.errors.product_price && (
                  <small className="text-red-500">{formik.errors.product_price}</small>
                )}
              </div>
            </div>

            {/* Custom Message */}
            <div className="mb-6">
              <Label
                className="text-[#212C25] text-xs font-[500] mb-2 block"
                htmlFor="custom_message"
                value="Custom Message (Optional)"
              />
              <textarea
                name="custom_message"
                rows="4"
                value={formik.values.custom_message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-white text-sm p-3 text-gray-700 border border-[#A0ACA4] rounded-md focus:ring-2 focus:ring-[#0f5d30] focus:outline-none w-full"
                placeholder="Enter Custom Message"
              />
              {formik.touched.custom_message && formik.errors.custom_message && (
                <small className="text-red-500">{formik.errors.custom_message}</small>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                label="Cancel"
                onClick={handleClose}
                className="px-6"
              />
              <Button
                type="submit"
                size="md"
                className="px-6"
                label="Send SMS"
                loading={isPending}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateSmsModal
