import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";
import { FaPlus, FaTrash } from "react-icons/fa";

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', course_offering: '', is_global: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = filterCourse ? { course_offering: filterCourse } : {};
        const [annRes, coursesRes] = await Promise.all([instructorApi.getAnnouncements(params), instructorApi.getCourses()]);
        setAnnouncements(annRes.data);
        setCourses(coursesRes.data);
      } catch (err) { console.error("Failed to fetch:", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [filterCourse]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await instructorApi.createAnnouncement(newAnnouncement);
      setAnnouncements([...announcements, response.data]);
      setShowModal(false);
      setNewAnnouncement({ title: '', content: '', course_offering: '', is_global: false });
    } catch (err) { console.error("Failed to create:", err); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
          <p className="text-sm text-gray-400">Create and manage announcements</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl"><FaPlus size={16} /> Add</button>
      </div>

      <div className="mb-4">
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl">
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-800">{a.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{a.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${a.is_global ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{a.is_global ? 'Global' : a.course_name}</span>
                  <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && <p className="text-gray-400 text-center py-8">No announcements</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Announcement</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required /></div>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Content</label><textarea value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})} className="w-full px-3 py-2 border rounded-xl" rows={3} required /></div>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Course (optional)</label><select value={newAnnouncement.course_offering} onChange={(e) => setNewAnnouncement({...newAnnouncement, course_offering: e.target.value})} className="w-full px-3 py-2 border rounded-xl"><option value="">Select course or global</option>{courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}</select></div>
              <div className="mb-3 flex items-center gap-2"><input type="checkbox" checked={newAnnouncement.is_global} onChange={(e) => setNewAnnouncement({...newAnnouncement, is_global: e.target.checked})} /><label className="text-sm">Global announcement</label></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">Create</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncements;