import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";
import { FaBell, FaCheck } from "react-icons/fa";

const InstructorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await instructorApi.getNotifications();
        setNotifications(response.data);
      } catch (err) { console.error("Failed to fetch:", err); }
      finally { setLoading(false); }
    };
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await instructorApi.markNotificationRead(id, { is_read: true });
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error("Failed to mark read:", err); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-400">Stay updated</p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{unreadCount} unread</span>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-4 ${!n.is_read ? 'border-l-4 border-l-blue-500' : ''}`}>
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaBell className="text-gray-400" size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium ${n.is_read ? 'text-gray-600' : 'text-gray-800'}`}>{n.title}</h3>
                <span className="text-xs text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{n.message}</p>
            </div>
            {!n.is_read && <button onClick={() => handleMarkRead(n.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><FaCheck size={16} /></button>}
          </div>
        ))}
        {notifications.length === 0 && <p className="text-gray-400 text-center py-8">No notifications</p>}
      </div>
    </div>
  );
};

export default InstructorNotifications;