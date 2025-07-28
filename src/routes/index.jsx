import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/login"
import Adminlayout from "../components/layout/admin-layout";
import Dashboard from "../pages/dashboard";
import Customer from "../pages/dashboard/customer";
import Product from "../pages/product";

import Addproduct from "../pages/addproduct";
import Addcustomer from "../pages/addcustomer";
import ProtectedRoute from "../provider/protectedRoute";
import PublicRoute from "../provider/publicRoute";
import UpdateCustomer from "../pages/dashboard/updatecustomer";
import TransactionList from "../pages/dashboard/transaction/transactionlist";
import OrderList from "../pages/dashboard/order/orderList";
import ActivationLists from "../pages/dashboard/activations/activations";
import ApplicationList from "../pages/dashboard/application/application";

import RepaymentPlan from "../pages/dashboard/repaymentMainPlan/createrepayment";
import CreateApplication from "../pages/dashboard/application/createapplication";
import ViewOrderSummary from "../pages/dashboard/order/viewOrderSummary";
import EditProduct from "../pages/addproduct/editproduct";
import ViewActivation from "../pages/dashboard/activations/viewactivation";
import ViewCustomerDetails from "../pages/dashboard/customer/viewcustomer";
import RepaymentMainPlan from "../pages/dashboard/repaymentMainPlan";
import ViewProductDetails from "../pages/product/viewProductDetails";
import SingleApplication from "../pages/dashboard/application/viewsingleapplication";
import CategoryDashboard from "../pages/dashboard/category";
import PaymentOrder from "../pages/dashboard/payment/paymentOrder";
import BulkProductUpload from "../pages/product/bulkUpload/bulkUpload";
import VendorManagement from "../pages/dashboard/activations/vendor";
import GuarantorList from "../pages/dashboard/guarantor/guarantorlist";
import ViewGuarantor from "../pages/dashboard/guarantor/viewguarantor";
import GuarantorStatistics from "../pages/dashboard/guarantor/guarantorstatistics";
import GuarantorVerification from "../pages/dashboard/guarantor/guarantorverification";
import ApplicationPayment from "../pages/dashboard/application/applicationPay/payment";
import SingleRecurring from "../pages/dashboard/transaction/singlerecurring";
import Notification from "../pages/dashboard/notification";

import SmsApplication from "../pages/dashboard/notification/smsnotification/smsapplication";
import EachSmsNotification from "../pages/dashboard/notification/smsnotification/eachsmsnotification";
import CreateSmsApplication from "../pages/dashboard/notification/smsnotification/createsmsapplication";





export const router = createBrowserRouter([

    {
        path: "/login",
        element: <PublicRoute><Login /></PublicRoute>

    },
    {
        path: "/",

        element: <ProtectedRoute> <Adminlayout /></ProtectedRoute>,
        children: [
            {
                path: "/",
                element: <Dashboard />

            },
            {
                path: "/customer",
                element: <Customer />

            },
            {
                path: "/product",
                element: <Product />

            },
            {
                path: "/repayment-plan",
                element: <RepaymentMainPlan />

            },
            {
                path: "/addproduct",
                element: <Addproduct />

            },
            {
                path: "/addcustomer",
                element: <Addcustomer />

            },
            {
                path: "/customer-details/:id",
                element: <UpdateCustomer />

            },
            {
                path: "/recurring_debits",
                element: <TransactionList />

            },
            {
                path: "/recurring_debit/:id",
                element: <SingleRecurring />

            },
            {
                path: "/payment_details",
                element: <OrderList />

            },
            {
                path: "/vendor_management",
                element: <ActivationLists />

            },
            {
                path: "/application",
                element: <ApplicationList />

            },
            {
                path: "/create_repayment_plan",
                element: <RepaymentPlan />

            },
            {
                path: "/create_application",
                element: <CreateApplication />

            },
            {
                path: "/guarantor_list",
                element: <GuarantorList />

            },
            {
                path: "/guarantor_statistics",
                element: <GuarantorStatistics />

            },
            {
                path: "/guarantor_verification",
                element: <GuarantorVerification />

            },
            {
                path: "/email_notification",
                element: <SmsApplication />

            },
            {
                path: "/create_sms_notification/:id",
                element: <CreateSmsApplication />

            },
            {
                path: "/notification",
                element: <Notification />

            },
            {
                path: "/view_guarantor/:id",
                element: <ViewGuarantor />

            },
            {
                path: "/vendor_sms_application/:id",
                element: <EachSmsNotification />

            },

            {
                path: "/payment_statistics",
                element: <ViewOrderSummary />

            },
            {
                path: "/application_payment/:id",
                element: <ApplicationPayment />

            },
            {
                path: "/editproduct/:id",
                element: <EditProduct />

            },
            {
                path: "/view_activation/:id",
                element: <ViewActivation />

            },
            {
                path: "/vendor_statistics",
                element: <VendorManagement />

            },
            {
                path: "/view_details/:id",
                element: <ViewCustomerDetails />

            },
            {
                path: "/view_product_details/:id",
                element: <ViewProductDetails />

            },
            {
                path: "/application-statistics/:id",
                element: <SingleApplication />

            },
            {
                path: "/payment_orders",
                element: <PaymentOrder />

            },
            {
                path: "/product_bulkupload",
                element: <BulkProductUpload />

            },
            { path: "/order_summary/:id", element: <ViewOrderSummary /> },
            { path: "/category", element: <CategoryDashboard /> },

        ]
    }

])
