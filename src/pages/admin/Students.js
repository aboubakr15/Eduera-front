import { useState, useEffect } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaUserGraduate,
  FaBookOpen,
} from "react-icons/fa";
import { adminApi } from "../../api/adminApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    department: "",
    gender: "",
    student_current_level: "",
  });

  const [enrollmentModal, setEnrollmentModal] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courseOfferings, setCourseOfferings] = useState([]);
  const [selectedOffering, setSelectedOffering] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

  const perPage = 8;

  useEffect(() => {
    fetchData();
    fetchCourseOfferings();
  }, [search, department]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, deptsRes] = await Promise.all([
        adminApi.getUsers("STUDENT"),
        adminApi.getDepartments(),
      ]);
      setStudents(studentsRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseOfferings = async () => {
    try {
      const res = await adminApi.getCourseOfferings();
      setCourseOfferings(res.data);
    } catch (error) {
      console.error("Failed to fetch course offerings:", error);
    }
  };

  const fetchEnrollments = async (studentId) => {
    try {
      setEnrollmentsLoading(true);
      const res = await adminApi.getEnrollments({ student: studentId });
      setEnrollments(res.data);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  const openEnrollmentModal = (student) => {
    setEnrollmentModal(student);
    setSelectedOffering("");
    fetchEnrollments(student.id);
  };

  const handleEnroll = async () => {
    if (!selectedOffering || !enrollmentModal) return;
    try {
      setEnrollLoading(true);
      const res = await adminApi.createEnrollment({
        student: enrollmentModal.id,
        course_offering: parseInt(selectedOffering),
        status: "ACTIVE",
      });
      setEnrollments((prev) => [...prev, res.data]);
      setSelectedOffering("");
    } catch (error) {
      console.error("Failed to enroll student:", error);
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    try {
      await adminApi.deleteEnrollment(enrollmentId);
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    } catch (error) {
      console.error("Failed to unenroll student:", error);
    }
  };

  const getDepartmentName = (deptId) => {
    if (!deptId) return "-";
    if (typeof deptId === "object") return deptId.name || "-";
    const dept = departments.find(
      (d) => d.id === deptId || d.id === parseInt(deptId),
    );
    return dept?.name || "-";
  };

  const filtered = students.filter((s) => {
    const searchLower = search.toLowerCase();
    const studentId = s.id?.toString() || s.student_id?.toString() || "";
    const matchSearch =
      s.full_name?.toLowerCase().includes(searchLower) ||
      s.email?.toLowerCase().includes(searchLower) ||
      studentId.includes(search);
    const studentDeptId = s.department_id || s.department;
    const matchDept =
      department === "All" || studentDeptId == parseInt(department);
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

  const handleDelete = (id) => {
    const student = students.find((s) => s.id === id);
    setConfirmDelete(student);
  };

  const confirmDeleteStudent = async () => {
    try {
      await adminApi.deleteUser(confirmDelete.id);
      setStudents((prev) => prev.filter((s) => s.id !== confirmDelete.id));
      setSelected((prev) => prev.filter((x) => x !== confirmDelete.id));
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
    setConfirmDelete(null);
  };

  const openAdd = () => {
    setEditingStudent(null);
    setForm({
      username: "",
      email: "",
      password: "",
      full_name: "",
      department: "",
      gender: "",
      student_current_level: "",
    });
    setShowModal(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setForm({
      username: student.username || "",
      email: student.email,
      password: "",
      full_name: student.full_name,
      department: student.department || "",
      gender: student.gender || "",
      student_current_level: student.student_current_level || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.email || !form.full_name) return;

    const payload = {
      username: form.username || form.email.split("@")[0],
      email: form.email,
      full_name: form.full_name,
      department: form.department ? parseInt(form.department) : null,
    };

    if (form.password) payload.password = form.password;
    if (form.gender) payload.gender = form.gender;
    if (form.student_current_level) payload.student_current_level = parseInt(form.student_current_level);

    try {
      if (editingStudent) {
        const response = await adminApi.updateUser(editingStudent.id, payload);
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id ? { ...s, ...response.data } : s,
          ),
        );
      } else {
        payload.primary_role = "STUDENT";
        const response = await adminApi.createStudent(payload);
        setStudents((prev) => [...prev, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const pageIds = paginated.map((s) => s.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const navigate = useNavigate();

  const levels = [
    { value: "1", label: "Level 1" },
    { value: "2", label: "Level 2" },
    { value: "3", label: "Level 3" },
    { value: "4", label: "Level 4" },
    { value: "5", label: "Level 5" },
  ];

  return (
    <div className="min-h-screen font-sans">
      <div className="px-4 pt-4 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
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

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:shadow-md shadow-sm transition-all duration-200"
        >
          <FaPlus size={12} />
          Add Student
        </button>
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
                <option key="all" value="All">
                  All
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
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
                Department
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-6">
                Actions
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
              paginated.map((student, index) => {
                const studentId =
                  student.id?.id || student.id || student.student_id || index;
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
                          student.profile_picture_url ||
                          `https://api.dicebear.com/7.x/adventurer/svg?seed=${studentId}`
                        }
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
                      {getDepartmentName(
                        student.department_id || student.department,
                      )}
                    </td>
                    <td className="py-3 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(student)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={14} />
                        </button>
                        <button
                          onClick={() => openEnrollmentModal(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <FaBookOpen size={11} />
                          Enroll
                        </button>
                      </div>
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@edu.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  {editingStudent ? "New Password (leave blank to keep)" : "Password *"}
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      value={form.department}
                      onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                      className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <FaChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="w-28">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Level
                  </label>
                  <div className="relative">
                    <select
                      value={form.student_current_level}
                      onChange={(e) => setForm((f) => ({ ...f, student_current_level: e.target.value }))}
                      className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                    >
                      <option value="">Level</option>
                      {levels.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                    <FaChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <div className="flex gap-4">
                  {["M", "F"].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                        className="accent-[#D67A1E]"
                      />
                      <span className="text-sm text-gray-600">{g === "M" ? "Male" : "Female"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl bg-[#D67A1E] text-white text-sm font-semibold hover:bg-[#af6b26] transition-colors"
              >
                {editingStudent ? "Save Changes" : "Add Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash size={20} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Delete Student?
            </h2>
            <p className="text-sm text-gray-400 mb-1">
              You are about to deactivate{" "}
              <span className="font-semibold text-gray-700">
                {confirmDelete.full_name}
              </span>
            </p>
            <p className="text-xs text-gray-400 mb-7">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Modal */}
      {enrollmentModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Enrollments
                </h2>
                <p className="text-sm text-gray-400">
                  {enrollmentModal.full_name} ({enrollmentModal.student_id || enrollmentModal.id})
                </p>
              </div>
              <button
                onClick={() => setEnrollmentModal(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Current Enrollments
              </h3>
              {enrollmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                </div>
              ) : enrollments.length === 0 ? (
                <p className="text-sm text-gray-300 text-center py-8">
                  No enrollments found
                </p>
              ) : (
                <div className="space-y-2">
                  {enrollments.map((enr) => (
                    <div
                      key={enr.id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {enr.course_offering_details?.course_name || "Course"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {enr.course_offering_details?.course_code} &middot;{" "}
                          {enr.course_offering_details?.semester}{" "}
                          {enr.course_offering_details?.year}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            enr.status === "ACTIVE"
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {enr.status}
                        </span>
                        <button
                          onClick={() => handleUnenroll(enr.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Enroll in Course Offering
              </h3>
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <select
                    value={selectedOffering}
                    onChange={(e) => setSelectedOffering(e.target.value)}
                    className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  >
                    <option value="">-- Select Course Offering --</option>
                    {courseOfferings.map((co) => (
                      <option key={co.id} value={co.id}>
                        {co.course_details?.code} - {co.course_details?.name} ({co.semester} {co.year})
                      </option>
                    ))}
                  </select>
                  <FaChevronDown
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={!selectedOffering || enrollLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D67A1E] text-white text-sm font-semibold hover:bg-[#af6b26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrollLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <FaPlus size={11} />
                  )}
                  Enroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
