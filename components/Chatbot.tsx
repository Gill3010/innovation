'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { ChatMessage, ChatService } from '@/services/chatService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your scientific research assistant. I can help you with research papers, academic publications, and scientific knowledge. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { translate } = useTranslation();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when chatbot is open on mobile
  useEffect(() => {
    if (isOpen) {
      // Check if mobile
      const isMobile = window.innerWidth < 640; // sm breakpoint
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get response from chat service
      const response = await ChatService.getResponse(userMessage, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I\'m sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot Toggle Button - Hidden on mobile when chat is open */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 landscape:bottom-4 landscape:right-4 z-90 w-14 h-14 landscape:w-12 landscape:h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'hidden sm:flex landscape:flex bg-red-600 hover:bg-red-700'
            : 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
        }`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot Window - Fullscreen on mobile portrait, floating in landscape */}
      <div
        className={`fixed bg-white shadow-2xl flex flex-col transition-all duration-300 z-100
          ${isOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
          inset-0 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-96 sm:h-[600px] sm:rounded-2xl
          landscape:inset-auto landscape:right-2 landscape:bottom-16 landscape:w-80 landscape:h-[70vh] landscape:rounded-2xl landscape:max-h-[400px]
        `}
      >
        {/* Chatbot Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 landscape:p-2 flex items-center justify-between shrink-0 sm:rounded-t-2xl landscape:rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3 landscape:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 landscape:w-7 landscape:h-7 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 landscape:w-4 landscape:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base sm:text-lg landscape:text-sm">Research Assistant</h3>
              <p className="text-xs text-blue-100 hidden sm:block landscape:hidden">I can help with scientific research</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={toggleChatbot}
            className="sm:hidden landscape:block p-2 landscape:p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close chatbot"
          >
            <svg className="w-6 h-6 landscape:w-5 landscape:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-4 landscape:p-3 space-y-3 sm:space-y-4 landscape:space-y-2 scrollbar-hide bg-slate-50 sm:bg-white landscape:bg-slate-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] landscape:max-w-[75%] rounded-xl sm:rounded-2xl landscape:rounded-lg px-3 py-2 sm:px-4 sm:py-3 landscape:px-2.5 landscape:py-1.5 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white sm:bg-slate-100 text-slate-800 shadow-md sm:shadow-none'
                }`}
              >
                <p className="text-sm sm:text-sm landscape:text-xs whitespace-pre-wrap wrap-break-word leading-relaxed landscape:leading-snug">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white sm:bg-slate-100 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-md sm:shadow-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Container */}
        <div className="border-t border-slate-200 p-3 sm:p-4 landscape:p-2 shrink-0 bg-white">
          <div className="flex gap-2 sm:gap-2 landscape:gap-1.5">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about research..."
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 landscape:px-2.5 landscape:py-2 rounded-xl landscape:rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm landscape:text-xs text-slate-900"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="px-3 py-2.5 sm:px-4 sm:py-3 landscape:px-2.5 landscape:py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl landscape:rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg shrink-0"
            >
              <svg className="w-5 h-5 sm:w-5 sm:h-5 landscape:w-4 landscape:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
