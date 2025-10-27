import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlus, FaTrash, FaUpload, FaImage, FaTimes } from 'react-icons/fa'
import Button from '../../components/shared/button'
import { 
    handleUpdateProduct, 
    handleGetCategories, 
    handleDeleteImage,
    handleDeleteImageDisplay
} from '../../services/product'
import { useFetchRepaymentPlans } from '../../hooks/queries/loan'
import { useFetchSingleProduct } from '../../hooks/queries/product'

function EditProduct() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [selectedImages, setSelectedImages] = useState([])
    const [selectedDisplayImage, setSelectedDisplayImage] = useState(null)
    const [previewImages, setPreviewImages] = useState([])
    const [displayPreview, setDisplayPreview] = useState(null)
    const [existingImages, setExistingImages] = useState([])
    const [existingDisplayImage, setExistingDisplayImage] = useState(null)
    const [repaymentPlans, setRepaymentPlans] = useState([])
    
    const { data: repaymentPlan } = useFetchRepaymentPlans()
    const { data: singleProduct, isLoading: productLoading } = useFetchSingleProduct(id)

    const [product, setProduct] = useState({
        id: id,
        name: "",
        description: "",
        shipping_days_min: "",
        shipping_days_max: "",
        category_id: "",
        price: "",
        stock: 0,
        featured: false,
        repayment_plan_id: "",
        status: "active",
        lease_eligible: true,
        marketplace_enabled: true,
        is_archived: false,
        specifications: [],
        loan_terms: {
            down_payment_percentage: "",
            max_tenure_months: "",
            interest_rate: "",
            processing_fee: 0
        }
    })

    // Fetch real data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
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
                console.error('Error fetching data:', error)
                toast.error('Failed to load form data')
            }
        }
        fetchData()
    }, [])

    // Parse repayment plans when data is loaded
    useEffect(() => {
        console.log('Repayment Plan Data:', repaymentPlan)
        if (repaymentPlan && Array.isArray(repaymentPlan)) {
            setRepaymentPlans(repaymentPlan)
        } else if (repaymentPlan && repaymentPlan.repayment_plans && Array.isArray(repaymentPlan.repayment_plans)) {
            setRepaymentPlans(repaymentPlan.repayment_plans)
        } else if (repaymentPlan && repaymentPlan.data && repaymentPlan.data.repayment_plans) {
            setRepaymentPlans(repaymentPlan.data.repayment_plans)
        } else if (repaymentPlan && repaymentPlan.data && Array.isArray(repaymentPlan.data)) {
            setRepaymentPlans(repaymentPlan.data)
        } else {
            setRepaymentPlans([])
        }
    }, [repaymentPlan])

    // Update product data when singleProduct is loaded
    useEffect(() => {
        if (singleProduct && singleProduct.data) {
            const productData = singleProduct.data;
            console.log('Product Data:', productData);
            setProduct({
                id: productData.id,
                name: productData.name || "",
                description: productData.description || "",
                shipping_days_min: productData.shipping_days_min || "",
                shipping_days_max: productData.shipping_days_max || "",
                category_id: productData.category_id || "",
                price: productData.price || "",
                specifications: productData.specifications && typeof productData.specifications === 'object' && !Array.isArray(productData.specifications) 
                    ? Object.entries(productData.specifications).map(([key, value]) => ({ attribute: key, value }))
                    : (productData.specifications || []),
                stock: productData.stock || 0,
                featured: productData.featured || false,
                lease_eligible: productData.lease_eligible || false,
                repayment_plan_id: productData.repayment_policies?.id || productData.repayment_plan_id || "",
                loan_terms: productData.loan_terms || {},
                marketplace_enabled: productData.marketplace_enabled || false,
                is_archived: productData.is_archived || false,
                status: productData.status || 'active'
            })

            // Set existing images
            if (productData.attachments) {
                setExistingImages(productData.attachments)
            }
            if (productData.display_attachment) {
                setExistingDisplayImage({ url: productData.display_attachment })
            }
        }
    }, [singleProduct])

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleNestedInput = (e) => {
        const { name, value } = e.target
        const keys = name.split('.')
        
        setProduct(prev => {
            const newProduct = { ...prev }
            let current = newProduct
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]] = { ...current[keys[i]] }
            }
            
            current[keys[keys.length - 1]] = value
            return newProduct
        })
    }

    const addSpecification = () => {
        setProduct(prev => ({
            ...prev,
            specifications: [...prev.specifications, { attribute: "", value: "" }]
        }))
    }

    const removeSpecification = (index) => {
        setProduct(prev => ({
            ...prev,
            specifications: prev.specifications.filter((_, i) => i !== index)
        }))
    }

    const handleSpecificationChange = (index, e) => {
        const { name, value } = e.target
        setProduct(prev => ({
            ...prev,
            specifications: prev.specifications.map((spec, i) => 
                i === index ? { ...spec, [name]: value } : spec
            )
        }))
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))
        setSelectedImages(prev => [...prev, ...newImages])
        setPreviewImages(prev => [...prev, ...newImages.map(img => img.preview)])
    }

    const handleDisplayImageUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedDisplayImage(file)
            setDisplayPreview(URL.createObjectURL(file))
        }
    }

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index))
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = async (imageId) => {
        try {
            await handleDeleteImage(id, imageId)
            setExistingImages(prev => prev.filter(img => img.id !== imageId))
            toast.success('Image removed successfully')
        } catch (error) {
            console.error('Error removing image:', error)
            toast.error('Failed to remove image')
        }
    }

    const removeExistingDisplayImage = async () => {
        try {
            await handleDeleteImageDisplay(id)
            setExistingDisplayImage(null)
            toast.success('Display image removed successfully')
        } catch (error) {
            console.error('Error removing display image:', error)
            toast.error('Failed to remove display image')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!product.name || !product.price || !product.category_id) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            const response = await handleUpdateProduct(product)
            if (response.status === 200 || response.status === 201) {
                toast.success('Product updated successfully!')
                navigate('/products')
            } else {
                toast.error('Failed to update product')
            }
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error('An error occurred while updating the product')
        } finally {
            setIsLoading(false)
        }
    }

    if (productLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product data...</p>
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
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                            <p className="mt-1 text-sm text-gray-600">Update product information and settings</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex gap-3">
                            <Button
                                label="Cancel"
                                variant="outline"
                                size="md"
                                className="border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                                onClick={() => navigate('/products')}
                            />
                            <Button
                                label="Update Product"
                                variant="solid"
                                size="md"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-sm"
                                onClick={handleSubmit}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Product Information */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                            <p className="mt-1 text-sm text-gray-600">Basic product details and pricing</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Product Name */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={product.name}
                                        onChange={handleInput}
                                        placeholder="Enter product name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (₦) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={product.price}
                                        onChange={handleInput}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category_id"
                                        value={product.category_id}
                                        onChange={handleInput}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Shipping Days Min */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Min Shipping Days
                                    </label>
                                    <input
                                        type="number"
                                        name="shipping_days_min"
                                        value={product.shipping_days_min}
                                        onChange={handleInput}
                                        placeholder="1"
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                {/* Shipping Days Max */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Shipping Days
                                    </label>
                                    <input
                                        type="number"
                                        name="shipping_days_max"
                                        value={product.shipping_days_max}
                                        onChange={handleInput}
                                        placeholder="7"
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                {/* Status Options */}
                                <div className="lg:col-span-2">
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="marketplace_enabled"
                                                checked={product.marketplace_enabled}
                                                onChange={handleInput}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">
                                                Enable for Marketplace
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="is_archived"
                                                checked={product.is_archived}
                                                onChange={handleInput}
                                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">
                                                Archived
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={product.description}
                                        onChange={handleInput}
                                        placeholder="Describe your product, services, or business needs here..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Product Specifications</h3>
                                    <p className="mt-1 text-sm text-gray-600">Add detailed product specifications</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSpecification}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <FaPlus className="w-4 h-4 mr-2" />
                                    Add Specification
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            {(!product.specifications || product.specifications.length === 0) ? (
                                <div className="text-center py-12">
                                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No specifications</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by adding a product specification.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {product.specifications.map((spec, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Attribute (e.g., Weight, Color)"
                                                    name="attribute"
                                                    value={spec.attribute}
                                                    onChange={(e) => handleSpecificationChange(index, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Value (e.g., 2kg, Red)"
                                                    name="value"
                                                    value={spec.value}
                                                    onChange={(e) => handleSpecificationChange(index, e)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(index)}
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Loan Terms */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Loan Terms</h3>
                            <p className="mt-1 text-sm text-gray-600">Configure loan terms for this product</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Down Payment Percentage */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Down Payment Percentage (%)
                                    </label>
                                    <select
                                        name="loan_terms.down_payment_percentage"
                                        value={product.loan_terms.down_payment_percentage}
                                        onChange={handleNestedInput}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select percentage</option>
                                        {[20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(percent => (
                                            <option key={percent} value={percent}>{percent}%</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Max Tenure Months */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Tenure (Months)
                                    </label>
                                    <select
                                        name="loan_terms.max_tenure_months"
                                        value={product.loan_terms.max_tenure_months}
                                        onChange={handleNestedInput}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select months</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                            <option key={month} value={month}>{month} {month === 1 ? 'month' : 'months'}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Interest Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Interest Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="loan_terms.interest_rate"
                                        value={product.loan_terms.interest_rate}
                                        onChange={handleNestedInput}
                                        placeholder="10"
                                        min="0"
                                        step="0.1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                {/* Processing Fee */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Processing Fee (₦)
                                    </label>
                                    <input
                                        type="number"
                                        name="loan_terms.processing_fee"
                                        value={product.loan_terms.processing_fee}
                                        onChange={handleNestedInput}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Repayment Plans */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Repayment Plans</h3>
                            <p className="mt-1 text-sm text-gray-600">Select a repayment plan for this product</p>
                        </div>
                        <div className="p-6">
                            {repaymentPlans && Array.isArray(repaymentPlans) && repaymentPlans.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {repaymentPlans.map((plan) => (
                                        <div 
                                            key={plan.id} 
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                product.repayment_plan_id === plan.id 
                                                    ? 'border-green-500 bg-green-50' 
                                                    : 'border-gray-200 hover:border-green-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 mb-1">{plan.description}</h4>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={product.repayment_plan_id === plan.id}
                                                    onChange={() => {
                                                        setProduct(prev => ({
                                                            ...prev,
                                                            repayment_plan_id: prev.repayment_plan_id === plan.id ? '' : plan.id
                                                        }));
                                                    }}
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="text-xs text-gray-500 space-y-1">
                                                {plan.tenure_unit && (
                                                    <div className="font-medium text-gray-700">Tenure: {plan.tenure_unit}</div>
                                                )}
                                                {(plan.weekly_tenure_min || plan.weekly_tenure_max) && (
                                                    <div>Weekly: {plan.weekly_tenure_min}-{plan.weekly_tenure_max} weeks</div>
                                                )}
                                                {(plan.monthly_tenure_min || plan.monthly_tenure_max) && (
                                                    <div>Monthly: {plan.monthly_tenure_min}-{plan.monthly_tenure_max} months</div>
                                                )}
                                                {(plan.down_percent_min || plan.down_percent_max) && (
                                                    <div>Down Payment: {plan.down_percent_min}-{plan.down_percent_max}%</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No repayment plans available</h3>
                                    <p className="mt-1 text-sm text-gray-500">Contact admin to create repayment plans.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Management */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                            <p className="mt-1 text-sm text-gray-600">Manage product images and display photo</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Display Image */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Image
                                    </label>
                                    
                                    {/* Existing Display Image */}
                                    {existingDisplayImage && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">Current Display Image:</p>
                                            <div className="relative inline-block">
                                                <img
                                                    src={existingDisplayImage.url || existingDisplayImage}
                                                    alt="Current display"
                                                    className="h-32 w-32 object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeExistingDisplayImage}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <FaTimes className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* New Display Image Upload */}
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {displayPreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={displayPreview}
                                                        alt="Display preview"
                                                        className="mx-auto h-32 w-32 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDisplayImage(null)
                                                            setDisplayPreview(null)
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <FaTimes className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                            )}
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                    <span>Upload new display image</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleDisplayImageUpload}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Images */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Images
                                    </label>
                                    
                                    {/* Existing Images */}
                                    {existingImages && existingImages.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {existingImages.map((image) => (
                                                    <div key={image.id} className="relative">
                                                        <img
                                                            src={image.url}
                                                            alt={`Product ${image.id}`}
                                                            className="w-full h-20 object-cover rounded-md border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingImage(image.id)}
                                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <FaTimes className="w-2 h-2" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Images Upload */}
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                                                    <span>Upload images</span>
                                                    <input
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleImageUpload}
                                                    />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                                        </div>
                                    </div>
                                    
                                    {/* New Image Previews */}
                                    {previewImages && previewImages.length > 0 && (
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {previewImages.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-20 object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <FaTimes className="w-2 h-2" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProduct