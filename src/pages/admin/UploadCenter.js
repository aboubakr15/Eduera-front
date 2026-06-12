import { useState, useRef, useEffect } from "react";
import {
  FaPlus,
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaQuestionCircle,
  FaCommentDots,
  FaSearch,
  FaChevronRight,
  FaChevronDown,
  FaEllipsisH,
  FaBars,
  FaTimes,
  FaPaperclip,
  FaBrain,
  FaBookOpen,
  FaStar,
  FaRegStar,
  FaEdit,
  FaTrash,
  FaFile,
  FaImage,
} from "react-icons/fa";
import { MdOutlineSlideshow } from "react-icons/md";
import botImg from "../../assets/images/botImg.png";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { adminApi } from "../../api/adminApi";
const UploadCenter = () => {
  const [source] = useState("file");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numSlides, setNumSlides] = useState("8");
  const [style, setStyle] = useState("Academic");
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef(null);

  const [collegeFile, setCollegeFile] = useState(null);
  const [collegeDragging, setCollegeDragging] = useState(false);
  const [collegeUploading, setCollegeUploading] = useState(false);
  const [collegeSuccess, setCollegeSuccess] = useState(null);
  const [collegeError, setCollegeError] = useState(null);
  const collegeInputRef = useRef(null);

  const canGenerate = !!uploadedFile;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setGenerated(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setGenerated(false);
    }
  };

  const handleCollegeDrop = (e) => {
    e.preventDefault();
    setCollegeDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setCollegeFile(file);
      setCollegeSuccess(null);
      setCollegeError(null);
    }
  };

  const handleCollegeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCollegeFile(file);
      setCollegeSuccess(null);
      setCollegeError(null);
    }
  };

  const handleCollegeUpload = async () => {
    if (!collegeFile) return;
    setCollegeUploading(true);
    setCollegeError(null);
    setCollegeSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', collegeFile);
      const response = await adminApi.uploadCollegeInstructions(formData);
      const data = response.data;
      setCollegeSuccess(`Success! ${data.tables_extracted || ''} tables extracted.`);
      setCollegeFile(null);
    } catch (err) {
      setCollegeError(err.response?.data?.detail || err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setCollegeUploading(false);
    }
  };

  const slideTitle = uploadedFile?.name.split(".")[0];
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full overflow-y-auto p-3">
      <div className=" mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-[#1B2036] transition-all group"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <FaFile size={20} className="text-[#D67A1E]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Upload Center</h2>
              <p className="text-xs text-gray-400">
                Upload your material here for chatbot!
              </p>
            </div>
          </div>
        </div>

        {/* College Instructions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <GraduationCap size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">College Instructions</h3>
              <p className="text-xs text-gray-400">
                Upload the official college instructions PDF to enable the student chatbot
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              PDF File
            </label>
            {!collegeFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setCollegeDragging(true); }}
                onDragLeave={() => setCollegeDragging(false)}
                onDrop={handleCollegeDrop}
                onClick={() => collegeInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  collegeDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40"
                }`}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <GraduationCap size={20} className="text-indigo-600" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Drop your college instructions PDF here
                </p>
                <p className="text-xs text-gray-400 mb-3">or click to browse</p>
                <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                  PDF only
                </span>
                <input
                  ref={collegeInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleCollegeFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={16} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {collegeFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(collegeFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => { setCollegeFile(null); setCollegeError(null); setCollegeSuccess(null); }}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors flex-shrink-0"
                >
                  <FaTimes size={11} />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleCollegeUpload}
            disabled={!collegeFile || collegeUploading}
            className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all ${
              !collegeFile || collegeUploading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            }`}
          >
            {collegeUploading ? "Uploading..." : "Upload College Instructions"}
          </button>
          {collegeError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {collegeError}
            </div>
          )}
          {collegeSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
              {collegeSuccess}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Upload File
            </label>
            {!uploadedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#D67A1E] bg-orange-50"
                    : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/40"
                }`}
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FaFile size={20} className="text-[#D67A1E]" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Drop your file here
                </p>
                <p className="text-xs text-gray-400 mb-3">or click to browse</p>
                <span className="text-xs text-[#D67A1E] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                  PDF, DOC, DOCX, TXT
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaFile size={16} className="text-[#D67A1E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setGenerated(false);
                  }}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors flex-shrink-0"
                >
                  <FaTimes size={11} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => canGenerate && setGenerated(true)}
            className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all ${
              canGenerate
                ? "bg-[#D67A1E] hover:bg-[#af6b26] shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Upload
          </button>
        </div>

        {generated && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">
              Slides: {slideTitle}
            </h3>
            <div className="space-y-3">
              {Array.from({ length: parseInt(numSlides) || 5 }, (_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <span className="w-7 h-7 rounded-lg bg-orange-100 text-[#D67A1E] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {i === 0
                        ? "Introduction & Overview"
                        : i === (parseInt(numSlides) || 5) - 1
                          ? "Conclusion & Summary"
                          : "Key concept from your file"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Bullet points and visual suggestions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCenter;
