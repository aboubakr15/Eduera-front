import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const Topbar = ({ user, role = "instructor" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const segments = location.pathname.split("/").filter(Boolean);
  const basePath = segments.length > 0 ? `/${segments[0]}` : "";

  let title = "Dashboard";
  if (basePath === "/dashboard") {
    title = "Dashboard";
  } else if (segments.length > 1) {
    const lastSegment = segments[segments.length - 1];
    title = lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!authUser) return;
    
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const { authApi } = await import("../api/authApi");
        const res = await authApi.getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();

    // Fetch profile
    const fetchProfile = async () => {
      try {
        if (role === "student") {
          const { studentApi } = await import("../api/studentApi");
          const res = await studentApi.getProfile();
          setProfile(res.data);
        } else if (role === "admin") {
          const { adminApi } = await import("../api/adminApi");
          const res = await adminApi.getProfile();
          setProfile(res.data);
        } else {
          const { instructorApi } = await import("../api/instructorApi");
          const res = await instructorApi.getProfile();
          setProfile(res.data);
        }
      } catch (e) {
        console.error("Failed to fetch profile in Topbar:", e);
      }
    };
    fetchProfile();
  }, [role, authUser]);

  const userName = profile?.full_name || authUser?.name || authUser?.email?.split("@")[0] || "User";
  const userAvatar = profile?.profile_picture_url || authUser?.avatar || null;
  const userRole =
    role === "student"
      ? "Student"
      : role === "admin"
        ? "Admin"
        : user?.primary_role || user?.role || "Instructor";

  return (
    <div className="h-14 bg-gray-100 flex items-center justify-between px-6 border-b border-gray-100">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Home</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-gray-800">{title}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:shadow-md transition-shadow"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifDropdown(false)}
              />
              <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50">
                <div className="px-2 py-1.5 border-b border-gray-100 mb-1.5 flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-gray-500">
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-[#D67A1E] bg-[#D67A1E]/[0.08] px-1.5 py-0.5 rounded-md">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notif.isRead ? "bg-[#D67A1E]/[0.02]" : ""
                      }`}
                      onClick={() => {
                        setShowNotifDropdown(false);
                        navigate(`${basePath}/notifications`);
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              notif.isRead ? "bg-gray-300" : "bg-[#D67A1E]"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs leading-tight ${
                              notif.isRead
                                ? "text-gray-400"
                                : "text-gray-800 font-medium"
                            }`}
                          >
                            {notif.text}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-2 py-1.5 border-t border-gray-100 mt-1.5">
                  <button
                    onClick={() => {
                      navigate(`${basePath}/notifications`);
                      setShowNotifDropdown(false);
                    }}
                    className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg py-1.5 transition-colors"
                  >
                    Show All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-xl transition-colors"
          onClick={() => {
            if (basePath === "/student") {
              navigate("/student/profile");
            } else {
              navigate(`${basePath}/account`);
            }
          }}
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              alt="user"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 overflow-hidden">
              <span className="text-sm font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
