import { useState, useEffect } from "react";
import {
  FaPlus,
  FaFileAlt,
  FaArrowRight,
  FaTrash,
  FaExclamationTriangle,
} from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { instructorApi } from "../../api/instructorApi";

const InstructorMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCourse, setFilterCourse] = useState("");
  const [filterMaterialType, setFilterMaterialType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    course_offering: "",
    title: "",
    description: "",
    material_type: "LECTURE",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const coursesRes = await instructorApi.getCourses();
        const coursesData = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data.results || [];
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }

      try {
        const materialsRes = await instructorApi.getMaterials();
        const materialsData = Array.isArray(materialsRes.data)
          ? materialsRes.data
          : materialsRes.data.results || [];
        setMaterials(materialsData);
      } catch (err) {
        console.error("Failed to fetch materials:", err);
        setError("Failed to load materials");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };
  const handleViewFile = async (fullUrl) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } catch (err) {
      console.error("Failed to open file:", err);
      alert("Failed to open the file.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("course_offering", newMaterial.course_offering);
      formData.append("title", newMaterial.title);
      formData.append("description", newMaterial.description);
      formData.append("material_type", newMaterial.material_type);

      if (selectedFile) {
        formData.append("file", selectedFile);
        const ext = selectedFile.name.split(".").pop().toLowerCase();
        formData.append("file_type", ext);
      }

      const response = await instructorApi.createMaterial(formData);

      if (response.data) {
        setMaterials([response.data, ...materials]);
      }

      setShowModal(false);
      setSelectedFile(null);
      setNewMaterial({
        course_offering: "",
        title: "",
        description: "",
        material_type: "LECTURE",
      });
    } catch (err) {
      console.error(
        "Failed to create material:",
        err.response?.data || err.message,
      );
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Failed to upload material. Please check all fields.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (material) => {
    setMaterialToDelete(material);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!materialToDelete) return;
    setDeleting(true);
    try {
      await instructorApi.deleteMaterial(materialToDelete.id);
      setMaterials(materials.filter((m) => m.id !== materialToDelete.id));
      setShowDeleteModal(false);
      setMaterialToDelete(null);
    } catch (err) {
      console.error("Failed to delete material:", err);
      setError("Failed to delete material");
    } finally {
      setDeleting(false);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesCourse =
      !filterCourse || m.course_offering === parseInt(filterCourse);
    const matchesType =
      !filterMaterialType || m.material_type === filterMaterialType;
    return matchesCourse && matchesType;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D67A1E]"></div>
      </div>
    );

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <div className="px-4 pt-4 pb-6 flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Materials
            </h1>
            <p className="text-sm text-gray-400">
              Manage your course materials
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#282f4f] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <FaPlus size={14} /> Add Material
        </button>
      </div>

      <div className="mx-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-base">
            Materials Information
            {filteredMaterials.length > 0 && (
              <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-xs font-semibold">
                {filteredMaterials.length} Items
              </span>
            )}
          </h2>

          <div className="flex items-center gap-3">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.course_name || c.course?.name || `Course #${c.id}`}
                </option>
              ))}
            </select>

            <select
              value={filterMaterialType}
              onChange={(e) => setFilterMaterialType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all"
            >
              <option value="">All Types</option>
              <option value="LECTURE">Lecture</option>
              <option value="SECTION">Section</option>
              <option value="ASSIGNMENT_DESC">Assignment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-6">
                Title
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-4">
                Course
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-4">
                Type
              </th>
              <th className="py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-left px-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-300">
                  <FaFileAlt size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    {filterCourse || filterMaterialType
                      ? "No materials match the selected filters."
                      : "You haven't uploaded any materials yet."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredMaterials.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaFileAlt className="text-[#D67A1E]" size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {m.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {m.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                    {m.course_name || m.course?.name || "-"}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {m.material_type === "ASSIGNMENT_DESC"
                        ? "Assignment"
                        : m.material_type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewFile(m.file_download_url)}
                        className="flex items-center mr-10 text-sm text-[#D67A1E] font-semibold hover:underline"
                      >
                        View File
                      </button>
                      <button
                        onClick={() => openDeleteModal(m)}
                        className=" text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Material"
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
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 my-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete Material
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800">
                "{materialToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setMaterialToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium transition-opacity shadow-sm flex items-center justify-center gap-2 ${
                  deleting
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Upload Material
            </h2>

            {submitError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-medium text-xs border border-red-100">
                {submitError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Course
                </label>
                <select
                  value={newMaterial.course_offering}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      course_offering: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                >
                  <option value="">Select course</option>
                  {courses.length > 0 ? (
                    courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.course_name || c.course?.name || `Course #${c.id}`}
                      </option>
                    ))
                  ) : (
                    <option disabled>No courses available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  value={newMaterial.title}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, title: e.target.value })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={newMaterial.description}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      description: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 resize-none bg-gray-50/50"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Type
                </label>
                <select
                  value={newMaterial.material_type}
                  onChange={(e) =>
                    setNewMaterial({
                      ...newMaterial,
                      material_type: e.target.value,
                    })
                  }
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 bg-gray-50/50"
                >
                  <option value="LECTURE">Lecture</option>
                  <option value="SECTION">Section</option>
                  <option value="ASSIGNMENT_DESC">Assignment</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Upload File
                </label>
                <div
                  onClick={() => document.getElementById("file-upload").click()}
                  className="w-full text-sm border border-dashed border-gray-300 rounded-xl px-4 py-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors bg-gray-50/50"
                >
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-[#D67A1E]">
                      <FaFileAlt size={16} />
                      <span className="font-medium truncate">
                        {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400">
                      Click to select a file from your computer
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFile(null);
                    setSubmitError(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-4 py-2.5 bg-[#1B2036] text-white rounded-xl text-sm font-medium transition-opacity shadow-sm flex items-center justify-center gap-2 ${
                    submitting
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:opacity-90"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    "Upload Material"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorMaterials;
