import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../api/studentApi";
import {
  FaPaperPlane, FaComments, FaBook, FaUsers, FaCrown, FaWifi, FaEdit, FaTrash
} from "react-icons/fa";
import { ArrowLeft, WifiOff } from "lucide-react";

/**
 * Returns a consistent Tailwind bg colour for an avatar based on a name string.
 */
const getAvatarColor = (name) => {
  if (!name) return "bg-gray-400";
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
    "bg-purple-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Student course group chat — real-time via WebSocket with HTTP fallback.
 */
const StudentChat = () => {
  const [courses, setCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [wsStatus, setWsStatus] = useState("disconnected");
  
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const navigate = useNavigate();

  // Current user ID for "isMe" detection
  const currentUserId =
    localStorage.getItem("userId") ||
    localStorage.getItem("student_id") ||
    localStorage.getItem("user_id") ||
    null;

  // ── Fetch enrolled courses on mount ────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await studentApi.getCourses();
        // studentApi.getCourses() returns enrollments; normalise to course list
        const raw = Array.isArray(response.data) ? response.data : [];
        // Each item is an enrollment which has course_offering ID
        const normalised = raw.map((item) => {
          return {
            id: item.course_offering, // The API expects course_offering ID, not enrollment ID
            course_name: item.course_name || "",
            course_code: item.course_code || "",
            is_chat_active: item.is_chat_active !== false,
            semester: item.semester || "",
            year: item.year || "",
            enrolled_count: item.enrolled_count || 0,
            instructor_name: item.instructor_name || "",
          };
        });
        setCourses(normalised);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ── WebSocket connection ────────────────────────────────────────────────
  const connectWebSocket = useCallback((course) => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const apiBase = process.env.REACT_APP_BASE_URL || "https://eduera-backend-production.up.railway.app";
    const wsBase = apiBase.replace(/^http/, "ws").replace(/\/$/, "");
    const wsUrl = `${wsBase}/ws/course-chat/${course.id}/?token=${token}`;

    setWsStatus("connecting");
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => {
          if (msg.action === "edit_message") {
            return prev.map((m) =>
              m.id === msg.id
                ? { ...m, content: msg.content, is_edited: true }
                : m
            );
          } else if (msg.action === "delete_message") {
            return prev.map((m) =>
              m.id === msg.id
                ? { ...m, content: msg.content, is_deleted: true }
                : m
            );
          }
          // Default: new message
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WS Error:", error);
      setWsStatus("disconnected");
    };

    ws.onclose = (event) => {
      console.log(`WS Closed: code=${event.code}, reason=${event.reason}`);
      setWsStatus("disconnected");
      reconnectTimerRef.current = setTimeout(() => {
        if (wsRef.current === ws) connectWebSocket(course);
      }, 3000);
    };
  }, []);

  // ── Load initial messages + open WS when course changes ────────────────
  useEffect(() => {
    if (!selectedCourse) return;

    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);

    const loadMessages = async () => {
      try {
        const res = await studentApi.getCourseChat(selectedCourse.id);
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch {
        setMessages([]);
      }
    };
    loadMessages();
    connectWebSocket(selectedCourse);

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsStatus("disconnected");
    };
  }, [selectedCourse, connectWebSocket]);

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ────────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCourse) return;
    if (selectedCourse.is_chat_active === false) return; // Prevent if closed

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ action: "chat_message", content }));
      } else {
        const res = await studentApi.sendCourseMessage(selectedCourse.id, { content });
        setMessages((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = (messageId, newContent) => {
    if (!newContent.trim() || wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ action: "edit_message", message_id: messageId, content: newContent }));
  };

  const handleDeleteMessage = (messageId) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ action: "delete_message", message_id: messageId }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D67A1E]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-[#F8F9FB]">
      {/* ── Sidebar ── */}
      <div className="w-72 bg-white border-r border-gray-200/50 flex flex-col flex-shrink-0">
        <div className="p-4 pb-3">
          <div className="flex items-center gap-2.5 mb-0.5">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-[#465182] transition-all group"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
            <h1 className="text-[15px] font-bold text-gray-800 flex items-center gap-2">
              <FaComments size={14} className="text-[#D67A1E]" />
              Course Chats
            </h1>
          </div>
          <p className="text-[11px] text-gray-400 ml-[30px] font-medium">
            {courses.length} active course{courses.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-2.5 pb-3 space-y-0.5">
          {courses.length > 0 ? (
            courses.map((course) => {
              const isActive = selectedCourse?.id === course.id;
              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all duration-200 ${
                    isActive
                      ? "bg-[#465182] text-white shadow-lg shadow-[#465182]/15"
                      : "hover:bg-gray-50 text-gray-800"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isActive ? "bg-white/15 text-white" : "bg-[#D67A1E]/[0.08] text-[#D67A1E]"}`}>
                    <FaBook size={11} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold truncate">{course.course_name}</p>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                      {course.course_code} · {course.semester} {course.year}
                    </p>
                    <div className={`flex items-center gap-1 mt-1.5 ${isActive ? "text-gray-400" : "text-gray-400"}`}>
                      <FaUsers size={9} />
                      <span className="text-[10px] font-medium">{course.enrolled_count || 0} students</span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 ring-1 ring-gray-100">
                <FaComments size={22} className="text-gray-300" />
              </div>
              <p className="text-[13px] font-semibold text-gray-500">No Courses</p>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[180px]">Enrol in a course to join its group chat.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedCourse ? (
          <>
            {/* Header */}
            <div className="bg-white px-5 py-3 border-b border-gray-200/50 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#D67A1E]/[0.08] flex items-center justify-center flex-shrink-0 border border-[#D67A1E]/10">
                <FaBook size={14} className="text-[#D67A1E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-gray-800 truncate">{selectedCourse.course_name}</p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {selectedCourse.course_code} · {selectedCourse.semester} {selectedCourse.year}
                </p>
              </div>
              {/* Connection status pill */}
              <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                wsStatus === "connected"
                  ? "bg-emerald-50 text-emerald-600"
                  : wsStatus === "connecting"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {wsStatus === "connected" ? (
                  <><FaWifi size={9} /> Live</>
                ) : wsStatus === "connecting" ? (
                  <><div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Connecting...</>
                ) : (
                  <><WifiOff size={9} /> Offline</>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
                <FaUsers size={11} className="text-gray-400" />
                <span className="text-[11px] text-gray-500 font-semibold">{selectedCourse.enrolled_count || 0}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isMe = String(msg.sender_id) === String(currentUserId);
                  const isInstructor = msg.sender_role === "PROFESSOR" || msg.sender_role === "TA";
                  const senderName = msg.sender_name || "User";
                  const showLabel = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;

                  return (
                    <div key={msg.id || index} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-6 text-white font-bold text-[10px] ${
                        isMe ? "bg-[#465182]" : isInstructor ? "bg-gradient-to-br from-[#D67A1E] to-[#b86a15] ring-2 ring-[#D67A1E]/15" : getAvatarColor(senderName)
                      }`}>
                        {isMe ? "Me" : senderName?.charAt(0)}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {showLabel && (
                          <div className={`flex items-center gap-1.5 mb-1 px-0.5 ${isMe ? "flex-row-reverse" : ""}`}>
                            <span className={`text-[11px] font-semibold ${isMe ? "text-[#465182]" : isInstructor ? "text-[#D67A1E]" : "text-gray-500"}`}>
                              {isMe ? "You" : isInstructor ? senderName : senderName?.split(" ")[0]}
                            </span>
                            {isInstructor && !isMe && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#D67A1E] bg-[#D67A1E]/[0.08] px-1.5 py-0.5 rounded-md border border-[#D67A1E]/10">
                                <FaCrown size={7} />
                                {msg.sender_role === "TA" ? "TA" : "Instructor"}
                              </span>
                            )}
                          </div>
                        )}

                        <div className={`group relative px-3.5 py-2.5 ${
                          isMe
                            ? "bg-[#465182] text-white rounded-2xl rounded-tr-lg shadow-md shadow-[#465182]/10"
                            : isInstructor
                            ? "bg-white text-gray-800 rounded-2xl rounded-tl-lg border border-[#D67A1E]/15 shadow-sm ring-1 ring-[#D67A1E]/5"
                            : "bg-white text-gray-800 rounded-2xl rounded-tl-lg border border-gray-200/50 shadow-sm"
                        }`}>
                          {editingMessageId === msg.id ? (
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <textarea
                                className="w-full text-gray-800 bg-white rounded-md p-1.5 text-[13px] resize-none focus:outline-none"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                              />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="text-[11px] px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
                                <button 
                                  onClick={() => { handleEditMessage(msg.id, editContent); setEditingMessageId(null); }} 
                                  className="text-[11px] px-2 py-1 bg-[#D67A1E] text-white rounded hover:bg-[#b86a15]"
                                >Save</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words ${msg.is_deleted ? 'italic opacity-70' : ''}`}>
                                {msg.content}
                              </p>
                              {/* Edit/Delete Actions now inline below */}
                            </>
                          )}
                        </div>

                        <div className={`flex items-center gap-2 mt-1 px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          <p className={`text-[10px] text-gray-400 font-medium ${isMe ? "text-right" : ""}`}>
                            {new Date(msg.created_at || msg.timestamp).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                            {msg.is_edited && !msg.is_deleted && <span className="ml-1 italic text-gray-400">(edited)</span>}
                          </p>
                          {!msg.is_deleted && (
                             <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                               {isMe && <button onClick={() => { setEditingMessageId(msg.id); setEditContent(msg.content); }} className="text-blue-500 hover:text-blue-700 p-0.5" title="Edit"><FaEdit size={11} /></button>}
                               <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-700 p-0.5" title="Delete"><FaTrash size={11} /></button>
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm ring-1 ring-gray-100">
                      <FaComments size={24} className="text-gray-300" />
                    </div>
                    <p className="text-[14px] font-bold text-gray-600">No messages yet</p>
                    <p className="text-[12px] text-gray-400 mt-1">Start the conversation by saying hello</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200/50 px-5 py-3 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={selectedCourse.is_chat_active !== false ? `Message #${selectedCourse.course_code}...` : "Chat is closed"}
                  className="flex-1 text-[13px] border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:border-[#465182]/25 focus:ring-2 focus:ring-[#465182]/5 bg-[#F8F9FB] transition-all duration-200 placeholder-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={sending || selectedCourse.is_chat_active === false}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending || selectedCourse.is_chat_active === false}
                  className="w-9 h-9 rounded-xl bg-[#465182] text-white flex items-center justify-center hover:bg-[#3a4570] transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#465182]/15 active:scale-95"
                >
                  <FaPaperPlane size={12} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#465182]/[0.015] rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/3 w-[350px] h-[350px] bg-[#D67A1E]/[0.015] rounded-full blur-3xl" />
            </div>
            <div className="text-center relative z-10">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-200/20 ring-1 ring-gray-100">
                <FaComments size={30} className="text-gray-300" />
              </div>
              <p className="text-[18px] font-bold text-gray-700 tracking-tight">Select a Course</p>
              <p className="text-[13px] text-gray-400 mt-1.5 max-w-[260px] mx-auto">
                Choose a course from the sidebar to view its group chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentChat;
