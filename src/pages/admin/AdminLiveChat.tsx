import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  Send,
  User,
  Bot,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PhoneCall,
  X,
  ExternalLink,
  RefreshCw,
  Bell,
  Volume2,
} from 'lucide-react';
import { getAuthToken } from '../../lib/api';

// Notification sound (base64 encoded short beep sound)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1eXmNhYFJQUE9RTk1MS0tLS0pLTEtMTk5PTlBSU1VWV1laXF1eX2FiY2RlaGlrbG5wcXN1dnh6fH+BgoSGiImLjI6QkZOVlpeZmpudnqChpKWnqaqsrbCxs7W2uLq7vb7AwcPExsnKy83Oz9HS09TV1tfY2dra293d3t/f4OHh4uLj4+Pk5OXl5eXm5ubm5+fn5+fn5+fn5+fn5+bm5ubm5eXl5eXk5OTj4+Pi4uLh4eHg4N/f3t7d3dzc29va2tnZ2NjX1tbV1dTU09PS0tHR0M/PzsrJycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaWjoqGgnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUBAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAQEBAQEBAQICAgMDBAQFBQYGBwgICQkKCgsLDA0NDg8PEBEREhMUFBUWFxcYGRobHBwdHh8gISIjJCUmJygoKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1haW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+';

// Play notification sound
const playNotificationSound = () => {
  try {
    const audio = new Audio(NOTIFICATION_SOUND);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore errors (user hasn't interacted with page yet)
    });
  } catch (e) {
    console.log('Could not play notification sound');
  }
};

const API_BASE = '/.netlify/functions/livechat';

// Admin purple theme colors
const colors = {
  bgDark: '#1a1625',
  bgCard: '#2a2440',
  bgCardHover: '#3d3456',
  bgInput: '#1e1a2e',
  purple400: '#a78bfa',
  purple500: '#8b5cf6',
  purple600: '#7c3aed',
  borderLight: 'rgba(139, 92, 246, 0.1)',
  borderMedium: 'rgba(139, 92, 246, 0.2)',
};

interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: string;
  current_page: string | null;
  product_context: any;
  last_message_at: string | null;
  unread_count: number;
  taken_over_by: string | null;
  admin_name: string | null;
  last_message: string | null;
  created_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: 'visitor' | 'ai' | 'admin' | 'system';
  content: string;
  created_at: string;
  admin_name?: string;
  metadata?: any;
}

