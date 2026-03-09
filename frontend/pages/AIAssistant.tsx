
import React, { useState, useRef, useEffect } from 'react';
import { Page, Product } from '../types';
import { getAIRecommendationsWithProducts, AISuggestedProduct } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  content: string;
  products?: AISuggestedProduct[];
}

interface AIAssistantProps {
  onNavigate: (page: Page) => void;
  onProductSelect?: (product: Product) => void;
  products?: Product[];
}

export default function AIAssistant({ onNavigate, onProductSelect, products: allProducts }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Xin chào! Tôi là Trợ lý AI của TechStore. Tôi có thể giúp bạn tư vấn sản phẩm, so sánh thông số kỹ thuật hoặc gợi ý thiết bị phù hợp với nhu cầu của bạn. Hãy hỏi tôi bất cứ điều gì!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleProductClick = (product: AISuggestedProduct) => {
    // Tìm sản phẩm đầy đủ từ danh sách products nếu có
    if (allProducts && onProductSelect) {
      const fullProduct = allProducts.find(p => String(p.id) === String(product.id));
      if (fullProduct) {
        onProductSelect(fullProduct);
        return;
      }
    }
    // Fallback: navigate tới trang chi tiết bằng ID
    if (onProductSelect) {
      onProductSelect({
        id: String(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        rating: product.rating || 0,
        reviewCount: 0,
        description: '',
        specs: {},
        originalPrice: product.originalPrice,
      } as Product);
    }
  };

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    if (e) e.preventDefault();
    const userMsg = customMsg || input.trim();
    if (!userMsg || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getAIRecommendationsWithProducts(userMsg);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.text,
        products: response.products
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Xin lỗi, tôi gặp chút trục trặc trong quá trình xử lý. Hãy thử lại sau ít phút nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto min-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-surface-border pb-6">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg animate-sparkle shadow-primary/20">
              <span className="material-symbols-outlined !text-[32px] font-variation-fill">psychology</span>
            </div>
            <div>
              <h1 className="text-3xl font-black font-display tracking-tight uppercase">AI Tech Concierge</h1>
              <p className="text-sm text-slate-500 font-light italic flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                Groq Llama 3.3 — Powered by TechStore AI
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
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-white/10'
                  }`}>
                  <div className="font-medium whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-black text-primary mb-2">{line.replace(/\*\*/g, '')}</p>;
                      }
                      // Bold inline: **text** 
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i} className="mb-2 last:mb-0">
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j} className="font-black">{part.replace(/\*\*/g, '')}</strong>;
                            }
                            return <span key={j}>{part}</span>;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </div>

                {/* Product Cards - hiển thị sau tin nhắn AI */}
                {msg.role === 'ai' && msg.products && msg.products.length > 0 && (
                  <div className="w-full max-w-[85%] mt-3">
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <span className="material-symbols-outlined text-primary !text-[16px] font-variation-fill">shopping_bag</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sản phẩm gợi ý — Nhấn để xem chi tiết</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-surface-dark hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group text-left cursor-pointer active:scale-[0.98]"
                        >
                          <div className="size-16 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 p-1.5 flex-shrink-0 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="size-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-black text-primary">{formatPrice(product.price)}</span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[9px] text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-primary transition-all">
                            <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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
              placeholder="Nhập câu hỏi về sản phẩm, so sánh hoặc tư vấn..."
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
              "Tư vấn laptop cho sinh viên",
              "So sánh iPhone và Samsung",
              "Tai nghe chống ồn tốt nhất",
              "Phụ kiện dưới 5 triệu"
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
