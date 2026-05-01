import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const initialDepartments = [
  {
    id: 1,
    name: "Computer Science",
    code: "CS",
    head: "Dr. Walter White",
    numStudents: 450,
    numInstructors: 18,
    establishedYear: 1995,
  },
  {
    id: 2,
    name: "Artificial Intelligence",
    code: "AI",
    head: "Dr. John wick",
    numStudents: 320,
    numInstructors: 14,
    establishedYear: 2010,
  },
  {
    id: 3,
    name: "Information System",
    code: "IS",
    head: "Dr. White Nigga",
    numStudents: 390,
    numInstructors: 16,
    establishedYear: 2000,
  },
  {
    id: 4,
    name: "Internet Technology",
    code: "IT",
    head: "Dr. Batman",
    numStudents: 280,
    numInstructors: 12,
    establishedYear: 2005,
  },
  {
    id: 5,
    name: "Software Engineering",
    code: "SE",
    head: "Dr. Joker",
    numStudents: 360,
    numInstructors: 15,
    establishedYear: 2008,
  },
];

const Departments = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    head: "",
    numStudents: "",
    numInstructors: "",
    establishedYear: "",
  });

  const perPage = 8;

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    const pageIds = paginated.map((d) => d.id);
    const allSelected = pageIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleDelete = (id) => {
    const dept = departments.find((d) => d.id === id);
    setConfirmDelete(dept);
  };

  const confirmDeleteDepartment = () => {
    setDepartments((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    setSelected((prev) => prev.filter((x) => x !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const openAdd = () => {
    setEditingDepartment(null);
    setForm({
      name: "",
      code: "",
      head: "",
      numStudents: "",
      numInstructors: "",
      establishedYear: "",
    });
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setEditingDepartment(dept);
    setForm({
      name: dept.name,
      code: dept.code,
      head: dept.head,
      numStudents: dept.numStudents,
      numInstructors: dept.numInstructors,
      establishedYear: dept.establishedYear,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code) return;
    if (editingDepartment) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === editingDepartment.id ? { ...d, ...form } : d,
        ),
      );
    } else {
      const newId = Date.now();
      setDepartments((prev) => [...prev, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  const pageIds = paginated.map((d) => d.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans">
      <div className="px-4 pt-4 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-[#1B2036] transition-all group"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Departments
          </h1>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:shadow-md shadow-sm transition-all duration-200"
        >
          <FaPlus size={12} />
          Add Department
        </button>
      </div>

      <div className="mx-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Departments Information
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <FaSearch size={13} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or code"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-52"
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
                Department Name
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Code
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Head of Department
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                No. Students
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                No. Instructors
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Est. Year
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-gray-300">
                  <FaBuilding size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No departments found</p>
                </td>
              </tr>
            ) : (
              paginated.map((dept) => (
                <tr
                  key={dept.id}
                  className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                    selected.includes(dept.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(dept.id)}
                      onChange={() => toggleSelect(dept.id)}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-2 font-semibold text-gray-800 text-sm">
                    {dept.name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.code}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.head}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.numStudents}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.numInstructors}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.establishedYear}
                  </td>
                  <td className="py-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => openEdit(dept)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <FaEdit size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
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
              Delete Department?
            </h2>
            <p className="text-sm text-gray-400 mb-1">
              You are about to delete{" "}
              <span className="font-semibold text-gray-700">
                {confirmDelete.name}
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
                onClick={confirmDeleteDepartment}
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingDepartment ? "Edit Department" : "Add New Department"}
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: "Department Name",
                  key: "name",
                  type: "text",
                  placeholder: "e.g. Computer Science",
                },
                {
                  label: "Code",
                  key: "code",
                  type: "text",
                  placeholder: "e.g. CS",
                },
                {
                  label: "Head of Department",
                  key: "head",
                  type: "text",
                  placeholder: "e.g. Dr. Ahmed Hassan",
                },
                {
                  label: "Number of Students",
                  key: "numStudents",
                  type: "number",
                  placeholder: "e.g. 450",
                },
                {
                  label: "Number of Instructors",
                  key: "numInstructors",
                  type: "number",
                  placeholder: "e.g. 18",
                },
                {
                  label: "Established Year",
                  key: "establishedYear",
                  type: "number",
                  placeholder: "e.g. 1995",
                },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  />
                </div>
              ))}
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
                {editingDepartment ? "Save Changes" : "Add Department"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
