import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { Package, Tag } from 'lucide-react';
import axiosInstance from '../../../../../store/axiosInstance';

function MarketplaceCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        display_attachment_id: null
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/admin/categories');
            console.log('Categories response:', response.data);
            
            // Parse response: {data: {categories: [...], pagination: {...}}}
            const categoriesData = response.data?.data?.categories || [];
            
            // Get product counts for each category
            const categoriesWithCounts = await Promise.all(
                categoriesData.map(async (category) => {
                    try {
                        const countRes = await axiosInstance.get(`/api/admin/products?category_id=${category.id}&limit=1`);
                        const productCount = countRes.data?.data?.pagination?.total || 0;
                        return {
                            ...category,
                            product_count: productCount
                        };
                    } catch (err) {
                        return {
                            ...category,
                            product_count: 0
                        };
                    }
                })
            );
            
            setCategories(categoriesWithCounts);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axiosInstance.put(`/api/admin/categories/${editingCategory.id}`, formData);
            } else {
                await axiosInstance.post('/api/admin/categories', formData);
            }
            
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', display_attachment_id: null });
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Error saving category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            display_attachment_id: category.display_attachment_id
        });
        setShowModal(true);
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            try {
                await axiosInstance.delete(`/api/admin/categories/${categoryId}`);
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert(error.response?.data?.message || 'Error deleting category. It may be in use by products.');
            }
        }
    };

    const filteredCategories = (categories || []).filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Marketplace Categories
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage product categories and their display settings
                    </p>
                </div>
                
                <div className="flex gap-3 items-center w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 pl-10 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setFormData({ name: '', display_attachment_id: null });
                            setShowModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
                    >
                        <FaPlus />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                        <p className="text-gray-600">Loading categories...</p>
                    </div>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Tag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Categories Found</h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.map((category) => (
                        <div 
                            key={category.id} 
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {/* Category Image */}
                            <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                                {category.DisplayAttachment?.url ? (
                                    <img 
                                        src={category.DisplayAttachment.url} 
                                        alt={category.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaImage className="w-12 h-12 text-green-300" />
                                )}
                            </div>
                            
                            {/* Category Info */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                        {category.name}
                                        <span className="block text-xs text-gray-400 font-mono mt-1">ID: {category.id}</span>
                                    </h3>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <Package className="w-4 h-4" />
                                    <span className="font-medium">{category.product_count || 0}</span>
                                    <span>Products</span>
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                    
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                        title="Delete Category"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Kitchen Equipment"
                                    />
                                </div>

                                {editingCategory && (
                                    <div className="mb-2">
                                        <label className="block text-xs text-gray-500">Category ID</label>
                                        <div className="text-sm text-gray-800">
                                            {editingCategory.id}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full"
                                        onChange={async (e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (file) {
                                                const formDataImage = new FormData();
                                                formDataImage.append('file', file);
                                                try {
                                                    const response = await axiosInstance.post('/api/admin/attachments/upload', formDataImage, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });
                                                    const id = response.data?.data?.attachment?.id;
                                                    const url = response.data?.data?.attachment?.url;
                                                    setFormData({ ...formData, display_attachment_id: id, previewImageUrl: url });
                                                } catch (err) {
                                                    alert('Error uploading image');
                                                }
                                            }
                                        }}
                                    />
                                    {formData.previewImageUrl && (
                                        <img
                                            src={formData.previewImageUrl}
                                            alt="Preview"
                                            className="mt-2 rounded w-full max-h-32 object-contain border"
                                        />
                                    )}
                                </div>
                                
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                                    >
                                        {editingCategory ? 'Update Category' : 'Create Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarketplaceCategories;
