import { useState, useEffect } from "react";
import { studentApi } from "../../api/studentApi";
import { FaCheckSquare, FaSquare, FaPlus, FaTrash, FaClock } from "react-icons/fa";

const StudentTodo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: "", description: "", priority: "MEDIUM", due_date: "" });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await studentApi.getTodo();
        setTodos(response.data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await studentApi.createTodo(newTodo);
      setTodos([...todos, response.data]);
      setShowAddModal(false);
      setNewTodo({ title: "", description: "", priority: "MEDIUM", due_date: "" });
    } catch (err) {
      console.error("Failed to create todo:", err);
      setError("Failed to create todo");
    }
  };

  const handleToggle = (todo) => {
    setTodos(todos.map(t => t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setTodos(todos.filter(t => t.id !== id));
  };

  const pendingTodos = todos.filter(t => !t.is_completed);
  const completedTodos = todos.filter(t => t.is_completed);

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
          <h1 className="text-2xl font-bold text-gray-800">To-Do List</h1>
          <p className="text-sm text-gray-400">Manage your tasks and pending assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          <FaPlus size={16} />
          Add Task
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="mb-6">
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{pendingTodos.length} pending</span>
          <span>{completedTodos.length} completed</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <h2 className="text-lg font-bold text-gray-800">Pending Tasks</h2>
        {pendingTodos.map((todo) => (
          <div key={todo.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <button onClick={() => handleToggle(todo)} className="text-gray-400 hover:text-blue-600">
              <FaSquare size={20} />
            </button>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{todo.title}</h3>
              {todo.description && <p className="text-sm text-gray-500">{todo.description}</p>}
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  todo.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                  todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {todo.priority}
                </span>
                {todo.due_date && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FaClock size={12} />
                    {new Date(todo.due_date).toLocaleDateString()}
                  </span>
                )}
                {todo.course_name && <span className="text-xs text-gray-400">{todo.course_name}</span>}
              </div>
            </div>
            <button onClick={() => handleDelete(todo.id)} className="text-gray-400 hover:text-red-500 p-2">
              <FaTrash size={16} />
            </button>
          </div>
        ))}
        {pendingTodos.length === 0 && <p className="text-gray-400">No pending tasks</p>}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Completed</h2>
        {completedTodos.map((todo) => (
          <div key={todo.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 opacity-60">
            <button onClick={() => handleToggle(todo)} className="text-green-500">
              <FaCheckSquare size={20} />
            </button>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 line-through">{todo.title}</h3>
            </div>
            <button onClick={() => handleDelete(todo.id)} className="text-gray-400 hover:text-red-500 p-2">
              <FaTrash size={16} />
            </button>
          </div>
        ))}
        {completedTodos.length === 0 && <p className="text-gray-400">No completed tasks</p>}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Task</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="datetime-local"
                  value={newTodo.due_date}
                  onChange={(e) => setNewTodo({ ...newTodo, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTodo;