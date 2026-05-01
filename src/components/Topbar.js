import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import Avatar from "../assets/images/man.png";
import { useNavigate } from "react-router-dom";
const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/students": "Students",
  "/admin/instructors": "Instructors",
  "/admin/teaching-assistants": "Teaching Assistants",
  "/admin/courses": "Courses",
  "/admin/course-offerings": "Course Offerings",
  "/admin/chatbot": "ChatBot",
  "/admin/uploadcenter": "Upload Center",
  "/admin/account": "My Account",
};
const Topbar = ({ user }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";
  const navigate = useNavigate();

  return (
    <div className="h-14 bg-gray-100 flex items-center justify-between px-6 border-b border-gray-100">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Home</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:shadow-md transition-shadow">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-xl transition-colors">
          <img
            src={user?.avatar || Avatar}
            onClick={() => navigate("/admin/account")}
            className="w-8 h-8 rounded-full object-cover cursor-pointer"
            alt="user"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
