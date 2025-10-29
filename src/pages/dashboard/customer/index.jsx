import React, { useState } from 'react';
import { FaEye, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Button from '../../../components/shared/button';
import { Link, useParams } from 'react-router-dom';
import { useFetchBusinessCustomerDetails, useFetchCustomer } from '../../../hooks/queries/customer';
import { useNavigate } from 'react-router-dom';

function Customer() {
    const perPage = 20;
    const { id } = useParams()
    const [page, setPage] = useState(1);
    const navigate = useNavigate()
    const [search, setSearch] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");

    const { data: customerData, isPending, isError } = useFetchCustomer(page, perPage, search, sourceFilter);


    console.log(customerData)

    const totalCustomers = Array.isArray(customerData) ? customerData.length : 0;
    const totalPages = Math.ceil(totalCustomers / perPage);
    const handleViewCustomer = (id, source) => {
        if (source === 'marketplace') {
            navigate(`/marketplace-user/${id}`);
        } else {
            navigate(`/view_details/${id}`);
        }
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };
    const handleCustomer = (id) => {
        navigate(`/customer-details/${id}`);
    }
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };



    return (
        <div className="px-6">
            <div className="inline-block min-w-full rounded-lg overflow-hidden">
                <div className="flex justify-between flex-col md:flex-row w-full gap-4 py-6">
                    <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Customer</h1>


                    <Link to="/customer_statistics">
                        <Button
                            label="View Customer Statistics"
                            variant="solid"
                            size="md"
                            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
                        />
                    </Link>
                </div>

                {/* Filter Section */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Source:</label>
                        <select 
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sourceFilter}
                            onChange={(e) => {
                                setSourceFilter(e.target.value);
                                setPage(1); // Reset to first page when filtering
                            }}
                        >
                            <option value="">All Sources</option>
                            <option value="vendor">Vendor</option>
                            <option value="marketplace">Marketplace</option>
                        </select>
                    </div>
                </div>

                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-white-100 text-black-700">
                        <tr>
                            {["ID", "Name", "Address", "Email", "Created At", "Phone No", "Source", 
                              ...(sourceFilter === 'marketplace' ? ["KYC Status", "Application Status"] : []), 
                              "View"
                            ].map((header, index) => (
                                <th key={index} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(customerData) && customerData.length > 0 ? (
                            customerData
                                .slice((page - 1) * perPage, page * perPage)
                                .map((item, index) => {
                                    const { id, full_name, created_at } = item;

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">{id}</td>
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">
                                                {item?.first_name} {item?.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.address || "N/A"}</td>
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.email || "N/A"}</td>
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">
                                                {new Date(created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">{item?.phone_number || "N/A"}</td>
                                            <td className="px-6 py-4 text-xs border-b border-gray-200">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    item?.source === 'marketplace' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item?.source === 'marketplace' ? 'Marketplace' : 'Vendor'}
                                                </span>
                                            </td>
                                            {sourceFilter === 'marketplace' && (
                                                <>
                                                    <td className="px-6 py-4 text-xs border-b border-gray-200">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            item.kyc_status === 'approved' ? 'bg-green-100 text-green-700' :
                                                            item.kyc_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            item.kyc_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {item.kyc_status === 'approved' ? 'Approved' :
                                                             item.kyc_status === 'rejected' ? 'Rejected' :
                                                             item.kyc_status === 'pending' ? 'Pending' :
                                                             item.kyc_status || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs border-b border-gray-200">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                            item.user_status === 'has_active_lease' ? 'bg-green-100 text-green-700' :
                                                            item.user_status === 'pending_application' ? 'bg-yellow-100 text-yellow-700' :
                                                            item.user_status === 'no_applications' ? 'bg-gray-100 text-gray-700' :
                                                            'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            {item.user_status === 'has_active_lease' ? 'Active Lease' :
                                                             item.user_status === 'pending_application' ? 'Pending' :
                                                             item.user_status === 'no_applications' ? 'No Applications' :
                                                             item.user_status || 'N/A'}
                                                        </span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="px-6 py-4 border-b border-gray-200 text-center">
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
                                                    aria-label="View"
                                                    onClick={() => handleViewCustomer(id, item?.source)}
                                                >
                                                    <FaEye className="text-gray-600 text-base" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center text-gray-500 text-sm py-6 border-b border-gray-200"
                                >
                                    No customer data available at the moment.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>



                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 text-white ${page === 1 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} rounded-lg`}
                    >
                        Previous
                    </button>
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 text-white ${page === totalPages ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} rounded-lg`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Customer;
