import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";
import { FaPlus, FaFileAlt, FaTrash, FaEdit } from "react-icons/fa";

const InstructorMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [newMaterial, setNewMaterial] = useState({ course_offering: '', title: '', description: '', material_type: 'LECTURE', file_url: '', file_type: 'pdf' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, coursesRes] = await Promise.all([instructorApi.getMaterials(), instructorApi.getCourses()]);
        setMaterials(materialsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await instructorApi.createMaterial(newMaterial);
      setMaterials([...materials, response.data]);
      setShowModal(false);
      setNewMaterial({ course_offering: '', title: '', description: '', material_type: 'LECTURE', file_url: '', file_type: 'pdf' });
    } catch (err) {
      console.error("Failed to create material:", err);
    }
  };

  const filteredMaterials = filterCourse ? materials.filter(m => m.course_offering === parseInt(filterCourse)) : materials;

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Materials</h1>
          <p className="text-sm text-gray-400">Manage course materials</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"><FaPlus size={16} /> Add Material</button>
      </div>

      <div className="mb-4">
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl">
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filteredMaterials.map(m => (
          <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><FaFileAlt className="text-blue-600" size={18} /></div>
              <div>
                <p className="text-sm font-medium text-gray-800">{m.title}</p>
                <p className="text-xs text-gray-400">{m.course_name} • {m.material_type}</p>
              </div>
            </div>
            <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">View</a>
          </div>
        ))}
        {filteredMaterials.length === 0 && <p className="text-gray-400 text-center py-8">No materials found</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Material</h2>
            <form onSubmit={handleCreate}>
              <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Course</label><select value={newMaterial.course_offering} onChange={(e) => setNewMaterial({...newMaterial, course_offering: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required><option value="">Select course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}</select></div>
              <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={newMaterial.title} onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required /></div>
              <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={newMaterial.description} onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})} className="w-full px-3 py-2 border rounded-xl" /></div>
              <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select value={newMaterial.material_type} onChange={(e) => setNewMaterial({...newMaterial, material_type: e.target.value})} className="w-full px-3 py-2 border rounded-xl"><option value="LECTURE">Lecture</option><option value="SECTION">Section</option><option value="ASSIGNMENT_DESC">Assignment</option><option value="OTHER">Other</option></select></div>
              <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">File URL</label><input type="url" value={newMaterial.file_url} onChange={(e) => setNewMaterial({...newMaterial, file_url: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required /></div>
              <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">File Type</label><input type="text" value={newMaterial.file_type} onChange={(e) => setNewMaterial({...newMaterial, file_type: e.target.value})} className="w-full px-3 py-2 border rounded-xl" placeholder="pdf, pptx, docx" /></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">Upload</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorMaterials;