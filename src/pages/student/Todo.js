import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  FaPlus,
  FaRegCircle,
  FaCheckCircle,
  FaTrash,
  FaClock,
  FaExclamationTriangle,
  FaClipboardList,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const StudentTodo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    due_date: "",
    course: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const todoResponse = await studentApi.getTodo();
        const todoData = Array.isArray(todoResponse.data)
          ? todoResponse.data
          : todoResponse.data.results || [];
        setTodos(todoData);

        const courseResponse = await studentApi.getCourses();
        const courseData = Array.isArray(courseResponse.data)
          ? courseResponse.data
          : courseResponse.data.results || [];
        setCourses(courseData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;
    setSubmitting(true);
    try {
      const response = await studentApi.createTodo(newTodo);
      if (response.data) {
        setTodos([response.data, ...todos]);
      }
      setNewTodo({
        title: "",
        description: "",
        priority: "MEDIUM",
        due_date: "",
        course: "",
      });
      setIsExpanded(false);
    } catch (err) {
      console.error("Failed to create todo:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (todo) => {
    const updatedTodo = { ...todo, is_completed: !todo.is_completed };
    setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
    try {
      await studentApi.updateTodo(todo.id, updatedTodo);
    } catch (err) {
      console.error("Failed to toggle todo:", err);
      setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
    }
  };

  const openDeleteModal = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!todoToDelete) return;
    setDeleting(true);
    try {
      await studentApi.deleteTodo(todoToDelete.id);
      setTodos(todos.filter((t) => t.id !== todoToDelete.id));
      setShowDeleteModal(false);
      setTodoToDelete(null);
    } catch (err) {
      console.error("Failed to delete todo:", err);

      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const pendingTodos = todos.filter((t) => !t.is_completed);
  const completedTodos = todos.filter((t) => t.is_completed);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/30">
      {/* Header */}
      <div className="flex-shrink-0 bg-white px-4 pt-4 pb-3 border-b border-gray-100">
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
            <h1 className="text-2xl font-bold text-gray-800">My TO-DO</h1>
            <p className="text-sm text-gray-400">{today}</p>
          </div>
        </div>
      </div>

      {/* Tasks Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-medium text-sm border border-red-100">
            {error}
          </div>
        )}

        {todos.length === 0 ? (
          <div className="flex-1 flex items-center justify-center mt-20">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaClipboardList size={28} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">
                No Tasks Yet
              </h3>
              <p className="text-sm text-gray-400">
                Add a task below to get started.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Pending Tasks */}
            <div className="space-y-3 mb-6">
              {pendingTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3] flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggle(todo)}
                      className="flex-shrink-0 text-gray-300 hover:text-[#5362a3] transition-colors"
                    >
                      <FaRegCircle size={22} />
                    </button>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-800 truncate">
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase ${
                            todo.priority === "HIGH"
                              ? "bg-red-50 text-red-600"
                              : todo.priority === "MEDIUM"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {todo.priority}
                        </span>
                        {todo.due_date && (
                          <span className="flex items-center gap-1 text-[11px] text-gray-400">
                            <FaClock size={9} />
                            {new Date(todo.due_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        )}
                        {todo.course_name && (
                          <span className="text-[11px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                            {todo.course_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(todo)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Completed Tasks */}
            {completedTodos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaCheckCircle size={14} className="text-emerald-500" />
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                    Completed {completedTodos.length}
                  </h2>
                </div>
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 border-l-4 border-l-gray-300 flex items-center justify-between opacity-60"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggle(todo)}
                        className="flex-shrink-0 text-emerald-500 hover:text-gray-400 transition-colors"
                      >
                        <FaCheckCircle size={22} />
                      </button>
                      <h3 className="text-sm font-medium text-gray-400 line-through truncate">
                        {todo.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => openDeleteModal(todo)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Task"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Add Bar */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)]">
        <form onSubmit={handleQuickAdd} className="p-4 space-y-0">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
            <FaPlus size={14} className="text-gray-400" />
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo({ ...newTodo, title: e.target.value })
              }
              placeholder="Add a task"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg transition-colors ${
                isExpanded
                  ? "bg-gray-200 text-gray-600"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              title="More options"
            >
              {isExpanded ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronUp size={12} />
              )}
            </button>
            {newTodo.title.trim() && (
              <button
                type="submit"
                disabled={submitting}
                className="text-xs font-semibold text-[#D67A1E] hover:text-[#b86319] transition-colors disabled:opacity-50 ml-2"
              >
                {submitting ? "Adding..." : "Add"}
              </button>
            )}
          </div>

          {isExpanded && (
            <div className="mt-3 space-y-3 pt-3 border-t border-dashed border-gray-200">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Course
                </label>
                <select
                  value={newTodo.course}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, course: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-white text-gray-700"
                >
                  <option value="">Select a course (Optional)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Details
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 resize-none bg-white"
                  rows={2}
                  placeholder="Add some description..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Priority
                </label>
                <div className="flex gap-2">
                  {[
                    {
                      value: "LOW",
                      label: "Low",
                      activeClass:
                        "bg-green-50 text-green-600 border-green-200",
                    },
                    {
                      value: "MEDIUM",
                      label: "Medium",
                      activeClass:
                        "bg-amber-50 text-amber-600 border-amber-200",
                    },
                    {
                      value: "HIGH",
                      label: "High",
                      activeClass: "bg-red-50 text-red-600 border-red-200",
                    },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() =>
                        setNewTodo({ ...newTodo, priority: p.value })
                      }
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        newTodo.priority === p.value
                          ? p.activeClass
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={newTodo.due_date}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, due_date: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-white"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 my-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete Task
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{todoToDelete?.title}"
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setTodoToDelete(null);
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
    </div>
  );
};

export default StudentTodo;
