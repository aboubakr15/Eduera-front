import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import {
  FaPlus,
  FaClipboardList,
  FaArrowRight,
  FaCalendarAlt,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterAssignmentType, setFilterAssignmentType] = useState(""); // ✅ فلتر النوع

  // States for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    course_offering: "",
    title: "",
    description: "",
    due_date: "",
    total_points: 10,
    assignment_type: "REPORT",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesRes = await instructorApi.getCourses();
        const coursesData = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data.results || [];
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }

      try {
        const assignRes = await instructorApi.getAssignments();
        const assignData = Array.isArray(assignRes.data)
          ? assignRes.data
          : assignRes.data.results || [];
        setAssignments(assignData);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const response = await instructorApi.createAssignment(newAssignment);
      if (response.data) {
        setAssignments([response.data, ...assignments]);
      }
      setShowModal(false);
      setNewAssignment({
        course_offering: "",
        title: "",
        description: "",
        due_date: "",
        total_points: 10,
        assignment_type: "REPORT",
      });
    } catch (err) {
      console.error("Failed to create:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Failed to create assignment. Please check all fields.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (assignment) => {
    setAssignmentToDelete(assignment);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!assignmentToDelete) return;
    setDeleting(true);
    try {
      await instructorApi.deleteAssignment(assignmentToDelete.id);
      setAssignments(assignments.filter((a) => a.id !== assignmentToDelete.id));
      setShowDeleteModal(false);
      setAssignmentToDelete(null);
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    } finally {
      setDeleting(false);
    }
  };

  // ✅ فلتر الاسايمنتات حسب النوع
  const filteredAssignments = assignments.filter((a) => {
    const matchesType =
      !filterAssignmentType || a.assignment_type === filterAssignmentType;
    return matchesType;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );

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
              Create and manage assignments
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#282f4f] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <FaPlus size={14} /> Add Assignment
        </button>
      </div>

      {/* ✅ Top Bar with Count and Filter */}
      <div className="flex items-center justify-between px-6 py-4 mb-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-800 text-base">
          Assignments Information
          {filteredAssignments.length > 0 && (
            <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
              {filteredAssignments.length} Total
            </span>
          )}
        </h2>

        <select
          value={filterAssignmentType}
          onChange={(e) => setFilterAssignmentType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
        >
          <option value="">All Types</option>
          <option value="REPORT">Report</option>
          <option value="QUIZ">Quiz</option>
          <option value="EXAM">Exam</option>
          <option value="PROJECT">Project</option>
        </select>
      </div>

      {/* ✅ Assignments List (Rectangles under each other) */}
      <div className="space-y-4 pb-8">
        {filteredAssignments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center mt-10">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaClipboardList size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                No Assignments Found
              </h3>
              <p className="text-sm text-gray-400">
                {filterAssignmentType
                  ? "No assignments match the selected type."
                  : "You haven't created any assignments yet."}
              </p>
            </div>
          </div>
        ) : (
          filteredAssignments.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3] flex items-center justify-between"
            >
              {/* Left Side: Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaClipboardList className="text-[#D67A1E]" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {a.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {a.description || "No description"}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span className="font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                      {a.course_name || "-"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={9} />
                      {new Date(a.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Badges & Actions */}
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {a.assignment_type}
                </span>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                  {parseInt(a.total_points)} Points
                </span>
                <button
                  onClick={() => navigate(`/instructor/submissions?assignment_id=${a.id}`)}
                  className="flex items-center gap-1.5 text-sm text-[#D67A1E] font-semibold hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => openDeleteModal(a)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Assignment"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 my-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete Assignment
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{assignmentToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setAssignmentToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium transition-opacity shadow-sm flex items-center justify-center gap-2 ${
                  deleting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Create Assignment
            </h2>

            {submitError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-medium text-xs border border-red-100">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Course
                </label>
                <select
                  value={newAssignment.course_offering}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      course_offering: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_name || c.course?.name || `Course #${c.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      title: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 resize-none bg-gray-50/50"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={newAssignment.due_date}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      due_date: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Points
                  </label>
                  <input
                    type="number"
                    value={newAssignment.total_points}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        total_points: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    Type
                  </label>
                  <select
                    value={newAssignment.assignment_type}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        assignment_type: e.target.value,
                      })
                    }
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  >
                    <option value="REPORT">Report</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="EXAM">Exam</option>
                    <option value="PROJECT">Project</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
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
                      Creating...
                    </>
                  ) : (
                    "Create Assignment"
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

export default InstructorAssignments;
