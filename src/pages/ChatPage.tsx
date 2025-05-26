import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/common/Login';

const placeholderMessages = [
  "What's a quick dinner I can make tonight?",
  "Suggest a healthy lunch idea",
  "Meal prep with broccoli and rice?",
  "Give me a 3-day clean eating plan"
];

const ChatPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [input, setInput] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('savr-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('savr-user');
    setUser(null);
    navigate('/');
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-800">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-center">
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto">
          <h1 className="text-xl font-serif text-amber-600">Savr Chat Assistant</h1>
          {user ? (
            <button
              onClick={handleLogout}
              className="text-sm text-stone-500 hover:text-red-500 transition"
            >
              Logout
            </button>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </header>
      {/* Main chat */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg font-medium mb-2">👋 Hi there! I'm your personal food assistant.</p>
          <p className="text-stone-600">Ask me anything about what to eat, how to cook, or how to nourish your body.</p>
        </div>

        {/* Chat history */}
        <div className="max-w-2xl mx-auto mt-10 text-center text-stone-400 italic">
          Let’s cook up some ideas together 🍳
        </div>
      </main>

      {/* Chat input footer */}
      <footer className="w-full border-t bg-white px-4 py-4 shadow-inner">
        <div className="max-w-xl mx-auto">
          {/* Quick prompts */}
          <div className="flex justify-center gap-3 mb-4">
            {[
              "Dinner idea with steak",
              "Low-calorie dessert",
              "Meal prep for 3 days",
              "Best source of iron"
            ].map((text, i) => (
              <button
                key={i}
                className="px-3 py-1 rounded-full border border-stone-300 text-sm hover:bg-stone-100 transition whitespace-nowrap"
              >
                {text}
              </button>
            ))}
          </div>

          {/* Input box */}
          <div className="flex items-center bg-stone-50 border rounded-full px-4 py-2 shadow-sm relative">
            {/* Upload icon */}
            <button className="mr-2 text-stone-500 hover:text-amber-500 transition" title="Upload a file">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 16v-4M12 12V8M16 12h-8M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
              </svg>
            </button>

            {/* Input field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder=" "
              className="flex-grow bg-transparent text-sm px-2 py-1 focus:outline-none placeholder-transparent"
            />
            {input === '' && (
              <div className="absolute left-12 text-stone-400 text-sm pointer-events-none">
                {displayText}<span className="animate-pulse">|</span>
              </div>
            )}

            {/* Voice icon */}
            <button className="ml-2 text-stone-500 hover:text-amber-500 transition" title="Record voice">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>

            {/* Send button */}
            <button className="ml-3 text-stone-600 hover:text-black" title="Send">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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