
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
    { role: 'ai', content: 'Xin chào! Tôi là Trợ lý AI của TechStore. Tôi có thể giúp bạn phân tích thông số kỹ thuật, so sánh sản phẩm hoặc tư vấn giải pháp công nghệ tối ưu dựa trên nhu cầu thực tế.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const insights = [
    { title: 'Xu hướng thị trường', icon: 'trending_up', desc: 'Laptops chip M3 đang dẫn đầu doanh số tháng này.' },
    { title: 'Đồ họa chuyên nghiệp', icon: 'imagesmode', desc: 'Các dòng RTX 40-series được khuyên dùng cho render 3D.' },
    { title: 'Tính tương thích', icon: 'settings_input_component', desc: 'Kiểm tra độ tương thích giữa các linh kiện PC.' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const userMsg = customMsg || input.trim();
    if (!userMsg || isLoading) return;

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
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Sidebar - Insights */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1">
        <div className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px]">analytics</span>
            AI Insights Dashboard
          </h3>
          <div className="space-y-4">
            {insights.map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-surface-border group hover:border-primary transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <span className="material-symbols-outlined text-primary !text-[20px]">{item.icon}</span>
                  <h4 className="text-xs font-black uppercase tracking-wider">{item.title}</h4>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 bg-primary/10 size-16 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-[10px] font-bold text-primary mb-2 italic">Mẹo AI:</p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">Bạn có thể hỏi AI so sánh trực tiếp 2 mã sản phẩm bất kỳ.</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate(Page.HOME)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group px-6"
        >
          <span className="material-symbols-outlined !text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Quay lại cửa hàng
        </button>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-6 order-1 lg:order-2">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-surface-border pb-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg animate-sparkle shadow-primary/20">
              <span className="material-symbols-outlined !text-[32px] font-variation-fill">psychology</span>
            </div>
            <div>
              <h1 className="text-3xl font-black font-display tracking-tight uppercase">AI Tech Concierge</h1>
              <p className="text-sm text-slate-500 font-light italic flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                Gemini 3.0 Ultra Mode Active
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 min-h-[500px]">
          <div
            ref={scrollRef}
            className="flex-grow bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-surface-border p-6 md:p-8 shadow-sm overflow-y-auto max-h-[600px] flex flex-col gap-6 no-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10'
                    : 'bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-white/10'
                  }`}>
                  <div className="font-medium whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, i) => {
                      // Simple markdown-ish bold detection
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-black text-primary mb-2">{line.replace(/\*\*/g, '')}</p>;
                      }
                      return <p key={i} className="mb-2 last:mb-0">{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                  <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.8s]"></span>
                  <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
                  <span className="size-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi về Specs hoặc so sánh sản phẩm..."
              className="w-full h-16 bg-white dark:bg-surface-dark border border-slate-200 dark:border-surface-border rounded-2xl px-6 pr-16 text-sm outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-xl dark:shadow-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {[
              "So sánh CPU M2 vs M3",
              "Top bàn phím cơ 2tr",
              "Build PC đồ họa giá rẻ",
              "Ưu đãi cho sinh viên"
            ].map((hint, i) => (
              <button
                key={i}
                onClick={() => handleSend(undefined, hint)}
                className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
