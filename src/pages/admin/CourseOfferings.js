import { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaBook,
} from "react-icons/fa";
import { adminApi } from "../../api/adminApi";

const CourseOfferings = () => {
  const [offerings, setOfferings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [tas, setTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingOffering, setEditingOffering] = useState(null);
  const [form, setForm] = useState({
    course: "",
    semester: "Fall",
    year: new Date().getFullYear(),
    instructor: "",
    tas: [],
    capacity: 30,
    course_schedule: [],
    is_active: true,
  });

  const semesters = ["Fall", "Spring", "Summer"];
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const perPage = 8;

  useEffect(() => {
    fetchData();
  }, [search, semester, yearFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (semester !== "All") params.semester = semester;
      if (yearFilter !== "All") params.year = parseInt(yearFilter);
      if (yearFilter === "All") params.is_active = true;
      
      try {
        const offeringsRes = await adminApi.getCourseOfferings(params);
        setOfferings(offeringsRes.data || []);
      } catch (e) {
        console.error("Failed to fetch offerings:", e);
        setOfferings([]);
      }
      
      try {
        const coursesRes = await adminApi.getCourses();
        console.log("Courses response:", coursesRes);
        setCourses(coursesRes.data || []);
      } catch (e) {
        console.error("Failed to fetch courses:", e);
        setCourses([]);
      }
      
      try {
        const instructorsRes = await adminApi.getUsers('PROFESSOR');
        console.log("Instructors response:", instructorsRes);
        setInstructors(instructorsRes.data || []);
      } catch (e) {
        console.error("Failed to fetch instructors:", e);
        setInstructors([]);
      }
      
      try {
        const tasRes = await adminApi.getUsers('TA');
        console.log("TAs response:", tasRes);
        setTAs(tasRes.data || []);
      } catch (e) {
        console.error("Failed to fetch TAs:", e);
        setTAs([]);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseSchedule = (scheduleStr) => {
    if (!scheduleStr) return [];
    try {
      return typeof scheduleStr === 'string' ? JSON.parse(scheduleStr) : scheduleStr;
    } catch {
      return [];
    }
  };

  const formatSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "-";
    return schedule.map(s => `${s.day} ${s.time}`).join(", ");
  };

  const filtered = offerings.filter((o) => {
    const courseName = o.course_details?.name || o.course_name || "";
    const courseCode = o.course_details?.code || o.course_code || "";
    const matchSearch = search === "" || 
      courseName.toLowerCase().includes(search.toLowerCase()) ||
      courseCode.toLowerCase().includes(search.toLowerCase());
    const matchSemester = semester === "All" || o.semester === semester;
    const matchYear = yearFilter === "All" || o.year === parseInt(yearFilter);
    return matchSearch && matchSemester && matchYear;
  });

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginated.map((o) => o.id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleDelete = (id) => {
    const offering = offerings.find((o) => o.id === id);
    setConfirmDelete(offering);
  };

  const confirmDeleteOffering = async () => {
    try {
      await adminApi.deleteCourseOffering(confirmDelete.id);
      setOfferings((prev) => prev.filter((o) => o.id !== confirmDelete.id));
      setSelected((prev) => prev.filter((x) => x !== confirmDelete.id));
    } catch (error) {
      console.error("Failed to delete offering:", error);
    }
    setConfirmDelete(null);
  };

  const openAdd = () => {
    setEditingOffering(null);
    setForm({
      course: "",
      semester: "Fall",
      year: new Date().getFullYear(),
      instructor: "",
      tas: [],
      capacity: 30,
      course_schedule: [],
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (offering) => {
    setEditingOffering(offering);
    setForm({
      course: offering.course,
      semester: offering.semester,
      year: offering.year,
      instructor: offering.instructor || "",
      tas: offering.tas || [],
      capacity: offering.capacity || 30,
      course_schedule: parseSchedule(offering.course_schedule),
      is_active: offering.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.course || !form.semester || !form.year) return;
    
    const payload = {
      course: parseInt(form.course),
      semester: form.semester,
      year: parseInt(form.year),
      instructor: form.instructor ? parseInt(form.instructor) : null,
      tas: form.tas.map(t => parseInt(t)),
      capacity: parseInt(form.capacity) || 30,
      course_schedule: form.course_schedule,
      is_active: form.is_active,
    };

    try {
      if (editingOffering) {
        const response = await adminApi.updateCourseOffering(editingOffering.id, payload);
        setOfferings((prev) =>
          prev.map((o) => (o.id === editingOffering.id ? { ...o, ...response.data } : o)),
        );
      } else {
        const response = await adminApi.createCourseOffering(payload);
        setOfferings((prev) => [...prev, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save offering:", error);
    }
  };

  const addScheduleSlot = () => {
    setForm((prev) => ({
      ...prev,
      course_schedule: [...prev.course_schedule, { day: "Monday", time: "09:00-10:30" }],
    }));
  };

  const updateScheduleSlot = (index, field, value) => {
    const newSchedule = [...form.course_schedule];
    newSchedule[index][field] = value;
    setForm((prev) => ({ ...prev, course_schedule: newSchedule }));
  };

  const removeScheduleSlot = (index) => {
    const newSchedule = form.course_schedule.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, course_schedule: newSchedule }));
  };

  const pageIds = paginated.map((o) => o.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  return (
    <div className="min-h-screen font-sans">
      <div className="px-4 pt-4 pb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Course Offerings
        </h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:shadow-md shadow-sm transition-all duration-200"
        >
          <FaPlus size={12} />
          Add Offering
        </button>
      </div>

      <div className="mx-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Course Offerings Information
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <FaSearch size={13} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by course name or code"
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
                value={semester}
                onChange={(e) => {
                  setSemester(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option key="all" value="All">All Semesters</option>
                {semesters.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <FaChevronDown
                size={11}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 outline-none cursor-pointer"
              >
                <option key="all" value="All">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
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
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Course
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Instructor
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Semester
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Capacity
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Enrolled
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Schedule
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Status
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                    <p className="text-sm">Loading offerings...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-gray-300">
                  <FaBook size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No offerings found</p>
                </td>
              </tr>
            ) : (
              paginated.map((offering) => (
                <tr
                  key={offering.id}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                    selected.includes(offering.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(offering.id)}
                      onChange={() => toggleSelect(offering.id)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="font-semibold text-gray-800 text-sm">
                      {offering.course_details?.name || offering.course_name || "-"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {offering.course_details?.code || offering.course_code || "-"}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {offering.instructor_name || "-"}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {offering.semester} {offering.year}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {offering.capacity || 30}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700">
                    {offering.enrollment_count || 0}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-500">
                    {formatSchedule(offering.course_schedule)}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      offering.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {offering.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(offering)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <FaEdit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(offering.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash size={20} className="text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              Delete Offering?
            </h2>
            <p className="text-sm text-gray-400 mb-1">
              You are about to delete{" "}
              <span className="font-semibold text-gray-700">
                {confirmDelete.course_details?.name || confirmDelete.course_name}
              </span>
            </p>
            <p className="text-xs text-gray-400 mb-7">
              {confirmDelete.semester} {confirmDelete.year}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-100 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOffering}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-100 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingOffering ? "Edit Course Offering" : "Add New Course Offering"}
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Course Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Course *
                </label>
                <div className="relative">
                  <select
                    value={form.course}
                    onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
                    className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                  <FaChevronDown
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Semester & Year */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Semester *
                  </label>
                  <div className="relative">
                    <select
                      value={form.semester}
                      onChange={(e) => setForm((f) => ({ ...f, semester: e.target.value }))}
                      className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                    >
                      {semesters.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <FaChevronDown
                      size={11}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Year *
                  </label>
                  <div className="relative">
                    <select
                      value={form.year}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                      className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <FaChevronDown
                      size={11}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Instructor Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Instructor (Professor)
                </label>
                <div className="relative">
                  <select
                    value={form.instructor}
                    onChange={(e) => setForm((f) => ({ ...f, instructor: e.target.value }))}
                    className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((i) => (
                      <option key={i.id} value={i.id}>{i.full_name}</option>
                    ))}
                  </select>
                  <FaChevronDown
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* TAs Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Teaching Assistants
                </label>
                <div className="relative">
                  <select
                    multiple
                    value={form.tas}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setForm((f) => ({ ...f, tas: selected }));
                    }}
                    className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors h-24"
                  >
                    {tas.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                  className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Schedule
                </label>
                {form.course_schedule.map((slot, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={slot.day}
                      onChange={(e) => updateScheduleSlot(index, "day", e.target.value)}
                      className="flex-1 border border-gray-100 bg-gray-50 rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) => updateScheduleSlot(index, "time", e.target.value)}
                      placeholder="09:00-10:30"
                      className="flex-1 border border-gray-100 bg-gray-50 rounded-lg px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => removeScheduleSlot(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addScheduleSlot}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  + Add Time Slot
                </button>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <label className="text-sm text-gray-700">Active</label>
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
                {editingOffering ? "Save Changes" : "Add Offering"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOfferings;