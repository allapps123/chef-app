import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAIResponse } from '../services/aiService';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const placeholderMessages = [
  "What's a quick dinner I can make tonight?",
  "Suggest a healthy lunch idea",
  "Meal prep with broccoli and rice?",
  "Give me a 3-day clean eating plan"
];

const ChatPage: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll down
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Check for pre-filled message from landing page
  useEffect(() => {
    const preFilledMessage = localStorage.getItem('savr-pre-fill-message');
    if (preFilledMessage) {
      setInput(preFilledMessage);
      localStorage.removeItem('savr-pre-fill-message'); // Clean up after use
    }
  }, []);

  // Typewriter effect for animated placeholder
  useEffect(() => {
    if (input !== '') return;

    const current = placeholderMessages[messageIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCharIndex(i => i - 1);
        if (charIndex <= 0) {
          setIsDeleting(false);
          setMessageIndex(i => (i + 1) % placeholderMessages.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + current.charAt(charIndex));
        setCharIndex(i => i + 1);
        if (charIndex >= current.length) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      }, 80);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messageIndex, input]);

  // Load saved messages on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('savr-conversation');
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
        console.error('Error loading saved messages:', err);
      }
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('savr-conversation', JSON.stringify(messages));
    }
  }, [messages]);

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeHHMM = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('savr-conversation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-800">
        {/* Navbar - Mobile Responsive */}
        

        {/* Header - Mobile Responsive */}
        <header className="bg-white shadow-sm px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex justify-center mt-12 sm:mt-14 md:mt-16">
            <div className="flex justify-between items-center w-full max-w-4xl mx-auto">
                <h1 className="text-base sm:text-lg md:text-xl font-serif text-amber-600">Savr Chat Assistant</h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button
                        onClick={clearConversation}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 transition cursor-pointer"
                    >
                        New Chat
                    </button>
                </div>
            </div>
        </header>

        {/* Main chat - Mobile Responsive */}
        <main className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4">
            {messages.length === 0 && (
                <>
                    <div className="max-w-2xl mx-auto text-center p-3 sm:p-4 md:p-6">
                        <p className="text-sm sm:text-base md:text-lg font-medium mb-2">👋 Hi there! I'm your personal food assistant.</p>
                        <p className="text-xs sm:text-sm md:text-base text-stone-600">Ask me anything about what to eat, how to cook, or how to nourish your body.</p>
                    </div>
                    <div className="max-w-2xl mx-auto mt-4 sm:mt-6 md:mt-10 text-center text-stone-400 italic text-xs sm:text-sm md:text-base">
                        Let's cook up some ideas together 🍳
                    </div>
                </>
            )}

            <div className="max-w-2xl mx-auto mt-3 sm:mt-4 md:mt-8 space-y-2 sm:space-y-3 md:space-y-4 pb-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[90%] sm:max-w-[85%] lg:max-w-md px-2 sm:px-3 md:px-4 py-2 md:py-3 rounded-xl sm:rounded-2xl ${
                            msg.role === 'user'
                                ? 'bg-amber-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        }`}>
                            <div className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                                <Markdown>{msg.content}</Markdown>
                            </div>
                            <p className={`text-xs mt-1 ${
                                msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                                {formatTimeHHMM(msg.timestamp)}
                            </p>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-xl sm:rounded-2xl rounded-bl-md shadow-sm px-2 sm:px-3 md:px-4 py-2 max-w-xs">
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-xs text-gray-400 ml-2">Typing...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </main>

        {/* Chat input footer - Mobile Responsive */}
        <footer className="w-full border-t bg-white px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 shadow-inner">
            <div className="max-w-xl mx-auto">
                {/* Quick prompts - Mobile Responsive */}
                <div className="flex justify-center gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4 flex-wrap">
                    {[
                        "Dinner idea with steak",
                        "Low-calorie dessert",
                        "Meal prep for 3 days",
                        "Best source of iron"
                    ].map((text, i) => (
                        <button
                            key={i}
                            onClick={() => setInput(text)}
                            className="px-2 sm:px-3 py-1 rounded-full border border-stone-300 text-xs sm:text-sm hover:bg-stone-100 transition whitespace-nowrap flex-shrink-0"
                        >
                            {text}
                        </button>
                    ))}
                </div>

                {/* Input box - Mobile Responsive */}
                <div className="flex items-center bg-stone-50 border rounded-full px-2 sm:px-3 md:px-4 py-2 shadow-sm relative min-h-[44px]">
                    {/* Upload icon */}
                    <button className="mr-1 sm:mr-2 text-stone-500 hover:text-amber-500 transition p-1" title="Upload a file">
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 16v-4M12 12V8M16 12h-8M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
                        </svg>
                    </button>

                    {/* Input field */}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {if(e.key === 'Enter') handleSend(); }}
                        placeholder=" "
                        className="flex-grow bg-transparent text-xs sm:text-sm md:text-base px-1 sm:px-2 py-1 focus:outline-none placeholder-transparent min-w-0"
                    />
                    {input === '' && (
                        <div className="absolute left-6 sm:left-8 md:left-12 text-stone-400 text-xs sm:text-sm pointer-events-none truncate pr-16 sm:pr-20">
                            {displayText}<span className="animate-pulse">|</span>
                        </div>
                    )}

                    {/* Voice icon */}
                    <button className="ml-1 sm:ml-2 text-stone-500 hover:text-amber-500 transition p-1" title="Record voice">
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            <line x1="12" y1="19" x2="12" y2="23" />
                            <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                    </button>

                    {/* Send button */}
                    <button 
                        onClick={handleSend} 
                        className="ml-1 sm:ml-2 md:ml-3 text-stone-600 hover:text-black cursor-pointer p-1 flex-shrink-0" 
                        title="Send"
                    >
                        <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 19l9-7-9-7v14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default ChatPage;
