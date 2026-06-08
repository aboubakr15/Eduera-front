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
} from "react-icons/fa";
import { MdOutlineSlideshow } from "react-icons/md";
import botImg from "../../assets/images/botImg.png";
import { adminApi } from "../../api/adminApi";
import { BACKEND_URL } from "../../api/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        title: `Quiz: ${uploadedFile.name}`,
        questions: [
          {
            id: 1,
            question: "What is the main topic of the uploaded material?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct_answer: 0,
            explanation: "This is the correct answer based on the material."
          },
          {
            id: 2,
            question: "Which of the following best describes the key concept?",
            options: ["Concept X", "Concept Y", "Concept Z", "Concept W"],
            correct_answer: 2,
            explanation: "The material clearly states that Concept Z is the key idea."
          },
          {
            id: 3,
            question: "What is the recommended approach according to the content?",
            options: ["Approach A", "Approach B", "Approach C", "Approach D"],
            correct_answer: 1,
            explanation: "Approach B is recommended in the uploaded material."
          },
          {
            id: 4,
            question: "Which statement is true based on the uploaded file?",
            options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"],
            correct_answer: 3,
            explanation: "Statement 4 is verified by the content."
          },
          {
            id: 5,
            question: "What can be inferred from the material?",
            options: ["Inference A", "Inference B", "Inference C", "Inference D"],
            correct_answer: 0,
            explanation: "The material supports Inference A."
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
                    setQuizData(null);
                    setError(null);
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
            onClick={handleGenerate}
            disabled={!uploadedFile || loading}
            className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all ${
              !uploadedFile || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#D67A1E] hover:bg-[#D67A1E] shadow-sm"
            }`}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {generated && quizData && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">
                {quizData.title || uploadedFile?.name.split(".")[0]}
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
              {(quizData.questions || []).map((q, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Q{i + 1}. {q.question || q.text || q.content}
                  </p>
                  <div className="space-y-2">
                    {(q.options || q.choices || []).map((opt, j) => (
                      <label
                        key={j}
                        className="flex items-center gap-2.5 text-sm text-gray-500 cursor-pointer hover:text-gray-700 group"
                      >
                        <span className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-gray-300 flex items-center justify-center text-xs font-semibold transition-colors flex-shrink-0">
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

//  Toolbar
const Toolbar = ({
  onAttach,
  deepThinking,
  setDeepThinking,
  attachedFiles,
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
      className="flex flex-col h-full items-center bg-gray-50 justify-center"
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
              attachedFiles={attachedFiles}
            />
          </div>
          {attachedFiles.length >= 10 && (
            <p className="text-xs text-orange-500 font-medium">
              Maximum 10 files reached
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button
            onClick={() => { onSend("Create a presentation covering the key topics from my course materials"); setInput(""); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200/60 bg-white text-[12px] font-medium text-gray-500 hover:border-[#D67A1E]/20 hover:text-[#D67A1E] hover:bg-[#D67A1E]/[0.04] transition-all duration-200 shadow-sm"
          >
            <MdOutlineSlideshow size={13} />
            Create a presentation
          </button>
          <button
            onClick={() => { onSend("Help me create slides about a topic I'll describe"); setInput(""); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200/60 bg-white text-[12px] font-medium text-gray-500 hover:border-[#465182]/20 hover:text-[#465182] hover:bg-[#465182]/[0.04] transition-all duration-200 shadow-sm"
          >
            <MdOutlineSlideshow size={13} />
            Make slides
          </button>
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
const ChatView = ({ messages, onSend, selectedCourse }) => {
  const [input, setInput] = useState("");
  const [deepThinking, setDeepThinking] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
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
                    ? "bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-sm markdown-content"
                    : "bg-[#465182] text-white rounded-tr-sm markdown-content-dark"
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
              attachedFiles={attachedFiles}
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
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [search, setSearch] = useState("");
  const [hoveredChat, setHoveredChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [sending, setSending] = useState(false);

  const messages = activeChatId ? allMessages[activeChatId] || [] : [];

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await adminApi.getConversations();
        setChats(response.data || []);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    fetchConversations();
  }, []);

  const loadMessages = async (convId) => {
    if (allMessages[convId] && allMessages[convId].length > 0) return;
    try {
      const response = await adminApi.getConversationMessages(convId);
      const formatted = (response.data || []).map((m) => ({
        id: m.id,
        role: m.role === "USER" ? "user" : "assistant",
        text: m.content,
        sources: m.sources_used || [],
      }));
      setAllMessages((prev) => ({ ...prev, [convId]: formatted }));
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await adminApi.createConversation({ title: "New conversation" });
      const conv = response.data;
      const newId = conv.id;
      setChats((prev) => [
        { id: newId, title: "New conversation", starred: false },
        ...prev,
      ]);
      setAllMessages((prev) => ({
        ...prev,
        [newId]: [],
      }));
      setActiveChatId(newId);
      setActiveView("chat");
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const sendToApi = async (text, chatId) => {
    setSending(true);
    try {
      const chat = chats.find((c) => c.id === chatId);
      const isNewChat = chat && chat.title === "New conversation";
      const payload = { content: text };
      if (!isNewChat) payload.conversation_id = chatId;

      const response = await adminApi.sendChatMessage({ content: text, conversation_id: isNewChat ? undefined : chatId });
      const data = response.data;
      const conversationId = data.conversation_id;
      const aiContent = data.ai_message?.content || data.answer || data.message || JSON.stringify(data);
      const sources = data.ai_message?.sources_used || [];
      const pptxMatch = aiContent.match(/([\w\/\-_.]+\.pptx)/);
      const presentationPath = data.presentation_path || (pptxMatch ? (pptxMatch[1].startsWith("http") ? pptxMatch[1] : `${BACKEND_URL}/${pptxMatch[1].replace(/^\//, "")}`) : null);

      const botMsg = { id: Date.now(), role: "assistant", text: aiContent, sources, presentationPath };

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
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || "Sorry, I couldn't process your request.";
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), { id: Date.now(), role: "assistant", text: errorMsg }],
      }));
    } finally {
      setSending(false);
    }
  };

  const handleWelcomeSend = async (text) => {
    try {
      const response = await adminApi.createConversation({
        title: text.slice(0, 32) + (text.length > 32 ? "..." : ""),
      });
      const conv = response.data;
      const newId = conv.id;
      const userMsg = { id: Date.now(), role: "user", text };

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
    const userMsg = { id: Date.now(), role: "user", text };

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

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    loadMessages(id);
  };

  const handleStar = async (id) => {
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
        await adminApi.updateConversation(id, { title: renameValue.trim() });
        setChats((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, title: renameValue.trim() } : c,
          ),
        );
      } catch (err) {
        console.error("Failed to rename:", err);
      }
    }
    setRenamingId(null);
  };

  const handleDeleteChat = async (id) => {
    try {
      await adminApi.deleteConversation(id);
      setChats((prev) => prev.filter((c) => c.id !== id));
      setAllMessages((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (activeChatId === id) setActiveChatId(null);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
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

        <div className="px-2 pb-2 space-y-1.5">
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

        </div>

        <div className="mx-4 border-t border-gray-100 mb-2" />

        <div className="flex-1 overflow-y-auto px-2 pb-4">
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
              activeView === "quiz" ? "bg-orange-100" : ""
            }`}
          >
            {activeView === "quiz" && (
              <FaQuestionCircle size={13} className="text-[#D67A1E]" />
            )}
          </div>
          <h1 className="text-base font-bold text-gray-800">
            {activeView === "quiz" && "Quiz Generator"}
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
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
