import React from 'react'
import { useParams } from 'react-router-dom';
// import { useFetchOrderSummary } from '../../../hooks/queries/order'

function ViewOrderSummary() {
  const { id } = useParams()
  // const { data: orderSummary, isPending, isError } = useFetchOrderSummary()

  return (
    <div>

    </div>
  )
}

export default ViewOrderSummary
