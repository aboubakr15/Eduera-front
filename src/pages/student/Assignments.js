import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import { FaClipboardList, FaFileUpload, FaClock, FaCheck, FaExclamationCircle } from "react-icons/fa";

const StudentAssignments = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await studentApi.getSubmissions();
        setSubmissions(response.data);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !fileUrl) return;
    
    try {
      const response = await studentApi.submitAssignment({
        assignment_id: selectedAssignment,
        file_url: fileUrl
      });
      setSubmissions([...submissions, response.data]);
      setShowSubmitModal(false);
      setFileUrl("");
      setSelectedAssignment(null);
    } catch (err) {
      console.error("Failed to submit:", err);
      setError("Failed to submit assignment");
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Assignments & Submissions</h1>
          <p className="text-sm text-gray-400">View and submit your assignments</p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <FaFileUpload size={16} />
          Submit Assignment
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{submission.assignment_title}</h3>
                <p className="text-sm text-gray-500 mt-1">{submission.course_name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                submission.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' :
                submission.status === 'GRADED' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {submission.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FaClock size={14} />
                <span>Submitted: {new Date(submission.submission_date).toLocaleDateString()}</span>
              </div>
              {submission.file_url && (
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Submission
                </a>
              )}
              {submission.grade && (
                <span className="font-bold text-gray-800">Grade: {submission.grade}</span>
              )}
              {submission.notes && (
                <p className="text-sm text-gray-500 italic">Note: {submission.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-12">
          <FaClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No assignments or submissions yet</p>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Assignment</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment ID
                </label>
                <input
                  type="number"
                  value={selectedAssignment || ''}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File URL
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Submit
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