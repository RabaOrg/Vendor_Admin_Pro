import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaCheck, FaTimes, FaDownload, FaEllipsisV } from 'react-icons/fa';
import axiosInstance from '../../../../../store/axiosInstance';

function MarketplaceKYC() {
    const [kycSubmissions, setKycSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    const itemsPerPage = 20;

    useEffect(() => {
        fetchKycSubmissions();
    }, [currentPage, statusFilter]);

    const fetchKycSubmissions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                ...(statusFilter && { status: statusFilter }),
                ...(searchTerm && { search: searchTerm })
            });

            const response = await axiosInstance.get(`/api/admin/kyc/users?${params}`);
            setKycSubmissions(response.data.data || []);
            setTotalPages(response.data.meta?.total_pages || 1);
        } catch (error) {
            console.error('Error fetching KYC submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveKyc = async (userId) => {
        try {
            await axiosInstance.patch(`/api/admin/kyc/users/${userId}/approve`);
            fetchKycSubmissions(); // Refresh the list
        } catch (error) {
            console.error('Error approving KYC:', error);
        }
    };

    const handleRejectKyc = async (userId, reason) => {
        try {
            await axiosInstance.patch(`/api/admin/kyc/users/${userId}/reject`, {
                reason: reason
            });
            fetchKycSubmissions(); // Refresh the list
        } catch (error) {
            console.error('Error rejecting KYC:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value === '') {
            fetchKycSubmissions();
        }
    };

    const handleSearchSubmit = () => {
        setCurrentPage(1);
        fetchKycSubmissions();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending': { class: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
            'approved': { class: 'bg-green-100 text-green-700', text: 'Approved' },
            'rejected': { class: 'bg-red-100 text-red-700', text: 'Rejected' },
            'incomplete': { class: 'bg-orange-100 text-orange-700', text: 'Incomplete' }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${config.class}`}>
                {config.text}
            </span>
        );
    };

    const getCompletionPercentage = (submission) => {
        const steps = ['bvn_verified', 'business_info', 'bank_details', 'financial_info', 'guarantor_info'];
        const completedSteps = steps.filter(step => submission[step]).length;
        return Math.round((completedSteps / steps.length) * 100);
    };

    return (
        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Marketplace KYC Management</h1>
                    
                    {/* Search and Filters */}
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
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
                            <option value="incomplete">Incomplete</option>
                        </select>
                        
                        <button
                            onClick={handleSearchSubmit}
                            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* KYC Submissions Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Completion
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            Loading KYC submissions...
                                        </td>
                                    </tr>
                                ) : kycSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No KYC submissions found.
                                        </td>
                                    </tr>
                                ) : (
                                    kycSubmissions.map((submission) => (
                                        <tr key={submission.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                #{submission.user_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>
                                                    <div className="font-medium">{submission.user?.first_name} {submission.user?.last_name}</div>
                                                    <div className="text-gray-500">{submission.user?.email}</div>
                                                    <div className="text-gray-500">{submission.user?.phone_number}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                                        <div 
                                                            className="bg-green-600 h-2 rounded-full" 
                                                            style={{ width: `${getCompletionPercentage(submission)}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">
                                                        {getCompletionPercentage(submission)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(submission.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(submission.updated_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === submission.id ? null : submission.id)}
                                                        className="text-gray-600 hover:text-gray-900 p-2"
                                                        title="Actions"
                                                    >
                                                        <FaEllipsisV />
                                                    </button>
                                                    
                                                    {openMenuId === submission.id && (
                                                        <>
                                                            <div 
                                                                className="fixed inset-0 z-10" 
                                                                onClick={() => setOpenMenuId(null)}
                                                            ></div>
                                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedSubmission(submission);
                                                                            setShowModal(true);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        <FaEye className="mr-2" />
                                                                        View Details
                                                                    </button>
                                                                    
                                                                    {submission.status === 'pending' && (
                                                                        <>
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleApproveKyc(submission.user_id);
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                                className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                                                                            >
                                                                                <FaCheck className="mr-2" />
                                                                                Approve
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const reason = prompt('Enter rejection reason:');
                                                                                    if (reason) {
                                                                                        handleRejectKyc(submission.user_id, reason);
                                                                                    }
                                                                                    setOpenMenuId(null);
                                                                                }}
                                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                                                            >
                                                                                <FaTimes className="mr-2" />
                                                                                Reject
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                    
                                                                    <button
                                                                        onClick={() => {
                                                                            window.open(`/api/admin/kyc/users/${submission.user_id}/documents`, '_blank');
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-purple-700 hover:bg-gray-100"
                                                                    >
                                                                        <FaDownload className="mr-2" />
                                                                        Download Documents
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
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

            {/* KYC Details Modal */}
            {showModal && selectedSubmission && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">KYC Details</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {selectedSubmission.user?.first_name} {selectedSubmission.user?.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">{selectedSubmission.user?.email}</p>
                                    <p className="text-sm text-gray-500">{selectedSubmission.user?.phone_number}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Completion Status</label>
                                    <div className="mt-1 flex items-center">
                                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                                            <div 
                                                className="bg-green-600 h-2 rounded-full" 
                                                style={{ width: `${getCompletionPercentage(selectedSubmission)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600">
                                            {getCompletionPercentage(selectedSubmission)}%
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">KYC Steps</label>
                                    <div className="mt-1 space-y-1">
                                        {[
                                            { key: 'bvn_verified', label: 'BVN Verification' },
                                            { key: 'business_info', label: 'Business Information' },
                                            { key: 'bank_details', label: 'Bank Details' },
                                            { key: 'financial_info', label: 'Financial Information' },
                                            { key: 'guarantor_info', label: 'Guarantor Information' }
                                        ].map(step => (
                                            <div key={step.key} className="flex items-center">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                                    selectedSubmission[step.key] ? 'bg-green-500' : 'bg-gray-300'
                                                }`}></span>
                                                <span className="text-sm text-gray-700">{step.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedSubmission.status)}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(selectedSubmission.updated_at).toLocaleString()}
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
                                {selectedSubmission.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                handleApproveKyc(selectedSubmission.user_id);
                                                setShowModal(false);
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => {
                                                const reason = prompt('Enter rejection reason:');
                                                if (reason) {
                                                    handleRejectKyc(selectedSubmission.user_id, reason);
                                                    setShowModal(false);
                                                }
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

export default MarketplaceKYC;
