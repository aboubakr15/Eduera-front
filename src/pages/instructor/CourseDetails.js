import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import { FaBook, FaUsers, FaFileAlt, FaClipboardList } from "react-icons/fa";

const InstructorCourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await instructorApi.getCourseDetails(id);
        setCourse(response.data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

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

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="mb-6">
        <Link to="/instructor/courses" className="text-sm text-blue-600 hover:underline mb-2 inline-block">← Back to Courses</Link>
        <h1 className="text-2xl font-bold text-gray-800">{course?.course_name}</h1>
        <p className="text-sm text-gray-400">{course?.course_code} • {course?.semester} {course?.year}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FaUsers className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Enrolled</p>
              <p className="text-lg font-bold text-gray-800">{course?.enrolled_count}/{course?.capacity}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FaFileAlt className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Materials</p>
              <p className="text-lg font-bold text-gray-800">{course?.materials?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <FaClipboardList className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Assignments</p>
              <p className="text-lg font-bold text-gray-800">{course?.assignments?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['materials', 'assignments', 'students'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-medium ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {activeTab === 'materials' && (
          <div className="space-y-3">
            {course?.materials?.length > 0 ? (
              course.materials.map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{m.title}</p>
                    <p className="text-xs text-gray-400">{m.material_type} • {m.file_type}</p>
                  </div>
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">View</a>
                </div>
              ))
            ) : <p className="text-gray-400">No materials uploaded</p>}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-3">
            {course?.assignments?.length > 0 ? (
              course.assignments.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400">Due: {new Date(a.due_date).toLocaleDateString()} • {a.total_points} points</p>
                  </div>
                  <span className="text-sm text-gray-500">{a.submission_count} submissions</span>
                </div>
              ))
            ) : <p className="text-gray-400">No assignments</p>}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-3">
            {course?.enrolled_students?.length > 0 ? (
              course.enrolled_students.map(s => (
                <div key={s.enrollment_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.student_name}</p>
                    <p className="text-xs text-gray-400">{s.student_email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
                </div>
              ))
            ) : <p className="text-gray-400">No students enrolled</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourseDetails;