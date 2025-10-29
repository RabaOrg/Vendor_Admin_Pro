import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaEdit, FaArrowLeft, FaImage, FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import Button from '../../../components/shared/button'
import { useFetchSingleProduct } from '../../../hooks/queries/product'
import { handleGetSingleProduct, handleGetCategories } from '../../../services/product'
import axiosInstance from '../../../../store/axiosInstance'

function ViewProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const { data: oneProduct, isPending, isError } = useFetchSingleProduct(id)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                
                // Fetch product details
                const productResponse = await axiosInstance.get(`/api/admin/products/${id}`)
                setProduct(productResponse.data.data)
                
                // Fetch categories
                const categoriesData = await handleGetCategories()
                // Handle nested structure: categoriesData.categories
                if (categoriesData && categoriesData.categories && Array.isArray(categoriesData.categories)) {
                    setCategories(categoriesData.categories)
                } else if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData)
                } else {
                    setCategories([])
                }
                
            } catch (error) {
                console.error('Error fetching product details:', error)
                setError('Failed to load product details')
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [id])

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category ? category.name : 'N/A'
    }

    const formatPrice = (price) => {
        if (!price) return 'N/A'
        return `₦${parseFloat(price).toLocaleString()}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product details...</p>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
                    <Button
                        label="Back to Products"
                        variant="solid"
                        size="md"
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => navigate('/products')}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/products')}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                                <p className="mt-1 text-sm text-gray-600">Product ID: {product.id}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-3">
                            <Button
                                label="Edit Product"
                                variant="solid"
                                size="md"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-sm"
                                onClick={() => navigate(`/editproduct/${id}`)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Product Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <p className="text-lg font-semibold text-green-600">{formatPrice(product.price)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <p className="text-gray-900">{getCategoryName(product.category_id)}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            product.is_archived 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {product.is_archived ? 'Archived' : 'Active'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace</label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            product.marketplace_enabled 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.marketplace_enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Days</label>
                                        <p className="text-gray-900">
                                            {product.shipping_days_min && product.shipping_days_max 
                                                ? `${product.shipping_days_min} - ${product.shipping_days_max} days`
                                                : 'N/A'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{product.description || 'No description provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Specifications */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 p-4 rounded-lg">
                                                <dt className="text-sm font-medium text-gray-700 capitalize">{key}</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {typeof value === 'object' ? JSON.stringify(value) : value}
                                                </dd>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interest Rules */}
                        {product.interest_rule && product.interest_rule.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Interest Rate Rules</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {product.interest_rule.map((rule, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-700">Interval</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 capitalize">{rule.interval || 'N/A'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-700">Min Duration</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{rule.min || 'N/A'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-700">Max Duration</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{rule.max || 'N/A'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-sm font-medium text-gray-700">Rate</dt>
                                                        <dd className="mt-1 text-sm text-gray-900">{rule.rate ? `${rule.rate}%` : 'N/A'}</dd>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Repayment Policies */}
                        {product.repayment_policies && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Repayment Policies</h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tenure Unit</label>
                                            <p className="text-gray-900 capitalize">{product.repayment_policies.tenure_unit || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <p className="text-gray-900">{product.repayment_policies.description || 'N/A'}</p>
                                        </div>
                                        {product.repayment_policies.weekly_tenure && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Tenure</label>
                                                <p className="text-gray-900">
                                                    {product.repayment_policies.weekly_tenure.min && product.repayment_policies.weekly_tenure.max
                                                        ? `${product.repayment_policies.weekly_tenure.min} - ${product.repayment_policies.weekly_tenure.max} weeks`
                                                        : 'N/A'
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {product.repayment_policies.monthly_tenure && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Tenure</label>
                                                <p className="text-gray-900">
                                                    {product.repayment_policies.monthly_tenure.min && product.repayment_policies.monthly_tenure.max
                                                        ? `${product.repayment_policies.monthly_tenure.min} - ${product.repayment_policies.monthly_tenure.max} months`
                                                        : 'N/A'
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {product.repayment_policies.down_percentage && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                                                <p className="text-gray-900">
                                                    {product.repayment_policies.down_percentage.min && product.repayment_policies.down_percentage.max
                                                        ? `${product.repayment_policies.down_percentage.min}% - ${product.repayment_policies.down_percentage.max}%`
                                                        : 'N/A'
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Product Images */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                            </div>
                            <div className="p-6">
                                {/* Display Image */}
                                {product.display_attachment && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Image</label>
                                        <div className="relative">
                                            <img
                                                src={product.display_attachment.url || product.display_attachment}
                                                alt="Product display"
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Additional Images */}
                                {product.attachments && product.attachments.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {product.attachments.map((attachment, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={attachment.url}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(!product.display_attachment && (!product.attachments || product.attachments.length === 0)) && (
                                    <div className="text-center py-8">
                                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-500">No images available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Product Metadata */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Product Metadata</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                                    <p className="text-gray-900">{formatDate(product.created_at)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                    <p className="text-gray-900">{formatDate(product.updated_at)}</p>
                                </div>
                                {product.created_by && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                                        <p className="text-gray-900">Admin #{product.created_by}</p>
                                    </div>
                                )}
                                {product.updated_by && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated By</label>
                                        <p className="text-gray-900">Admin #{product.updated_by}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewProductDetails