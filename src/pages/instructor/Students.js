import { useState, useEffect } from "react";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaUserGraduate,
} from "react-icons/fa";
import { instructorApi } from "../../api/instructorApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const perPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = filterCourse ? { course_offering: filterCourse } : {};
        const [studentsRes, coursesRes] = await Promise.all([
          instructorApi.getStudents(params),
          instructorApi.getCourses(),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterCourse]);

  const filtered = students.filter((s) => {
    const searchLower = search.toLowerCase();
    const studentId = s.id?.toString() || s.student_id?.toString() || "";
    return (
      s.full_name?.toLowerCase().includes(searchLower) ||
      s.email?.toLowerCase().includes(searchLower) ||
      studentId.includes(search)
    );
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginated.map((s) => s.id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const pageIds = paginated.map((s) => s.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );

  return (
    <div className="min-h-screen font-sans">
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
          Students
        </h1>
      </div>

      <div className="mx-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Students Information
            {students.length > 0 && (
              <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                {students.length} Students
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <FaSearch size={13} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-52"
              />
            </div>
            {/* Course Filter */}
            <div className="relative">
              <select
                value={filterCourse}
                onChange={(e) => {
                  setFilterCourse(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option value="">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
              <FaChevronDown
                size={11}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              
              <th className="w-16 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left">
                Image
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Students Name
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                ID
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Email
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                GPA
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Courses
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                    <p className="text-sm">Loading students...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-300">
                  <FaUserGraduate
                    size={32}
                    className="mx-auto mb-3 opacity-30"
                  />
                  <p className="text-sm">No students found</p>
                </td>
              </tr>
            ) : (
              paginated.map((s, index) => {
                const studentId = s.id?.id || s.id || s.student_id || index;
                return (
                  <tr
                    key={studentId}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                      selected.includes(studentId) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(studentId)}
                        onChange={() => toggleSelect(studentId)}
                        className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 pl-2">
                      <img
                        src={
                          s.profile_picture_url ||
                          `https://api.dicebear.com/7.x/adventurer/svg?seed=${studentId}`
                        }
                        alt={s.full_name}
                        className="w-9 h-9 rounded-full bg-gray-100 object-cover"
                      />
                    </td>
                    <td className="py-3 px-2 font-semibold text-gray-800 text-sm">
                      {s.full_name}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400">
                      {s.student_id || studentId}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400">
                      {s.email}
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-sm font-medium text-gray-400  px-2.5 py-1 rounded-lg">
                        {s.current_gpa}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs font-medium text-gray-400 px-2.5 py-1.5 rounded-lg">
                        {s.enrolled_courses?.length || 0}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
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
    </div>
  );
};

export default InstructorStudents;
