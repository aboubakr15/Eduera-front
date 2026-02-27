import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";

import Dashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import Courses from "../pages/admin/Courses";
import Departments from "../pages/admin/Departments";
import Instructors from "../pages/admin/Instructors";
import ChatBot from "../pages/admin/ChatBot";
import Account from "../pages/admin/Account";
import Settings from "../pages/admin/Settings";
import TA from "../pages/admin/TA";
import UploadCenter from "../pages/admin/UploadCenter";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
    ],
  },

  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "students", element: <Students /> },
          { path: "courses", element: <Courses /> },
          { path: "departments", element: <Departments /> },
          { path: "teaching-assistants", element: <TA /> },
          { path: "instructors", element: <Instructors /> },
          { path: "uploadCenter", element: <UploadCenter /> },
          { path: "chatbot", element: <ChatBot /> },
          { path: "settings", element: <Settings /> },
          { path: "account", element: <Account /> },
        ],
      },
    ],
  },
]);
