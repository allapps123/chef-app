import React, { useEffect, useState } from 'react';
import BotIcon from '../icons/BotIcon';

const placeholderMessages = [
  "Ask for a recipe...",
  "What can I cook with broccoli?",
  "Suggest a meal with tofu",
  "Need a dinner idea?"
];

const ChatFrame: React.FC = () => {
  /* Cycles through placeholder messages in the input field while the user is not typing */
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (input !== '') return; // Stop animation if user types

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
  }, [charIndex, isDeleting, messageIndex, input]);

  return (
    <div className="fixed bottom-16 sm:bottom-20 md:bottom-24 right-2 sm:right-4 md:right-6 w-72 sm:w-80 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 z-50 border border-stone-300 max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="text-xs sm:text-sm text-yellow-800 mb-2 sm:mb-3 font-medium">Savr AI Assistant</div>

      {/* Bot message area */}
      <div className="h-32 sm:h-40 overflow-y-auto bg-stone-50 rounded-md p-2 sm:p-3 text-stone-700 text-xs sm:text-sm flex-1">
        <div className="flex flex-col space-y-2">
          <div className="flex items-start space-x-2">
            <BotIcon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 flex-shrink-0" />
            <div className="bg-yellow-100 text-stone-800 p-2 sm:p-4 rounded-xl max-w-[200px] sm:max-w-xs text-xs sm:text-sm">
              Hi! How can I help you plan your next meal?
            </div>
          </div>
        </div>
      </div>

      {/* Typing input field */}
      <div className="flex items-center bg-white border border-stone-300 rounded-full px-2 sm:px-3 py-2 shadow-sm relative mt-2 sm:mt-3 min-h-[40px]">
        {/* Upload icon */}
        <button className="mr-1 sm:mr-2 text-stone-500 hover:text-amber-500 transition p-1" title="Upload a file">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 16v-4M12 12V8M16 12h-8M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
          </svg>
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder=" "
          className="flex-grow bg-transparent text-xs sm:text-sm px-1 sm:px-2 py-1 focus:outline-none placeholder-transparent min-w-0"
        />
        {input === '' && !isInputFocused && (
          <div className="absolute left-8 sm:left-10 text-xs sm:text-sm text-stone-400 pointer-events-none truncate pr-12 sm:pr-16">
            <span>{displayText}<span className="animate-pulse">|</span></span>
          </div>
        )}
        {/* Voice icon */}
        <button className="ml-1 sm:ml-2 text-stone-500 hover:text-yellow-700 transition p-1" title="Record voice">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatFrame;