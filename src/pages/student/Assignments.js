import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  FaClipboardList,
  FaFileUpload,
  FaClock,
  FaFileAlt,
  FaArrowRight,
  FaCommentDots,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const StudentAssignments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesRes = await studentApi.getCourses();
        const coursesData = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data.results || [];
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }

      try {
        const assignRes = await studentApi.getAssignments();
        const assignData = Array.isArray(assignRes.data)
          ? assignRes.data
          : assignRes.data.results || [];
        setAssignments(assignData);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      }

      try {
        const response = await studentApi.getSubmissions();
        const submissionsData = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignmentId || !selectedFile) {
      setSubmitError("Please select an assignment and upload a file.");
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("assignment_id", selectedAssignmentId);
      formData.append("file", selectedFile);

      const response = await studentApi.submitAssignment(formData);

      if (response.data) {
        setSubmissions([response.data, ...submissions]);
      }

      setShowSubmitModal(false);
      setSelectedFile(null);
      setSelectedCourseId("");
      setSelectedAssignmentId("");
    } catch (err) {
      console.error("Failed to submit:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Failed to submit assignment. Please check all fields.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSubmission = async (url) => {
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
      console.error("Failed to view submission:", err);
    }
  };

  const filteredAssignments = assignments.filter(
    (a) => a.course_offering === parseInt(selectedCourseId),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
            <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
            <p className="text-sm text-gray-400">
              View and submit your assignments
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#282f4f] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <FaFileUpload size={14} /> Submit Assignment
        </button>
      </div>

      {/* Top Bar with Count */}
      <div className="flex items-center justify-between px-6 py-4 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 text-base">
          Submissions Information
          {submissions.length > 0 && (
            <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
              {submissions.length} Total
            </span>
          )}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-medium text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Submissions List */}
      <div className="space-y-4 pb-8">
        {submissions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center mt-10">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaClipboardList size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                No Submissions Found
              </h3>
              <p className="text-sm text-gray-400">
                You haven't submitted any assignments yet.
              </p>
            </div>
          </div>
        ) : (
          submissions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaClipboardList className="text-[#D67A1E]" size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {s.assignment_title || s.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span className="font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                        {s.course_name || "-"}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaClock size={9} />
                        {new Date(s.submission_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      s.status === "GRADED"
                        ? "bg-emerald-50 text-emerald-600"
                        : s.status === "SUBMITTED"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {s.status}
                  </span>

                  {s.status === "GRADED" && s.grade != null && (
                    <span className="text-sm font-bold text-white bg-emerald-500 px-3 py-1 rounded-lg shadow-sm">
                      {s.grade}/100
                    </span>
                  )}

                  {s.assignment_file_download_url && (
                    <button
                      onClick={() => handleViewSubmission(s.assignment_file_download_url)}
                      className="flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline mr-2"
                    >
                      <FaDownload size={11} /> Assignment
                    </button>
                  )}
                  {s.file_download_url && (
                    <button
                      onClick={() => handleViewSubmission(s.file_download_url)}
                      className="flex items-center gap-1.5 text-sm text-[#D67A1E] font-semibold hover:underline"
                    >
                      Submission
                      <FaArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>

              {s.status === "GRADED" && s.notes && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-200 flex items-start gap-3 bg-gray-50/50 p-3 rounded-xl">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FaCommentDots size={14} className="text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Instructor Feedback
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {s.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Submit Assignment
            </h2>

            {submitError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-medium text-xs border border-red-100">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Select Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    setSelectedAssignmentId("");
                  }}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                >
                  <option value="">Choose a course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.course_offering}>
                      {c.course_name || `Course #${c.course_offering}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Select Assignment
                </label>
                <select
                  value={selectedAssignmentId}
                  onChange={(e) => setSelectedAssignmentId(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedCourseId}
                  required
                >
                  <option value="">
                    {selectedCourseId
                      ? "Choose an assignment..."
                      : "Select a course first"}
                  </option>
                  {filteredAssignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
                {selectedCourseId && filteredAssignments.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1">
                    No assignments found for this course.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Upload Your Solution
                </label>
                <div
                  onClick={() =>
                    document.getElementById("file-upload-student").click()
                  }
                  className={`w-full text-sm border border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-colors bg-gray-50/50 ${
                    selectedCourseId && selectedAssignmentId
                      ? "border-blue-300 hover:border-blue-400 hover:bg-blue-50/50"
                      : "border-gray-200 opacity-50 pointer-events-none"
                  }`}
                >
                  <input
                    id="file-upload-student"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-[#D67A1E]">
                      <FaFileAlt size={16} />
                      <span className="font-medium truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      {selectedCourseId && selectedAssignmentId
                        ? "Click to select a file from your computer"
                        : "Select course and assignment first"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedFile(null);
                    setSelectedCourseId("");
                    setSelectedAssignmentId("");
                    setSubmitError(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-4 py-2.5 bg-[#1B2036] text-white rounded-xl text-sm font-medium transition-opacity shadow-sm flex items-center justify-center gap-2 ${
                    submitting
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Assignment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
