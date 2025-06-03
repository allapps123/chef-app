import React, { useEffect, useState, useRef } from 'react';
import BotIcon from '../icons/BotIcon';
import { getAIResponse } from '../../services/aiService';
import Markdown from 'react-markdown';

const placeholderMessages = [
  "Ask for a recipe...",
  "What can I cook with broccoli?",
  "Suggest a meal with tofu",
  "Need a dinner idea?"
];

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatFrame: React.FC = () => {
  /* Cycles through placeholder messages in the input field while the user is not typing */
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load saved chat frame messages on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('savr-chatframe-conversation');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string dates back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (err) {
        console.error('Error loading saved chat frame messages:', err);
      }
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('savr-chatframe-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  // Typewriter effect for placeholder messages
  useEffect(() => {
    if (input !== '' || isInputFocused) return; // Stop animation if user types or focuses

    const currentMessage = placeholderMessages[messageIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(current => current.slice(0, -1));
        setCharIndex(i => i - 1);
        if (charIndex <= 0) {
          setIsDeleting(false);
          setMessageIndex((i) => (i + 1) % placeholderMessages.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(current => current + currentMessage.charAt(charIndex));
        setCharIndex(i => i + 1);
        if (charIndex >= currentMessage.length) {
          setTimeout(() => setIsDeleting(true), 1500); // Hold before deleting
        }
      }, 80);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messageIndex, input, isInputFocused]);

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(input, messages);
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        content: aiResponse.text,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat frame error:', err);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        content: "Sorry, I encountered an error. Please try again.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format time
  const formatTimeHHMM = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('savr-chatframe-conversation');
  };

  return (
    <div className="fixed bottom-16 sm:bottom-20 md:bottom-24 right-2 sm:right-4 md:right-6 w-72 sm:w-80 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-stone-300 max-h-[70vh] flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-3 sm:p-4 border-b border-stone-200">
        <div className="text-xs sm:text-sm text-amber-800 font-medium">Savr AI Assistant</div>
        {messages.length > 0 && (
          <button
            onClick={clearConversation}
            className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded-md hover:bg-stone-100 transition"
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 min-h-[200px] max-h-[300px]">
        {messages.length === 0 ? (
          // Initial bot message
          <div className="flex items-start space-x-2">
            <BotIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 flex-shrink-0 mt-1" />
            <div className="bg-amber-100 text-stone-800 p-2 sm:p-3 rounded-xl max-w-[200px] sm:max-w-xs text-xs sm:text-sm">
              Hi! How can I help you plan your next meal?
            </div>
          </div>
        ) : (
          // Conversation messages
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start space-x-2'}`}>
              {msg.role === 'assistant' && (
                <BotIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
              )}
              <div className={`max-w-[85%] px-2 sm:px-3 py-2 rounded-xl text-xs sm:text-sm ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white rounded-br-md'
                  : 'bg-amber-100 text-stone-800 rounded-bl-md'
              }`}>
                <div className="leading-relaxed whitespace-pre-wrap">
                  <Markdown>{msg.content}</Markdown>
                </div>
                <p className={`text-xs mt-1 opacity-70 ${
                  msg.role === 'user' ? 'text-amber-100' : 'text-stone-500'
                }`}>
                  {formatTimeHHMM(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start space-x-2">
            <BotIcon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div className="bg-amber-100 text-stone-800 rounded-xl rounded-bl-md px-2 sm:px-3 py-2 max-w-xs">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-stone-500 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field */}
      <div className="p-2 sm:p-3 border-t border-stone-200">
        <div className="flex items-center bg-stone-50 border border-stone-300 rounded-full px-2 sm:px-3 py-2 shadow-sm relative min-h-[40px]">
          {/* Upload icon */}
          <button 
            className="mr-1 sm:mr-2 text-stone-500 hover:text-amber-500 transition p-1" 
            title="Upload a file"
            disabled={loading}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 16v-4M12 12V8M16 12h-8M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
            </svg>
          </button>

          {/* Input field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder=" "
            disabled={loading}
            className="flex-grow bg-transparent text-xs sm:text-sm px-1 sm:px-2 py-1 focus:outline-none placeholder-transparent min-w-0 disabled:opacity-50"
          />
          
          {/* Animated placeholder */}
          {input === '' && !isInputFocused && (
            <div className="absolute left-8 sm:left-10 text-xs sm:text-sm text-stone-400 pointer-events-none truncate pr-12 sm:pr-16">
              <span>{displayText}<span className="animate-pulse">|</span></span>
            </div>
          )}

          {/* Voice icon */}
          <button 
            className="ml-1 sm:ml-2 text-stone-500 hover:text-amber-500 transition p-1" 
            title="Record voice"
            disabled={loading}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          {/* Send button */}
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="ml-1 sm:ml-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0" 
            title="Send message"
          >
            <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatFrame;