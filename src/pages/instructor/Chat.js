import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";

const InstructorChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await instructorApi.getConversations();
        setConversations(response.data);
      } catch (err) { console.error("Failed to fetch:", err); }
      finally { setLoading(false); }
    };
    fetchConversations();
  }, []);

  const handleSelectConversation = async (conv) => {
    setSelectedConversation(conv);
    try {
      const response = await instructorApi.getConversationMessages(conv.id);
      setMessages(response.data);
    } catch (err) { console.error("Failed to fetch messages:", err); }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen">
      <div className="w-1/3 border-r border-gray-100 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Conversations</h1>
        <div className="space-y-2">
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => handleSelectConversation(conv)} className={`w-full text-left p-3 rounded-xl ${selectedConversation?.id === conv.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
              <p className="font-medium text-gray-800">{conv.student_name}</p>
              <p className="text-sm text-gray-500">{conv.course_name}</p>
              <p className="text-xs text-gray-400 truncate">{conv.last_message?.content}</p>
            </button>
          ))}
          {conversations.length === 0 && <p className="text-gray-400 text-center py-8">No conversations</p>}
        </div>
      </div>
      <div className="w-2/3 p-4 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-xl max-w-[70%] ${msg.role === 'USER' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'USER' ? 'text-blue-200' : 'text-gray-400'}`}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
              {messages.length === 0 && <p className="text-gray-400 text-center">No messages</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
};

export default InstructorChat;