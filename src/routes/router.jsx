import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";

import Dashboard from "../pages/admin/Dashboard";
import Students from "../pages/admin/Students";
import Courses from "../pages/admin/Courses";
import CourseOfferings from "../pages/admin/CourseOfferings";
import Departments from "../pages/admin/Departments";
import Instructors from "../pages/admin/Instructors";
import ChatBot from "../pages/admin/ChatBot";
import Account from "../pages/admin/Account";
import Settings from "../pages/admin/Settings";
import TA from "../pages/admin/TA";
import UploadCenter from "../pages/admin/UploadCenter";

import StudentDashboard from "../pages/student/Dashboard";
import StudentCourses from "../pages/student/Courses";
import StudentCourseDetails from "../pages/student/CourseDetails";
import StudentEnrollments from "../pages/student/Enrollments";
import StudentAssignments from "../pages/student/Assignments";
import StudentGrades from "../pages/student/Grades";
import StudentTodo from "../pages/student/Todo";
import StudentProfile from "../pages/student/Profile";
import StudentChat from "../pages/student/Chat";
import StudentNotifications from "../pages/student/Notifications";
import StudentChatBot from "../pages/student/ChatBot";

import InstructorDashboard from "../pages/instructor/Dashboard";
import InstructorCourses from "../pages/instructor/Courses";
import InstructorMaterials from "../pages/instructor/Materials";
import InstructorAssignments from "../pages/instructor/Assignments";
import InstructorSubmissions from "../pages/instructor/Submissions";
import InstructorStudents from "../pages/instructor/Students";
import InstructorAnnouncements from "../pages/instructor/Announcements";
import InstructorChat from "../pages/instructor/Chat";
import InstructorNotifications from "../pages/instructor/Notifications";
import InstructorAccount from "../pages/instructor/Account";
import InstructorChatBot from "../pages/instructor/ChatBot";
import InstructorUploadCenter from "../pages/instructor/UploadCenter";

import InstructorCourseDetails from "../pages/instructor/CourseDetails";

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
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "students", element: <Students /> },
          { path: "courses", element: <Courses /> },
          { path: "course-offerings", element: <CourseOfferings /> },
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

  {
    path: "/student",
    element: <ProtectedRoute allowedRoles={["STUDENT"]} />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: "dashboard", element: <StudentDashboard /> },
          { path: "courses", element: <StudentCourses /> },
          { path: "courses/:id", element: <StudentCourseDetails /> },
          { path: "enrollments", element: <StudentEnrollments /> },
          { path: "assignments", element: <StudentAssignments /> },
          { path: "grades", element: <StudentGrades /> },
          { path: "todo", element: <StudentTodo /> },
          { path: "profile", element: <StudentProfile /> },
          { path: "chat", element: <StudentChat /> },
          { path: "notifications", element: <StudentNotifications /> },
          { path: "chatbot", element: <StudentChatBot /> },
        ],
      },
    ],
  },

  {
    path: "/instructor",
    element: <ProtectedRoute allowedRoles={["PROFESSOR"]} />,
    children: [
      {
        element: <InstructorLayout />,
        children: [
          { path: "dashboard", element: <InstructorDashboard /> },
          { path: "courses", element: <InstructorCourses /> },
          { path: "courses/:id", element: <InstructorCourseDetails /> },
          { path: "materials", element: <InstructorMaterials /> },
          { path: "assignments", element: <InstructorAssignments /> },
          { path: "submissions", element: <InstructorSubmissions /> },
          { path: "students", element: <InstructorStudents /> },
          { path: "announcements", element: <InstructorAnnouncements /> },
          { path: "chat", element: <InstructorChat /> },
          { path: "notifications", element: <InstructorNotifications /> },
          { path: "account", element: <InstructorAccount /> },
          { path: "chatbot", element: <InstructorChatBot /> },
          { path: "uploadcenter", element: <InstructorUploadCenter /> },
        ],
      },
    ],
  },

  {
    path: "/ta",
    element: <ProtectedRoute allowedRoles={["TA"]} />,
    children: [
      {
        element: <InstructorLayout />,
        children: [
          { path: "dashboard", element: <InstructorDashboard /> },
          { path: "courses", element: <InstructorCourses /> },
          { path: "courses/:id", element: <InstructorCourseDetails /> },
          { path: "materials", element: <InstructorMaterials /> },
          { path: "assignments", element: <InstructorAssignments /> },
          { path: "submissions", element: <InstructorSubmissions /> },
          { path: "students", element: <InstructorStudents /> },
          { path: "announcements", element: <InstructorAnnouncements /> },
          { path: "chat", element: <InstructorChat /> },
          { path: "notifications", element: <InstructorNotifications /> },
        ],
      },
    ],
  },
]);
