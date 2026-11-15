import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  RotateCcw,
  Sparkles,
  User,
  ShoppingBag,
  Info,
} from 'lucide-react';
import type { ChatMessage } from '../../types/ai.types';
import { AiProductRecommendationCard } from './AiProductRecommendationCard';
import stridexChatbotAvatar from '../../assets/stridex_chatbot.webp';

interface AiChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearConversation: () => void;
  isLoading: boolean;
}

const SUGGESTED_QUESTIONS = [
  'Find running shoes',
  'Show shoes under Rs. 10,000',
  'Find Nike shoes',
  'Check available sizes',
  'Show new arrivals',
  'How can I place an order?',
];

export const AiChatWindow: React.FC<AiChatWindowProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onClearConversation,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSuggestedClick = (question: string) => {
    if (isLoading) return;
    onSendMessage(question);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="STRIDEX AI Shopping Assistant"
      aria-modal="true"
      className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-[#DCEBE0] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      {/* ---------------------------------------------------- */}
      {/* HEADER                                               */}
      {/* ---------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#26352D] via-[#2F4238] to-[#26352D] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#3E5548] shadow-sm select-none">
        <div className="flex items-center gap-2.5">
          {/* Mini mascot icon */}
          <div className="relative w-9 h-9 rounded-full bg-[#395043] border border-[#72C98A]/50 flex items-center justify-center shadow-inner overflow-hidden p-0.5">
            <img src={stridexChatbotAvatar} alt="STRIDEX AI Robot" className="w-full h-full object-contain" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#72C98A] border-2 border-[#26352D] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-bold text-sm tracking-wide text-white">
                STRIDEX AI Assistant
              </h3>
              <span className="bg-[#72C98A]/20 text-[#72C98A] text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider border border-[#72C98A]/30">
                Live
              </span>
            </div>
            <p className="text-[11px] text-[#BDECCB] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A] inline-block animate-pulse" />
              Online • Step Into Your Style
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-1">
          {/* Reset / Clear Button */}
          <button
            type="button"
            onClick={onClearConversation}
            title="Clear conversation"
            aria-label="Clear conversation"
            className="p-1.5 text-[#BDECCB] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close Window Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close Assistant"
            aria-label="Close Assistant"
            className="p-1.5 text-[#BDECCB] hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* CHAT BODY / MESSAGE STREAM                           */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F2FAF4]/60 font-sans text-sm">
        {/* Welcome Card */}
        <div className="bg-white border border-[#DCEBE0] rounded-xl p-3.5 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 text-[#72C98A]">
            <Sparkles className="w-4 h-4" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#26352D]">
              Welcome to STRIDEX Footwear Assistant!
            </h4>
          </div>
          <p className="text-xs text-[#718078] leading-relaxed">
            I can help you browse real-time shoe availability, find your exact size,
            compare prices in <strong className="text-[#26352D]">Sri Lankan Rupees (LKR)</strong>,
            and assist with orders, COD, bank transfers, or gift vouchers.
          </p>

          {/* Suggested quick chips */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-[#26352D] mb-1.5">
              Suggested Questions:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestedClick(q)}
                  disabled={isLoading}
                  className="bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] hover:text-[#1B2820] border border-[#DCEBE0] hover:border-[#72C98A] text-[11px] px-2.5 py-1 rounded-full transition-all duration-150 text-left font-medium disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Messages */}
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`flex items-end gap-2 max-w-[88%] ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Sender Avatar */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs shadow-xs overflow-hidden ${
                    isUser
                      ? 'bg-[#72C98A] text-white'
                      : 'bg-[#26352D] p-0.5'
                  }`}
                >
                  {isUser ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <img src={stridexChatbotAvatar} alt="AI" className="w-full h-full object-contain" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 shadow-xs text-xs sm:text-[13px] leading-relaxed ${
                    isUser
                      ? 'bg-[#72C98A] text-white rounded-br-xs font-medium'
                      : msg.isError
                      ? 'bg-[#FDF2F2] border border-[#F5C2C2] text-[#A63232] rounded-bl-xs'
                      : 'bg-white border border-[#DCEBE0] text-[#26352D] rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-[#718078] px-8 select-none">
                {msg.timestamp}
              </span>

              {/* Recommended Product Cards Carousel */}
              {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                <div className="w-full mt-2 pl-7 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#26352D]">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#72C98A]" />
                    <span>Recommended Shoes from STRIDEX:</span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-[#DCEBE0]">
                    {msg.suggestedProducts.map((p) => (
                      <AiProductRecommendationCard
                        key={p.id}
                        product={p}
                        onNavigate={onClose}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing / Generating Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-[#718078] pl-1">
            <div className="w-6 h-6 rounded-full bg-[#26352D] p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
              <img src={stridexChatbotAvatar} alt="AI" className="w-full h-full object-contain" />
            </div>
            <div className="bg-white border border-[#DCEBE0] px-3.5 py-2 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5">
              <span className="text-[11px] text-[#718078] font-medium mr-1">
                STRIDEX AI is typing
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A] animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ---------------------------------------------------- */}
      {/* FOOTER / INPUT BAR                                   */}
      {/* ---------------------------------------------------- */}
      <div className="p-3 bg-white border-t border-[#DCEBE0] space-y-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about shoes, sizes, prices, orders..."
            disabled={isLoading}
            maxLength={500}
            className="flex-1 bg-[#F2FAF4] border border-[#DCEBE0] rounded-xl px-3.5 py-2 text-xs sm:text-[13px] text-[#26352D] placeholder-[#718078] focus:outline-none focus:border-[#72C98A] focus:bg-white transition-all disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
            className="bg-[#72C98A] hover:bg-[#59B976] disabled:bg-[#DCEBE0] text-white disabled:text-[#718078] p-2.5 rounded-xl transition-all duration-150 shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#72C98A]/50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Small footer disclaimer */}
        <div className="flex items-center justify-between text-[10px] text-[#718078] px-1 select-none">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-[#72C98A]" />
            Powered by Google Gemini & STRIDEX Atlas
          </span>
          <span>Prices in LKR</span>
        </div>
      </div>
    </div>
  );
};