export default function AdminLiveChat() {
  const token = getAuthToken();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Notification state
  const [notificationModal, setNotificationModal] = useState<ChatSession | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const seenWaitingSessions = useRef<Set<string>>(new Set());

  // Fetch all sessions
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        // Check for new waiting_for_admin sessions
        const waitingSessions = data.sessions.filter(
          (s: ChatSession) => s.status === 'waiting_for_admin'
        );

        // Find new waiting sessions we haven't seen before
        waitingSessions.forEach((session: ChatSession) => {
          if (!seenWaitingSessions.current.has(session.id)) {
            // New waiting session detected!
            seenWaitingSessions.current.add(session.id);

            // Only show notification if not first load and sound enabled
            if (!loading) {
              if (soundEnabled) {
                playNotificationSound();
              }
              // Show notification modal
              setNotificationModal(session);
            }
          }
        });

        // Clean up seen sessions that are no longer waiting
        seenWaitingSessions.current.forEach((id) => {
          const session = data.sessions.find((s: ChatSession) => s.id === id);
          if (!session || session.status !== 'waiting_for_admin') {
            seenWaitingSessions.current.delete(id);
          }
        });

        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  }, [token, loading, soundEnabled]);

  // Fetch messages for selected session
  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        setSelectedSession(data.session);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchSessions();
      setLoading(false);
    };
    loadData();
  }, [fetchSessions]);

  // Poll for updates
  useEffect(() => {
    pollInterval.current = setInterval(() => {
      fetchSessions();
      if (selectedSession) {
        fetchMessages(selectedSession.id);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [fetchSessions, fetchMessages, selectedSession]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Select a session
  const handleSelectSession = async (session: ChatSession) => {
    setSelectedSession(session);
    await fetchMessages(session.id);
  };

  // Take over the chat
  const handleTakeover = async () => {
    if (!selectedSession) return;

    setTakingOver(true);
    try {
      const response = await fetch(`${API_BASE}/admin/takeover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: selectedSession.id }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchMessages(selectedSession.id);
        await fetchSessions();
      }
    } catch (error) {
      console.error('Failed to take over:', error);
    } finally {
      setTakingOver(false);
    }
  };

  // Take over from notification modal
  const handleTakeoverFromNotification = async (session: ChatSession) => {
    setNotificationModal(null);
    setSelectedSession(session);
    await fetchMessages(session.id);

    // Then take over
    setTakingOver(true);
    try {
      const response = await fetch(`${API_BASE}/admin/takeover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchMessages(session.id);
        await fetchSessions();
      }
    } catch (error) {
      console.error('Failed to take over:', error);
    } finally {
      setTakingOver(false);
    }
  };

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedSession) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${API_BASE}/admin/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          content: newMessage.trim(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        await fetchMessages(selectedSession.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Close session
  const handleCloseSession = async () => {
    if (!selectedSession) return;

    try {
      const response = await fetch(`${API_BASE}/admin/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: selectedSession.id }),
      });
      const data = await response.json();
      if (data.success) {
        setSelectedSession(null);
        setMessages([]);
        await fetchSessions();
      }
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  };

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_for_admin':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs">
            <PhoneCall className="w-3 h-3" />
            Waiting
          </span>
        );
      case 'admin_joined':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
            <Bot className="w-3 h-3" />
            AI Chat
          </span>
        );
    }
  };

  // Get message sender icon and style
  const getMessageStyle = (senderType: string) => {
    switch (senderType) {
      case 'visitor':
        return {
          icon: <User className="w-4 h-4" />,
          bgColor: 'bg-gray-600/30',
          textColor: 'text-gray-200',
          align: 'items-start',
        };
      case 'ai':
        return {
          icon: <Bot className="w-4 h-4" />,
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-200',
          align: 'items-start',
        };
      case 'admin':
        return {
          icon: <User className="w-4 h-4" />,
          bgColor: 'bg-purple-500/30',
          textColor: 'text-purple-200',
          align: 'items-end',
        };
      case 'system':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-300',
          align: 'items-center',
        };
      default:
        return {
          icon: <MessageCircle className="w-4 h-4" />,
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-300',
          align: 'items-start',
        };
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex gap-4 p-4">
      {/* Sessions List */}
      <div
        className="w-80 flex-shrink-0 rounded-xl overflow-hidden flex flex-col"
        style={{ background: colors.bgCard, border: `1px solid ${colors.borderLight}` }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: colors.borderLight }}
        >
          <h2
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
          >
            Conversations
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled
                  ? 'text-purple-400 bg-purple-500/10'
                  : 'text-gray-500 hover:text-gray-400 hover:bg-white/5'
              }`}
              title={soundEnabled ? 'Sound alerts on' : 'Sound alerts off'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={fetchSessions}
              className="p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active conversations</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`w-full p-4 text-left border-b transition-colors ${
                  selectedSession?.id === session.id
                    ? 'bg-purple-500/20'
                    : 'hover:bg-white/5'
                }`}
                style={{ borderColor: colors.borderLight }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/20">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {session.visitor_name || `Visitor ${session.visitor_id.slice(0, 8)}`}
                    </span>
                  </div>
                  {session.unread_count > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs font-medium">
                      {session.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  {getStatusBadge(session.status)}
                  <span className="text-xs text-gray-500">
                    {session.last_message_at ? formatTime(session.last_message_at) : 'New'}
                  </span>
                </div>

                {session.last_message && (
                  <p className="text-xs text-gray-400 truncate">
                    {session.last_message}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className="flex-1 rounded-xl overflow-hidden flex flex-col"
        style={{ background: colors.bgCard, border: `1px solid ${colors.borderLight}` }}
      >
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: colors.borderLight }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {selectedSession.visitor_name || `Visitor ${selectedSession.visitor_id.slice(0, 8)}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {selectedSession.visitor_email && (
                      <span>{selectedSession.visitor_email}</span>
                    )}
                    {getStatusBadge(selectedSession.status)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedSession.current_page && (
                  <a
                    href={selectedSession.current_page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Page
                  </a>
                )}

                {selectedSession.status !== 'admin_joined' && (
                  <button
                    onClick={handleTakeover}
                    disabled={takingOver}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {takingOver ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <PhoneCall className="w-4 h-4" />
                    )}
                    Take Over
                  </button>
                )}

                <button
                  onClick={handleCloseSession}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const style = getMessageStyle(message.sender_type);
                const isSystem = message.sender_type === 'system';
                const isAdmin = message.sender_type === 'admin';

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${style.align}`}
                  >
                    {isSystem ? (
                      <div className={`px-4 py-2 rounded-lg ${style.bgColor} ${style.textColor} text-sm text-center w-full`}>
                        {message.content}
                      </div>
                    ) : (
                      <div className={`max-w-[70%] ${isAdmin ? 'ml-auto' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={style.textColor}>{style.icon}</span>
                          <span className="text-xs text-gray-500">
                            {message.sender_type === 'admin' && message.admin_name
                              ? message.admin_name
                              : message.sender_type === 'ai'
                              ? 'AI Assistant'
                              : 'Visitor'}
                          </span>
                          <span className="text-xs text-gray-600">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <div
                          className={`px-4 py-3 rounded-xl ${style.bgColor} ${style.textColor}`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {selectedSession.status === 'admin_joined' ? (
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t"
                style={{ borderColor: colors.borderLight }}
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    style={{
                      background: colors.bgInput,
                      border: `1px solid ${colors.borderMedium}`,
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="p-4 border-t text-center"
                style={{ borderColor: colors.borderLight }}
              >
                <p className="text-sm text-gray-500">
                  Click "Take Over" to start responding to this chat
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500">
                Choose a chat from the list to view messages
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {notificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div
            className="w-full max-w-md rounded-xl overflow-hidden animate-pulse"
            style={{
              background: colors.bgCard,
              border: `2px solid ${colors.purple500}`,
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center gap-3 border-b"
              style={{ borderColor: colors.borderLight, background: 'rgba(139, 92, 246, 0.1)' }}
            >
              <div className="p-2 rounded-full bg-orange-500/20 animate-bounce">
                <Bell className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2
                  className="text-lg font-semibold text-white"
                  style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
                >
                  Team Member Requested!
                </h2>
                <p className="text-xs text-gray-400">Someone needs your help</p>
              </div>
              <button
                onClick={() => setNotificationModal(null)}
                className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Visitor Info */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {notificationModal.visitor_name ||
                      `Visitor ${notificationModal.visitor_id.slice(0, 8)}`}
                  </p>
                  {notificationModal.visitor_email && (
                    <p className="text-xs text-gray-400">{notificationModal.visitor_email}</p>
                  )}
                </div>
              </div>

              {/* Current Page */}
              {notificationModal.current_page && (
                <div className="p-3 rounded-lg" style={{ background: colors.bgDark }}>
                  <p className="text-xs text-gray-500 mb-1">Viewing page:</p>
                  <p className="text-sm text-gray-300 truncate">
                    {notificationModal.current_page}
                  </p>
                </div>
              )}

              {/* Last Message */}
              {notificationModal.last_message && (
                <div className="p-3 rounded-lg" style={{ background: colors.bgDark }}>
                  <p className="text-xs text-gray-500 mb-1">Last message:</p>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {notificationModal.last_message}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="p-4 flex items-center gap-3 border-t"
              style={{ borderColor: colors.borderLight }}
            >
              <button
                onClick={() => setNotificationModal(null)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors"
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setNotificationModal(null);
                  handleSelectSession(notificationModal);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                View Chat
              </button>
              <button
                onClick={() => handleTakeoverFromNotification(notificationModal)}
                disabled={takingOver}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
                style={{ fontFamily: "'Neuzeit Grotesk', sans-serif" }}
              >
                {takingOver ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PhoneCall className="w-4 h-4" />
                )}
                Take Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
