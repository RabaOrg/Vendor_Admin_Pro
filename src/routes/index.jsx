import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/auth/login"
import Adminlayout from "../components/layout/admin-layout";
import Dashboard from "../pages/dashboard";
import Customer from "../pages/dashboard/customer";
import Product from "../pages/product";
import Repayment from "../pages/repayment";
import Addproduct from "../pages/addproduct";
import Addcustomer from "../pages/addcustomer";
import ProtectedRoute from "../provider/protectedRoute";
import PublicRoute from "../provider/publicRoute";


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
        ]
    }

])
