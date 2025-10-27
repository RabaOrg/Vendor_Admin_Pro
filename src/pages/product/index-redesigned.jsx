import React, { useEffect, useState } from 'react';
import { FaSearch, FaEdit, FaEye, FaTh, FaList, FaTrash, FaFilter, FaArchive } from 'react-icons/fa';
import axiosInstance from '../../../store/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/shared/button';
import { toast } from 'react-toastify';

function Product() {
    const [currentPage, setCurrentPage] = useState(1);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productMeta, setMetaProduct] = useState([]);
    const itemsPerPage = 10;
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState('table');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [marketplaceFilter, setMarketplaceFilter] = useState('');

    const navigate = useNavigate();

    // Filter products based on search, archived status, and marketplace status
    useEffect(() => {
        let filtered = [...allProducts];

        // Apply archived filter
        if (!showArchived) {
            filtered = filtered.filter(item => !item.is_archived);
        }

        // Apply marketplace filter
        if (marketplaceFilter === 'enabled') {
            filtered = filtered.filter(item => item.marketplace_enabled === true);
        } else if (marketplaceFilter === 'disabled') {
            filtered = filtered.filter(item => !item.marketplace_enabled);
        }

        // Apply search filter
        if (search) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [allProducts, showArchived, marketplaceFilter, search]);

    // Fetch products from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get(`/api/admin/products?page=${currentPage}&perPage=${itemsPerPage}`);
                setAllProducts(response.data.data || []);
                setProductMeta(response.data);
            } catch (error) {
                console.log('Error fetching products:', error);
                toast.error('Failed to load products');
            }
        };
        fetchProduct();
    }, [currentPage, itemsPerPage]);

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                setIsDeleting(true);
                const response = await axiosInstance.delete(`/api/admin/products/${id}`);
                if (response.status === 200) {
                    const result = response.data.data || response.data;
                    const { softDeleted, applicationCount } = result;
                    
                    if (softDeleted) {
                        toast.success(`Product archived (${applicationCount} applications found)`);
                    } else {
                        toast.success('Product deleted successfully');
                    }
                    
                    // Refresh
                    const updatedResponse = await axiosInstance.get(`/api/admin/products?page=${currentPage}&perPage=${itemsPerPage}`);
                    setAllProducts(updatedResponse.data.data || []);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                toast.error('Failed to delete product');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProducts.length === 0) {
            toast.warning('Please select products to delete');
            return;
        }

        if (window.confirm(`Delete ${selectedProducts.length} product(s)?`)) {
            try {
                setIsDeleting(true);
                const deletePromises = selectedProducts.map(id => 
                    axiosInstance.delete(`/api/admin/products/${id}`)
                );
                
                await Promise.all(deletePromises);
                toast.success(`${selectedProducts.length} product(s) deleted`);
                setSelectedProducts([]);
                
                // Refresh
                const updatedResponse = await axiosInstance.get(`/api/admin/products?page=${currentPage}&perPage=${itemsPerPage}`);
                setAllProducts(updatedResponse.data.data || []);
            } catch (error) {
                console.error('Error deleting products:', error);
                toast.error('Failed to delete products');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleSelectProduct = (id) => {
        setSelectedProducts(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSelectAll =踝 () => {
        if (selectedProducts.length === filteredProducts.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(filteredProducts.map(item => item.id));
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section - Redesigned */}
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage your product inventory</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'table' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                }`}
                                title="Table View"
                            >
                                <FaList className="text-gray-600" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-colors ${
                                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                }`}
                                title="Grid View"
                            >
                                <FaTh className="text-gray-600" />
                            </button>
                        </div>
                        
                        {selectedProducts.length > 0 && (
                            <Button
                                label={`Delete (${selectedProducts.length})`}
                                variant="solid"
                                size="md"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleBulkDelete}
                                loading={isDeleting}
                            />
                        )}
                        
                        <Link to="/addproduct">
                            <Button
                                label="Add New Product"
                                variant="solid"
                                size="md"
                                className="bg-green-600 hover:bg-green-700 text-white"
                            />
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                       不全="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Filters Section - Below Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Filters:</span>
                        </div>
                        
                        {/* Marketplace Filter */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">Marketplace:</label>
                            <select
                                value={marketplaceFilter}
                                onChange={(e) => setMarketplaceFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">All Products</option>
                                <option value="enabled">Enabled</option>
                                <option value="disabled">Disabled</option>
                            </select>
                        </div>

                        {/* Archived Filter */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="showArchived"
                                checked={showArchived}
                                onChange={(e) => setShowArchived(e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showArchived" className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <FaArchive />
                                Show Archived
                            </label>
                        </div>

                        {/* Results Count */}
                        <div className="ml-auto text-sm text-gray-600">
                            Showing {filteredProducts.length} of {allProducts.length} products
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Table/Grid */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                            onChange={handleSelectAll}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketplace</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(item.id)}
                                                    onChange={() => handleSelectProduct(item.id)}
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <img 
                                                    src={item.display_attachment_url?.url || '/placeholder.png'} 
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.category || 'N/A'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                ₦{parseFloat(item.price || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                    item.marketplace_enabled 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {item.marketplace_enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                    item.is_archived 
                                                        ? 'bg-red-100 text-red-800' 
                                                        : 'bg-green-100 text-green-800'
                                                }`}>
                                                    {item.is_archived ? 'Archived' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/view_product_details/${item.id}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/editproduct/${item.id}`)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(item.id)}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative">
                                <div className="absolute top-2 left-2 z-10">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(item.id)}
                                        onChange={() => handleSelectProduct(item.id)}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="h-48 bg-gray-100 flex items-center justify-center">
                                    {item.display_attachment_url?.url ? (
                                        <img 
                                            src={item.display_attachment_url.url} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-center">
                                            <div className="text-4xl mb-2">📦</div>
                                            <div className="text-sm">No Image</div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{item.category || 'N/A'}</p>
                                    <p className="text-lg font-bold text-green-600 mb-3">
                                        ₦{parseFloat(item.price || 0).toLocaleString()}
                                    </p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            item.marketplace_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {item.marketplace_enabled ? 'Marketplace' : 'Internal'}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            item.is_archived ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {item.is_archived ? 'Archived' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Link to={`/view_product_details/${item.id}`}>
                                            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" title="View">
                                                <FaEye className="text-gray-600" />
                                            </button>
                                        </Link>
                                        <Link to={`/editproduct/${item.id}`}>
                                            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200" title="Edit">
                                                <FaEdit className="text-gray-600" />
                                            </button>
                                        </Link>
                                        <button
                                            className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                                            onClick={() => handleDeleteProduct(item.id)}
                                            disabled={isDeleting}
                                            title="Delete"
                                        >
                                            <FaTrash className="text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No products found
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">
                    Page {currentPage} of {productMeta?.meta?.total_pages || 1}
                </span>
                <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage >= (productMeta?.meta?.total_pages || 1)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Product;
