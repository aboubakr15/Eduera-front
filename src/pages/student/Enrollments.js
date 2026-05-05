import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { FaBook, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const StudentEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ✅ خلينا الفلتر الافتراضي يبقى ACTIVE عشان يظهر الكورسات الشغالة على طول
  const [filter, setFilter] = useState("ACTIVE");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await studentApi.getEnrollments({ status: filter });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setEnrollments(data);
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
      setEnrollments(enrollments.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to drop enrollment:", err);
      setError("Failed to drop course");
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-800">My Enrollments</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
              Manage your course enrollments
              {!error && enrollments.length > 0 && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                  {enrollments.length} Courses
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs - تم إزالة All */}
      <div className="flex gap-2 mb-6">
        {["ACTIVE", "COMPLETED", "DROPPED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === status
                ? "bg-[#282f4f] text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-medium text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Enrollments List */}
      <div className="space-y-4 pb-8">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3] flex items-center justify-between"
          >
            {/* Left Side */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaBook className="text-[#D67A1E]" size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {enrollment.course_name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span>{enrollment.course_code}</span>
                  <span>•</span>
                  <span>
                    {enrollment.semester} {enrollment.year}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              {enrollment.grade && (
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                  {enrollment.grade}
                </span>
              )}

              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                  enrollment.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : enrollment.status === "COMPLETED"
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                {enrollment.status}
              </span>

              {enrollment.status === "ACTIVE" && (
                <button
                  onClick={() => handleDrop(enrollment.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Drop Course"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        {enrollments.length === 0 && (
          <div className="flex-1 flex items-center justify-center mt-10">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FaBook size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                No Enrollments Found
              </h3>
              <p className="text-sm text-gray-400">
                You have no {filter.toLowerCase()} enrollments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollments;
