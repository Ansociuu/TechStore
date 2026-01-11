
import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { getAIRecommendations } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIAssistantProps {
  onNavigate: (page: Page) => void;
}

export default function AIAssistant({ onNavigate }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Xin chào! Tôi là Trợ lý AI của TechStore. Bạn cần tư vấn về sản phẩm nào hay muốn tìm hiểu công nghệ gì hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getAIRecommendations(userMsg);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Xin lỗi, tôi gặp chút trục trặc trong quá trình xử lý. Hãy thử lại sau ít phút nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto min-h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation Back */}
      <button 
        onClick={() => onNavigate(Page.HOME)}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group w-fit"
      >
        <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Thoát Trợ lý AI
      </button>

      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-surface-border pb-6">
        <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg animate-sparkle">
          <span className="material-symbols-outlined !text-[28px] font-variation-fill">auto_awesome</span>
        </div>
        <div>
          <h1 className="text-3xl font-black font-display tracking-tight uppercase">AI Tech Concierge</h1>
          <p className="text-sm text-slate-500 font-light italic">Tư vấn chuyên sâu 24/7 bởi Gemini Flash 3.0</p>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-6 md:p-10 shadow-sm overflow-y-auto max-h-[500px] flex flex-col gap-6 no-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-white/10'
            }`}>
              {msg.content.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-white/5 p-5 rounded-3xl rounded-tl-none flex gap-2 items-center">
              <span className="size-1.5 bg-primary rounded-full animate-bounce"></span>
              <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative group">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi AI về MacBook, iPhone hoặc linh kiện chuyên dụng..."
          className="w-full h-16 bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-2xl px-6 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xl"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          "So sánh iPhone 17 và S24",
          "MacBook nào cho coder?",
          "Build PC đồ họa 30tr",
          "Tai nghe tốt nhất hiện nay"
        ].map((hint, i) => (
          <button 
            key={i}
            onClick={() => setInput(hint)}
            className="px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-surface-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
          >
            {hint}
          </button>
        ))}
      </div>
    </div>
  );
}
