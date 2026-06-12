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
  FaDownload,
  FaBook,
} from "react-icons/fa";
import { MdOutlineSlideshow } from "react-icons/md";
import botImg from "../../assets/images/botImg.png";
import { instructorApi } from "../../api/instructorApi";
import { BACKEND_URL } from "../../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Quiz Generator
const QuizGenerator = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numQ, setNumQ] = useState("5");
  const [difficulty, setDifficulty] = useState("Medium");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setGenerated(false);
      setQuizData(null);
      setError(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setGenerated(false);
      setQuizData(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile) return;
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockQuiz = {
        title: uploadedFile.name.split(".")[0] + " - Quiz",
        questions: [
          {
            question: "What is the main purpose of the discussed topic?",
            options: ["To analyze data", "To solve a problem", "To provide information", "To generate revenue"],
            correct_answer: "To provide information",
            explanation: "The primary goal is to inform the audience about key concepts."
          },
          {
            question: "Which of the following best describes a key concept from the material?",
            options: ["It is a theoretical framework", "It is a practical application", "It is a historical overview", "It is a statistical method"],
            correct_answer: "It is a theoretical framework",
            explanation: "The material focuses on establishing a theoretical foundation."
          },
          {
            question: "According to the content, what is a critical factor for success?",
            options: ["Consistent effort", "Natural talent", "External funding", "Luck"],
            correct_answer: "Consistent effort",
            explanation: "Consistency and dedication are highlighted as the most important factors."
          },
          {
            question: "What methodology is primarily used in the discussed approach?",
            options: ["Qualitative analysis", "Quantitative analysis", "Mixed methods", "Case study"],
            correct_answer: "Mixed methods",
            explanation: "The approach combines both qualitative and quantitative techniques."
          },
          {
            question: "What is a common misconception addressed in the material?",
            options: ["That the topic is too complex", "That it only applies to experts", "That results are immediate", "That it requires expensive tools"],
            correct_answer: "That results are immediate",
            explanation: "The material clarifies that meaningful results take time and patience."
          }
        ]
      };
      setQuizData(mockQuiz);
      setGenerated(true);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
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
                    setQuizData(null);
                    setError(null);
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
            onClick={handleGenerate}
            disabled={!uploadedFile || loading}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !uploadedFile || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#D67A1E] hover:bg-[#c06d19] text-white shadow-md shadow-[#D67A1E]/20 hover:shadow-lg hover:shadow-[#D67A1E]/25 active:scale-[0.995]"
            }`}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600">
            {error}
          </div>
        )}

        {generated && quizData && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] shadow-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">
                {quizData.title || uploadedFile?.name.split(".")[0]}
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
              {(quizData.questions || []).map((q, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#FAFBFC] rounded-2xl border border-gray-100/80"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Q{i + 1}. {q.question || q.text || q.content}
                  </p>
                  <div className="space-y-2">
                    {(q.options || q.choices || []).map((opt, j) => (
                      <label
                        key={j}
                        className="flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-700 group transition-colors duration-150"
                      >
                        <span className="w-6 h-6 rounded-full border-2 border-gray-200/80 group-hover:border-gray-300 flex items-center justify-center text-[11px] font-bold transition-all duration-150 flex-shrink-0 text-gray-400 group-hover:text-gray-600">
                          {String.fromCharCode(65 + j)}
                        </span>
                        {typeof opt === "string" ? opt : opt.text || opt.content}
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

// Toolbar
const Toolbar = ({
  deepThinking,
  setDeepThinking,
  selectedCourse,
  setSelectedCourse,
  showCourseMenu,
  setShowCourseMenu,
}) => (
  <div className="flex items-center gap-2 flex-wrap">
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
  </div>
);

// Welcome Screen
const WelcomeScreen = ({ onSend, sending }) => {
  const [input, setInput] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showCourseMenu, setShowCourseMenu] = useState(false);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div
      className="flex flex-col h-full items-center bg-[#F8F9FB] justify-center relative"
      onClick={() => setShowCourseMenu(false)}
    >
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
                  disabled={sending}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-9 h-9 rounded-xl bg-[#465182] flex items-center justify-center hover:bg-[#3a4570] transition-all duration-200 flex-shrink-0 shadow-md shadow-[#465182]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaPaperPlane size={12} className="text-white" />
                  )}
                </button>
              </div>
          <div className="border-t border-gray-100 pt-2.5">
            <Toolbar
              deepThinking={deepThinking}
              setDeepThinking={setDeepThinking}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              showCourseMenu={showCourseMenu}
              setShowCourseMenu={setShowCourseMenu}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200/60 bg-white text-[12px] font-medium text-gray-500 shadow-sm cursor-default">
            <FaQuestionCircle size={13} className="text-[#D67A1E]" />
            Try: "Generate a quiz for chapter 1 in logic design"
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200/60 bg-white text-[12px] font-medium text-gray-500 shadow-sm cursor-default">
            <MdOutlineSlideshow size={13} className="text-[#465182]" />
            Try: "Create a presentation for lec 1 in intro to CS"
          </div>
        </div>
      </div>
    </div>
  );
};

// Chat View
const ChatView = ({ messages, onSend, sending }) => {
  const [input, setInput] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [refiningId, setRefiningId] = useState(null);
  const [refineText, setRefineText] = useState("");

  const isPresentationBlueprint = (text) => /Slide\s+\d+:/i.test(text) && text.length > 100;

  const handleApprove = () => {
    onSend("Approved! Generate the final presentation file.", selectedCourse);
  };

  const handleStartRefine = (msgId) => {
    setRefiningId(msgId);
    setRefineText("");
  };

  const handleSubmitRefine = (msgId) => {
    if (!refineText.trim()) return;
    onSend(refineText.trim(), selectedCourse);
    setRefiningId(null);
    setRefineText("");
  };

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || sending) return;
    onSend(input.trim());
    setInput("");
  };

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
                    <span key={i} className="text-[11px] text-gray-400 bg-gray-100 rounded-lg px-2 py-1">
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
              <div
                className={`px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-white border border-gray-200/50 text-gray-700 shadow-sm shadow-gray-100/50 rounded-2xl rounded-tl-lg markdown-content"
                    : "bg-[#465182] text-white rounded-2xl rounded-tr-lg shadow-md shadow-[#465182]/15 markdown-content-dark"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !match && !className;
                      if (isInline) {
                        return <code className="bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-xs font-mono" {...props}>{children}</code>;
                      }
                      return (
                        <pre className="bg-gray-900 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      );
                    },
                    a({node, children, ...props}) {
                      return <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                    },
                    ul({node, children, ...props}) {
                      return <ul className="list-disc pl-5 my-1 space-y-0.5" {...props}>{children}</ul>;
                    },
                    ol({node, children, ...props}) {
                      return <ol className="list-decimal pl-5 my-1 space-y-0.5" {...props}>{children}</ol>;
                    },
                    table({node, children, ...props}) {
                      return <div className="overflow-x-auto my-2"><table className="min-w-full border-collapse border border-gray-300 text-xs" {...props}>{children}</table></div>;
                    },
                    th({node, children, ...props}) {
                      return <th className="border border-gray-300 px-2 py-1 bg-gray-50 font-semibold" {...props}>{children}</th>;
                    },
                    td({node, children, ...props}) {
                      return <td className="border border-gray-300 px-2 py-1" {...props}>{children}</td>;
                    },
                    h1({node, children, ...props}) {
                      return <h1 className="text-base font-bold mt-3 mb-1" {...props}>{children}</h1>;
                    },
                    h2({node, children, ...props}) {
                      return <h2 className="text-sm font-bold mt-2 mb-1" {...props}>{children}</h2>;
                    },
                    h3({node, children, ...props}) {
                      return <h3 className="text-sm font-semibold mt-2 mb-1" {...props}>{children}</h3>;
                    },
                    p({node, children, ...props}) {
                      return <p className="mb-1 last:mb-0" {...props}>{children}</p>;
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {msg.sources.map((src, i) => {
                    if (typeof src === "string") {
                      const pillClass = "inline-flex items-center gap-1 text-[10px] font-medium text-[#D67A1E] bg-[#D67A1E]/[0.06] border border-[#D67A1E]/10 px-2 py-0.5 rounded-full";
                      const isUrl = src.startsWith("http");
                      const pill = (
                        <span className={pillClass}>
                          <FaBook size={8} />
                          {isUrl ? src.split("/").pop() : src}
                          {isUrl && <span className="text-[8px] opacity-60">↗</span>}
                        </span>
                      );
                      return isUrl
                        ? <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="no-underline">{pill}</a>
                        : <span key={i}>{pill}</span>;
                    }

                    const meta = src.metadata || {};
                    const sourceTitle = meta.file_name || meta.source?.split("/").pop() || src.title || src.content?.slice(0, 60) || "";
                    const sourceUrl = meta.source?.startsWith("http") ? meta.source : null;
                    const page = meta.page || src.page || null;
                    if (!sourceTitle) return null;

                    const pillClass = "inline-flex items-center gap-1 text-[10px] font-medium text-[#D67A1E] bg-[#D67A1E]/[0.06] border border-[#D67A1E]/10 px-2 py-0.5 rounded-full hover:bg-[#D67A1E]/[0.1] transition-colors";
                    const pill = (
                      <span className={pillClass}>
                        <FaBook size={8} />
                        {sourceTitle}
                        {page != null && ` p.${page}`}
                        {sourceUrl && <span className="text-[8px] opacity-60">↗</span>}
                      </span>
                    );

                    return sourceUrl
                      ? <a key={i} href={sourceUrl} target="_blank" rel="noopener noreferrer" className="no-underline">{pill}</a>
                      : <span key={i}>{pill}</span>;
                  })}
                </div>
              )}
              {msg.presentationPath && (
                <div className="px-1">
                  <a
                    href={msg.presentationPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D67A1E] bg-[#D67A1E]/[0.06] border border-[#D67A1E]/10 px-3 py-1.5 rounded-lg hover:bg-[#D67A1E]/[0.1] transition-colors"
                  >
                    <FaDownload size={10} />
                    Download Presentation
                  </a>
                </div>
              )}
              {msg.role === "assistant" && isPresentationBlueprint(msg.text) && !msg.presentationPath && (
                <div className="px-1 space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={handleApprove}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Approve & Generate
                    </button>
                    <button
                      onClick={() => handleStartRefine(msg.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#D67A1E] bg-[#D67A1E]/[0.06] border border-[#D67A1E]/10 rounded-lg hover:bg-[#D67A1E]/[0.1] transition-colors"
                    >
                      Refine
                    </button>
                  </div>
                  {refiningId === msg.id && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={refineText}
                        onChange={(e) => setRefineText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmitRefine(msg.id)}
                        placeholder="Describe what to change..."
                        className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#D67A1E]/30"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSubmitRefine(msg.id)}
                        disabled={!refineText.trim()}
                        className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#465182] rounded-lg hover:bg-[#3a4570] transition-colors disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#465182]/10 to-[#465182]/5 ring-1 ring-[#465182]/5">
              <FaRobot size={13} className="text-[#465182]" />
            </div>
            <div className="bg-white border border-gray-200/50 text-gray-400 shadow-sm shadow-gray-100/50 rounded-2xl rounded-tl-lg px-4 py-3 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#465182]/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-[#465182]/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-[#465182]/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
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
                  disabled={sending}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-9 h-9 rounded-xl bg-[#465182] flex items-center justify-center hover:bg-[#3a4570] transition-all duration-200 flex-shrink-0 shadow-md shadow-[#465182]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FaPaperPlane size={12} className="text-white" />
                  )}
                </button>
              </div>
              <div className="border-t border-gray-100 pt-2.5">
                <Toolbar
                  deepThinking={deepThinking}
                  setDeepThinking={setDeepThinking}
                  selectedCourse={selectedCourse}
                  setSelectedCourse={setSelectedCourse}
                  showCourseMenu={showCourseMenu}
                  setShowCourseMenu={setShowCourseMenu}
                />
              </div>
            </div>
      </div>
    </div>
  );
};

// Main Page
const ChatBot = () => {
  const [activeView, setActiveView] = useState("chat");
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hoveredChat, setHoveredChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const generateId = () => Date.now() + Math.random();

  const fetchConversations = async () => {
    try {
      const response = await instructorApi.getOwnConversations();
      const convs = response.data || [];
      setChats(convs.map((c) => ({ id: c.id, title: c.title, starred: false, updated_at: c.updated_at })));

      const messagesMap = {};
      for (const conv of convs) {
        if (!messagesMap[conv.id]) {
          messagesMap[conv.id] = [{ id: `title-${conv.id}`, role: "assistant", text: conv.title || "Conversation", isTitle: true }];
        }
      }
      setAllMessages(messagesMap);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await instructorApi.getCourses();
        setCourses(response.data || []);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
    fetchConversations();
  }, []);

  const loadConversationMessages = async (convId) => {
    if (allMessages[convId] && allMessages[convId].length > 0 && !allMessages[convId][0]?.isTitle) return;
    try {
      const response = await instructorApi.getConversationMessages(convId);
      const data = response.data;
      const messages = Array.isArray(data) ? data : data?.messages || data?.results || [];
      const formatted = messages.map((m) => ({
        id: m.id,
        role: m.role === "USER" ? "user" : "assistant",
        text: m.content,
        sources: m.sources_used || [],
        was_from_rag: m.was_from_rag,
        timestamp: m.timestamp,
      }));
      setAllMessages((prev) => ({ ...prev, [convId]: formatted }));
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  const sendToApi = async (text, chatId) => {
    setSending(true);
    try {
      const chat = chats.find((c) => c.id === chatId);
      const isNewChat = chat && chat.title === "New conversation";
      const payload = { content: text };
      if (!isNewChat) payload.conversation_id = chatId;

      const response = await instructorApi.sendChatMessage(payload);
      const data = response.data;

      const conversationId = data.conversation_id;
      const aiContent = data.ai_message?.content || data.answer || data.message || JSON.stringify(data);
      const sources = data.ai_message?.sources_used || data.sources_used || [];
      const pptxMatch = aiContent.match(/([\w\/\-_.]+\.pptx)/);
      const presentationPath = data.presentation_path || (pptxMatch ? (pptxMatch[1].startsWith("http") ? pptxMatch[1] : `${BACKEND_URL}/${pptxMatch[1].replace(/^\//, "")}`) : null);

      const botMsg = {
        id: generateId(),
        role: "assistant",
        text: aiContent,
        sources,
        presentationPath,
      };

      if (isNewChat && conversationId) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? { ...c, id: conversationId, title: text.slice(0, 32) + (text.length > 32 ? "..." : "") }
              : c,
          ),
        );
        setActiveChatId(conversationId);
        setAllMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[chatId] || []), botMsg],
        }));
        if (chatId !== conversationId) {
          setAllMessages((prev) => {
            const copy = { ...prev };
            delete copy[chatId];
            return copy;
          });
        }
      } else {
        setAllMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), botMsg],
        }));
      }
    } catch (err) {
      console.error("AI chat error:", err);
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || "Sorry, I couldn't process your request. Please try again.";
      const botMsg = {
        id: generateId(),
        role: "assistant",
        text: errorMsg,
      };
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), botMsg],
      }));
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await instructorApi.createConversation({ title: "New conversation" });
      const conv = response.data;
      const newId = conv.id || Date.now();
      setChats((prev) => [
        { id: newId, title: conv.title || "New conversation", starred: false, updated_at: conv.updated_at },
        ...prev,
      ]);
      setAllMessages((prev) => ({
        ...prev,
        [newId]: [{ id: `title-${newId}`, role: "assistant", text: conv.title || "New conversation", isTitle: true }],
      }));
      setActiveChatId(newId);
      setActiveView("chat");
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const handleWelcomeSend = async (text) => {
    try {
      const response = await instructorApi.createConversation({
        title: text.slice(0, 32) + (text.length > 32 ? "..." : ""),
      });
      const conv = response.data;
      const newId = conv.id || Date.now();
      const userMsg = { id: generateId(), role: "user", text };

      setChats((prev) => [
        { id: newId, title: text.slice(0, 32) + (text.length > 32 ? "..." : ""), starred: false },
        ...prev,
      ]);
      setAllMessages((prev) => ({ ...prev, [newId]: [userMsg] }));
      setActiveChatId(newId);
      setActiveView("chat");

      sendToApi(text, newId);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const handleSend = (text) => {
    if (!activeChatId) return;
    const userMsg = { id: generateId(), role: "user", text };

    setAllMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMsg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId && c.title === "New conversation"
          ? { ...c, title: text.slice(0, 32) + (text.length > 32 ? "..." : "") }
          : c,
      ),
    );

    sendToApi(text, activeChatId);
  };

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

  const submitRename = async (id) => {
    if (renameValue.trim()) {
      try {
        await instructorApi.updateConversation(id, { title: renameValue.trim() });
        setChats((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, title: renameValue.trim() } : c,
          ),
        );
      } catch (err) {
        console.error("Failed to rename conversation:", err);
      }
    }
    setRenamingId(null);
  };

  const handleDeleteChat = async (id) => {
    try {
      await instructorApi.deleteConversation(id);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
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
                      loadConversationMessages(chat.id);
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
          <h1 className="text-[15px] font-bold text-gray-800 tracking-tight">
            Chat
          </h1>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex h-full items-center justify-center bg-[#F8F9FB]">
              <div className="flex items-center gap-2.5 text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#465182] rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading conversations...</span>
              </div>
            </div>
          ) : (
            <>
              {activeView === "chat" && isWelcome && (
                <WelcomeScreen onSend={handleWelcomeSend} sending={sending} />
              )}
              {activeView === "chat" && !isWelcome && (
                <ChatView messages={messages} onSend={handleSend} sending={sending} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
