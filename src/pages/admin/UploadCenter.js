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
import { ArrowLeft } from "lucide-react";
const UploadCenter = () => {
  const [source] = useState("file");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numSlides, setNumSlides] = useState("8");
  const [style, setStyle] = useState("Academic");
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef(null);

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
