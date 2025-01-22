import React, { useState } from 'react'
import Button from '../../../components/shared/button';
import { Link } from 'react-router-dom';
import { useFetchOrder } from '../../../hooks/queries/order'

function OrderList() {
  const [loading, setloading] = useState([]);
  const { data: OrderList, isPending, isError } = useFetchOrder()

  console.log(OrderList)
  return (
    <div className='px-6'>
      <div className="inline-block min-w-full  rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 mt-3">
          <h1 className="text-3xl font-semibold">
            Order <span className="text-black-400"></span>
          </h1>
          <div className='flex gap-3'>
            <Button
              label="Cancel"
              variant="transparent"
              size="lg"
              className="text-sm w-[150px]"
            />
            <Link to={'/order_summary'}> <Button
              label="View order summary"
              variant="solid"

              size="md"
              className="text-sm px-6 py-5"
            /></Link>
          </div>
        </div>
        <table className="min-w-full leading-normal mt-3 ">
          <thead className='bg-[#D5D5D5]'>
            <tr>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase  tracking-wider">
                Product Name
              </th>

              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                State
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-white text-left text-xs font-bold text-black uppercase tracking-wider">
                Desired Delivery Date
              </th>


            </tr>
          </thead>

          {Array.isArray(OrderList) && OrderList.map((item, index) => {
            const { Product, User, State, amount } = item
            return (
              <tr className="bg-white" >

                <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {Product.name}
                  </p>
                </td>

                <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {amount}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {User.first_name} {User.last_name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {User.phone_number}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-xs">
                  <p className="font-[500] whitespace-no-wrap text-xs">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </td>


              </tr>
            )
          })}



          <tbody>




          </tbody>
        </table>

      </div>
    </div>
  )
}

export default OrderList
