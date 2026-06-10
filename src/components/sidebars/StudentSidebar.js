import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdSchool,
  MdAssignment,
  MdGrade,
  MdCheckCircle,
  MdPerson,
  MdChat,
  MdNotifications,
  MdMenu,
  MdClose,
  MdAccountCircle,
} from "react-icons/md";
import {
  FaBook,
  FaClipboardList,
  FaRobot,
  FaSignOutAlt,
  FaUserGraduate,
  FaChevronDown,
  FaBullhorn,
} from "react-icons/fa";

const getRoleIcon = (role) => {
  switch (role) {
    case "STUDENT":
      return <FaUserGraduate size={20} className="text-green-400" />;
    case "PROFESSOR":
      return <FaBook size={20} className="text-blue-400" />;
    case "TA":
      return <MdSchool size={20} className="text-amber-400" />;
    default:
      return <FaUserGraduate size={20} className="text-gray-400" />;
  }
};

const overviewItems = [
  {
    label: "Dashboard",
    icon: <MdDashboard size={20} />,
    path: "/student/dashboard",
  },
];

const academicItems = [
  { label: "My Courses", icon: <FaBook size={18} />, path: "/student/courses" },
  {
    label: "Enrollments",
    icon: <MdAssignment size={18} />,
    path: "/student/enrollments",
  },
  {
    label: "Assignments",
    icon: <FaClipboardList size={18} />,
    path: "/student/assignments",
  },
  { label: "Grades", icon: <MdGrade size={18} />, path: "/student/grades" },
  { label: "To-Do", icon: <MdCheckCircle size={18} />, path: "/student/todo" },
  { label: "ChatBot", icon: <FaRobot size={18} />, path: "/student/chatbot" },
];

const communicationItems = [
  { label: "Announcements", icon: <FaBullhorn size={18} />, path: "/student/announcements" },
  { label: "Chat", icon: <MdChat size={20} />, path: "/student/chat" },
  // {
  //   label: "Notifications",
  //   icon: <MdNotifications size={20} />,
  //   path: "/student/notifications",
  // },
];

const bottomNavItems = [
  { label: "Profile", icon: <MdPerson size={20} />, path: "/student/profile" },
];

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div
      className={`relative h-screen bg-[#1B2036] flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-[#1B2036] border border-gray-600 rounded-full flex items-center justify-center shadow-sm hover:bg-[#252b45] transition-colors"
      >
        {isOpen ? (
          <MdClose size={14} className="text-gray-300" />
        ) : (
          <MdMenu size={14} className="text-gray-300" />
        )}
      </button>

      <div
        className={`flex items-center px-4 py-4 overflow-hidden transition-all duration-300 ${
          !isOpen ? "justify-center" : ""
        }`}
      >
        <img
          src="/logo.png"
          alt="EDUera"
          className="w-7 h-7 object-contain cursor-pointer flex-shrink-0"
        />
        {isOpen && (
          <span className="text-2xl font-serif font-bold text-gray-100 tracking-tight whitespace-nowrap ml-3">
            EDUera
          </span>
        )}
      </div>

      <div className="mx-2 mb-4 relative">
        <div
          onClick={() => isOpen && setProfileOpen(!profileOpen)}
          className={`flex items-center gap-3 bg-white/10 rounded-xl px-2 py-2.5 cursor-pointer hover:bg-white/15 transition-colors ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            {getRoleIcon(user?.primary_role)}
          </div>
          {isOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.email?.split("@")[0] || "Student"}
                </p>
                <p className="text-xs text-gray-400">
                  {user?.primary_role
                    ? user.primary_role.charAt(0).toUpperCase() +
                      user.primary_role.slice(1).toLowerCase()
                    : "Student"}
                </p>
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
          <div className="mt-1 bg-[#252b45] border border-white/10 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {user?.email || "student@edu.com"}
              </p>
            </div>
            <button
              onClick={() => navigate("/student/profile")}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors"
            >
              <MdAccountCircle size={16} className="text-gray-400" />
              My Profile
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 overflow-y-auto">
        {isOpen && (
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mb-1">
            Overview
          </p>
        )}
        <div className="space-y-0.5">
          {overviewItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  !isOpen ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white/15 text-[#D67A1E]"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
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
        </div>

        {isOpen && (
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mt-4 mb-1">
            Academics
          </p>
        )}
        <div className="space-y-0.5">
          {academicItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  !isOpen ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white/15 text-[#D67A1E]"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
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
        </div>

        {isOpen && (
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-3 mt-4 mb-1">
            Communication
          </p>
        )}
        <div className="space-y-0.5">
          {communicationItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              title={!isOpen ? item.label : ""}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  !isOpen ? "justify-center" : ""
                } ${
                  isActive
                    ? "bg-white/15 text-[#D67A1E]"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
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
        </div>
      </nav>

      <div className="mx-4 my-1 border-t border-white/10" />

      <nav className="px-2 pb-6 space-y-0.5">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            title={!isOpen ? item.label : ""}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                !isOpen ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-white/15 text-[#D67A1E]"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
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
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-gray-400 hover:bg-white/10 hover:text-white ${
            !isOpen ? "justify-center" : ""
          }`}
          title={!isOpen ? "Sign Out" : ""}
        >
          <FaSignOutAlt size={18} className="flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </nav>
    </div>
  );
};

export default StudentSidebar;
