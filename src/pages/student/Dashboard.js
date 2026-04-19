import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { FaBook, FaChartLine, FaGraduationCap, FaCheckCircle } from "react-icons/fa";

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

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const { profile, portal_announcements, course_announcements, courses_progress, completed_courses_count, in_progress_courses_count } = data || {};

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen">
      <div className="flex-1 flex flex-col overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, {profile?.full_name || 'Student'}!
            </h1>
            <p className="text-sm text-gray-400">Here's your learning overview</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<FaBook size={14} />}
            label="Enrolled Courses"
            value={in_progress_courses_count || 0}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<FaChartLine size={14} />}
            label="Current GPA"
            value={profile?.current_gpa || '0.00'}
            color="text-emerald-600"
            bgColor="bg-emerald-50"
          />
          <StatCard
            icon={<FaGraduationCap size={14} />}
            label="Enrolled Hours"
            value={profile?.enrolled_hours || 0}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<FaCheckCircle size={14} />}
            label="Completed"
            value={completed_courses_count || 0}
            color="text-amber-600"
            bgColor="bg-amber-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Profile Summary</h2>
              <Link to="/student/profile" className="text-sm text-blue-600 hover:underline">View Profile</Link>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Student ID</span>
                <span className="text-sm font-medium text-gray-800">{profile?.student_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Current Streak</span>
                <span className="text-sm font-medium text-gray-800">{profile?.current_streak || 0} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Enrolled Hours</span>
                <span className="text-sm font-medium text-gray-800">{profile?.enrolled_hours || 0}</span>
              </div>
            </div>
            
            {profile?.daily_streak_mock && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Weekly Activity</p>
                <div className="flex justify-between">
                  {Object.entries(profile.daily_streak_mock).map(([day, active]) => (
                    <div key={day} className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <span className="text-xs">{day.charAt(0)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Course Progress</h2>
              <Link to="/student/courses" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {courses_progress?.length > 0 ? (
                courses_progress.map((course) => (
                  <div key={course.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{course.course_name}</p>
                      <p className="text-xs text-gray-400">{course.course_code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 sm:w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{course.progress}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No courses in progress</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Portal Announcements</h2>
              <Link to="/student/notifications" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {portal_announcements?.length > 0 ? (
                portal_announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">{announcement.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{announcement.content}</p>
                    <p className="text-xs text-gray-400 mt-2">{announcement.time_since}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No announcements</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800">Course Announcements</h2>
              <Link to="/student/notifications" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {course_announcements?.length > 0 ? (
                course_announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800">{announcement.title}</p>
                      {announcement.is_TODO && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">To-Do</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{announcement.author_name}</p>
                    <p className="text-xs text-gray-400 mt-1">{announcement.time_since}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No course announcements</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1" />
      </div>
    </div>
  );
};

export default StudentDashboard;