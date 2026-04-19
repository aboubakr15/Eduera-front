import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";
import { FaCheck, FaFileAlt } from "react-icons/fa";

const InstructorSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ grade: '', notes: '' });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await instructorApi.getSubmissions();
        setSubmissions(response.data);
      } catch (err) { console.error("Failed to fetch:", err); }
      finally { setLoading(false); }
    };
    fetchSubmissions();
  }, []);

  const handleGrade = async (e) => {
    e.preventDefault();
    try {
      await instructorApi.gradeSubmission(selectedSubmission.id, gradeData);
      setSubmissions(submissions.map(s => s.id === selectedSubmission.id ? { ...s, status: 'GRADED', grade: gradeData.grade, notes: gradeData.notes } : s));
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeData({ grade: '', notes: '' });
    } catch (err) { console.error("Failed to grade:", err); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Submissions</h1>
        <p className="text-sm text-gray-400">Review and grade student submissions</p>
      </div>

      <div className="space-y-3">
        {submissions.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-800">{s.assignment_title}</h3>
                <p className="text-sm text-gray-500">{s.student_name} • {s.course_name}</p>
                <p className="text-xs text-gray-400 mt-1">Submitted: {new Date(s.submission_date).toLocaleDateString()}</p>
                {s.file_url && <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 inline-block">View Submission</a>}
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'GRADED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{s.status}</span>
                {s.grade && <p className="text-lg font-bold text-gray-800 mt-2">{s.grade}</p>}
                {s.status !== 'GRADED' && <button onClick={() => { setSelectedSubmission(s); setShowGradeModal(true); }} className="mt-2 text-sm text-blue-600 hover:underline">Grade</button>}
              </div>
            </div>
            {s.notes && <p className="text-sm text-gray-500 mt-2 italic">Feedback: {s.notes}</p>}
          </div>
        ))}
        {submissions.length === 0 && <p className="text-gray-400 text-center py-8">No submissions</p>}
      </div>

      {showGradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Grade Submission</h2>
            <form onSubmit={handleGrade}>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Grade (0-100)</label><input type="number" min="0" max="100" value={gradeData.grade} onChange={(e) => setGradeData({...gradeData, grade: e.target.value})} className="w-full px-3 py-2 border rounded-xl" required /></div>
              <div className="mb-3"><label className="block text-sm font-medium mb-1">Feedback</label><textarea value={gradeData.notes} onChange={(e) => setGradeData({...gradeData, notes: e.target.value})} className="w-full px-3 py-2 border rounded-xl" placeholder="Optional feedback" /></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowGradeModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl">Cancel</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl">Submit Grade</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorSubmissions;