"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Clock, Plus, X, ArrowUp, Bot } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/axios";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const userName = user?.name || "Harsh";
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock History Data
  const historyItems = [
    "Prisma P1001 Connection Fix",
    "LMS Web App Development",
    "Push files to GitHub",
    "Change column datatype",
    "AI Chatbot Integration",
    "MySQL Password Aiven"
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);

    try {
      const res = await api.post("/chat", { message: userMsg, history: messages.slice(-10) });
      const aiResponseContent = res.data.data.content;
      setMessages((prev) => [
        ...prev, 
        { role: "ai", content: aiResponseContent }
      ]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Something went wrong fetching from AI.";
      setMessages((prev) => [
        ...prev, 
        { role: "ai", content: `Error: ${errorMsg}` }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setShowHistory(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f9fafb] text-gray-900 font-sans">
      
      {/* Sliding History Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${
          showHistory ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
          <button onClick={() => setShowHistory(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {historyItems.map((item, idx) => (
            <button 
              key={idx}
              className="w-full text-left px-3 py-3 rounded-xl border border-transparent text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-colors"
              onClick={() => {
                setMessages([{ role: "user", content: `Load session: ${item}`}, { role: "ai", content: `I have restored the context for "${item}". What would you like to continue discussing?` }]);
                setShowHistory(false);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col relative w-full h-full">
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Clock className="h-4 w-4" />
              History
            </button>
            <button 
              type="button"
              onClick={startNewChat}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
          </div>
          
          <Link 
            href="/home" 
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-gray-900"
            title="Close chat"
          >
            <X className="h-5 w-5" />
          </Link>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mx-auto max-w-3xl h-full flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col justify-center text-center pb-20">
                <h1 className="text-4xl font-semibold tracking-tight text-gray-800 sm:text-5xl">
                  Welcome <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">{userName}</span>!
                </h1>
                <p className="mt-4 text-base text-gray-500 sm:text-lg">
                  Hey buddy! Need any assistance or up for a chat?
                </p>
              </div>
            ) : (
              <div className="flex-1 py-6 space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 mt-1">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-base leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-orange-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 mt-1">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl px-5 py-4 bg-white border border-gray-100 rounded-bl-none shadow-sm text-gray-400">
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></span>
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-75"></span>
                      <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-150"></span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <div className="w-full px-4 pb-6 pt-2">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow focus-within:shadow-md">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Start your chat with BroKod.."
                className="w-full max-h-[150px] min-h-[56px] resize-none rounded-3xl bg-transparent py-4 pl-6 pr-14 text-base text-gray-900 placeholder-gray-400 outline-none scrollbar-thin scrollbar-thumb-gray-200"
                rows={1}
              />
              <button 
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isTyping}
                className="absolute bottom-2 right-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Overlay for Mobile Sidebar */}
      {showHistory && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 transition-opacity" 
          onClick={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
