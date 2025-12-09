import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User } from 'lucide-react';

const colors = {
  accent: '#64a70b',
  dark: '#183028',
  secondary: '#1e3a2f',
};

const fonts = {
  heading: "'Hearns', serif",
  subheading: "'Embossing Tape 3', sans-serif",
  body: "'Neuzeit Grotesk', sans-serif",
};

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SmartSearchChatProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  suggestions?: string[];
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: colors.accent }}
        animate={{ y: [0, -4, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
        }}
      />
    ))}
  </div>
);

const SmartSearchChat: React.FC<SmartSearchChatProps> = ({
  messages,
  isTyping,
  onSendMessage,
  suggestions = [
    'Polo shirts for restaurant staff',
    'Warm outdoor jackets',
    'Budget-friendly t-shirts',
    'Eco-friendly clothing',
  ],
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isTyping) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(100, 167, 11, 0.15)' }}
            >
              <Sparkles size={24} style={{ color: colors.accent }} />
            </div>
            <h3
              className="text-base font-medium mb-2"
              style={{ color: 'white', fontFamily: fonts.heading }}
            >
              How can I help?
            </h3>
            <p
              className="text-xs mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.5)', fontFamily: fonts.body }}
            >
              Describe what you're looking for
            </p>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 rounded-full text-xs transition-colors"
                  style={{
                    backgroundColor: 'rgba(100, 167, 11, 0.15)',
                    color: colors.accent,
                    fontFamily: fonts.body,
                    border: `1px solid rgba(100, 167, 11, 0.3)`,
                  }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start gap-2 max-w-[90%] ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor:
                      message.role === 'user'
                        ? colors.accent
                        : 'rgba(100, 167, 11, 0.15)',
                  }}
                >
                  {message.role === 'user' ? (
                    <User size={14} style={{ color: 'white' }} />
                  ) : (
                    <Sparkles size={14} style={{ color: colors.accent }} />
                  )}
                </div>

                {/* Message bubble */}
                <div
                  className="px-3 py-2 rounded-2xl"
                  style={{
                    backgroundColor:
                      message.role === 'user'
                        ? colors.accent
                        : 'rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    fontFamily: fonts.body,
                    fontSize: '13px',
                    lineHeight: 1.5,
                    borderBottomRightRadius: message.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: message.role === 'user' ? '16px' : '4px',
                  }}
                >
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-2">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(100, 167, 11, 0.15)' }}
              >
                <Sparkles size={14} style={{ color: colors.accent }} />
              </div>
              <div
                className="px-3 py-2 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderBottomLeftRadius: '4px',
                }}
              >
                <TypingIndicator />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t"
        style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you need..."
            disabled={isTyping}
            className="flex-1 bg-transparent outline-none text-sm placeholder-opacity-50"
            style={{
              color: 'white',
              fontFamily: fonts.body,
            }}
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-40"
            style={{
              backgroundColor: input.trim() ? colors.accent : 'transparent',
            }}
          >
            <Send
              size={16}
              style={{ color: input.trim() ? 'white' : 'rgba(255, 255, 255, 0.4)' }}
            />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default SmartSearchChat;
