import { useState, useEffect } from "react";
import { authApi } from "../../api/authApi";
import { Bell } from "lucide-react";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await authApi.getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-500 text-sm">
              View your recent system notifications and updates.
            </p>
          </div>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border ${
                  !n.isRead ? "border-[#D67A1E]/30 bg-orange-50/20" : "border-gray-100"
                } transition-all duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    !n.isRead ? "bg-orange-100 text-[#D67A1E]" : "bg-gray-100 text-gray-500"
                  }`}>
                    <Bell size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="text-base font-medium text-gray-900 leading-tight">
                        {n.title}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(n.time).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {n.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Bell size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-500 max-w-sm">
              You don't have any notifications right now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
