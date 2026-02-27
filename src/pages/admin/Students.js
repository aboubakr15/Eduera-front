import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaUserGraduate,
} from "react-icons/fa";
import { adminApi } from "../../api/adminApi";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [page, setPage] = useState(1);

  const perPage = 8;

  useEffect(() => {
    fetchData();
  }, [search, department]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, summaryRes] = await Promise.all([
        adminApi.getUsers('STUDENT'),
        adminApi.getDashboardSummary()
      ]);
      setStudents(studentsRes.data);
      if (summaryRes.data.departments) {
        setDepartments(summaryRes.data.departments);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (deptId) => {
    if (!deptId) return "-";
    const dept = departments.find(d => d.id === deptId || d.id === parseInt(deptId));
    return dept?.name || "-";
  };

  const filtered = students.filter((s) => {
    const matchSearch =
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.includes(search);
    const studentDeptId = s.department_id || s.department;
    const matchDept = department === "All" || studentDeptId === parseInt(department);
    return matchSearch && matchDept;
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

  return (
    <div className="min-h-screen font-sans">
      <div className="px-4 pt-4 pb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Students
        </h1>
      </div>

      <div className="mx-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Students Information
          </h2>
          <div className="flex items-center gap-3">
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
            <div className="relative">
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option key="all" value="All">All</option>
                {departments.length > 0 ? departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                )) : (
                  <>
                    <option value={1}>Computer Science</option>
                    <option value={2}>Artificial Intelligence</option>
                    <option value={3}>Information System</option>
                    <option value={4}>Software Engineering</option>
                  </>
                )}
              </select>
              <FaChevronDown
                size={11}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </th>
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
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                    <p className="text-sm">Loading students...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-300">
                  <FaUserGraduate
                    size={32}
                    className="mx-auto mb-3 opacity-30"
                  />
                  <p className="text-sm">No students found</p>
                </td>
              </tr>
            ) : (
              paginated.map((student, index) => {
                const studentId = student.id?.id || student.id || student.student_id || index;
                return (
                  <tr
                    key={studentId}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${selected.includes(studentId) ? "bg-blue-50" : ""
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
                        src={student.profile_picture_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${studentId}`}
                        alt={student.full_name}
                        className="w-9 h-9 rounded-full bg-gray-100 object-cover"
                      />
                    </td>
                    <td className="py-3 px-2 font-semibold text-gray-800 text-sm">
                      {student.full_name}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400">
                      {student.student_id || studentId}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-400">
                      {student.email}
                    </td>
                    <td className="py-3 px-2 text-sm font-semibold text-gray-700">
                      {getDepartmentName(student.department_id || student.department)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

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
              className={`w-7 h-7 rounded-full text-sm font-medium transition-colors ${page === p
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

export default Students;
