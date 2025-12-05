import React, { useMemo, useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, User } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatResponse = {
  reply: string;
  sources?: Array<{ id: string; title: string; source: string; score: number }>;
  error?: string;
};

type EscalationData = {
  name: string;
  email: string;
  phone?: string;
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalationData, setEscalationData] = useState<EscalationData>({ name: '', email: '', phone: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiUrl = useMemo(() => process.env.REACT_APP_CHAT_API_URL || 'http://localhost:3002/api/chat', []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok || data.error) {
        const errorMsg = data.error || 'Sorry, I had trouble answering that. Please try again.';
        setMessages([...nextMessages, { role: 'assistant', content: errorMsg }]);
      } else {
        const answer = data.reply;
        setMessages([...nextMessages, { role: 'assistant', content: answer }]);
      }
    } catch (err) {
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: 'Network error. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEscalation = () => {
    setShowEscalation(true);
  };

  const submitEscalation = () => {
    if (!escalationData.name || !escalationData.email) {
      alert('Please provide your name and email');
      return;
    }

    // Add escalation message to chat
    setMessages([
      ...messages,
      {
        role: 'assistant',
        content: `Thanks ${escalationData.name}! We've received your contact details. A team member will reach out to you at ${escalationData.email} shortly. Is there anything else I can help with in the meantime?`
      }
    ]);

    // Reset escalation form
    setShowEscalation(false);
    setEscalationData({ name: '', email: '', phone: '' });

    // TODO: Send escalation data to backend
    console.log('Escalation submitted:', escalationData);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        .chat-widget-container {
          font-family: 'DM Sans', -apple-system, sans-serif;
        }

        .chat-header-title {
          font-family: 'Crimson Pro', Georgia, serif;
        }

        .chat-message-enter {
          animation: messageSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .chat-bubble-user {
          background: linear-gradient(135deg, #78BE20 0%, #6da71d 100%);
          box-shadow: 0 2px 8px rgba(120, 190, 32, 0.2),
                      0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .chat-bubble-assistant {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
        }

        .chat-input-focus:focus {
          outline: none;
          border-color: #78BE20;
          box-shadow: 0 0 0 3px rgba(120, 190, 32, 0.15);
        }

        .chat-send-button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(120, 190, 32, 0.4);
        }

        .chat-send-button:not(:disabled):active {
          transform: translateY(0);
        }

        .chat-toggle-button {
          box-shadow: 0 4px 20px rgba(120, 190, 32, 0.3),
                      0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .chat-toggle-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 28px rgba(120, 190, 32, 0.4),
                      0 4px 12px rgba(0, 0, 0, 0.25);
        }

        .chat-widget-backdrop {
          background: linear-gradient(165deg,
            rgba(10, 10, 10, 0.96) 0%,
            rgba(20, 20, 20, 0.94) 50%,
            rgba(15, 15, 15, 0.95) 100%);
          backdrop-filter: blur(20px) saturate(1.2);
        }

        .escalation-form-enter {
          animation: formSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes formSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .typing-indicator span {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(120, 190, 32, 0.6);
          margin: 0 2px;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(120, 190, 32, 0.3);
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: rgba(120, 190, 32, 0.5);
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 chat-widget-container">
        {isOpen ? (
          <div className="w-[420px] h-[620px] rounded-2xl shadow-2xl flex flex-col overflow-hidden chat-widget-backdrop border border-white/10">
            {/* Header */}
            <div className="relative px-6 py-5 border-b border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#78BE20]/10 via-transparent to-transparent opacity-50" />
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="chat-header-title text-2xl font-bold text-white mb-1 tracking-tight">
                    Outpost Assistant
                  </h3>
                  <p className="text-sm text-white/60 font-medium">
                    Ask about our products & services
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 -mr-2"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-custom">
              {messages.length === 0 && (
                <div className="text-center py-8 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#78BE20]/20 to-[#6da71d]/10 mb-4 border border-[#78BE20]/20">
                    <Sparkles className="w-8 h-8 text-[#78BE20]" />
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed max-w-xs mx-auto">
                    Hi! I'm here to help with questions about signage, vehicle branding, custom clothing, and more.
                  </p>
                  <button
                    onClick={handleEscalation}
                    className="mt-4 text-xs text-[#78BE20] hover:text-[#6da71d] font-medium transition-colors"
                  >
                    Need to speak with a human? →
                  </button>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 chat-message-enter ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#78BE20] to-[#6da71d] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-white/80" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'chat-bubble-user text-white font-medium rounded-tr-sm'
                        : 'chat-bubble-assistant text-white/90 rounded-tl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 chat-message-enter">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#78BE20] to-[#6da71d] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-bubble-assistant rounded-2xl rounded-tl-sm px-5 py-3">
                    <div className="typing-indicator flex items-center gap-1 py-1">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              {messages.length > 0 && !showEscalation && (
                <div className="text-center pt-2">
                  <button
                    onClick={handleEscalation}
                    className="text-xs text-white/50 hover:text-[#78BE20] font-medium transition-colors"
                  >
                    Need more help? Talk to our team →
                  </button>
                </div>
              )}

              {showEscalation && (
                <div className="escalation-form-enter bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#78BE20]/20 to-[#6da71d]/10 flex items-center justify-center border border-[#78BE20]/20">
                      <MessageCircle className="w-5 h-5 text-[#78BE20]" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm mb-1">Connect with our team</h4>
                      <p className="text-white/60 text-xs leading-relaxed">We'll get back to you shortly</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={escalationData.name}
                      onChange={(e) => setEscalationData({ ...escalationData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white px-4 py-2.5 placeholder:text-white/40 focus:outline-none focus:border-[#78BE20]/50 focus:ring-2 focus:ring-[#78BE20]/20 transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={escalationData.email}
                      onChange={(e) => setEscalationData({ ...escalationData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white px-4 py-2.5 placeholder:text-white/40 focus:outline-none focus:border-[#78BE20]/50 focus:ring-2 focus:ring-[#78BE20]/20 transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={escalationData.phone}
                      onChange={(e) => setEscalationData({ ...escalationData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white px-4 py-2.5 placeholder:text-white/40 focus:outline-none focus:border-[#78BE20]/50 focus:ring-2 focus:ring-[#78BE20]/20 transition-all"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setShowEscalation(false)}
                      className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitEscalation}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#78BE20] to-[#6da71d] hover:from-[#6da71d] hover:to-[#5a8a18] text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-[#78BE20]/20"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4 bg-black/20">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl text-[15px] text-white px-4 py-3 resize-none focus:outline-none focus:border-[#78BE20]/50 focus:ring-2 focus:ring-[#78BE20]/20 placeholder:text-white/40 transition-all scrollbar-custom"
                  placeholder="Type your message..."
                  rows={1}
                  style={{ maxHeight: '120px', minHeight: '48px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="chat-send-button flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#78BE20] to-[#6da71d] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="chat-toggle-button flex items-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-[#78BE20] to-[#6da71d] text-white font-bold text-base"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="tracking-wide">Chat with us</span>
          </button>
        )}
      </div>
    </>
  );
};

export default ChatWidget;
