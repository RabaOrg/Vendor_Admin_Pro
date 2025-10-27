import { useState, useEffect, useCallback } from 'react';
import { FaSave, FaEdit, FaEye, FaChartBar, FaCheck, FaSearch, FaUpload, FaTimes, FaSync } from 'react-icons/fa';
import axiosInstance from '../../../../../store/axiosInstance';

function MarketplaceEligibility() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    const [eligibilityStats, setEligibilityStats] = useState({
        total_users: 0,
        avg_eligibility: 0,
        min_eligibility: 0,
        max_eligibility: 0,
        kyc_completed_count: 0,
        eligibility_ranges: []
    });
    
    const [eligibilitySettings, setEligibilitySettings] = useState({
        default_eligibility_amount: 500000,
        minimum_eligibility_amount: 100000,
        maximum_eligibility_amount: 10000000
    });
    
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkAmount, setBulkAmount] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [saving, setSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [refreshingUserId, setRefreshingUserId] = useState(null);

    const itemsPerPage = 20;

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
            });
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            
            const response = await axiosInstance.get(`/api/admin/user-eligibility/eligibility?${params}`);
            if (response.data.data) {
                setUsers(response.data.data.users || []);
                const pagination = response.data.data.pagination || {};
                setTotalPages(pagination.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, itemsPerPage]);

    const fetchEligibilityStats = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/user-eligibility/stats');
            if (response.data.data) {
                setEligibilityStats({
                    total_users: response.data.data.total_users || 0,
                    avg_eligibility: response.data.data.avg_eligibility || 0,
                    min_eligibility: response.data.data.min_eligibility || 0,
                    max_eligibility: response.data.data.max_eligibility || 0,
                    kyc_completed_count: response.data.data.kyc_completed_count || 0,
                    eligibility_ranges: response.data.data.eligibility_ranges || []
                });
            }
        } catch (error) {
            console.error('Error fetching eligibility stats:', error);
        }
    };

    const fetchEligibilitySettings = async () => {
        try {
            const response = await axiosInstance.get('/api/admin/user-eligibility/settings');
            if (response.data.data) {
                setEligibilitySettings({
                    default_eligibility_amount: response.data.data.default_eligibility_amount || 500000,
                    minimum_eligibility_amount: response.data.data.minimum_eligibility_amount || 100000,
                    maximum_eligibility_amount: response.data.data.maximum_eligibility_amount || 10000000
                });
            }
        } catch (error) {
            console.error('Error fetching eligibility settings:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEligibilityStats();
        fetchEligibilitySettings();
    }, [fetchUsers]);

    const handleUpdateUserEligibility = async () => {
        try {
            console.log('Updating user eligibility:', editingUser.id, editAmount);
            
            if (!editAmount || editAmount.trim() === '') {
                alert('Please enter an eligibility amount');
                return;
            }
            
            const amount = parseFloat(editAmount.replace(/,/g, ''));
            if (isNaN(amount) || amount < 0) {
                alert('Please enter a valid amount');
                return;
            }
            
            setSaving(true);
            console.log('Sending PUT request to:', `/api/admin/user-eligibility/${editingUser.id}/eligibility`);
            console.log('Amount:', amount);
            
            const response = await axiosInstance.put(`/api/admin/user-eligibility/${editingUser.id}/eligibility`, {
                eligibility_amount: amount
            });
            
            console.log('Update response:', response.data);
            alert('User eligibility updated successfully!');
            
            setShowEditModal(false);
            setEditingUser(null);
            setEditAmount('');
            fetchUsers();
            fetchEligibilityStats();
        } catch (error) {
            console.error('Error updating user eligibility:', error);
            console.error('Error response:', error.response);
            alert(error.response?.data?.message || 'Error updating eligibility: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleRefreshEligibility = async (userId) => {
        try {
            setRefreshing(true);
            setRefreshingUserId(userId);
            console.log('Refreshing Periculum eligibility for user:', userId);
            
            const response = await axiosInstance.post(`/api/admin/user-eligibility/${userId}/eligibility/refresh`);
            
            console.log('Refresh response:', response.data);
            alert('Eligibility refreshed successfully from Periculum!');
            fetchUsers();
            fetchEligibilityStats();
        } catch (error) {
            console.error('Error refreshing eligibility:', error);
            console.error('Error response:', error.response);
            alert(error.response?.data?.message || 'Failed to refresh eligibility: ' + error.message);
        } finally {
            setRefreshing(false);
            setRefreshingUserId(null);
        }
    };

    const handleBulkUpdate = async () => {
        try {
            console.log('Bulk updating eligibility for users:', selectedUsers);
            
            if (selectedUsers.length === 0) {
                alert('Please select at least one user');
                return;
            }
            
            if (!bulkAmount || bulkAmount.trim() === '') {
                alert('Please enter an eligibility amount');
                return;
            }
            
            const amount = parseFloat(bulkAmount.replace(/,/g, ''));
            if (isNaN(amount) || amount < 0) {
                alert('Please enter a valid amount');
                return;
            }

            const updates = selectedUsers.map(userId => ({
                userId: parseInt(userId),
                eligibility_amount: amount
            }));
            
            setSaving(true);
            console.log('Sending PUT request to: /api/admin/user-eligibility/eligibility/bulk');
            console.log('Updates:', updates);

            const response = await axiosInstance.put('/api/admin/user-eligibility/eligibility/bulk', {
                updates,
                reason: 'Admin bulk update'
            });
            
            console.log('Bulk update response:', response.data);
            alert(`Successfully updated ${selectedUsers.length} user(s)!`);
            
            setShowBulkModal(false);
            setBulkAmount('');
            setSelectedUsers([]);
            fetchUsers();
            fetchEligibilityStats();
        } catch (error) {
            console.error('Error bulk updating eligibility:', error);
            console.error('Error response:', error.response);
            alert(error.response?.data?.message || 'Error with bulk update: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setEditAmount(user.eligibility_amount ? formatNumber(user.eligibility_amount) : '');
        setShowEditModal(true);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(u => u.id));
        }
    };

    const formatNumber = (num) => {
        if (!num && num !== 0) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleAmountInput = (value, setter) => {
        // Remove non-numeric characters except for decimal point
        const cleanValue = value.replace(/[^\d.]/g, '');
        // Format with commas
        const formatted = formatNumber(cleanValue);
        setter(formatted);
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'Not Set';
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-black">User Eligibility Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Current Default: <span className="font-semibold text-green-600">{formatCurrency(eligibilitySettings.default_eligibility_amount)}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {selectedUsers.length > 0 && (
                            <button
                                onClick={() => setShowBulkModal(true)}
                                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 flex items-center gap-2 shadow-md transition-all"
                            >
                                <FaUpload />
                                Update Selected ({selectedUsers.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Eligibility Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FaChartBar className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {eligibilityStats.total_users?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FaCheck className="text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">KYC Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {eligibilityStats.kyc_completed_count?.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FaEye className="text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Avg Eligibility</p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {formatCurrency(eligibilityStats.avg_eligibility)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FaChartBar className="text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Max Eligibility</p>
                                <p className="text-xl font-semibold text-gray-900">
                                    {formatCurrency(eligibilityStats.max_eligibility)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={users.length > 0 && selectedUsers.length === users.length}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Eligibility Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Periculum Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        DTI
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Fetched
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
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
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className={`hover:bg-gray-50 ${selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}`}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => handleSelectUser(user.id)}
                                                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.first_name} {user.last_name}
                                                </div>
                                                <div className="text-xs text-gray-500">ID: {user.id}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                                <div className="text-xs text-gray-500">{user.phone_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(user.eligibility_amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    user.eligibility_status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    user.eligibility_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    user.eligibility_status === 'failed' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.eligibility_status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.periculum_dti ? `${(user.periculum_dti * 100).toFixed(1)}%` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.eligibility_fetched_at 
                                                    ? new Date(user.eligibility_fetched_at).toLocaleDateString()
                                                    : 'Never'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 transition-colors"
                                                    >
                                                        <FaEdit />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleRefreshEligibility(user.id)}
                                                        disabled={!user.periculum_statement_key || (refreshing && refreshingUserId === user.id)}
                                                        className={`flex items-center gap-1 transition-colors ${
                                                            !user.periculum_statement_key 
                                                                ? 'text-gray-400 cursor-not-allowed' 
                                                                : 'text-green-600 hover:text-green-900'
                                                        }`}
                                                        title={user.periculum_statement_key ? 'Refresh from Periculum' : 'No bank statement uploaded'}
                                                    >
                                                        <FaSync className={refreshing && refreshingUserId === user.id ? 'animate-spin' : ''} />
                                                        Refresh
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
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
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
                                        Page <span className="font-medium">{currentPage}</span> of{' '}
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

            {/* Edit User Eligibility Modal */}
            {showEditModal && editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Edit User Eligibility
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingUser(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    <strong>User:</strong> {editingUser.first_name} {editingUser.last_name}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">{editingUser.email}</p>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Eligibility Amount (NGN)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">₦</span>
                                    <input
                                        type="text"
                                        value={editAmount}
                                        onChange={(e) => handleAmountInput(e.target.value, setEditAmount)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Current: {formatCurrency(editingUser.eligibility_amount)}
                                </p>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingUser(null);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateUserEligibility}
                                    disabled={saving}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaSave />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Update Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Bulk Update Eligibility
                                </h3>
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                                <p className="text-sm text-gray-700">
                                    You have selected <strong>{selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''}</strong>. Enter the eligibility amount to apply to all selected users.
                                </p>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Eligibility Amount (NGN)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">₦</span>
                                    <input
                                        type="text"
                                        value={bulkAmount}
                                        onChange={(e) => handleAmountInput(e.target.value, setBulkAmount)}
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                                        placeholder="500,000"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                                <p className="text-xs font-medium text-gray-700 mb-2">Selected Users:</p>
                                <div className="space-y-1">
                                    {users.filter(u => selectedUsers.includes(u.id)).map(user => (
                                        <div key={user.id} className="text-xs text-gray-600 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                            {user.first_name} {user.last_name} (ID: {user.id})
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkUpdate}
                                    disabled={saving}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaUpload />
                                    {saving ? 'Updating...' : `Update ${selectedUsers.length} User${selectedUsers.length !== 1 ? 's' : ''}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarketplaceEligibility;
