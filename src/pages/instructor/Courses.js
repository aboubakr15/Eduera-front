import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import { FaBook, FaClock, FaUsers } from "react-icons/fa";

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <p className="text-sm text-gray-400">Manage your course offerings</p>
        </div>
        
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaBook className="text-blue-600" size={20} />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${course.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {course.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">{course.course_name}</h3>
            <p className="text-sm text-gray-500 mb-3">{course.course_code}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1"><FaClock size={12} /> {course.semester} {course.year}</span>
              <span className="flex items-center gap-1"><FaUsers size={12} /> {course.enrolled_count}/{course.capacity}</span>
            </div>
            {course.course_schedule && course.course_schedule.length > 0 && (
              <div className="text-sm text-gray-500 mb-3">
                {course.course_schedule.map(s => `${s.day} ${s.time}`).join(', ')}
              </div>
            )}
            <Link to={`/instructor/courses/${course.id}`} className="text-sm text-blue-600 font-medium hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <FaBook size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default InstructorCourses;