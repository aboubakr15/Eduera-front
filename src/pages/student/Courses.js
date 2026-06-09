import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  FaBook,
  FaSearch,
  FaClock,
  FaChalkboardTeacher,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentApi.getCourses();
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

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester =
      semesterFilter === "all" || course.semester === semesterFilter;
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const semesters = [
    ...new Set(courses.map((c) => c.semester).filter(Boolean)),
  ];
  const statuses = [...new Set(courses.map((c) => c.status).filter(Boolean))];

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
              View and manage your enrolled courses
              {!error && courses.length > 0 && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                  {filteredCourses.length} Courses
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all bg-white"
          />
        </div>

        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
        >
          <option value="all">All Semesters</option>
          {semesters.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
        >
          <option value="all">All Status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-medium text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Courses Grid */}
      {!error && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
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
                    course.status === "Completed"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : course.status === "Dropped"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  {course.status || "Active"}
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
                  <FaChalkboardTeacher size={10} className="text-gray-400" />
                  {course.instructor_name}
                </span>
                {course.schedule && course.schedule.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg">
                    <FaClock size={10} className="text-gray-400" />
                    {course.schedule
                      .map((s) => `${s.day} ${s.time}`)
                      .join(", ")}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center justify-end">
                  <Link
                    to={`/student/courses/${course.course_offering}`}
                    className="flex items-center gap-2 text-sm text-[#D67A1E] font-semibold hover:gap-3 transition-all duration-200"
                  >
                    View Details
                    <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!error && filteredCourses.length === 0 && (
        <div className="flex-1 flex items-center justify-center mt-20">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBook size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              No Courses Found
            </h3>
            <p className="text-sm text-gray-400">
              You haven't enrolled in any courses yet or no courses match your
              search.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
