import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdTableChart,
  MdHelp,
  MdSettings,
  MdAccountCircle,
  MdMenu,
  MdClose,
  MdAdminPanelSettings,
} from "react-icons/md";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
  FaSchool,
  FaChevronDown,
  FaRobot,
  FaSignOutAlt,
  FaUserTie,
  FaUserSecret,
} from "react-icons/fa";

const getRoleIcon = (role) => {
  switch (role) {
    case 'ADMIN':
      return <FaUserSecret size={20} className="text-purple-600" />;
    case 'PROFESSOR':
      return <FaUserTie size={20} className="text-blue-600" />;
    case 'TA':
      return <FaChalkboardTeacher size={20} className="text-green-600" />;
    default:
      return <MdAdminPanelSettings size={20} className="text-gray-600" />;
  }
};

const mainNavItems = [
  { label: "Dashboard", icon: <MdDashboard size={20} /> },
  { label: "Students", icon: <FaUserGraduate size={18} /> },
  { label: "Instructors", icon: <FaChalkboardTeacher size={18} /> },
  { label: "Teaching Assistants", icon: <FaChalkboardTeacher size={18} /> },
  { label: "Departments", icon: <FaBuilding size={18} /> },
  { label: "Courses", icon: <FaSchool size={18} /> },
  { label: "Course Offerings", icon: <FaSchool size={18} /> },
  { label: "ChatBot", icon: <FaRobot size={20} /> },
  { label: "UploadCenter", icon: <FaRobot size={20} /> },
];

const bottomNavItems = [
  {
    label: "Account",
    icon: <MdAccountCircle size={20} />,
    path: "/admin/account",
  },
  { label: "Help", icon: <MdHelp size={20} />, path: "/admin/help" },
  {
    label: "Settings",
    icon: <MdSettings size={20} />,
    path: "/admin/settings",
  },
];

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  return (
    <div
      className={`relative h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-300 ease-in-out ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        {isOpen ? (
          <MdClose size={14} className="text-gray-500" />
        ) : (
          <MdMenu size={14} className="text-gray-500" />
        )}
      </button>

      <div
        className={`flex items-center px-4 py-4 overflow-hidden transition-all duration-300 ${!isOpen ? "justify-center" : ""}`}
      >
        <div
          className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "w-12 h-12" : "w-12 h-12"}`}
        >
          <img
            src="/logo.png"
            alt="EDUera"
            className="w-full h-full object-contain cursor-pointer"
          />
        </div>
        {isOpen && (
          <span className="text-2xl font-bold text-gray-700 tracking-tight whitespace-nowrap ml-1">
            EDUera
          </span>
        )}
      </div>

      <div className="mx-2 mb-4 relative">
        <div
          onClick={() => isOpen && setProfileOpen(!profileOpen)}
          className={`flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-2.5 cursor-pointer hover:bg-gray-100 transition-colors ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            {getRoleIcon(user?.primary_role)}
          </div>
          {isOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.email?.split('@')[0] || 'Admin'}
                </p>
                <p className="text-xs text-gray-400">{user?.primary_role || 'Admin'}</p>
              </div>
              <FaChevronDown
                size={12}
                className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </div>

        {isOpen && profileOpen && (
          <div className="mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-gray-700 truncate">
                {user?.email || 'admin@admin.com'}
              </p>
            </div>
            <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <MdAccountCircle size={16} className="text-gray-400" />
              My Profile
            </button>
            <button
              onClick={() => {
                setProfileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <MdSettings size={16} className="text-gray-400" />
              Settings
            </button>

            <div className="border-t border-gray-50" />
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={`/admin/${item.label.toLowerCase().replace(" ", "-")}`}
            title={!isOpen ? item.label : ""}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
        ${!isOpen ? "justify-center" : ""}
        ${
          isActive
            ? "bg-blue-50 text-[#D67A1E]"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex-shrink-0 ${
                    isActive ? "text-[#D67A1E]" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>

                {isOpen && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-4 my-1 border-t border-gray-100" />

      <nav className="px-2 pb-6 space-y-0.5">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            title={!isOpen ? item.label : ""}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
    ${!isOpen ? "justify-center" : ""}
    ${
      isActive
        ? "bg-blue-50 text-[#D67A1E]"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
    }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex-shrink-0 ${
                    isActive ? "text-[#D67A1E]" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>

                {isOpen && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
