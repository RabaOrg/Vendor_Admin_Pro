import React from 'react'
import { useParams } from 'react-router-dom'
import KycDetails from '../customer/kycdetails/index'
import BusinessDetails from '../customer/businessdetails/businessdetails';
import FinancialDetails from '../customer/financialdetails/financialdetail';
import Guarantor from '../customer/guarantor';
import ImageUpload from '../uploadimage';
import Repayment from '../customer/repayment';
import EditCustomer from '../customer/editcustomer';

function UpdateCustomer() {
    const { id } = useParams();

    return (
        <div>
            <EditCustomer Id={id} />
            <BusinessDetails Id={id} />
            <FinancialDetails Id={id} />
            <Guarantor Id={id} />
            <ImageUpload />
            <Repayment />
        </div>
    )
}

export default UpdateCustomer
