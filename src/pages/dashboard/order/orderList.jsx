import React, { useState } from 'react'
import { useFetchOrder } from '../../../hooks/queries/order'

function OrderList() {
  const [loading, setloading] = useState([]);
  const { data: OrderList, isPending, isError } = useFetchOrder()

  console.log(OrderList)
  return (
    <div>
      <h1>order</h1>
    </div>
  )
}

export default OrderList
