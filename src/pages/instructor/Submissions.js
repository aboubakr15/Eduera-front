import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import {
  FaCheck,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const InstructorSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: "", notes: "" });
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState(null);
  const [gradeSuccess, setGradeSuccess] = useState(null);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 8;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("assignment_id");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const params = {};
        if (assignmentId) params.assignment_id = assignmentId;
        const response = await instructorApi.getSubmissions(params);
        setSubmissions(response.data);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [assignmentId]);

  const handleGrade = async (e) => {
    e.preventDefault();
    setGrading(true);
    setGradeError(null);
    setGradeSuccess(null);
    try {
      await instructorApi.gradeSubmission(selectedSubmission.id, gradeData);
      setSubmissions(
        submissions.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                status: "GRADED",
                grade: gradeData.grade,
                notes: gradeData.notes,
              }
            : s,
        ),
      );
      setGradeSuccess("Grade submitted successfully!");
      setTimeout(() => {
        setShowGradeModal(false);
        setSelectedSubmission(null);
        setGradeData({ grade: "", notes: "" });
        setGradeSuccess(null);
      }, 1000);
    } catch (err) {
      console.error("Failed to grade:", err);
      const errorMsg =
        err.response?.data?.grade?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Failed to submit grade. Please check the grade value.";
      setGradeError(errorMsg);
    } finally {
      setGrading(false);
    }
  };

  const handleViewFile = async (url) => {
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
      console.error("Failed to view file:", err);
    }
  };

  const paginated = submissions.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(submissions.length / perPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginated.map((s) => s.id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const pageIds = paginated.map((s) => s.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-[#1B2036] transition-all group"
        >
          <ArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Submissions
        </h1>
      </div>

      <div className="mx-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Submissions Information
            {submissions.length > 0 && (
              <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                {submissions.length} Pending
              </span>
            )}
          </h2>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Student
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Assignment
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Course
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Date
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Status
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Grade
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                    <p className="text-sm">Loading submissions...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-300">
                  <FaFileAlt size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No submissions found</p>
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                    selected.includes(s.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggleSelect(s.id)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-800 text-sm">
                    {s.student_name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600">
                    {s.assignment_title}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {s.course_name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {new Date(s.submission_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        s.status === "GRADED"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {s.grade ? (
                      <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                        {parseInt(s.grade)}/100
                      </span>
                    ) : (
                      <span className="text-sm text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {s.file_download_url && (
                        <button
                          onClick={() => handleViewFile(s.file_download_url)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FaFileAlt size={11} />
                          View
                        </button>
                      )}
                      {s.status !== "GRADED" && (
                        <button
                          onClick={() => {
                            setSelectedSubmission(s);
                            setShowGradeModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#282f4f] rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <FaCheck size={11} />
                          Grade
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-center gap-3 py-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <FaChevronLeft size={11} />
          </button>
          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-full text-sm font-medium transition-colors ${
                page === p
                  ? "bg-[#D67A1E] text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <FaChevronRight size={11} />
          </button>
        </div>
      </div>

      {showGradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Grade Submission
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Evaluating:{" "}
              <span className="font-medium text-gray-600">
                {selectedSubmission?.assignment_title}
              </span>{" "}
              by{" "}
              <span className="font-medium text-gray-600">
                {selectedSubmission?.student_name}
              </span>
            </p>
            {gradeSuccess && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl mb-4 font-medium text-xs border border-emerald-100">
                {gradeSuccess}
              </div>
            )}
            {gradeError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-medium text-xs border border-red-100">
                {gradeError}
              </div>
            )}
            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Grade (0 - 100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={gradeData.grade}
                  onChange={(e) =>
                    setGradeData({ ...gradeData, grade: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                  disabled={grading}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Feedback / Notes
                </label>
                <textarea
                  value={gradeData.notes}
                  onChange={(e) =>
                    setGradeData({ ...gradeData, notes: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 resize-none bg-gray-50/50"
                  rows={4}
                  placeholder="Provide constructive feedback to the student..."
                  disabled={grading}
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowGradeModal(false);
                    setGradeError(null);
                    setGradeSuccess(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  disabled={grading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grading}
                  className={`flex-1 px-4 py-2.5 bg-[#1B2036] text-white rounded-xl text-sm font-medium transition-opacity shadow-sm flex items-center justify-center gap-2 ${
                    grading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                  }`}
                >
                  {grading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Grade"
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

export default InstructorSubmissions;
