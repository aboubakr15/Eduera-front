import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import { FaBook, FaUsers, FaClipboardList, FaFileAlt } from "react-icons/fa";

const StatCard = ({ icon, label, value, color, bgColor }) => (
  <div className="bg-white rounded-2xl p-3 sm:p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 w-full">
    <div className="flex-1 overflow-hidden">
      <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-1 break-words">{label}</p>
      <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight break-all">{value}</p>
    </div>
    <div className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 ml-2 ${bgColor} ${color} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
  </div>
);

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await instructorApi.getDashboard();
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const { total_courses, total_students, pending_submissions, upcoming_assignments, recent_announcements, courses } = data || {};

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen">
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-400">Overview of your courses and students</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FaBook size={14} />}
            label="Total Courses"
            value={total_courses || 0}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<FaUsers size={14} />}
            label="Total Students"
            value={total_students || 0}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={<FaClipboardList size={14} />}
            label="Pending Submissions"
            value={pending_submissions || 0}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
          <StatCard
            icon={<FaFileAlt size={14} />}
            label="Upcoming Assignments"
            value={upcoming_assignments || 0}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">My Courses</h2>
              <Link to="/instructor/courses" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {courses?.length > 0 ? (
                courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{course.course_name}</p>
                      <p className="text-xs text-gray-400">{course.course_code} • {course.semester} {course.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">{course.enrolled_count}/{course.capacity}</p>
                      <p className="text-xs text-gray-400">students</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No courses assigned</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Recent Announcements</h2>
              <Link to="/instructor/announcements" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {recent_announcements?.length > 0 ? (
                recent_announcements.slice(0, 4).map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">{announcement.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{announcement.course_name}</p>
                    <p className="text-xs text-gray-400">{new Date(announcement.created_at).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No announcements</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
};

export default InstructorDashboard;