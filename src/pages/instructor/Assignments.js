import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";
import { FaPlus, FaClipboardList } from "react-icons/fa";

const InstructorAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ course_offering: '', title: '', description: '', due_date: '', total_points: 10, assignment_type: 'REPORT' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, coursesRes] = await Promise.all([instructorApi.getAssignments(), instructorApi.getCourses()]);
        setAssignments(assignRes.data);
        setCourses(coursesRes.data);
      } catch (err) { console.error("Failed to fetch:", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await instructorApi.createAssignment(newAssignment);
      setAssignments([...assignments, response.data]);
      setShowModal(false);
      setNewAssignment({ course_offering: '', title: '', description: '', due_date: '', total_points: 10, assignment_type: 'REPORT' });
    } catch (err) { console.error("Failed to create:", err); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
          <p className="text-sm text-gray-400">Create and manage assignments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl"><FaPlus size={16} /> Add Assignment</button>
      </div>

      <div className="space-y-3">
        {assignments.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-800">{a.title}</h3>
                <p className="text-sm text-gray-500">{a.course_name}</p>
                <p className="text-xs text-gray-400 mt-1">Due: {new Date(a.due_date).toLocaleDateString()} • {a.total_points} points • {a.submission_count} submissions</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{a.assignment_type}</span>
            </div>
          </div>
        ))}
        {assignments.length === 0 && <p className="text-gray-400 text-center py-8">No assignments found</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Assignment</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Course</label><select value={newAssignment.course_offering} onChange={(e) => setNewAssignment({...newAssignment, course_offering: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required><option value="">Select course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}</select></div>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required /></div>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Description</label><textarea value={newAssignment.description} onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})} className="w-full px-3 py-2 border rounded-xl" /></div>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Due Date</label><input type="datetime-local" value={newAssignment.due_date} onChange={(e) => setNewAssignment({...newAssignment, due_date: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required /></div>
              <div className="mb-3 flex gap-3"><div className="flex-1"><label className="block text-sm font-medium mb-1">Points</label><input type="number" value={newAssignment.total_points} onChange={(e) => setNewAssignment({...newAssignment, total_points: e.target.value})} className="w-full px-3 py-2 border rounded-xl" /></div><div className="flex-1"><label className="block text-sm font-medium mb-1">Type</label><select value={newAssignment.assignment_type} onChange={(e) => setNewAssignment({...newAssignment, assignment_type: e.target.value})} className="w-full px-3 py-2 border rounded-xl"><option value="REPORT">Report</option><option value="QUIZ">Quiz</option><option value="EXAM">Exam</option><option value="PROJECT">Project</option></select></div></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">Create</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAssignments;