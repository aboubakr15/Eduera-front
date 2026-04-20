import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { FaBook, FaSearch, FaPlus, FaClock, FaChalkboardTeacher, FaFilter } from "react-icons/fa";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = semesterFilter === "all" || course.semester === semesterFilter;
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const semesters = [...new Set(courses.map(c => c.semester).filter(Boolean))];
  const statuses = [...new Set(courses.map(c => c.status).filter(Boolean))];

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
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-sm text-gray-400">View and manage your enrolled courses</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative max-w-md flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Semesters</option>
            {semesters.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Status</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaBook className="text-blue-600" size={20} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                course.status === 'Active' ? 'bg-green-100 text-green-700' :
                course.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {course.status || 'Active'}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-1">{course.course_name}</h3>
            <p className="text-sm text-gray-500 mb-3">{course.course_code}</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <FaChalkboardTeacher size={14} />
              <span>{course.instructor_name}</span>
            </div>

            {course.schedule && course.schedule.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <FaClock size={14} />
                <span>{course.schedule.map(s => `${s.day} ${s.time}`).join(', ')}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{course.progress || 0}%</span>
              </div>
              <Link
                to={`/student/courses/${course.id}`}
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <FaBook size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;