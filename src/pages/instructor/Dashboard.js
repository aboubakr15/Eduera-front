import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import {
  FaBook,
  FaUsers,
  FaClipboardList,
  FaFileAlt,
  FaBullhorn,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Img from "../../assets/images/instructor.png";
import Avatar from "../../assets/images/man.png";
import { useNavigate } from "react-router-dom";

function StatCard({ label, value, color, bg, onClick }) {
  return (
    <div className="bg-white rounded-2xl p-3 sm:p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 w-full border-l-4 border-l-[#5362a3]">
      <div className="flex-1 overflow-hidden">
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-1 break-words">
          {label}
        </p>
        <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight break-all">
          {value}
        </p>
      </div>
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 ${bg} ${color} rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform`}
        onClick={onClick}
      >
        <FaArrowRight size={14} />
      </div>
    </div>
  );
}

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const userName = user?.name || user?.email?.split("@")[0] || "Instructor";

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
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

  const {
    total_courses,
    total_students,
    pending_submissions,
    upcoming_assignments,
    recent_announcements,
    portal_announcements,
    courses,
  } = data || {};

  const statsCards = [
    {
      label: "Total Courses",
      value: total_courses || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/instructor/courses",
    },
    {
      label: "Total Students",
      value: total_students || 0,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      path: "/instructor/students",
    },
    {
      label: "Pending Submissions",
      value: pending_submissions || 0,
      color: "text-amber-600",
      bg: "bg-amber-50",
      path: "/instructor/submissions",
    },
    {
      label: "Upcoming Assignments",
      value: upcoming_assignments || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/instructor/assignments",
    },
  ];

  return (
    <>
      <style>{`
        .portal-scroll::-webkit-scrollbar { width: 4px; }
        .portal-scroll::-webkit-scrollbar-track { background: transparent; }
        .portal-scroll::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 99px; }
        .portal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }
      `}</style>

      <div className="flex-1 flex overflow-hidden min-h-screen">
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-400">
                Overview of your courses and students
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-bl from-blue-200/50 to-transparent rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full"></div>
            <div className="absolute top-4 right-12 w-2 h-2 bg-blue-400/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400/30 rounded-full"></div>
            <div className="absolute bottom-6 left-12 w-2.5 h-2.5 bg-indigo-400/20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-transparent"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-semibold text-gray-800">
                Welcome, Dr. {userName}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Manage your courses, monitor students progress and engage with
                your learners
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                color={card.color}
                bg={card.bg}
                onClick={() => navigate(card.path)}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">My Courses</h2>
              <Link
                to="/instructor/courses"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
              {courses?.length > 0 ? (
                courses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {course.course_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {course.course_code} • {course.semester} {course.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {course.enrolled_count}/{course.capacity}
                      </p>
                      <p className="text-xs text-gray-400">Enrolled Students</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No courses assigned</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">
                Announcements
              </h2>
              <Link
                to="/instructor/announcements"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recent_announcements?.length > 0 ? (
                recent_announcements.slice(0, 3).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 bg-gray-50 rounded-xl flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaBullhorn size={12} className="text-[#D67A1E]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {announcement.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {announcement.course_name} •{" "}
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No announcements</p>
              )}
            </div>
          </div>

          {/* Portal Announcements Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-gray-800">
                Portal Announcements
              </h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Important updates from the administration
            </p>

            <div className="max-h-[260px] overflow-y-auto space-y-3 portal-scroll">
              {portal_announcements?.length > 0 ? (
                portal_announcements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-gray-50 rounded-xl flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaBullhorn size={12} className="text-[#D67A1E]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{ann.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{ann.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {ann.author_name} • {ann.time_since} ago
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No portal announcements</p>
              )}
            </div>
          </div>

          <div className="flex-1" />
        </div>

        <div className="hidden lg:flex w-80 flex-col gap-4 p-4 overflow-y-auto border-l border-gray-100 bg-white">
          <div className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <img
                src={user?.avatar || Avatar}
                className="w-20 h-20 rounded-full object-cover cursor-pointer"
                alt="user"
              />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              Dr. {userName}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Instructor</p>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {total_students || 0}
                </p>
                <p className="text-sm text-gray-400">Students</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {total_courses || 0}
                </p>
                <p className="text-sm text-gray-400">Courses</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {pending_submissions || 0}
                </p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-purple-300/20 to-blue-300/20 rounded-full blur-3xl"></div>
            <div className="absolute top-8 right-16 w-12 h-12 border-2 border-orange-300/30 rounded-lg rotate-12"></div>
            <div className="absolute bottom-12 left-12 w-8 h-8 border-2 border-pink-300/40 rounded-full"></div>

            <svg
              className="absolute top-0 left-0 w-full h-full opacity-10"
              viewBox="0 0 400 400"
            >
              <path
                d="M 0,100 Q 100,50 200,100 T 400,100"
                stroke="#ff6b6b"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 0,200 Q 100,150 200,200 T 400,200"
                stroke="#a855f7"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <div className="mb-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-300/20 rounded-full blur-2xl scale-110"></div>
                <img
                  src={Img}
                  alt="Instructor illustration"
                  className="w-32 h-32 object-contain drop-shadow-xl relative z-10"
                />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-3">
                Ready to inspire others?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                Empower students by building engaging and creative lessons
              </p>
            </div>

            <Link
              to="/instructor/courses"
              className="relative z-10 mt-6 px-8 py-2 rounded-xl bg-[#282f4f] text-white font-normal transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              View Courses
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default InstructorDashboard;
