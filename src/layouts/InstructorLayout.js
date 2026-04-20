import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdSchool,
  MdAssignment,
  MdPeople,
  MdAnnouncement,
  MdChat,
  MdNotifications,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { FaBook, FaClipboardList, FaFileUpload, FaSignOutAlt, FaUserTie, FaChalkboardTeacher } from "react-icons/fa";

const getRoleIcon = (role) => {
  switch (role) {
    case 'PROFESSOR':
      return <FaUserTie size={20} className="text-blue-600" />;
    case 'TA':
      return <FaChalkboardTeacher size={20} className="text-green-600" />;
    default:
      return <FaUserTie size={20} className="text-gray-600" />;
  }
};

const mainNavItems = [
  { label: "Dashboard", icon: <MdDashboard size={20} />, path: "/instructor/dashboard" },
  { label: "Courses", icon: <FaBook size={18} />, path: "/instructor/courses" },
  { label: "Materials", icon: <FaFileUpload size={18} />, path: "/instructor/materials" },
  { label: "Assignments", icon: <FaClipboardList size={18} />, path: "/instructor/assignments" },
  { label: "Submissions", icon: <MdAssignment size={18} />, path: "/instructor/submissions" },
  { label: "Students", icon: <MdPeople size={18} />, path: "/instructor/students" },
  { label: "Announcements", icon: <MdAnnouncement size={18} />, path: "/instructor/announcements" },
  { label: "Chat", icon: <MdChat size={20} />, path: "/instructor/chat" },
  { label: "Notifications", icon: <MdNotifications size={20} />, path: "/instructor/notifications" },
];

const InstructorLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, userRole, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const roleLabel = userRole === 'PROFESSOR' ? 'Professor' : 'Teaching Assistant';

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`relative h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-300 ease-in-out ${isOpen ? "w-60" : "w-16"}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isOpen ? <MdClose size={14} className="text-gray-500" /> : <MdMenu size={14} className="text-gray-500" />}
        </button>

        <div className={`flex items-center px-4 py-4 overflow-hidden transition-all duration-300 ${!isOpen ? "justify-center" : ""}`}>
          <div className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "w-12 h-12" : "w-12 h-12"}`}>
            <img src="/logo.png" alt="EDUera" className="w-full h-full object-contain cursor-pointer" />
          </div>
          {isOpen && <span className="text-2xl font-bold text-gray-700 tracking-tight whitespace-nowrap ml-1">EDUera</span>}
        </div>

        <div className="mx-2 mb-4">
          <div className={`flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-2.5 ${!isOpen ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {getRoleIcon(user?.primary_role)}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{user?.email?.split('@')[0] || 'Instructor'}</p>
                <p className="text-xs text-gray-400">{roleLabel}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${!isOpen ? "justify-center" : ""} ${isActive ? "bg-blue-50 text-[#D67A1E]" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
            >
              {({ isActive }) => (
                <>
                  <span className={`flex-shrink-0 ${isActive ? "text-[#D67A1E]" : "text-gray-400"}`}>{item.icon}</span>
                  {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-4 my-1 border-t border-gray-100" />

        <nav className="px-2 pb-6">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-gray-500 hover:bg-red-50 hover:text-red-500 ${!isOpen ? "justify-center" : ""}`}
          >
            <FaSignOutAlt size={18} className="text-gray-400" />
            {isOpen && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout;