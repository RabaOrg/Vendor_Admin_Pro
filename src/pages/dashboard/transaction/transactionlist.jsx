import React, { useEffect, useState } from 'react';
import Modal from '../../../components/shared/modal';
import CustomInput from '../../../components/shared/customInput';
import Button from '../../../components/shared/button';
import { handleGetAllTrnsaction, handleGetTrnsaction } from '../../../services/transaction';
import { toast } from 'react-toastify';

function TransactionList() {
  const [searchDetails, setSearchDetails] = useState({
    start_date: '',
    end_date: '',
    page: '',
    perPage: '',
  });

  const [isModal, setIsModal] = useState(false);
  const pageItem = 10
  const [currentPage, setcurrentPage] = useState(1)
  const [transactionDisplay, setTransactionDisplay] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleModal = () => {
    setIsModal(true);
  };
  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await handleGetTrnsaction(1, 20)
      console.log(response)
      setTransactionDisplay(response)
    } catch (error) {
      console.log(error)
    }
  }
  const handleCloseModal = () => {
    setIsModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchDetails({ ...searchDetails, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!searchDetails.start_date || !searchDetails.end_date) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const queryParams = {
        start_date: searchDetails.start_date,
        end_date: searchDetails.end_date,
        page: currentPage,
        perPage: 10,
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


      {transactionDisplay.length > 0 ? (
        <div className="overflow-x-auto mt-6 px-7">
          <table className="min-w-full leading-normal mt-4 ">
            <thead>
              <tr className="bg-white-200  text-gray-900">
                <th className="border px-6 py-3 text-xs text-left font-bold">LOAN ID</th>
                <th className="border px-6 py-3 text-xs text-left font-bold">TYPE</th>
                <th className="border px-6 py-3 text-xs text-left font-bold">AMOUNT</th>
                <th className="border px-6 py-3 text-xs text-left font-bold">CUSTOMER NAME</th>
                <th className="border px-6 py-3 text-xs text-left font-bold">CREATED AT</th>
                <th className="border px-6 py-3 text-xs text-left font-bold">UPDATED AT</th>
                <th className="border px-6 py-3 text-xs text-left font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactionDisplay.map((item, index) => (
                <tr key={index} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="border px-6 py-4 text-xs">{item.id}</td>
                  <td className="border px-6 py-4 text-xs">{item.type}</td>
                  <td className="border px-6 py-4 text-xs">{item.amount}</td>
                  <td className="border px-6 py-4 text-xs">{item.customer_name}</td>
                  <td className="border px-6 py-4 text-xs">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="border px-6 py-4 text-xs">{new Date(item.updated_at).toLocaleString()}</td>
                  <td className="border px-6 py-4 text-sm">
                    <div className="flex items-center space-x-2">
                      {item.status === 'pending' ? (
                        <button
                          className="bg-yellow-300 text-yellow-700 px-4 py-2 rounded-md text-xs"
                        >
                          Pending
                        </button>
                      ) : (
                        <button
                          className="bg-green-400 text-green-700 px-4 py-2 rounded-md text-xs"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
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
