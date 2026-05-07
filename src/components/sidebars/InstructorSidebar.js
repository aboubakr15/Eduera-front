import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdAccountCircle,
  MdMenu,
  MdClose,
  MdAssignment,
  MdPeople,
  MdAnnouncement,
  MdChat,
} from "react-icons/md";
import {
  FaBook,
  FaClipboardList,
  FaFileUpload,
  FaSignOutAlt,
  FaUserTie,
  FaRobot,
  FaChalkboardTeacher,
  FaChevronDown,
} from "react-icons/fa";
import Avatar from "../../assets/images/man.png";
import { useNavigate } from "react-router-dom";

const getRoleIcon = (role) => {
  switch (role) {
    case "PROFESSOR":
      return (
        <img
          src={Avatar}
          className="w-8 h-8 rounded-full object-cover"
          alt="admin"
        />
      );
    case "TA":
      return <FaChalkboardTeacher size={20} className="text-green-400" />;
    default:
      return (
        <img
          src={Avatar}
          className="w-8 h-8 rounded-full object-cover"
          alt="instructor"
        />
      );
  }
};

const overviewItems = [{ label: "Dashboard", icon: <MdDashboard size={20} /> }];

const managementItems = [
  { label: "Courses", icon: <FaBook size={18} /> },
  { label: "Materials", icon: <FaFileUpload size={18} /> },
  { label: "Assignments", icon: <FaClipboardList size={18} /> },
  { label: "Submissions", icon: <MdAssignment size={18} /> },
  { label: "Students", icon: <MdPeople size={18} /> },
  { label: "Announcements", icon: <MdAnnouncement size={18} /> },
  { label: "Chat", icon: <MdChat size={20} /> },
  { label: "ChatBot", icon: <FaRobot size={18} /> },
  { label: "UploadCenter", icon: <FaRobot size={18} /> },
];

const bottomNavItems = [
  {
    label: "Account",
    icon: <MdAccountCircle size={20} />,
    path: "/instructor/account",
  },
];

const InstructorSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const roleLabel =
    user?.primary_role === "PROFESSOR" ? "Professor" : "Teaching Assistant";

  return (
    <div
      className={`relative h-screen bg-[#1B2036] flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "w-60" : "w-16"}`}
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
        className={`flex items-center px-4 py-4 overflow-hidden transition-all duration-300 ${!isOpen ? "justify-center" : ""}`}
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
          className={`flex items-center gap-3 bg-white/10 rounded-xl px-2 py-2.5 cursor-pointer hover:bg-white/15 transition-colors ${!isOpen ? "justify-center" : ""}`}
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            {getRoleIcon(user?.primary_role)}
          </div>
          {isOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.email?.split("@")[0] || "Instructor"}
                </p>
                <p className="text-xs text-gray-400">{roleLabel}</p>
              </div>
              <FaChevronDown
                size={12}
                className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </div>

        {isOpen && profileOpen && (
          <div className="mt-1 bg-[#252b45] border border-white/10 rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-semibold text-white truncate">
                {user?.email || "instructor@edu.com"}
              </p>
            </div>
            <button
              onClick={() => navigate("/instructor/account")}
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
              to={`/instructor/${item.label.toLowerCase()}`}
              title={!isOpen ? item.label : ""}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${!isOpen ? "justify-center" : ""}
                ${isActive ? "bg-white/15 text-[#D67A1E]" : "text-gray-400 hover:bg-white/10 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex-shrink-0 ${isActive ? "text-[#D67A1E]" : "text-gray-400"}`}
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
            Management
          </p>
        )}
        <div className="space-y-0.5">
          {managementItems.map((item) => (
            <NavLink
              key={item.label}
              to={`/instructor/${item.label.toLowerCase()}`}
              title={!isOpen ? item.label : ""}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${!isOpen ? "justify-center" : ""}
                ${isActive ? "bg-white/15 text-[#D67A1E]" : "text-gray-400 hover:bg-white/10 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex-shrink-0 ${isActive ? "text-[#D67A1E]" : "text-gray-400"}`}
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
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${!isOpen ? "justify-center" : ""}
              ${isActive ? "bg-white/15 text-[#D67A1E]" : "text-gray-400 hover:bg-white/10 hover:text-white"}`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex-shrink-0 ${isActive ? "text-[#D67A1E]" : "text-gray-400"}`}
                >
                  {item.icon}
                </span>
                {isOpen && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={async () => {
            await logoutUser();
            navigate("/login");
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-gray-400 hover:bg-white/10 hover:text-white ${!isOpen ? "justify-center" : ""}`}
          title={!isOpen ? "Sign Out" : ""}
        >
          <FaSignOutAlt size={18} className="flex-shrink-0" />
          {isOpen && <span>Sign Out</span>}
        </button>
      </nav>
    </div>
  );
};

export default InstructorSidebar;
