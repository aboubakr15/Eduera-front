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
const dummyChats = [
  { id: 1, title: "How does backpropagation work?", starred: false },
  { id: 2, title: "Explain overfitting vs underfitting", starred: false },
  { id: 3, title: "What is a transformer model?", starred: false },
  { id: 4, title: "Neural network architectures", starred: false },
];

const courses = [
  "Introduction to Programming",
  "Data Structures & Algorithms",
  "Object Oriented Programming",
];

// Quiz Generator
const QuizGenerator = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numQ, setNumQ] = useState("5");
  const [difficulty, setDifficulty] = useState("Medium");
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef(null);

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

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#F8F9FB]">
      <div className="max-w-5xl px-10 mx-auto w-full py-10">
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D67A1E]/15 to-[#D67A1E]/5 flex items-center justify-center border border-[#D67A1E]/10">
            <FaQuestionCircle size={18} className="text-[#D67A1E]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Quiz Generator
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Upload a file and generate a quiz from it
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] shadow-gray-200/50 p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
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
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-[#D67A1E] bg-[#D67A1E]/[0.03] scale-[1.005]"
                    : "border-gray-200/80 bg-[#FAFBFC] hover:border-[#D67A1E]/50 hover:bg-[#D67A1E]/[0.015]"
                }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#D67A1E]/10 to-[#D67A1E]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaFile size={22} className="text-[#D67A1E]" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Drop your file here
                </p>
                <p className="text-xs text-gray-400 mb-3">or click to browse</p>
                <span className="text-[11px] text-[#D67A1E] font-medium bg-[#D67A1E]/[0.06] border border-[#D67A1E]/10 px-3 py-1 rounded-full">
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
              <div className="flex items-center gap-3.5 bg-[#FAFBFC] border border-gray-200/60 rounded-2xl p-4">
                <div className="w-11 h-11 bg-gradient-to-br from-[#D67A1E]/10 to-[#D67A1E]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaFile size={17} className="text-[#D67A1E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setGenerated(false);
                  }}
                  className="w-8 h-8 rounded-xl bg-white border border-gray-200/60 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 transition-all duration-200 flex-shrink-0"
                >
                  <FaTimes size={11} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Questions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numQ}
                onChange={(e) => setNumQ(e.target.value)}
                className="w-full border border-gray-200/60 bg-[#FAFBFC] rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D67A1E]/40 focus:bg-white focus:ring-2 focus:ring-[#D67A1E]/5 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full appearance-none border border-gray-200/60 bg-[#FAFBFC] rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D67A1E]/40 focus:bg-white focus:ring-2 focus:ring-[#D67A1E]/5 transition-all duration-200"
              >
                {["Easy", "Medium", "Hard"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => uploadedFile && setGenerated(true)}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              uploadedFile
                ? "bg-[#D67A1E] hover:bg-[#c06d19] text-white shadow-md shadow-[#D67A1E]/20 hover:shadow-lg hover:shadow-[#D67A1E]/25 active:scale-[0.995]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Generate Quiz
          </button>
        </div>

        {generated && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] shadow-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">
                {uploadedFile?.name.split(".")[0]}
              </h3>
              <span
                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold ${
                  difficulty === "Easy"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : difficulty === "Hard"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}
              >
                {difficulty}
              </span>
            </div>
            <div className="space-y-4">
              {Array.from({ length: parseInt(numQ) || 3 }, (_, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#FAFBFC] rounded-2xl border border-gray-100/80"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Q{i + 1}. Sample question from your file?
                  </p>
                  <div className="space-y-2">
                    {["A", "B", "C", "D"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-700 group transition-colors duration-150"
                      >
                        <span className="w-6 h-6 rounded-full border-2 border-gray-200/80 group-hover:border-gray-300 flex items-center justify-center text-[11px] font-bold transition-all duration-150 flex-shrink-0 text-gray-400 group-hover:text-gray-600">
                          {opt}
                        </span>
                        Sample answer option {opt}
                      </label>
                    ))}
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

// Presentation Generator
const PresentationGenerator = () => {
  const [source, setSource] = useState("file");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [numSlides, setNumSlides] = useState("8");
  const [style, setStyle] = useState("Academic");
  const [generated, setGenerated] = useState(false);
  const fileInputRef = useRef(null);

  const canGenerate =
    source === "file" ? !!uploadedFile : textInput.trim().length > 0;

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

  const slideTitle =
    source === "file"
      ? uploadedFile?.name.split(".")[0]
      : textInput.slice(0, 40) + (textInput.length > 40 ? "..." : "");

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#F8F9FB]">
      <div className="max-w-5xl mx-auto w-full py-10 px-10">
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#D67A1E]/15 to-[#D67A1E]/5 flex items-center justify-center border border-[#D67A1E]/10">
            <MdOutlineSlideshow size={20} className="text-[#D67A1E]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Presentation Generator
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Generate a presentation from a file or text
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] shadow-gray-200/50 p-6 space-y-5">
          <div className="flex gap-1 p-1 bg-[#F3F4F6] rounded-xl">
            {[
              { id: "file", label: "From File" },
              { id: "text", label: "From Text" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSource(tab.id);
                  setGenerated(false);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  source === tab.id
                    ? "bg-white text-[#D67A1E] shadow-sm shadow-gray-200/50"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {source === "file" && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
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
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-[#D67A1E] bg-[#D67A1E]/[0.03] scale-[1.005]"
                      : "border-gray-200/80 bg-[#FAFBFC] hover:border-[#D67A1E]/50 hover:bg-[#D67A1E]/[0.015]"
                  }`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-[#D67A1E]/10 to-[#D67A1E]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaFile size={22} className="text-[#D67A1E]" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Drop your file here
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    or click to browse
                  </p>
                  <span className="text-[11px] text-[#D67A1E] font-medium bg-[#D67A1E]/[0.06] border border-[#D67A1E]/10 px-3 py-1 rounded-full">
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
                <div className="flex items-center gap-3.5 bg-[#D67A1E]/[0.03] border border-[#D67A1E]/10 rounded-2xl p-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#D67A1E]/15 to-[#D67A1E]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaFile size={17} className="text-[#D67A1E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setGenerated(false);
                    }}
                    className="w-8 h-8 rounded-xl bg-white border border-gray-200/60 flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 transition-all duration-200 flex-shrink-0"
                  >
                    <FaTimes size={11} />
                  </button>
                </div>
              )}
            </div>
          )}

          {source === "text" && (
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Your Text
              </label>
              <textarea
                placeholder="Paste or type your content here... e.g. lecture notes, article, summary"
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setGenerated(false);
                }}
                rows={6}
                className="w-full border border-gray-200/60 bg-[#FAFBFC] rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-[#D67A1E]/40 focus:bg-white focus:ring-2 focus:ring-[#D67A1E]/5 transition-all duration-200 resize-none"
              />
              <p className="text-[11px] text-gray-400 mt-1.5 text-right font-medium">
                {textInput.length} characters
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Slides
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={numSlides}
                onChange={(e) => setNumSlides(e.target.value)}
                className="w-full border border-gray-200/60 bg-[#FAFBFC] rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D67A1E]/40 focus:bg-white focus:ring-2 focus:ring-[#D67A1E]/5 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full appearance-none border border-gray-200/60 bg-[#FAFBFC] rounded-xl px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-[#D67A1E]/40 focus:bg-white focus:ring-2 focus:ring-[#D67A1E]/5 transition-all duration-200"
              >
                {["Academic", "Professional", "Creative"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => canGenerate && setGenerated(true)}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              canGenerate
                ? "bg-[#D67A1E] hover:bg-[#c06d19] text-white shadow-md shadow-[#D67A1E]/20 hover:shadow-lg hover:shadow-[#D67A1E]/25 active:scale-[0.995]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Generate Presentation
          </button>
        </div>

        {generated && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] shadow-gray-200/50 p-6">
            <h3 className="font-bold text-gray-800 mb-5">
              Slides: {slideTitle}
            </h3>
            <div className="space-y-3">
              {Array.from({ length: parseInt(numSlides) || 5 }, (_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-4 bg-[#FAFBFC] rounded-2xl border border-gray-100/80"
                >
                  <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D67A1E]/15 to-[#D67A1E]/5 text-[#D67A1E] flex items-center justify-center text-xs font-bold flex-shrink-0 border border-[#D67A1E]/10">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {i === 0
                        ? "Introduction & Overview"
                        : i === (parseInt(numSlides) || 5) - 1
                          ? "Conclusion & Summary"
                          : `Key concept from your ${source === "file" ? "file" : "text"}`}
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

//  Toolbar
const Toolbar = ({
  onAttach,
  deepThinking,
  setDeepThinking,
  selectedCourse,
  setSelectedCourse,
  showCourseMenu,
  setShowCourseMenu,
  attachedFiles,
  onRemoveFile,
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    <button
      onClick={onAttach}
      className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl border text-[13px] font-medium transition-all duration-200 ${
        attachedFiles?.length > 0
          ? "border-[#465182]/20 bg-[#465182]/[0.04] text-[#465182]"
          : "border-gray-200/60 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300/60"
      }`}
    >
      <FaPaperclip size={11} />
      Attach
      {attachedFiles?.length > 0 && (
        <span className="ml-0.5 bg-[#465182] text-white text-[10px] rounded-md w-4 h-4 flex items-center justify-center font-bold">
          {attachedFiles.length}
        </span>
      )}
    </button>

    <button
      onClick={() => setDeepThinking(!deepThinking)}
      className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl border text-[13px] font-medium transition-all duration-200 ${
        deepThinking
          ? "border-[#D67A1E]/25 bg-[#D67A1E]/[0.06] text-[#D67A1E]"
          : "border-gray-200/60 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300/60"
      }`}
    >
      <FaBrain size={11} />
      Deep Thinking
    </button>

    {/* Choose Course */}
    <div className="relative">
      <button
        onClick={() => setShowCourseMenu(!showCourseMenu)}
        className={`flex items-center gap-1.5 px-3.5 py-[7px] rounded-xl border text-[13px] font-medium transition-all duration-200 ${
          selectedCourse
            ? "border-[#465182]/20 bg-[#465182]/[0.04] text-[#465182]"
            : "border-gray-200/60 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300/60"
        }`}
      >
        <FaBookOpen size={11} />
        {selectedCourse ? (
          <span className="max-w-[120px] truncate">{selectedCourse}</span>
        ) : (
          "Choose Course"
        )}
        <FaChevronDown size={9} className="ml-0.5 opacity-60" />
      </button>
      {showCourseMenu && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200/60 rounded-xl shadow-xl shadow-gray-200/40 overflow-hidden z-20 w-64">
          {courses.map((course) => (
            <button
              key={course}
              onClick={() => {
                setSelectedCourse(course);
                setShowCourseMenu(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors duration-150 ${
                selectedCourse === course
                  ? "bg-[#D67A1E]/[0.06] text-[#D67A1E] font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {course}
            </button>
          ))}
          {selectedCourse && (
            <button
              onClick={() => {
                setSelectedCourse("");
                setShowCourseMenu(false);
              }}
              className="w-full text-left px-4 py-2.5 text-[11px] text-gray-400 hover:bg-gray-50 border-t border-gray-100 font-medium"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

const FileChip = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className="flex items-center gap-2 bg-[#465182]/[0.05] border border-[#465182]/10 rounded-xl px-3 py-2">
      {isImage && preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-8 h-8 rounded-lg object-cover flex-shrink-0 ring-1 ring-black/5"
        />
      ) : (
        <FaFile size={13} className="text-[#465182]/40 flex-shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-[#465182] truncate max-w-[120px]">
          {file.name}
        </p>
        <p className="text-[10px] text-[#465182]/40 font-medium">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 text-[#465182]/25 hover:text-red-500 transition-colors duration-150 text-sm leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
};

const FilesPreviewStrip = ({ files, onRemove }) => {
  if (!files || files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {files.map((file, i) => (
        <FileChip key={i} file={file} onRemove={() => onRemove(i)} />
      ))}
    </div>
  );
};

// Welcome Screen
const WelcomeScreen = ({ onSend }) => {
  const [input, setInput] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim(), attachedFiles);
    setInput("");
    setAttachedFiles([]);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachedFiles((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 10);
    });
    e.target.value = "";
  };

  const removeFile = (index) =>
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div
      className="flex flex-col h-full items-center bg-[#F8F9FB] justify-center relative"
      onClick={() => setShowCourseMenu(false)}
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#465182]/[0.015] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#D67A1E]/[0.015] rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center relative z-10">
        <div className="w-28 h-28 mb-5 rounded-full bg-gradient-to-br from-gray-50 to-gray-100/80 overflow-hidden ring-1 ring-gray-200/50 shadow-lg shadow-gray-200/30">
          <img
            src={botImg}
            alt="Bot"
            className="w-full h-full object-cover brightness-[0.8] saturate-[0.9]"
          />
        </div>

        <h1 className="text-[28px] font-bold text-gray-800 mb-1.5 tracking-tight">
          Welcome, there
        </h1>
        <p className="text-gray-400 text-[15px] mb-10">How can I help you?</p>

        <div
          className="w-full bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/30 px-5 py-4 flex flex-col gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-xl bg-[#465182] flex items-center justify-center hover:bg-[#3a4570] transition-all duration-200 flex-shrink-0 shadow-md shadow-[#465182]/20 active:scale-95"
            >
              <FaPaperPlane size={12} className="text-white" />
            </button>
          </div>
          <FilesPreviewStrip files={attachedFiles} onRemove={removeFile} />
          <div className="border-t border-gray-100 pt-2.5">
            <Toolbar
              onAttach={() => fileInputRef.current?.click()}
              deepThinking={deepThinking}
              setDeepThinking={setDeepThinking}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              showCourseMenu={showCourseMenu}
              setShowCourseMenu={setShowCourseMenu}
              attachedFiles={attachedFiles}
              onRemoveFile={removeFile}
            />
          </div>
          {attachedFiles.length >= 10 && (
            <p className="text-[11px] text-[#D67A1E] font-semibold">
              Maximum 10 files reached
            </p>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

// Chat View
const ChatView = ({ messages, onSend }) => {
  const [input, setInput] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim(), attachedFiles);
    setInput("");
    setAttachedFiles([]);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAttachedFiles((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 10);
    });
    e.target.value = "";
  };

  const removeFile = (index) =>
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

  return (
    <div
      className="flex flex-col h-full bg-[#F8F9FB]"
      onClick={() => setShowCourseMenu(false)}
    >
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-[#465182]/10 to-[#465182]/5 ring-1 ring-[#465182]/5"
                  : "bg-gradient-to-br from-[#465182]/10 to-[#465182]/5 ring-1 ring-[#465182]/5"
              }`}
            >
              {msg.role === "assistant" ? (
                <FaRobot size={13} className="text-[#465182]" />
              ) : (
                <FaUser size={12} className="text-[#465182]" />
              )}
            </div>
            <div className="flex flex-col gap-1.5 max-w-[68%]">
              {msg.files && msg.files.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.files.map((f, i) => (
                    <FileChip key={i} file={f} />
                  ))}
                </div>
              )}
              <div
                className={`px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white border border-gray-200/50 text-gray-700 shadow-sm shadow-gray-100/50 rounded-2xl rounded-tl-lg"
                    : "bg-[#465182] text-white rounded-2xl rounded-tr-lg shadow-md shadow-[#465182]/15"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-8 pb-6 pt-2" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white border border-gray-200/60 rounded-2xl shadow-lg shadow-gray-200/30 px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <button
              onClick={handleSend}
              className="w-9 h-9 rounded-xl bg-[#465182] flex items-center justify-center hover:bg-[#3a4570] transition-all duration-200 flex-shrink-0 shadow-md shadow-[#465182]/20 active:scale-95"
            >
              <FaPaperPlane size={12} className="text-white" />
            </button>
          </div>
          <FilesPreviewStrip files={attachedFiles} onRemove={removeFile} />
          <div className="border-t border-gray-100 pt-2.5">
            <Toolbar
              onAttach={() => fileInputRef.current?.click()}
              deepThinking={deepThinking}
              setDeepThinking={setDeepThinking}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              showCourseMenu={showCourseMenu}
              setShowCourseMenu={setShowCourseMenu}
              attachedFiles={attachedFiles}
              onRemoveFile={removeFile}
            />
          </div>
          {attachedFiles.length >= 10 && (
            <p className="text-[11px] text-[#D67A1E] font-semibold">
              Maximum 10 files reached
            </p>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

// Main Page
const ChatBot = () => {
  const [activeView, setActiveView] = useState("chat");
  const [chats, setChats] = useState(dummyChats);
  const [activeChatId, setActiveChatId] = useState(null);
  const [allMessages, setAllMessages] = useState({
    1: [
      {
        id: 1,
        role: "assistant",
        text: "Hi! Ask me anything about backpropagation.",
      },
    ],
    2: [
      {
        id: 1,
        role: "assistant",
        text: "Hi! Let's talk about overfitting vs underfitting.",
      },
    ],
    3: [
      {
        id: 1,
        role: "assistant",
        text: "Hi! What would you like to know about transformer models?",
      },
    ],
    4: [
      {
        id: 1,
        role: "assistant",
        text: "Hi! Let's explore neural network architectures.",
      },
    ],
  });
  const [search, setSearch] = useState("");
  const [hoveredChat, setHoveredChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  const handleNewChat = () => {
    const newId = Date.now();
    setChats((prev) => [
      { id: newId, title: "New conversation", starred: false },
      ...prev,
    ]);
    setAllMessages((prev) => ({
      ...prev,
      [newId]: [
        { id: 1, role: "assistant", text: "Hi! How can I help you today?" },
      ],
    }));
    setActiveChatId(newId);
    setActiveView("chat");
  };

  const handleWelcomeSend = (text, files) => {
    const newId = Date.now();
    const userMsg = { id: Date.now(), role: "user", text, files };
    const botMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: `Ai Replay`,
    };
    setChats((prev) => [
      {
        id: newId,
        title: text.slice(0, 32) + (text.length > 32 ? "..." : ""),
        starred: false,
      },
      ...prev,
    ]);
    setAllMessages((prev) => ({ ...prev, [newId]: [userMsg, botMsg] }));
    setActiveChatId(newId);
    setActiveView("chat");
  };

  const handleSend = (text, files) => {
    if (!activeChatId) return;
    const userMsg = { id: Date.now(), role: "user", text, files };
    const botMsg = {
      id: Date.now() + 1,
      role: "assistant",
      text: `Ai Replay`,
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMsg, botMsg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.title === "New conversation"
          ? { ...c, title: text.slice(0, 32) + (text.length > 32 ? "..." : "") }
          : c,
      ),
    );
  };

  // Chat actions
  const handleStar = (id) => {
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)),
    );
    setOpenMenuId(null);
  };

  const handleRename = (id, currentTitle) => {
    setRenamingId(id);
    setRenameValue(currentTitle);
    setOpenMenuId(null);
  };

  const submitRename = (id) => {
    if (renameValue.trim()) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, title: renameValue.trim() } : c,
        ),
      );
    }
    setRenamingId(null);
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setAllMessages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeChatId === id) setActiveChatId(null);
    setOpenMenuId(null);
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );
  const isWelcome = activeView === "chat" && activeChatId === null;

  return (
    <div
      className="flex h-screen font-sans overflow-hidden bg-[#F8F9FB]"
      onClick={() => {
        setOpenMenuId(null);
      }}
    >
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-white border-r border-gray-200/50 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {/* Search */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 bg-[#F8F9FB] border border-gray-200/50 rounded-xl px-2.5 py-2 focus-within:border-[#465182]/20 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#465182]/5 transition-all duration-200">
            <FaSearch size={11} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-[13px] text-gray-700 placeholder-gray-400 outline-none flex-1"
            />
          </div>
        </div>

        <div className="px-4 pb-3 space-y-1.5">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#282f4f] text-white hover:bg-[#323f7b] transition-all duration-200 shadow-md shadow-[#282f4f]/15 active:scale-[0.98]"
          >
            <FaPlus size={11} />
            New Chat
          </button>
          <button
            onClick={() => setActiveView("quiz")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
              activeView === "quiz"
                ? "bg-[#D67A1E]/[0.08] text-[#D67A1E] ring-1 ring-[#D67A1E]/15"
                : "bg-[#F8F9FB] text-gray-500 hover:bg-gray-100 hover:text-[#D67A1E]"
            }`}
          >
            <FaQuestionCircle size={13} />
            Quiz Generator
            {activeView === "quiz" && (
              <FaChevronRight size={9} className="ml-auto opacity-50" />
            )}
          </button>
          <button
            onClick={() => setActiveView("presentation")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
              activeView === "presentation"
                ? "bg-[#D67A1E]/[0.08] text-[#D67A1E] ring-1 ring-[#D67A1E]/15"
                : "bg-[#F8F9FB] text-gray-500 hover:bg-gray-100 hover:text-[#D67A1E]"
            }`}
          >
            <MdOutlineSlideshow size={15} />
            Presentation
            {activeView === "presentation" && (
              <FaChevronRight size={9} className="ml-auto opacity-50" />
            )}
          </button>
        </div>

        <div className="mx-4 border-t border-gray-100" />

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.12em] mb-2 px-1">
            History
          </p>
          <div className="space-y-0.5">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="relative"
                onMouseEnter={() => setHoveredChat(chat.id)}
                onMouseLeave={() => setHoveredChat(null)}
              >
                {renamingId === chat.id ? (
                  <div className="flex items-center gap-1 px-2 py-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitRename(chat.id);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      onBlur={() => submitRename(chat.id)}
                      className="flex-1 text-[13px] text-gray-700 bg-[#F8F9FB] border border-gray-200/60 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#465182]/30 focus:ring-2 focus:ring-[#465182]/5 transition-all duration-200"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setActiveView("chat");
                      setOpenMenuId(null);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-[13px] transition-all duration-150 ${
                      activeView === "chat" && activeChatId === chat.id
                        ? "bg-[#465182]/[0.06] text-gray-800 font-semibold ring-1 ring-[#465182]/8"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    {chat.starred ? (
                      <FaStar
                        size={11}
                        className="flex-shrink-0 text-amber-400"
                      />
                    ) : (
                      <FaCommentDots
                        size={12}
                        className="flex-shrink-0 text-gray-300"
                      />
                    )}
                    <span className="truncate flex-1">{chat.title}</span>
                    {hoveredChat === chat.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === chat.id ? null : chat.id,
                          );
                        }}
                        className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-200/60 text-gray-400 transition-colors duration-150"
                      >
                        <FaEllipsisH size={10} />
                      </button>
                    )}
                  </button>
                )}

                {openMenuId === chat.id && (
                  <div
                    className="absolute right-0 top-9 bg-white border border-gray-200/60 rounded-xl shadow-xl shadow-gray-200/40 z-30 w-40 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleStar(chat.id)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {chat.starred ? (
                        <FaStar size={11} className="text-amber-400" />
                      ) : (
                        <FaRegStar size={11} className="text-gray-400" />
                      )}
                      {chat.starred ? "Unstar" : "Star"}
                    </button>
                    <button
                      onClick={() => handleRename(chat.id, chat.title)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <FaEdit size={11} className="text-gray-400" />
                      Rename
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50 transition-colors duration-150"
                    >
                      <FaTrash size={11} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-2.5 bg-white border-b border-gray-200/50 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 flex-shrink-0"
          >
            <FaBars size={13} />
          </button>
          {activeView !== "chat" && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D67A1E]/15 to-[#D67A1E]/5 flex items-center justify-center border border-[#D67A1E]/10">
              {activeView === "quiz" && (
                <FaQuestionCircle size={13} className="text-[#D67A1E]" />
              )}
              {activeView === "presentation" && (
                <MdOutlineSlideshow size={14} className="text-[#D67A1E]" />
              )}
            </div>
          )}
          <h1 className="text-[15px] font-bold text-gray-800 tracking-tight">
            {activeView === "quiz" && "Quiz Generator"}
            {activeView === "presentation" && "Presentation Generator"}
          </h1>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeView === "chat" && isWelcome && (
            <WelcomeScreen onSend={handleWelcomeSend} />
          )}
          {activeView === "chat" && !isWelcome && (
            <ChatView messages={messages} onSend={handleSend} />
          )}
          {activeView === "quiz" && <QuizGenerator />}
          {activeView === "presentation" && <PresentationGenerator />}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
