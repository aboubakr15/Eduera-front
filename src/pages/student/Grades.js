import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { FaGraduationCap, FaStar } from "react-icons/fa";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await studentApi.getGrades();
        setGrades(response.data);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const filteredGrades = grades.filter(g => !filter || g.status === filter);

  const completedCount = grades.filter(g => g.status === 'COMPLETED').length;
  const averageGrade = completedCount > 0 
    ? (grades.filter(g => g.status === 'COMPLETED').reduce((sum, g) => sum + parseFloat(g.grade), 0) / completedCount).toFixed(2)
    : '0.00';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Grades</h1>
        <p className="text-sm text-gray-400">View your course grades and GPA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FaGraduationCap className="text-blue-600" size={20} />
            </div>
            <span className="text-sm text-gray-500">Total Courses</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{grades.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FaStar className="text-green-600" size={20} />
            </div>
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <FaGraduationCap className="text-purple-600" size={20} />
            </div>
            <span className="text-sm text-gray-500">Average Grade</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{averageGrade}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {['ACTIVE', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? '' : status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        {filteredGrades.map((grade) => (
          <div
            key={grade.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800">{grade.course_name}</h3>
              <p className="text-sm text-gray-500">{grade.course_code}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                grade.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {grade.status}
              </span>
              {grade.grade && (
                <span className="text-xl font-bold text-gray-800">{grade.grade}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <FaGraduationCap size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No grades found</p>
        </div>
      )}
    </div>
  );
};

export default StudentGrades;