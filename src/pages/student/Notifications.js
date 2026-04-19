import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { FaBell, FaCheck, FaBook, FaClipboardList, FaInfoCircle } from "react-icons/fa";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await studentApi.getNotifications();
        setNotifications(response.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await studentApi.markNotificationRead(id, { is_read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'ASSIGNMENT_DUE': return <FaClipboardList className="text-blue-500" />;
      case 'ANNOUNCEMENT': return <FaBook className="text-purple-500" />;
      default: return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-400">Stay updated with your courses</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {unreadCount} unread
        </span>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4 ${
              !notification.is_read ? "border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              {getIcon(notification.notification_type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${notification.is_read ? "text-gray-600" : "text-gray-800"}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-gray-400">
                  {new Date(notification.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
              <div className="flex items-center gap-2 mt-2">
                {notification.related_object_type && (
                  <span className="text-xs text-gray-400">
                    Related: {notification.related_object_type}
                  </span>
                )}
              </div>
            </div>
            {!notification.is_read && (
              <button
                onClick={() => handleMarkRead(notification.id)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <FaCheck size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <FaBell size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notifications</p>
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;