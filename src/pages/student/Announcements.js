import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { FaBullhorn } from "react-icons/fa";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch announcements logic here. Assuming the backend has an endpoint for student announcements
        // or we get it via a generic endpoint. If studentApi doesn't have it, we'll need to add it or use axios.
        // For now, if there's no specific endpoint, we'll just show an empty list or try to fetch.
        // I will add a method getAnnouncements to studentApi if it doesn't exist.
        const res = await studentApi.getAnnouncements();
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-500 text-sm">
            Stay updated with the latest news from your courses.
          </p>
        </div>

        {/* Announcements List */}
        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaBullhorn size={16} className="text-[#D67A1E]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {a.title}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-md">
                        {new Date(a.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                      {a.content}
                    </p>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                        {a.course_name || "Course Announcement"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <FaBullhorn size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Announcements Yet
            </h3>
            <p className="text-gray-500 max-w-sm">
              You're all caught up! When instructors post new announcements, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
