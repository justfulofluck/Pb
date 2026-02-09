
import React, { useState, useRef, useEffect } from 'react';
import { getHealthAdvice } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
  sources?: any[];
}

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hey there! I’m your Pinobite Health Coach. Want to know how to fuel your morning? Ask me anything about nutrition or our products!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setIsLoading(true);

    const { text, sources } = await getHealthAdvice(userText);
    setMessages(prev => [...prev, { role: 'ai', text, sources }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col doodle-border border-primary">
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined">eco</span>
              <span className="font-bold">Pinobite Health Coach</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scroll bg-background-light">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.sources.map((s, idx) => (
                      s.web && (
                        <a 
                          key={idx} 
                          href={s.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-slate-600 transition-colors"
                        >
                          {s.web.title || 'Source'}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-400 p-4 rounded-2xl text-sm italic animate-pulse">
                  Fact checking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your health coach..."
                className="flex-1 px-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${isOpen ? 'bg-slate-800' : 'bg-primary'} text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group relative`}
      >
        <span className="material-symbols-outlined text-3xl">{isOpen ? 'close' : 'chat_bubble'}</span>
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
           </span>
        )}
      </button>
    </div>
  );
};

export default GeminiChat;
