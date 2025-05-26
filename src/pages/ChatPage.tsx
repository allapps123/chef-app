import React, { useEffect, useState } from 'react';

const placeholderMessages = [
  "Ask for a quick dinner idea...",
  "What can I cook with broccoli and rice?",
  "Suggest a healthy lunch...",
  "Give me a 3-day vegetarian meal plan"
];

const ChatPage: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (input !== '') return; // Stop animation if user starts typing

    const currentMessage = placeholderMessages[messageIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setCharIndex(i => i - 1);
        if (charIndex <= 0) {
          setIsDeleting(false);
          setMessageIndex((i) => (i + 1) % placeholderMessages.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + currentMessage.charAt(charIndex));
        setCharIndex(i => i + 1);
        if (charIndex >= currentMessage.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      }, 80);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messageIndex, input]);

  return (
    <div className="h-screen w-screen flex flex-col justify-between bg-white">
      {/* Header */}
      <div className="p-6 text-center text-lg font-semibold text-stone-800">
        <p>👋 Welcome to <span className="text-amber-600">Savr Chat</span>!</p>
        <p className="mt-1 text-base font-normal">Ask about meals, nutrition tips, or what you can cook with what’s in your kitchen.</p>
        <p className="mt-1 text-stone-500 text-sm">Click one of the quick prompts below or start typing your own question.</p>
      </div>

      {/* Input and suggestions */}
      <div className="w-full border-t px-4 py-2">
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mb-2">
          {[
            "Suggest a 3-day vegetarian plan",
            "What can I make with tofu and spinach?",
            "Give me a healthy lunch idea",
            "What’s a quick dinner under 30 minutes?"
          ].map((label, index) => (
            <button
              key={index}
              className="px-3 py-1 rounded-full border border-stone-300 text-sm hover:bg-stone-100 transition"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Animated placeholder input */}
        <div className="flex items-center bg-white border rounded-full px-3 py-2 shadow relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=" "
            className="flex-grow text-sm px-2 py-1 focus:outline-none placeholder-transparent"
          />
          {input === '' && (
            <div className="absolute left-4 text-stone-400 text-sm pointer-events-none">
              {displayText}<span className="animate-pulse">|</span>
            </div>
          )}
          <button className="ml-2 text-stone-600 text-sm hover:text-black">Savr</button>
          <button className="ml-2 text-stone-600 text-sm hover:text-black">Think</button>
          <button className="ml-2 text-stone-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 19l9-7-9-7v14z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;