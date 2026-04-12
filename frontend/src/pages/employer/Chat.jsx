import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth"; 
import { 
  MessageCircle, Send, Circle, Info, 
  Home, LogOut, User, ArrowLeft 
} from "lucide-react";

// --- HELPERS ---
function initials(n = "") { 
  return n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase(); 
}

// --- MOCK DATA (Merging Adeeba's detailed logic with Main's previews) ---
const MOCK_CONVOS = [
  { id: "j1", name: "Sara Baig", preview: "Please be on time tomo...", time: "2:34 PM", unread: 2 },
  { id: "j2", name: "Usman Khan", preview: "Can you confirm the w...", time: "Yesterday", unread: 0 },
  { id: "j3", name: "Fatima Asif", preview: "Great job today, thank you!", time: "Mon", unread: 0 },
];

const MOCK_MESSAGES_DATA = {
  j1: [
    { id: 1, from: "them", text: "Hi, are you available tomorrow?", time: "2:30 PM" },
    { id: 2, from: "me", text: "Yes, what time?", time: "2:31 PM" },
    { id: 3, from: "them", text: "9 AM sharp please", time: "2:32 PM" },
  ],
  j2: [
    { id: 1, from: "them", text: "Can you confirm the work?", time: "Yesterday" },
    { id: 2, from: "me", text: "Yes confirmed ", time: "Yesterday" },
  ],
  j3: [
    { id: 1, from: "them", text: "Great job today!", time: "Mon" },
    { id: 2, from: "me", text: "Thank you ", time: "Mon" },
  ],
};

export default function Chat() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  // State
  const [activeConvo, setActiveConvo] = useState(jobId || "j1");
  const [messages, setMessages] = useState(MOCK_MESSAGES_DATA[jobId || "j1"] || []);
  const [text, setText] = useState("");
  const [convos] = useState(MOCK_CONVOS);
  const bottomRef = useRef();

  // --- LOGIC ---

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Logic to switch conversations and attempt to fetch from API
  useEffect(() => {
    if (!activeConvo) return;
    
    // 1. First load mock data for immediate UI feedback
    setMessages(MOCK_MESSAGES_DATA[activeConvo] || []);

    // 2. Then try to fetch real data from API
    api.get(`/chat/${activeConvo}`)
      .then(d => { 
        if(d?.length) setMessages(d); 
      })
      .catch(() => console.log("Using mock data as fallback"));
  }, [activeConvo]);

  const sendMsg = async () => {
    if (!text.trim()) return;

    const msg = { 
      id: Date.now(), 
      from: "me", 
      text: text.trim(), 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    };

    // Update UI locally
    setMessages(ms => [...ms, msg]);
    setText("");

    // Save to Database via API
    try { 
      await api.post(`/chat/${activeConvo}`, { message: msg.text }); 
    } catch (err) {
      console.error("Failed to sync message to server");
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    return user.role === "admin" ? "/admin/dashboard" : `/${user.role}/dashboard`;
  };

  const active = convos.find(c => c.id === activeConvo);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      
      {/* 1. Sidebar (Conversation List) */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <MessageCircle size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-lg">Messages</span>
          </div>
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 transition-all">
            <Home size={20} />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {convos.map(c => (
            <div
              key={c.id}
              onClick={() => {
                setActiveConvo(c.id);
                navigate(`/employer/chat/${c.id}`); // Keep URL in sync
              }}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-slate-50 ${
                c.id === activeConvo 
                  ? "bg-white border-r-4 border-teal-500 shadow-sm" 
                  : "hover:bg-slate-100/50"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 shadow-inner">
                {initials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-sm text-slate-900 truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{c.time}</span>
                </div>
                <div className="text-xs text-slate-500 truncate">
                    {c.unread > 0 ? (
                        <span className="bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full mr-2">
                            {c.unread} new
                        </span>
                    ) : null}
                    {c.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Header */}
        {active && (
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                {initials(active.name)}
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-none mb-1">{active.name}</div>
                <div className="flex items-center gap-1">
                  <Circle size={6} className="fill-emerald-500 text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to={getDashboardPath()} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase transition-all no-underline"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] flex flex-col gap-6">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[70%]">
                <div className={`px-5 py-3 rounded-2xl text-[14px] shadow-sm leading-relaxed ${
                  m.from === "me" 
                    ? "bg-[#1A2E35] text-white rounded-tr-none" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                }`}>
                  {m.text}
                </div>
                <div className={`text-[10px] text-slate-400 mt-2 font-bold uppercase ${m.from === "me" ? "text-right" : "text-left"}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 rounded-2xl p-2 border border-slate-200">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendMsg(); }}
              placeholder="Type your message here..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-slate-700"
            />
            <button
              onClick={sendMsg}
              className="w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}