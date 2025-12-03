import React, { useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatResponse = {
  reply: string;
  sources?: Array<{ id: string; title: string; source: string; score: number }>;
  error?: string;
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = useMemo(() => process.env.REACT_APP_CHAT_API_URL || 'http://localhost:3002/api/chat', []);

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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div>
              <p className="text-sm font-semibold text-white">Chat with Outpost</p>
              <p className="text-xs text-white/60">Powered by your knowledge base</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-sm"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin">
            {messages.length === 0 && (
              <div className="text-xs text-white/60 px-2 py-3">
                Ask about signage, vehicle branding, materials, lead times, or installation.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-[#78BE20] text-black'
                    : 'mr-auto bg-white/10 text-white'
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-white/60 px-2 py-1">Thinking…</div>
            )}
          </div>

          <div className="border-t border-white/10 p-3 bg-[#0d0d0d]">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl text-sm text-white p-2 resize-none h-12 focus:outline-none focus:ring-2 focus:ring-[#78BE20]/60"
                placeholder="Ask a question…"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-[#78BE20] text-black text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6da71d]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#78BE20] text-black font-semibold shadow-lg hover:bg-[#6da71d]"
        >
          Live Chat
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
