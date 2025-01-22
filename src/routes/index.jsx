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
import Repayment from "../pages/dashboard/repayment_plan";
import RepaymentPlan from "../pages/dashboard/repayment_Plan/createrepayment";
import CreateApplication from "../pages/dashboard/application/createapplication";
import ViewOrderSummary from "../pages/dashboard/order/viewOrderSummary";
import EditProduct from "../pages/addproduct/editproduct";
import ViewActivation from "../pages/dashboard/activations/viewactivation";
import ViewCustomerDetails from "../pages/dashboard/customer/viewcustomer";





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
                element: <Repayment />

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
                path: "/transaction",
                element: <TransactionList />

            },
            {
                path: "/orders",
                element: <OrderList />

            },
            {
                path: "/activation",
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
                path: "/create_application/:id",
                element: <CreateApplication />

            },
            {
                path: "/order_summary",
                element: <ViewOrderSummary />

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
                path: "/view_details/:id",
                element: <ViewCustomerDetails />

            },

        ]
    }

])
