import { useState } from 'react';
import LeaseCalculatorModal from '../../../components/modals/LeaseCalculatorModal';

function LeaseCalculatorPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800">Lease Calculator</h1>
          <p className="text-gray-600 mt-2">
            Calculate lease terms and payment schedules for products before creating applications.
          </p>
        </div>

        <div className="p-6">
          <div className="text-center py-12">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Lease Calculator Tool</h2>
              <p className="text-gray-600 mb-6">
                Use this tool to calculate lease terms, monthly payments, and total costs for any product.
                Perfect for planning and presenting lease options to customers.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Open Lease Calculator
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Product Pricing</h3>
              <p className="text-blue-600 text-sm">
                Enter any product price and see how it affects lease calculations with management fees.
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Flexible Down Payment</h3>
              <p className="text-green-600 text-sm">
                Choose between percentage or fixed amount for down payment calculations.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Interest & Tenure</h3>
              <p className="text-purple-600 text-sm">
                Set custom interest rates and lease terms in months or days.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Enter the product price you want to calculate lease terms for</li>
              <li>Choose whether to set down payment as a percentage or fixed amount</li>
              <li>Set the interest rate and lease tenure (in months or days)</li>
              <li>Click "Calculate Lease" to see detailed payment breakdown</li>
              <li>Use the results to create applications or present options to customers</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Lease Calculator Modal */}
      <LeaseCalculatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default LeaseCalculatorPage;
