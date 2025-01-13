import React, { useState } from 'react';
import Modal from '../../../components/shared/modal';
import CustomInput from '../../../components/shared/customInput';
import Button from '../../../components/shared/button';
import { handleGetAllTrnsaction } from '../../../services/transaction';
import { toast } from 'react-toastify';

function TransactionList() {
  const [searchDetails, setSearchDetails] = useState({
    start_date: '',
    end_date: '',
    page: '',
    perPage: '',
  });

  const [isModal, setIsModal] = useState(false);
  const [transactionDisplay, setTransactionDisplay] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleModal = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchDetails({ ...searchDetails, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!searchDetails.start_date || !searchDetails.end_date || !searchDetails.page || !searchDetails.perPage) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const queryParams = {
        start_date: searchDetails.start_date,
        end_date: searchDetails.end_date,
        page: searchDetails.page,
        perPage: searchDetails.perPage,
      };
      const response = await handleGetAllTrnsaction(
        queryParams.start_date,
        queryParams.end_date,
        queryParams.page,
        queryParams.perPage
      );
      console.log(response);
      if (response) {
        setTransactionDisplay(response || []);
        toast.success("Transaction list fetched successfully.");
        setIsModal(false);
      }
      queryParams.start_date = "",
        queryParams.end_date = "",
        queryParams.page = "",
        queryParams.perPage = ""
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-10'>
      <div className="flex justify-between px-6">
        <h1 className="text-3xl font-semibold text-black mb-4 md:mb-0">Transactions</h1>
        <Button
          label="Search Transactions"
          variant="solid"
          size="md"
          onClick={handleModal}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 mt-4 md:mt-0"
        />
      </div>

      {/* Transactions Table */}
      {transactionDisplay.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Internal Ref</th>
                <th className="border px-4 py-2">External Ref</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {transactionDisplay.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.id}</td>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2">{item.type}</td>
                  <td className="border px-4 py-2">{item.internal_ref}</td>
                  <td className="border px-4 py-2">{item.external_ref}</td>
                  <td className="border px-4 py-2">{item.amount}</td>
                  <td className="border px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="border px-4 py-2">{new Date(item.updated_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="py-48 text-center text-gray-500">No transactions to display.</p>
      )}

      {/* Modal */}
      <Modal isOpen={isModal} onClose={handleCloseModal}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <CustomInput
            label="Start Date"
            type="date"
            name="start_date"
            placeholder="Select start date"
            value={searchDetails.start_date}
            onChange={handleInputChange}
          />
          <CustomInput
            label="End Date"
            type="date"
            name="end_date"
            placeholder="Select end date"
            value={searchDetails.end_date}
            onChange={handleInputChange}
          />
          <CustomInput
            label="Page"
            type="number"
            name="page"
            placeholder="Page number"
            value={searchDetails.page}
            onChange={handleInputChange}
          />
          <CustomInput
            label="Per Page"
            type="number"
            name="perPage"
            placeholder="Items per page"
            value={searchDetails.perPage}
            onChange={handleInputChange}
          />
          <div className="flex space-x-4">
            <Button
              label="Search"
              variant="solid"
              loading={loading}
              size="md"
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
            />
            <Button
              label="Close"
              variant="outline"
              size="md"
              onClick={handleCloseModal}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TransactionList;
