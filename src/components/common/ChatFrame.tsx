import React, { useEffect, useState } from 'react';

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
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl p-4 z-50 border border-stone-300">
      {/* Header */}
      <div className="text-sm text-stone-600 mb-3">Savr AI Assistant</div>

      {/* Bot message area */}
      <div className="h-40 overflow-y-auto bg-stone-50 rounded-md p-3 text-stone-700 text-sm">
        <p><strong>Bot:</strong> Hi! How can I help you plan your next meal?</p>
      </div>

      {/* Typing input field */}
      <div className="relative mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder=" "
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-transparent"
        />
        <div className="absolute top-2.5 left-3 text-sm text-stone-400 pointer-events-none">
          {input === '' && <span>{displayText}<span className="animate-pulse">|</span></span>}
        </div>
      </div>
    </div>
  );
};

export default ChatFrame;