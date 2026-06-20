import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Volume2, ShieldAlert } from 'lucide-react';
import { sendMessageToSafeNest } from '../api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am SafeNest, your secure safety assistant. You can speak to me freely about safety rules, what to do if you are scared, or how anonymous reporting works. Everything you say is kept completely private.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([
    "What is an unsafe touch?",
    "How do I report abuse?",
    "Helpline numbers"
  ]);
  const [priority, setPriority] = useState('normal');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg.trim()) return;

    // Add user message
    const userMessage = {
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    
    setIsTyping(true);

    try {
      const data = await sendMessageToSafeNest(msg);
      
      // Simulate slight typing latency for visual quality
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.reply,
          timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setSuggestions(data.suggestions || []);
        setPriority(data.priority || 'normal');
        setIsTyping(false);
      }, 700);

    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: "I am having trouble connecting securely to the safety grid right now. If you are in danger, please contact 1-800-422-4453 immediately.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 700);
    }
  };

  return (
    <section id="chatbot" className="py-24 relative overflow-hidden bg-navy-dark/60">
      {/* Background Lights */}
      <div className="absolute right-10 bottom-10 w-96 h-96 bg-glow-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight mb-4">
            AI-Powered <span className="text-gradient-cyan-purple">Safety Assistant</span>
          </h2>
          <p className="text-sm text-gray-400">
            Chat anonymously with SafeNest. Learn your rights, ask clarifying questions, and discover safe contact resources instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hologram Representation */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              
              {/* Holographic Glowing Rings */}
              <div className="absolute w-full h-full rounded-full border border-glow-cyan/20 animate-[spin_15s_linear_infinite]"></div>
              <div className="absolute w-[80%] h-[80%] rounded-full border border-dashed border-glow-purple/20 animate-[spin_10s_linear_infinite_reverse]"></div>
              
              {/* Voice waves overlay when typing/speaking */}
              <div className="absolute flex items-center gap-1">
                <span className={`w-1 bg-glow-cyan rounded-full transition-all duration-300 ${isTyping ? 'h-12 animate-pulse' : 'h-4'}`}></span>
                <span className={`w-1 bg-glow-purple rounded-full transition-all duration-300 ${isTyping ? 'h-16 animate-pulse' : 'h-6'}`}></span>
                <span className={`w-1 bg-glow-pink rounded-full transition-all duration-300 ${isTyping ? 'h-10 animate-pulse' : 'h-5'}`}></span>
                <span className={`w-1 bg-glow-cyan rounded-full transition-all duration-300 ${isTyping ? 'h-6 animate-pulse' : 'h-3'}`}></span>
              </div>

              {/* Bot Floating Core */}
              <div className="w-32 h-32 rounded-3xl bg-navy-card border border-glow-cyan/40 shadow-cyan-glow/20 flex items-center justify-center animate-float-slow z-10">
                <Bot className="w-16 h-16 text-glow-cyan" />
              </div>
            </div>

              {/* Glowing SafeNest Badge */}
              <div className="mt-6 flex flex-col items-center">
              <span className="text-xs uppercase font-mono tracking-widest text-glow-cyan bg-glow-cyan/10 px-3 py-1 rounded-full border border-glow-cyan/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-glow-cyan animate-ping"></span>
                SafeNest v2.1 Active
              </span>
              <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px]">
                End-to-end sandbox chat session. No records are saved to the server.
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-8">
            <div className={`glass-panel rounded-3xl border border-white/10 flex flex-col h-[520px] overflow-hidden shadow-2xl relative transition-all duration-500 ${
              priority === 'emergency' ? 'border-glow-pink/40 shadow-pink-glow/5' : ''
            }`}>
              
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-navy-light/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-glow-cyan/15 flex items-center justify-center border border-glow-cyan/20">
                    <Sparkles className="w-5 h-5 text-glow-cyan" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">SafeNest Guidance System</h4>
                    <p className="text-[10px] text-glow-emerald font-semibold uppercase tracking-wider">Ready to protect</p>
                  </div>
                </div>

                {priority === 'emergency' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-glow-pink/15 border border-glow-pink/40 text-glow-pink text-xs font-bold animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Emergency Priority Mode
                  </span>
                )}
              </div>

              {/* Message Box */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, i) => {
                  const isBot = msg.sender === 'bot';
                  return (
                    <div key={i} className={`flex items-start gap-3 ${!isBot ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isBot 
                          ? 'bg-glow-cyan/10 border-glow-cyan/20 text-glow-cyan' 
                          : 'bg-glow-purple/10 border-glow-purple/20 text-glow-purple'
                      }`}>
                        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isBot 
                          ? 'bg-white/5 text-gray-200 border border-white/5' 
                          : 'bg-gradient-to-tr from-glow-purple/20 to-glow-cyan/20 text-white border border-glow-purple/30 shadow-purple-glow/5'
                      }`}>
                        <p>{msg.text}</p>
                        <span className="block text-[9px] text-gray-500 text-right mt-1.5">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-glow-cyan/10 border border-glow-cyan/20 text-glow-cyan flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Suggestions Chips */}
              {suggestions.length > 0 && (
                <div className="px-6 py-2 flex flex-wrap gap-2 border-t border-white/5 bg-navy-dark/40 overflow-x-auto whitespace-nowrap">
                  {suggestions.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-glow-cyan/40 bg-white/5 hover:bg-glow-cyan/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-white/5 bg-navy-light/20 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask SafeNest anything securely..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-glow-cyan/50 text-white placeholder-gray-500 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="p-3 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple hover:opacity-90 text-navy-dark font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-cyan-glow/15"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
