import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/public/HomePage";
import PublicLessons from "../pages/public/PublicLessons";
import LessonDetailsPage from "../pages/public/LessonDetailsPage";
import PricingPage from "../pages/public/PricingPage";
import DashboardHome from "../pages/dashboard/user/DashboardHome";
import AddLesson from "../pages/dashboard/user/AddLesson";
import MyLessons from "../pages/dashboard/user/MyLessons";
import UpdateLesson from "../pages/dashboard/user/UpdateLesson";
import MyFavorites from "../pages/dashboard/user/MyFavorites";
import Profile from "../pages/dashboard/user/Profile";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import ManageUsers from "../pages/dashboard/admin/ManageUsers";
import ManageLessons from "../pages/dashboard/admin/ManageLessons";
import ReportedLessons from "../pages/dashboard/admin/ReportedLessons";
import AdminProfile from "../pages/dashboard/admin/AdminProfile";
import SuccessPage from "../pages/payment/SuccessPage";
import CancelPage from "../pages/payment/CancelPage";
import NotFound from "../pages/shared/NotFound";
import LoadingPage from "../pages/shared/LoadingPage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "public-lessons", element: <PublicLessons /> },
      { path: "lessons/:id", element: <LessonDetailsPage /> },
      {
        path: "pricing",
        element: (
          <PrivateRoute>
            <PricingPage />
          </PrivateRoute>
        ),
      },
      { path: "payment/success", element: <SuccessPage /> },
      { path: "payment/cancel", element: <CancelPage /> },
      { path: "loading", element: <LoadingPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "add-lesson", element: <AddLesson /> },
      { path: "my-lessons", element: <MyLessons /> },
      { path: "update-lesson/:id", element: <UpdateLesson /> },
      { path: "my-favorites", element: <MyFavorites /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  {
    path: "/dashboard/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "manage-lessons", element: <ManageLessons /> },
      { path: "reported-lessons", element: <ReportedLessons /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
]);

export default router;
