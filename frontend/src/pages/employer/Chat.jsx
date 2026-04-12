import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { 
  MessageCircle, Send, Circle, Info, 
  Home, LogOut, User, ChevronLeft 
} from "lucide-react";

// Helper for initials
function initials(n="") { 
  return n.split(" ").slice(0,2).map(p => p[0]).join("").toUpperCase(); 
}

const MOCK_CONVOS = [
  { id:"j1", name:"Sara Baig", preview:"Please be on time tomo...", time:"2:34 PM", unread:2 },
  { id:"j2", name:"Usman Khan", preview:"Can you confirm the w...", time:"Yesterday", unread:0 },
  { id:"j3", name:"Fatima Asif", preview:"Great job today, thank you!", time:"Mon", unread:0 },
];

const MOCK_MSGS = [
  { id:1, from:"them", text:"Hi, I've accepted your job request. Please confirm the start time.", time:"2:30 PM" },
  { id:2, from:"me", text:"Great! Please be at our place by 9 AM sharp.", time:"2:31 PM" },
  { id:3, from:"them", text:"Sure, I'll be there on time. Do you have a parking spot available?", time:"2:32 PM" },
  { id:4, from:"me", text:"Yes, you can park in the driveway. See you tomorrow!", time:"2:34 PM" },
];

export default function Chat() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [activeConvo, setActiveConvo] = useState(jobId || "j1");
  const [messages, setMessages] = useState(MOCK_MSGS);
  const [text, setText] = useState("");
  const [convos, setConvos] = useState(MOCK_CONVOS);
  const bottomRef = useRef();

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // API Fetch Logic
  useEffect(() => {
    if (!activeConvo) return;
    api.get(`/chat/${activeConvo}`)
      .then(d => { if(d?.length) setMessages(d); })
      .catch(() => {});
  }, [activeConvo]);

  const sendMsg = async () => {
    if (!text.trim()) return;
    const msg = { 
      id: Date.now(), 
      from: "me", 
      text: text.trim(), 
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
    };
    setMessages(ms => [...ms, msg]);
    setText("");
    try { await api.post(`/chat/${activeConvo}`, { message: msg.text }); } catch {}
  };

  const active = convos.find(c => c.id === activeConvo);

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      
      {/* 1. Internal Conversation Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        
        {/* Chat-Specific Navigation Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <MessageCircle size={18} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-lg">Chats</span>
          </div>
          
          {/* Exit to Dashboard Button */}
          <Link 
            to="/" 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 transition-all"
            title="Return Home"
          >
            <Home size={20} />
          </Link>
        </div>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {convos.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveConvo(c.id)}
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
                <div className="text-xs text-slate-500 truncate">{c.preview}</div>
              </div>
              {c.unread > 0 && (
                <div className="bg-teal-500 text-white rounded-full min-w-[18px] h-[18px] text-[10px] font-black flex items-center justify-center px-1">
                  {c.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Active Chat Header */}
        {active && (
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-white">
                  {initials(active.name)}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-none mb-1">{active.name}</div>
                <div className="flex items-center gap-1">
                  <Circle size={6} className="fill-emerald-500 text-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Actions */}
            <div className="flex items-center gap-2">
              <Link to="/profile" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase">
                <User size={16} /> Profile
              </Link>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC] flex flex-col gap-6">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] group`}>
                <div className={`px-5 py-3 rounded-2xl text-[14px] shadow-sm leading-relaxed ${
                  m.from === "me" 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                }`}>
                  {m.text}
                </div>
                <div className={`text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-tighter ${m.from === "me" ? "text-right" : "text-left"}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Bottom Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-teal-500 focus-within:bg-white focus-within:shadow-md transition-all duration-300">
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
              disabled={!text.trim()}
              className="w-11 h-11 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all flex items-center justify-center disabled:opacity-30 shadow-lg shadow-teal-100"
            >
              <Send size={20} />
            </button>
          </div>
          <div className="mt-3 flex justify-center items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
            <Info size={12} className="text-teal-500" /> End-to-end encrypted · {text.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}