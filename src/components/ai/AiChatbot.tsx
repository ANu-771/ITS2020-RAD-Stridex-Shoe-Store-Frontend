import React, { useState, useEffect } from 'react';
import type { ChatMessage } from '../../types/ai.types';
import { aiService } from '../../services/aiService';
import { SneakerMascotAvatar } from './SneakerMascotAvatar';
import { AiChatWindow } from './AiChatWindow';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  text: "Hello! I'm your STRIDEX AI Shopping Assistant 👟 How can I help you find your perfect pair of shoes today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export const AiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('stridex_chat_messages');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [INITIAL_WELCOME_MESSAGE];
  });

  // Sync messages to sessionStorage for page persistence during session
  useEffect(() => {
    try {
      sessionStorage.setItem('stridex_chat_messages', JSON.stringify(messages));
    } catch {
      // Ignore sessionStorage limits
    }
  }, [messages]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
      }
      return next;
    });
  };

  const handleClearConversation = () => {
    const fresh: ChatMessage[] = [
      {
        ...INITIAL_WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(fresh);
    try {
      sessionStorage.removeItem('stridex_chat_messages');
    } catch {
      // Ignore
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Format history (latest 6 messages prior to this user message)
      const historyPayload = messages.slice(-6).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const response = await aiService.sendMessage(text, historyPayload);

      const aiMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: response.suggestedProducts || [],
        isError: !response.success && response.reply.includes('Sorry!'),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If user closed chat while response was generating, flag unread count
      if (!isOpen) {
        setUnreadCount((c) => c + 1);
      }
    } catch (err: any) {
      console.error('Failed to get AI response:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry! Our STRIDEX AI Assistant is temporarily unavailable. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SneakerMascotAvatar
        onClick={handleToggleOpen}
        isOpen={isOpen}
        unreadCount={unreadCount}
      />

      <AiChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        onClearConversation={handleClearConversation}
        isLoading={isLoading}
      />
    </>
  );
};
