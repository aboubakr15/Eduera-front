import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  FaBook,
  FaFileAlt,
  FaClipboardList,
  FaChalkboardTeacher,
  FaUserTie,
  FaDownload,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const StudentCourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("materials");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        let response;
        try {
          response = await studentApi.getCourseDetails(id);
        } catch (e) {
          const coursesRes = await studentApi.getCourses();
          const foundCourse = coursesRes.data.find(
            (c) => c.id === parseInt(id) || c.id === id,
          );
          if (foundCourse) {
            response = { data: foundCourse };
          } else {
            throw e;
          }
        }
        setCourse(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            "Failed to load course details",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleViewMaterial = async (url) => {
    if (!url) return;
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Failed to fetch file");
      const blob = await response.blob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (err) {
      console.error("Failed to view material:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-medium text-sm border border-red-100">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#D67A1E] font-semibold hover:underline"
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
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
          <h1 className="text-2xl font-bold text-gray-800">
            {course?.course_name}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-gray-400">
              {course?.course_code} • {course?.semester} {course?.year}
            </p>
            {course?.enrollment_status && (
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                  course.enrollment_status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600"
                    : course.enrollment_status === "COMPLETED"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {course.enrollment_status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 border-l-4 border-l-blue-500">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaUserTie className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Instructor</p>
            <p className="text-sm font-bold text-gray-800">
              {course?.instructor_name || "TBA"}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 border-l-4 border-l-purple-500">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaChalkboardTeacher className="text-purple-600" size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Teaching Assistant</p>
            <p className="text-sm font-bold text-gray-800">
              {course?.tas_names?.length > 0
                ? course.tas_names.join(", ")
                : "Not Assigned"}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 border-l-4 border-l-emerald-500">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaFileAlt className="text-emerald-600" size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Materials</p>
            <p className="text-lg font-bold text-gray-800">
              {course?.materials?.length || 0}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 border-l-4 border-l-amber-500">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaClipboardList className="text-amber-600" size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Assignments</p>
            <p className="text-lg font-bold text-gray-800">
              {course?.assignments?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["materials", "assignments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#282f4f] text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {activeTab === "materials" && (
          <div className="space-y-4">
            {course?.materials?.length > 0 ? (
              course.materials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaFileAlt className="text-[#D67A1E]" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {m.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-medium">
                          {m.material_type}
                        </span>
                        <span className="text-xs text-gray-400 uppercase">
                          {m.file_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewMaterial(m.file_download_url)}
                    disabled={!m.file_download_url}
                    className="text-sm text-[#D67A1E] font-semibold hover:underline flex-shrink-0 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FaDownload size={12} /> View
                  </button>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<FaFileAlt size={28} />}
                text="No materials available."
              />
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="space-y-4">
            {course?.assignments?.length > 0 ? (
              course.assignments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaClipboardList className="text-[#D67A1E]" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {a.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>
                          Due:{" "}
                          {new Date(a.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span className="text-amber-600 font-medium">
                          {parseInt(a.total_points)} Pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {a.submitted ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <FaCheck size={10} /> Submitted
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        <FaTimes size={10} /> Pending
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<FaClipboardList size={28} />}
                text="No assignments yet."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon, text }) => (
  <div className="flex-1 flex items-center justify-center mt-10">
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
        {icon}
      </div>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  </div>
);

export default StudentCourseDetails;
