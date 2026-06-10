import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import { FaBook, FaClock, FaUsers, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await instructorApi.getCourses();
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-[#1B2036] transition-all group"
          >
            <ArrowLeft
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
              Manage your course offerings
              {!error && courses.length > 0 && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                  {courses.length} Courses
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-medium text-sm">
          {error}
        </div>
      )}

      {/* Courses Grid */}
      {!error && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#5362a3] flex flex-col h-full"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <FaBook className="text-[#D67A1E]" size={20} />
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    course.is_active
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-gray-50 text-gray-500 border border-gray-100"
                  }`}
                >
                  {course.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Title & Code */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1 line-clamp-2">
                  {course.course_name}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  {course.course_code}
                </p>
              </div>

              {/* Stats Pills */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                  <FaUsers size={10} className="text-gray-400" />
                  {course.enrolled_count}/{course.capacity}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                  <FaClock size={10} className="text-gray-400" />
                  {course.semester} {course.year}
                </span>
              </div>

              {/* Schedule Info */}
              {course.course_schedule && course.course_schedule.length > 0 && (
                <div className="text-xs text-gray-400 bg-gray-50/50 rounded-lg p-2.5 mb-4 border border-gray-50">
                  <p className="font-medium text-gray-500 mb-1">Schedule:</p>
                  <p className="leading-relaxed">
                    {course.course_schedule
                      .map((s) => `${s.day} ${s.time}`)
                      .join(" • ")}
                  </p>
                </div>
              )}

              {/* Footer Action */}
              <div className="mt-auto pt-4 border-t border-gray-50">
                <Link
                  to={`${window.location.pathname.startsWith('/ta') ? '/ta' : '/instructor'}/courses/${course.id}`}
                  className="flex items-center gap-2 text-sm text-[#D67A1E] font-semibold hover:gap-3 transition-all duration-200"
                >
                  View Details
                  <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!error && courses.length === 0 && (
        <div className="flex-1 flex items-center justify-center mt-20">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBook size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              No Courses Found
            </h3>
            <p className="text-sm text-gray-400">
              You haven't been assigned any courses yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;
