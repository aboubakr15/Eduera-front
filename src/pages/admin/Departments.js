import { useState, useEffect } from "react";
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
import { adminApi } from "../../api/adminApi";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form, setForm] = useState({
    name: "",
    name_ar: "",
    code: "",
    head_of_department: "",
  });

  const perPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
    fetchProfessors();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDepartments({ search });
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await adminApi.getUsers("PROFESSOR");
      setProfessors(response.data);
    } catch (error) {
      console.error("Failed to fetch professors:", error);
    }
  };

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);


  const handleDelete = (id) => {
    const dept = departments.find((d) => d.id === id);
    setConfirmDelete(dept);
  };

  const confirmDeleteDepartment = async () => {
    try {
      await adminApi.deleteDepartment(confirmDelete.id);
      setDepartments((prev) => prev.filter((d) => d.id !== confirmDelete.id));
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
    setConfirmDelete(null);
  };

  const openAdd = () => {
    setEditingDepartment(null);
    setForm({
      name: "",
      name_ar: "",
      code: "",
      head_of_department: "",
    });
    setShowModal(true);
  };

  const openEdit = (dept) => {
    setEditingDepartment(dept);
    setForm({
      name: dept.name,
      name_ar: dept.name_ar || "",
      code: dept.code,
      head_of_department: dept.head_of_department || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.code) return;

    const payload = {
      name: form.name,
      name_ar: form.name_ar,
      code: form.code,
      head_of_department: form.head_of_department || null,
    };

    try {
      if (editingDepartment) {
        const response = await adminApi.updateDepartment(
          editingDepartment.id,
          payload,
        );
        setDepartments((prev) =>
          prev.map((d) =>
            d.id === editingDepartment.id ? { ...d, ...response.data } : d,
          ),
        );
      } else {
        const response = await adminApi.createDepartment(payload);
        setDepartments((prev) => [...prev, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save department:", error);
    }
  };


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
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Department Name
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Code
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-2">
                Head of Department
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right pr-6">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-300">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D67A1E] rounded-full animate-spin"></div>
                    <p className="text-sm">Loading departments...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-300">
                  <FaBuilding size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No departments found</p>
                </td>
              </tr>
            ) : (
              paginated.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="py-3 px-2 font-semibold text-gray-800 text-sm">
                    {dept.name}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.code}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-400">
                    {dept.head_of_department_name || "-"}
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
                  label: "Arabic Name",
                  key: "name_ar",
                  type: "text",
                  placeholder: "e.g. علوم الحاسب",
                },
                {
                  label: "Code",
                  key: "code",
                  type: "text",
                  placeholder: "e.g. CS",
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

              {/* Head of Department Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Head of Department
                </label>
                <div className="relative">
                  <select
                    value={form.head_of_department}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        head_of_department: e.target.value,
                      }))
                    }
                    className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:bg-white transition-colors"
                  >
                    <option value="">-- Select Professor --</option>
                    {professors.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown
                    size={11}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
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
