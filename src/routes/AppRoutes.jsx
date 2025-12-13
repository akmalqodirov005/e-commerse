import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../components/layouts/RootLayout";
import ErrorPage from "../components/error-element/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminLocations from "../pages/admin/AdminLocations";
import Cart from "../components/cart/Cart";
import ProductPage from "../pages/product/ProductPage";
import Admin from "../pages/admin/Admin";

const AppRoutes = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "products/:productId",
          element: <ProductPage />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          path: "admin",
          element: (
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          ),
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <AdminProducts />,
            },
            {
              path: "products",
              element: <AdminProducts />,
            },
            {
              path: "categories",
              element: <AdminCategories />,
            },
            {
              path: "users",
              element: <AdminUsers />,
            },
            {
              path: "locations",
              element: <AdminLocations />,
            },
            {
              path: "profile/:userId",
              element: <Admin />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default AppRoutes;
