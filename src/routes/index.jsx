import React from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Layout from "../components/Layout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

//  ALL PAGE COMPONENTS
// Public Pages
import Home from "../pages/Home";
import PublicLessons from "../pages/PublicLessons";
import LessonDetails from "../pages/LessonDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Pricing from "../pages/Pricing";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import NotFound from "../pages/NotFound";

// Dashboard Pages (User & Admin)
import Dashboard from "../pages/dashboard/Dashboard";
import AddLesson from "../pages/dashboard/AddLesson";
import MyLessons from "../pages/dashboard/MyLessons";
import UpdateLesson from "../pages/dashboard/UpdateLesson";
import Favorites from "../pages/dashboard/Favorites";
import Profile from "../pages/dashboard/Profile";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ManageUsers from "../pages/dashboard/ManageUsers";
import ManageLessons from "../pages/dashboard/ManageLessons";
import ReportedLessons from "../pages/dashboard/ReportedLessons";

// 3. ROUTER
export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <NotFound />,
      children: [
       

        { path: "payment/success", element: <PaymentSuccess /> },
        { path: "payment/cancel", element: <PaymentCancel /> },

        {
          element: <Layout />,
          children: [
            // PUBLIC ROUTES
            { index: true, element: <Home /> },
            { path: "public-lessons", element: <PublicLessons /> },
            { path: "lessons/:id", element: <LessonDetails /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "pricing", element: <Pricing /> },

            // DASHBOARD ROUTES (NESTED UNDER <Layout />)
            {
              path: "dashboard",
              element: (
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              ),
              children: [
                // User Routes
                { index: true, element: <Dashboard /> },
                { path: "add-lesson", element: <AddLesson /> },
                { path: "my-lessons", element: <MyLessons /> },
                { path: "update-lesson/:id", element: <UpdateLesson /> },
                { path: "favorites", element: <Favorites /> },
                { path: "profile", element: <Profile /> },

                // Admin Routes 
                {
                  path: "admin",
                  element: (
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "admin/manage-users",
                  element: (
                    <ProtectedRoute adminOnly>
                      <ManageUsers />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "admin/manage-lessons",
                  element: (
                    <ProtectedRoute adminOnly>
                      <ManageLessons />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "admin/reported-lessons",
                  element: (
                    <ProtectedRoute adminOnly>
                      <ReportedLessons />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
          ],
        },

        // FALLBACK/404
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
