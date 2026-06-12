import { useState, useEffect, Fragment } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import {
  FaCheck,
  FaFileAlt,
  FaChevronLeft,
  FaChevronRight,
  FaRobot,
  FaRedo,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const InstructorSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: "", notes: "" });
  const [grading, setGrading] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [textToView, setTextToView] = useState("");
  const [gradeError, setGradeError] = useState(null);
  const [gradeSuccess, setGradeSuccess] = useState(null);
  const [regradingId, setRegradingId] = useState(null);
  const [expandedRubric, setExpandedRubric] = useState(null);

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

  const handleRegrade = async (submissionId) => {
    setRegradingId(submissionId);
    try {
      const response = await instructorApi.regradeSubmission(submissionId);
      setSubmissions(
        submissions.map((s) =>
          s.id === submissionId ? { ...s, ...response.data } : s,
        ),
      );
    } catch (err) {
      console.error("Regrade failed:", err);
    } finally {
      setRegradingId(null);
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    setGrading(true);
    setGradeError(null);
    setGradeSuccess(null);
    try {
      const response = await instructorApi.gradeSubmission(selectedSubmission.id, gradeData);
      // Update the local submissions list with the new grade data
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
      // Only show error if the request actually failed (non-2xx)
      if (err.response) {
        const data = err.response.data;
        const errorMsg =
          (Array.isArray(data?.grade) ? data.grade[0] : null) ||
          data?.detail ||
          data?.error ||
          data?.message ||
          "Failed to submit grade. Please check the grade value.";
        setGradeError(errorMsg);
      } else {
        setGradeError("Network error. Please try again.");
      }
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
                <td colSpan={7} className="text-center py-16 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                    <p className="text-sm">Loading submissions...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-300">
                  <FaFileAlt size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No submissions found</p>
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <Fragment key={s.id}>
                <tr
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >

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
                    {s.grading_result ? (
                      <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {s.grading_result.total_score}/{s.grading_result.max_score} ({s.grading_result.percentage}%)
                      </span>
                    ) : s.grade ? (
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
                      {s.submitted_text && (
                        <button
                          onClick={() => {
                            setTextToView(s.submitted_text);
                            setShowTextModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FaFileAlt size={11} />
                          Text
                        </button>
                      )}
                      {s.grading_result ? (
                        <>
                          <button
                            onClick={() =>
                              setExpandedRubric(
                                expandedRubric === s.id ? null : s.id,
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <FaRobot size={11} />
                            {expandedRubric === s.id ? "Hide Rubric" : "Rubric"}
                          </button>
                          <button
                            onClick={() => handleRegrade(s.id)}
                            disabled={regradingId === s.id}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-opacity ${
                              regradingId === s.id
                                ? "opacity-60 cursor-not-allowed bg-gray-400"
                                : "bg-[#282f4f] hover:opacity-90"
                            }`}
                          >
                            {regradingId === s.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Regrading...
                              </>
                            ) : (
                              <>
                                <FaRedo size={11} />
                                Regrade
                              </>
                            )}
                          </button>
                        </>
                      ) : s.status !== "GRADED" ? (
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
                      ) : null}
                    </div>
                  </td>
                </tr>
                {expandedRubric === s.id && s.grading_result && (
                  <tr key={`rubric-${s.id}`} className="bg-gray-50/50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="max-w-2xl space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-800">
                            {s.grading_result.total_score}/{s.grading_result.max_score}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({s.grading_result.percentage}%)
                          </span>
                        </div>
                        {s.grading_result.criteria_breakdown.map((c, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-gray-800">
                                {c.criteria_name}
                              </span>
                              <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                                {c.points_awarded}/{c.max_points}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              {c.justification}
                            </p>
                          </div>
                        ))}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 mb-1">
                            AI Feedback
                          </p>
                          <p className="text-sm text-blue-900">
                            {s.grading_result.feedback_summary}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
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

      {showTextModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl border border-gray-100 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Submitted Content
            </h2>
            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 whitespace-pre-wrap max-h-96 overflow-y-auto border border-gray-200">
              {textToView}
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowTextModal(false);
                  setTextToView("");
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorSubmissions;
