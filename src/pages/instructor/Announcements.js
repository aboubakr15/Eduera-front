import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";
import { FaPlus, FaBullhorn } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

const InstructorAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    course_offering: "",
    is_global: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = filterCourse ? { course_offering: filterCourse } : {};
        const [annRes, coursesRes] = await Promise.all([
          instructorApi.getAnnouncements(params),
          instructorApi.getCourses(),
        ]);
        setAnnouncements(annRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterCourse]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await instructorApi.createAnnouncement(newAnnouncement);
      setAnnouncements([response.data, ...announcements]);
      setShowModal(false);
      setNewAnnouncement({
        title: "",
        content: "",
        course_offering: "",
        is_global: false,
      });
    } catch (err) {
      console.error("Failed to create:", err);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
            <p className="text-sm text-gray-400 flex items-center gap-2 mt-0.5">
              Create and manage announcements
              {announcements.length > 0 && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                  {announcements.length} Total
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#282f4f] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <FaPlus size={14} /> Add Announcement
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all w-full max-w-xs"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.course_name}
            </option>
          ))}
        </select>
      </div>

      {/* Announcements List */}
      {announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-[#5362a3]"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaBullhorn size={16} className="text-[#D67A1E]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800 leading-tight">
                    {a.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {a.content}
                  </p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        a.is_global
                          ? "bg-purple-50 text-purple-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {a.is_global ? "Global" : a.course_name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(a.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {announcements.length === 0 && (
        <div className="flex-1 flex items-center justify-center mt-20">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-sm w-full">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaBullhorn size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              No Announcements Found
            </h3>
            <p className="text-sm text-gray-400">
              {filterCourse
                ? "No announcements for this specific course."
                : "You haven't posted any announcements yet."}
            </p>
          </div>
        </div>
      )}

      {/* Professional Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Create Announcement
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      title: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Content
                </label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 resize-none bg-gray-50/50"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Course (Optional)
                </label>
                <select
                  value={newAnnouncement.course_offering}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      course_offering: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                >
                  <option value="">Select course or leave for global</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.course_name}
                    </option>
                  ))}
                </select>
              </div>



              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#1B2036] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorAnnouncements;
