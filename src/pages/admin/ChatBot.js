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
    <div className="flex flex-col h-full overflow-y-auto py-10 bg-gray-50">
      <div className="max-w-5xl px-10 mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <FaQuestionCircle size={18} className="text-[#D67A1E]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Quiz Generator</h2>
            <p className="text-xs text-gray-400">
              Upload a file and generate a quiz from it
            </p>
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
                    ? "border-[#D67A1E] bg-gray-50"
                    : "border-gray-200 bg-gray-50 hover:border-[#D67A1E] hover:bg-gray-50/40"
                }`}
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FaFile size={20} className="text-[#D67A1E]" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Drop your file here
                </p>
                <p className="text-xs text-gray-400 mb-3">or click to browse</p>
                <span className="text-xs text-[#D67A1E] bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
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
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Questions
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numQ}
                onChange={(e) => setNumQ(e.target.value)}
                className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-300 focus:bg-white transition-colors"
              >
                {["Easy", "Medium", "Hard"].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => uploadedFile && setGenerated(true)}
            className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all ${
              uploadedFile
                ? "bg-[#D67A1E] hover:bg-[#D67A1E] shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Generate Quiz
          </button>
        </div>

        {generated && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">
                {uploadedFile?.name.split(".")[0]}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  difficulty === "Easy"
                    ? "bg-green-100 text-green-600"
                    : difficulty === "Hard"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {difficulty}
              </span>
            </div>
            <div className="space-y-4">
              {Array.from({ length: parseInt(numQ) || 3 }, (_, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Q{i + 1}. Sample question from your file?
                  </p>
                  <div className="space-y-2">
                    {["A", "B", "C", "D"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-700 group"
                      >
                        <span className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-gray-300 flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0">
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
    <div className="flex flex-col h-full overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <MdOutlineSlideshow size={20} className="text-[#D67A1E]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Presentation Generator
            </h2>
            <p className="text-xs text-gray-400">
              Generate a presentation from a file or text
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
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
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  source === tab.id
                    ? "bg-white text-[#D67A1E] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {source === "file" && (
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
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/40"
                  }`}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FaFile size={20} className="text-[#D67A1E]" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Drop your file here
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    or click to browse
                  </p>
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
          )}

          {source === "text" && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-orange-300 focus:bg-white transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {textInput.length} characters
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Slides
              </label>
              <input
                type="number"
                min="3"
                max="20"
                value={numSlides}
                onChange={(e) => setNumSlides(e.target.value)}
                className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-300 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full appearance-none border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-300 focus:bg-white transition-colors"
              >
                {["Academic", "Professional", "Creative"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => canGenerate && setGenerated(true)}
            className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all ${
              canGenerate
                ? "bg-[#D67A1E] hover:bg-[#af6b26] shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Generate Presentation
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
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${
        attachedFiles?.length > 0
          ? "border-[#1B2036] bg-white text-gray-600"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <FaPaperclip size={12} />
      Attach
      {attachedFiles?.length > 0 && (
        <span className="ml-1 bg-[#1B2036] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {attachedFiles.length}
        </span>
      )}
    </button>

    <button
      onClick={() => setDeepThinking(!deepThinking)}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors shadow-sm ${
        deepThinking
          ? "border-[#c36c16] bg-white text-[#D67A1E]"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <FaBrain size={12} />
      Deep Thinking
    </button>

    {/* Choose Course */}
    <div className="relative">
      <button
        onClick={() => setShowCourseMenu(!showCourseMenu)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
      >
        <FaBookOpen size={12} />
        {selectedCourse || "Choose Course"}
        <FaChevronDown size={10} className="ml-1" />
      </button>
      {showCourseMenu && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-20 w-60">
          {courses.map((course) => (
            <button
              key={course}
              onClick={() => {
                setSelectedCourse(course);
                setShowCourseMenu(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                selectedCourse === course
                  ? "bg-orange-50 text-[#D67A1E] font-semibold"
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
              className="w-full text-left px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50 border-t border-gray-100"
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
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
      {isImage && preview ? (
        <img
          src={preview}
          alt="preview"
          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <FaFile size={14} className="text-blue-400 flex-shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-blue-700 truncate max-w-[120px]">
          {file.name}
        </p>
        <p className="text-xs text-blue-400">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 text-blue-300 hover:text-red-500 transition-colors text-base leading-none"
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
      className="flex flex-col h-full items-center bg-gray-50  justify-center"
      onClick={() => setShowCourseMenu(false)}
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-32 h-32 mb-4 rounded-full bg-gray-50 overflow-hidden ">
          <img
            src={botImg}
            alt="Bot"
            className="w-full h-full object-cover brightness-75"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, there
        </h1>
        <p className="text-gray-400 text-base mb-10">How can I help you?</p>

        <div
          className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 flex flex-col gap-3"
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
              className="w-8 h-8 rounded-xl bg-[#465182] flex items-center justify-center hover:bg-[#323f7b] transition-colors flex-shrink-0"
            >
              <FaPaperPlane size={12} className="text-white" />
            </button>
          </div>
          <FilesPreviewStrip files={attachedFiles} onRemove={removeFile} />
          <div className="border-t border-gray-100 pt-2">
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
            <p className="text-xs text-orange-500 font-medium">
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
      className="flex flex-col h-full bg-gray-50"
      onClick={() => setShowCourseMenu(false)}
    >
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-[#465182]/10" : "bg-[#465182]/10"
              }`}
            >
              {msg.role === "assistant" ? (
                <FaRobot size={14} className="text-[#465182]" />
              ) : (
                <FaUser size={13} className="text-[#465182]" />
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
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-sm"
                    : "bg-[#465182] text-white rounded-tr-sm"
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 flex flex-col gap-3">
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
              className="w-8 h-8 rounded-xl bg-[#465182] flex items-center justify-center hover:bg-[#323f7b] transition-colors flex-shrink-0"
            >
              <FaPaperPlane size={12} className="text-white" />
            </button>
          </div>
          <FilesPreviewStrip files={attachedFiles} onRemove={removeFile} />
          <div className="border-t border-gray-100 pt-2">
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
            <p className="text-xs text-orange-500 font-medium">
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
      className="flex h-screen font-sans overflow-hidden bg-gray-50"
      onClick={() => {
        setOpenMenuId(null);
      }}
    >
      {/* Sidebar */}
      <div
        className={`flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {/* Search */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-2 py-2">
            <FaSearch size={12} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
            />
          </div>
        </div>

        <div className="px-4 pb-3 space-y-1.5">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#282f4f] text-white hover:bg-[#323f7b] transition-colors"
          >
            <FaPlus size={12} />
            New Chat
          </button>
          <button
            onClick={() => setActiveView("quiz")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeView === "quiz"
                ? "bg-gray-100 text-[#D67A1E] ring-1 ring-gray-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-50 hover:text-[#D67A1E]"
            }`}
          >
            <FaQuestionCircle size={13} />
            Quiz Generator
            {activeView === "quiz" && (
              <FaChevronRight size={10} className="ml-auto opacity-60" />
            )}
          </button>
          <button
            onClick={() => setActiveView("presentation")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeView === "presentation"
                ? "bg-gray-100 text-[#D67A1E] ring-1 ring-gray-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-50 hover:text-[#D67A1E]"
            }`}
          >
            <MdOutlineSlideshow size={15} />
            Presentation
            {activeView === "presentation" && (
              <FaChevronRight size={10} className="ml-auto opacity-60" />
            )}
          </button>
        </div>

        <div className="mx-4 border-t border-gray-100 mb-2" />

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
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
                      className="flex-1 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-300"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveChatId(chat.id);
                      setActiveView("chat");
                      setOpenMenuId(null);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                      activeView === "chat" && activeChatId === chat.id
                        ? "bg-gray-100 text-gray-800 font-semibold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    {chat.starred ? (
                      <FaStar
                        size={11}
                        className="flex-shrink-0 text-yellow-400"
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
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400"
                      >
                        <FaEllipsisH size={11} />
                      </button>
                    )}
                  </button>
                )}

                {openMenuId === chat.id && (
                  <div
                    className="absolute right-0 top-9 bg-white border border-gray-100 rounded-xl shadow-lg z-30 w-40 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleStar(chat.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {chat.starred ? (
                        <FaStar size={12} className="text-yellow-400" />
                      ) : (
                        <FaRegStar size={12} className="text-gray-400" />
                      )}
                      {chat.starred ? "Unstar" : "Star"}
                    </button>
                    <button
                      onClick={() => handleRename(chat.id, chat.title)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <FaEdit size={12} className="text-gray-400" />
                      Rename
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FaTrash size={12} />
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
        <div className="px-4 bg-white border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            {sidebarOpen ? <FaBars size={14} /> : <FaBars size={14} />}
          </button>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              activeView === "quiz"
                ? "bg-orange-100"
                : activeView === "presentation"
                  ? "bg-orange-100"
                  : ""
            }`}
          >
            {activeView === "quiz" && (
              <FaQuestionCircle size={13} className="text-[#D67A1E]" />
            )}
            {activeView === "presentation" && (
              <MdOutlineSlideshow size={15} className="text-[#D67A1E]" />
            )}
          </div>
          <h1 className="text-base font-bold text-gray-800">
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
