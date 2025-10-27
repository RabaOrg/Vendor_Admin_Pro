import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaExclamationTriangle, FaCalendarAlt, FaPercentage } from 'react-icons/fa';
import { Calendar, Percent, Clock } from 'lucide-react';
import axiosInstance from '../../../../../store/axiosInstance';

function MarketplaceRepaymentPlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        description: '',
        tenure_unit: 'month',
        weekly_tenure_min: '',
        weekly_tenure_max: '',
        monthly_tenure_min: '',
        monthly_tenure_max: '',
        down_percent_min: 0,
        down_percent_max: 100
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/admin/repayment-plans');
            console.log('Repayment plans response:', response.data);
            
            // Parse response: {status: 'success', data: {repayment_plans: [...], pagination: {...}}}
            const plansData = response.data?.data?.repayment_plans || [];
            
            setPlans(plansData);
        } catch (error) {
            console.error('Error fetching repayment plans:', error);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data for submission
            const submitData = {
                description: formData.description,
                tenure_unit: formData.tenure_unit,
                down_percent_min: parseInt(formData.down_percent_min) || 0,
                down_percent_max: parseInt(formData.down_percent_max) || 100
            };

            // Add tenure ranges based on tenure_unit
            if (formData.tenure_unit === 'week') {
                submitData.weekly_tenure_min = parseInt(formData.weekly_tenure_min) || null;
                submitData.weekly_tenure_max = parseInt(formData.weekly_tenure_max) || null;
            } else if (formData.tenure_unit === 'month') {
                submitData.monthly_tenure_min = parseInt(formData.monthly_tenure_min) || null;
                submitData.monthly_tenure_max = parseInt(formData.monthly_tenure_max) || null;
            }

            if (editingPlan) {
                await axiosInstance.put(`/api/admin/repayment-plans/${editingPlan.id}`, submitData);
            } else {
                await axiosInstance.post('/api/admin/repayment-plans', submitData);
            }
            
            setShowModal(false);
            setEditingPlan(null);
            resetForm();
            fetchPlans();
        } catch (error) {
            console.error('Error saving repayment plan:', error);
            alert(error.response?.data?.message || 'Error saving repayment plan');
        }
    };

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            description: plan.description || '',
            tenure_unit: plan.tenure_unit || 'month',
            weekly_tenure_min: plan.weekly_tenure_min || '',
            weekly_tenure_max: plan.weekly_tenure_max || '',
            monthly_tenure_min: plan.monthly_tenure_min || '',
            monthly_tenure_max: plan.monthly_tenure_max || '',
            down_percent_min: plan.down_percent_min || 0,
            down_percent_max: plan.down_percent_max || 100
        });
        setShowModal(true);
    };

    const handleDelete = async (planId) => {
        if (window.confirm('Are you sure you want to delete this repayment plan? This action cannot be undone if products are using it.')) {
            try {
                await axiosInstance.delete(`/api/admin/repayment-plans/${planId}`);
                fetchPlans();
            } catch (error) {
                console.error('Error deleting repayment plan:', error);
                alert(error.response?.data?.message || 'Error deleting repayment plan. It may be in use by products.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            description: '',
            tenure_unit: 'month',
            weekly_tenure_min: '',
            weekly_tenure_max: '',
            monthly_tenure_min: '',
            monthly_tenure_max: '',
            down_percent_min: 0,
            down_percent_max: 100
        });
    };

    const filteredPlans = (plans || []).filter(plan =>
        plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTenureDisplay = (plan) => {
        const tenureUnit = plan.tenure_unit || 'month';
        if (tenureUnit === 'week' || tenureUnit === 'weekly') {
            const min = plan.weekly_tenure_min || 0;
            const max = plan.weekly_tenure_max || 0;
            return `${min}-${max} weeks`;
        } else {
            const min = plan.monthly_tenure_min || 0;
            const max = plan.monthly_tenure_max || 0;
            return `${min}-${max} months`;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Repayment Plans
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage repayment plan configurations and tenure options
                    </p>
                </div>
                
                <div className="flex gap-3 items-center w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <input
                            type="text"
                            placeholder="Search plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 pl-10 text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    
                    <button
                        onClick={() => {
                            setEditingPlan(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
                    >
                        <FaPlus />
                        Add Plan
                    </button>
                </div>
            </div>

            {/* Plans Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                        <p className="text-gray-600">Loading repayment plans...</p>
                    </div>
                </div>
            ) : filteredPlans.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Repayment Plans Found</h3>
                    <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first repayment plan.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPlans.map((plan) => (
                        <div 
                            key={plan.id} 
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            {/* Plan Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {plan.description || 'Unnamed Plan'}
                                    </h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        plan.tenure_unit === 'week' || plan.tenure_unit === 'weekly'
                                            ? 'bg-blue-100 text-blue-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        <Clock className="w-3 h-3 mr-1" />
                                        {plan.tenure_unit === 'week' || plan.tenure_unit === 'weekly' ? 'Weekly' : 'Monthly'}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Plan Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        Tenure
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {getTenureDisplay(plan)}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center text-gray-600">
                                        <Percent className="w-4 h-4 mr-2 text-gray-400" />
                                        Down Payment
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {plan.down_percent_min}% - {plan.down_percent_max}%
                                    </span>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                                >
                                    <FaEdit />
                                    Edit
                                </button>
                                
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                    title="Delete Plan"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Plan Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4 pt-10">
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {editingPlan ? 'Edit Repayment Plan' : 'Add New Repayment Plan'}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                >
                                    ×
                                </button>
                            </div>
                            
                            {editingPlan && (
                                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 flex items-start gap-3">
                                    <FaExclamationTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-800">
                                        <strong className="font-semibold">Important:</strong> Changes to this plan will only apply to new orders/applications created after this update. Existing applications will keep their original terms.
                                    </p>
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., 6-Month Payment Plan for Solar Products"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tenure Unit *
                                    </label>
                                    <select
                                        value={formData.tenure_unit}
                                        onChange={(e) => setFormData({ ...formData, tenure_unit: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="week">Weekly</option>
                                        <option value="month">Monthly</option>
                                    </select>
                                </div>
                                
                                {formData.tenure_unit === 'week' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Min Weeks
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.weekly_tenure_min}
                                                onChange={(e) => setFormData({ ...formData, weekly_tenure_min: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="4"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Weeks
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.weekly_tenure_max}
                                                onChange={(e) => setFormData({ ...formData, weekly_tenure_max: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="52"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {formData.tenure_unit === 'month' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Min Months
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.monthly_tenure_min}
                                                onChange={(e) => setFormData({ ...formData, monthly_tenure_min: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="3"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Months
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.monthly_tenure_max}
                                                onChange={(e) => setFormData({ ...formData, monthly_tenure_max: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="12"
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Min Down Payment %
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            required
                                            value={formData.down_percent_min}
                                            onChange={(e) => setFormData({ ...formData, down_percent_min: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Max Down Payment %
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            required
                                            value={formData.down_percent_max}
                                            onChange={(e) => setFormData({ ...formData, down_percent_max: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            placeholder="50"
                                        />
                                    </div>
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
                                        {editingPlan ? 'Update Plan' : 'Create Plan'}
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

export default MarketplaceRepaymentPlans;

