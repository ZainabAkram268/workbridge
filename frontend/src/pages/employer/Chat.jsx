<<<<<<< Updated upstream
=======
import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { MessageCircle, Send, Circle } from "lucide-react";

function initials(n = "") {
  return n.split(" ").slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

// ✅ Conversations
const MOCK_CONVOS = [
  { id: "j1", name: "Sara Baig", time: "2:34 PM", unread: 2 },
  { id: "j2", name: "Usman Khan", time: "Yesterday", unread: 0 },
  { id: "j3", name: "Fatima Asif", time: "Mon", unread: 0 },
];

// ✅ Messages per conversation
const MOCK_MESSAGES = {
  j1: [
    { id: 1, from: "them", text: "Hi, are you available tomorrow?", time: "2:30 PM" },
    { id: 2, from: "me", text: "Yes, what time?", time: "2:31 PM" },
    { id: 3, from: "them", text: "9 AM sharp please", time: "2:32 PM" },
  ],
  j2: [
    { id: 1, from: "them", text: "Can you confirm the work?", time: "Yesterday" },
    { id: 2, from: "me", text: "Yes confirmed 👍", time: "Yesterday" },
  ],
  j3: [
    { id: 1, from: "them", text: "Great job today!", time: "Mon" },
    { id: 2, from: "me", text: "Thank you 😊", time: "Mon" },
  ],
};

export default function Chat() {
  const [activeConvo, setActiveConvo] = useState("j3");
  const [messages, setMessages] = useState(MOCK_MESSAGES["j3"]);
  const [text, setText] = useState("");
  const bottomRef = useRef();

  // switch messages per convo
  useEffect(() => {
    setMessages(MOCK_MESSAGES[activeConvo] || []);
  }, [activeConvo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    if (!text.trim()) return;

    const msg = {
      id: Date.now(),
      from: "me",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages(prev => [...prev, msg]);
    setText("");
  };

  const active = MOCK_CONVOS.find(c => c.id === activeConvo);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      
      {/* Sidebar */}
      <Sidebar role="employer" />

      {/* Main layout */}
      <div className="ml-[232px] flex w-full">

        {/* Conversations */}
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b font-bold text-sm flex items-center gap-2">
            <MessageCircle size={16} /> Messages
          </div>

          {MOCK_CONVOS.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveConvo(c.id)}
              className={`p-4 cursor-pointer flex gap-3 border-b ${
                c.id === activeConvo ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
                {initials(c.name)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.time}</span>
                </div>
              </div>

              {c.unread > 0 && (
                <div className="bg-teal-500 text-white text-xs px-2 rounded-full">
                  {c.unread}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col h-screen">

          {/* Header */}
          {active && (
            <div className="p-4 bg-white border-b flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
                {initials(active.name)}
              </div>

              <div>
                <div className="font-semibold text-sm">{active.name}</div>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Circle size={6} className="fill-green-500" /> Online
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[60%]">
                  <div
                    className={`px-4 py-2 rounded-xl text-sm ${
                      m.from === "me"
                        ? "bg-black text-white"
                        : "bg-white border"
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Type message..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={sendMsg}
              className="bg-teal-600 text-white px-4 rounded-lg"
            >
              <Send size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
