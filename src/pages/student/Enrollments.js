import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { FaBook, FaTrash } from "react-icons/fa";

const StudentEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await studentApi.getEnrollments({ status: filter || undefined });
        setEnrollments(response.data);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
        setError("Failed to load enrollments");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [filter]);

  const handleDrop = async (id) => {
    if (!window.confirm("Are you sure you want to drop this course?")) return;
    try {
      await studentApi.dropEnrollment(id);
      setEnrollments(enrollments.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to drop enrollment:", err);
      setError("Failed to drop course");
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Enrollments</h1>
          <p className="text-sm text-gray-400">Manage your course enrollments</p>
        </div>
        <div className="flex gap-2">
          {['ACTIVE', 'COMPLETED', 'DROPPED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status === filter ? '' : status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <FaBook className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{enrollment.course_name}</h3>
                <p className="text-sm text-gray-500">{enrollment.course_code} • {enrollment.semester} {enrollment.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                enrollment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {enrollment.status}
              </span>
              {enrollment.grade && (
                <span className="text-sm font-bold text-gray-800">Grade: {enrollment.grade}</span>
              )}
              {enrollment.status === 'ACTIVE' && (
                <button
                  onClick={() => handleDrop(enrollment.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {enrollments.length === 0 && (
        <div className="text-center py-12">
          <FaBook size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No enrollments found</p>
        </div>
      )}
    </div>
  );
};

export default StudentEnrollments;