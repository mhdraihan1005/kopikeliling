"use client";

import { useState, useRef, useEffect } from "react";
import { BotMessageSquare, Sparkles, Send, X, Coffee, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AiBarista() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Halo! Saya AiCino, Asisten Barista cerdas Anda. Bingung mau pesan kopi apa hari ini? Ceritakan suasana hati Anda, atau cuaca di sana!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.message || "Maaf, terjadi kesalahan saat menghubungi server." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Maaf, koneksi terputus. Silakan coba lagi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 sm:right-6 w-[88vw] sm:w-96 bg-black/60 backdrop-blur-2xl border border-amber-500/30 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 flex justify-between items-center text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <BotMessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                    AiCino Barista 
                    <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                       <Sparkles size={14} className="text-amber-200 fill-amber-200" />
                    </motion.div>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                     <p className="text-[10px] text-amber-100 opacity-90">Online - Powered by AI</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Content */}
            <div className="h-80 sm:h-96 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  key={i} 
                  className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] text-[13px] sm:text-sm px-4 py-3 rounded-2xl shadow-sm ${
                    msg.role === "assistant" 
                      ? "bg-zinc-800/90 text-white rounded-tl-sm border border-zinc-700/50 leading-relaxed" 
                      : "bg-gradient-to-r from-amber-500 to-amber-400 text-black font-medium rounded-tr-sm"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-zinc-800/90 px-4 py-3 rounded-2xl rounded-tl-sm border border-zinc-700/50 flex items-center gap-2.5">
                    <Loader2 size={14} className="text-amber-500 animate-spin" />
                    <span className="text-zinc-400 text-[13px] animate-pulse">Sedang menganalisa preferensi menu...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-zinc-700/80 bg-black/80">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ceritakan harimu atau keinginganmu..."
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-white text-sm rounded-full pl-4 pr-12 py-3.5 outline-none focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-zinc-500"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 p-2 bg-gradient-to-tr from-amber-500 to-amber-400 hover:scale-105 active:scale-95 text-black rounded-full disabled:opacity-50 disabled:grayscale transition-all"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Menu Pemicu */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-5 sm:right-6 w-14 h-14 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-black shadow-[0_0_30px_rgba(245,158,11,0.5)] rounded-full flex items-center justify-center z-[100] group border border-amber-300"
      >
        <motion.div animate={{ scale: isOpen ? 0 : 1, rotate: isOpen ? -90 : 0 }} className="absolute">
           <BotMessageSquare size={24} className="text-black/90 drop-shadow-sm" />
        </motion.div>
        <motion.div animate={{ scale: isOpen ? 1 : 0, rotate: isOpen ? 0 : 90 }} className="absolute">
           <X size={24} className="text-black/90" />
        </motion.div>
        
        {!isOpen && (
           <span className="absolute 0 right-0 top-0 w-3.5 h-3.5 bg-red-500 border-2 border-zinc-900 rounded-full animate-ping"></span>
        )}
        {!isOpen && (
           <span className="absolute 0 right-0 top-0 w-3.5 h-3.5 bg-red-500 border-2 border-zinc-900 rounded-full"></span>
        )}
      </motion.button>
    </>
  );
}
