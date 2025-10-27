import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheck, FaTimes, FaFlag } from 'react-icons/fa';
import axiosInstance from '../../../../../store/axiosInstance';

function MarketplaceReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const itemsPerPage = 20;

    useEffect(() => {
        fetchReviews();
    }, [currentPage, statusFilter]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                ...(statusFilter && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm })
            });

            const response = await axiosInstance.get(`/api/admin/marketplace/reviews?${params}`);
            setReviews(response.data.data || []);
            setTotalPages(response.data.meta?.total_pages || 1);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerateReview = async (reviewId, action) => {
        try {
            await axiosInstance.patch(`/api/admin/marketplace/reviews/${reviewId}/moderate`, {
                action: action
            });
            fetchReviews(); // Refresh the list
        } catch (error) {
            console.error('Error moderating review:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await axiosInstance.delete(`/api/admin/marketplace/reviews/${reviewId}`);
                fetchReviews(); // Refresh the list
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') {
            fetchReviews();
        }
    };

    const handleSearchSubmit = () => {
        setCurrentPage(1);
        fetchReviews();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
            'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
            'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
            'flagged': { class: 'bg-orange-100 text-orange-700', text: 'Flagged' }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const getRatingStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    return (
        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Marketplace Reviews</h1>
                    
                    {/* Search and Filters */}
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search reviews..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full px-3 py-2 pl-8 mt-1 text-xs font-[400] text-[#202224] rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-green-600 focus:outline-none"
                            />
                            <span className="absolute left-3 top-[22px] transform -translate-y-1/2 text-gray-400">
                                <FaSearch />
                            </span>
                        </div>
                        
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="flagged">Flagged</option>
                        </select>
                        
                        <button
                            onClick={handleSearchSubmit}
                            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Reviews Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Review ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dealer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Comment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            Loading reviews...
                                        </td>
                                    </tr>
                                ) : reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No reviews found.
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{review.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>
                                                    <div className="font-medium">{review.user?.name || 'Anonymous'}</div>
                                                    <div className="text-gray-500">{review.user?.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>
                                                    <div className="font-medium">{review.dealer?.name}</div>
                                                    <div className="text-gray-500">{review.dealer?.location}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <span className="text-yellow-400 mr-1">
                                                        {getRatingStars(review.rating)}
                                                    </span>
                                                    <span className="text-gray-500">({review.rating}/5)</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                                <div className="truncate">
                                                    {review.comment || 'No comment'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(review.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedReview(review);
                                                            setShowModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    
                                                    {review.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleModerateReview(review.id, 'approve')}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Approve"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                            <button
                                                                onClick={() => handleModerateReview(review.id, 'reject')}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Reject"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    <button
                                                        onClick={() => handleModerateReview(review.id, 'flag')}
                                                        className="text-orange-600 hover:text-orange-900"
                                                        title="Flag"
                                                    >
                                                        <FaFlag />
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => handleDeleteReview(review.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                        <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Review Details Modal */}
            {showModal && selectedReview && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Review Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedReview.user?.name || 'Anonymous'} ({selectedReview.user?.email})
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dealer</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedReview.dealer?.name} - {selectedReview.dealer?.location}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Rating</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <span className="text-yellow-400">{getRatingStars(selectedReview.rating)}</span>
                                        ({selectedReview.rating}/5)
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Comment</label>
                                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">
                                        {selectedReview.comment || 'No comment provided'}
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedReview.status)}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(selectedReview.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Close
                                </button>
                                {selectedReview.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleModerateReview(selectedReview.id, 'approve');
                                                setShowModal(false);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleModerateReview(selectedReview.id, 'reject');
                                                setShowModal(false);
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarketplaceReviews;
