import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  FaBook,
  FaChartLine,
  FaGraduationCap,
  FaCheckCircle,
  FaBullhorn,
  FaArrowRight,
  FaFire,
  FaClock,
  FaLaptopCode,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../assets/images/man.png";
import { useNavigate } from "react-router-dom";

function StatCard({ label, value, color, bg, onClick }) {
  return (
    <div
      className="bg-white rounded-2xl p-3 sm:p-5 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 w-full border-l-4 border-l-[#5362a3] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 overflow-hidden">
        <p className="text-[11px] sm:text-xs text-gray-400 font-medium mb-1 break-words">
          {label}
        </p>
        <p className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-800 tracking-tight break-all">
          {value}
        </p>
      </div>
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 ${bg} ${color} rounded-xl flex items-center justify-center hover:scale-110 transition-transform`}
      >
        <FaArrowRight size={14} />
      </div>
    </div>
  );
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await studentApi.getDashboard();
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

  const userName = user?.name || user?.email?.split("@")[0] || "Student";

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
    profile,
    portal_announcements,
    course_announcements,
    courses_progress,
    completed_courses_count,
    in_progress_courses_count,
  } = data || {};

  const statsCards = [
    {
      label: "Enrolled Courses",
      value: in_progress_courses_count || 0,
      color: "text-blue-600",
      bg: "bg-blue-50",
      path: "/student/courses",
    },
    {
      label: "Current GPA",
      value: profile?.current_gpa || "0.00",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      path: "/student/grades",
    },
    {
      label: "Enrolled Hours",
      value: profile?.enrolled_hours || 0,
      color: "text-purple-600",
      bg: "bg-purple-50",
      path: "/student/profile",
    },
    {
      label: "Completed Courses",
      value: completed_courses_count || 0,
      color: "text-amber-600",
      bg: "bg-amber-50",
      path: "/student/courses",
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
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-400">
                Overview of your academic progress and courses
              </p>
            </div>
          </div>

          {/* Welcome Banner */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-bl from-blue-200/50 to-transparent rounded-full"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full"></div>
            <div className="absolute top-4 right-12 w-2 h-2 bg-blue-400/30 rounded-full"></div>
            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400/30 rounded-full"></div>
            <div className="absolute bottom-6 left-12 w-2.5 h-2.5 bg-indigo-400/20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-transparent"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-semibold text-gray-800">
                Welcome back, {profile?.full_name || userName}!
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Ready to learn something new today?
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800">
                  Profile Summary
                </h2>
                <Link
                  to="/student/profile"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Profile
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Student ID</span>
                  <span className="text-sm font-medium text-gray-800">
                    {profile?.student_id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Streak</span>
                  <span className="text-sm font-medium text-gray-800">
                    {profile?.current_streak || 0} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Enrolled Hours</span>
                  <span className="text-sm font-medium text-gray-800">
                    {profile?.enrolled_hours || 0}
                  </span>
                </div>
              </div>

              {profile?.daily_streak_mock && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Weekly Activity</p>
                  <div className="flex justify-between">
                    {Object.entries(profile.daily_streak_mock).map(
                      ([day, active]) => (
                        <div key={day} className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                          >
                            <span className="text-xs">{day.charAt(0)}</span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800">
                  Course Progress
                </h2>
                <Link
                  to="/student/courses"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {courses_progress?.length > 0 ? (
                  courses_progress.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {course.course_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {course.course_code}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No courses in progress
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Portal Announcements */}
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
                portal_announcements.slice(0, 5).map((announcement) => (
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
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Admin • {announcement.time_since}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No announcements</p>
              )}
            </div>
          </div>

          {/* Course Announcements */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">
                Course Announcements
              </h2>
              <Link
                to="/student/notifications"
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {course_announcements?.length > 0 ? (
                course_announcements.slice(0, 3).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 bg-gray-50 rounded-xl flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FaBullhorn size={12} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-800">
                          {announcement.title}
                        </p>
                        {announcement.is_TODO && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            To-Do
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {announcement.author_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {announcement.time_since}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No course announcements</p>
              )}
            </div>
          </div>

          <div className="flex-1" />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:flex w-80 flex-col gap-4 p-4 overflow-y-auto border-l border-gray-100 bg-white portal-scroll">
          {/* Profile Card */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <img
                src={user?.avatar || Avatar}
                className="w-20 h-20 rounded-full object-cover cursor-pointer"
                alt="user"
              />
            </div>
            <h3 className="text-base font-bold text-gray-800">
              {profile?.full_name || userName}
            </h3>

            <div className="mt-0.5">
              <p className="text-xs text-gray-400">Student</p>
              {profile?.student_id && (
                <p className="text-[11px] text-gray-400 font-mono">
                  ID: {profile.student_id}
                </p>
              )}
            </div>

            {(profile?.department_name ||
              profile?.department?.name ||
              profile?.academic_year) && (
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {profile?.department_name || profile?.department?.name || ""}
                {profile?.academic_year ? ` • ${profile.academic_year}` : ""}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200">
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaFire size={12} className="text-orange-500" />
                  <p className="text-lg font-bold text-gray-800">
                    {profile?.current_streak || 0}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400">Days Streak</p>
              </div>
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaClock size={12} className="text-purple-500" />
                  <p className="text-lg font-bold text-gray-800">
                    {profile?.enrolled_hours || 0}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400">Enrolled Hours</p>
              </div>
            </div>
          </div>

          {profile?.daily_streak_mock && (
            <div className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-3">
                Weeks Streak
              </h3>
              <div className="flex justify-between gap-1">
                {Object.entries(profile.daily_streak_mock).map(
                  ([day, active]) => (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          active
                            ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {day.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[9px] text-gray-400">{day}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Courses Status Card */}
          <div className="bg-gray-50 rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Courses Status
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FaLaptopCode size={10} className="text-blue-500" /> In
                    Progress
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {in_progress_courses_count || 0}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        in_progress_courses_count
                          ? (in_progress_courses_count /
                              (in_progress_courses_count +
                                completed_courses_count)) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FaCheckCircle size={10} className="text-emerald-500" />{" "}
                    Completed
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {completed_courses_count || 0}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${
                        completed_courses_count
                          ? (completed_courses_count /
                              (in_progress_courses_count +
                                completed_courses_count)) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Card */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-emerald-300/20 to-blue-300/20 rounded-full blur-3xl"></div>

            <div className="mb-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-300/20 rounded-full blur-2xl scale-110"></div>
                <FaGraduationCap className="w-20 h-20 text-[#5362a3] relative z-10" />
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                Keep up the great work!
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md">
                Consistency is the key to success. Keep learning and improving
                your skills.
              </p>
            </div>

            <Link
              to="/student/courses"
              className="relative z-10 mt-6 px-6 py-2 rounded-xl bg-[#282f4f] text-white text-sm font-normal transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              My Courses
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
