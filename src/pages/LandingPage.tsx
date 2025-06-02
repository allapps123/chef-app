import { useState, useEffect, useRef } from 'react';
import { ChefHat, Clock, Leaf, Apple, Heart, Users, MenuIcon } from 'lucide-react';
import ChatIcon from '../components/icons/ChatIcon';
import BotIcon from '../components/icons/BotIcon';
// import MenuIcon from '../components/icons/MenuIcon'
import { Logo } from '../components/common/Logo'
import Footer from '../components/common/Footer';
import ChatFrame from '../components/common/ChatFrame';
import GoogleLoginButton from '../components/common/Login';
import { signOut, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

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

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const [lastScrollY, setLastScrollY] = useState<number>(0);

    const [animationProgress, setAnimationProgress] = useState<number>(0);

    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    // Chat functionality - simplified for just input bar
    const [displayText, setDisplayText] = useState('');
    const [messageIndex, setMessageIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [input, setInput] = useState('');

    const titleDivRef = useRef<HTMLDivElement>(null);
    const descriptionDivRef = useRef<HTMLDivElement>(null);
    const heroSectionRef = useRef<HTMLDivElement>(null);
    const featuresSectionRef = useRef<HTMLDivElement>(null);
    const aboutSectionRef = useRef<HTMLDivElement>(null);
    const contactSectionRef = useRef<HTMLDivElement>(null);

    const [currentSection, setCurrentSection] = useState<string>('intro');

    // Check if user is logged in
    useEffect(() => {
        const savedUser = localStorage.getItem('savr-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Logout handler
    const handleLogout = async () => {
        await signOut(auth);
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

    // Handle simple form submission - redirect to chat page with pre-filled input
    const handleSend = () => {
        if (!input.trim()) return;
        
        // Save the input to localStorage so chat page can pick it up
        localStorage.setItem('savr-pre-fill-message', input);
        navigate('/chat');
    };

    useEffect(() => {
        let previousScrollPosition = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            setLastScrollY(currentScrollY);

            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1, currentScrollY / docHeight));
            setAnimationProgress(scrollProgress);

            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            if (titleDivRef.current) {
                const scrollOffset = currentScrollY;
                const titleParallaxFactor = 0.35; // Adjust speed
                const opacityFactor = Math.max(0, 1 - (scrollOffset / 600));

                if (scrollDirection === 'down') {
                    titleDivRef.current.style.transform = `translateY(${scrollOffset * titleParallaxFactor}px)`;
                } else {
                    titleDivRef.current.style.transform = `translateY(${scrollOffset * titleParallaxFactor * 0.5}px)`;
                }

                titleDivRef.current.style.opacity = String(opacityFactor);
            }

            if (descriptionDivRef.current) {
                const scrollOffset = currentScrollY;
                const descParallaxFactor = 0.2; // Slower than title
                const opacityFactor = Math.max(0, 1 - (scrollOffset / 700));

                descriptionDivRef.current.style.transform = `translateY(${scrollOffset * descParallaxFactor}px)`;
                descriptionDivRef.current.style.opacity = String(opacityFactor);
            }

            const sections = [
                { id: 'intro', ref: heroSectionRef },
                { id: 'features', ref: featuresSectionRef },
                { id: 'about', ref: aboutSectionRef },
                { id: 'contact', ref: contactSectionRef }
            ];

            for (const section of sections) {
                if (section.ref.current) {
                    const rect = section.ref.current.getBoundingClientRect();
                    const sectionTop = rect.top;
                    const sectionHeight = rect.height;

                    if (sectionTop < window.innerHeight * 0.4 &&
                        sectionTop + sectionHeight > window.innerHeight * 0.25) {
                        setCurrentSection(section.id);
                        break;
                    }
                }
            }
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        if (titleDivRef.current) {
            titleDivRef.current.style.opacity = '1';
            titleDivRef.current.style.transform = 'translateY(0)';
        }

        if (descriptionDivRef.current) {
            descriptionDivRef.current.style.opacity = '1';
            descriptionDivRef.current.style.transform = 'translateY(0)';
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [lastScrollY, scrollDirection]);

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const start = window.pageYOffset;
            const target = section.getBoundingClientRect().top + window.pageYOffset;
            const distance = target - start;
            const duration = 1000; // ms
            let startTime: number | null = null;

            function animation(currentTime: number) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                const ease = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

                window.scrollTo(0, start + distance * ease(progress));

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    };

    useEffect(() => {
        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target as HTMLElement;
                    const delay = target.dataset.delay || '0';
                    setTimeout(() => {
                        target.classList.add('animate-in');
                    }, parseInt(delay));
                } else if ((entry.target as HTMLElement).classList.contains('animate-out-on-leave')) {
                    (entry.target as HTMLElement).classList.remove('animate-in');
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((element, index) => {
            (element as HTMLElement).dataset.delay = String(index * 30); // 100ms stagger
            observer.observe(element);
        });

        return () => {
            animatedElements.forEach(element => {
                observer.unobserve(element);
            });
        };
    }, []);

    return (
        <div className="font-sans bg-stone-100">
            {/* Navbar  */}
            <nav className={`fixed w-full transition-all duration-500 z-50 ${isScrolled ? 'bg-stone-900 bg-opacity-90 shadow-lg backdrop-blur-md py-3' : 'py-6'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className={`text-stone-700 font-bold text-2xl transition-all duration-500 ${isScrolled ? 'transform scale-90' : ''}`}>
                            <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}/>
                        </div>
                        <ul className="hidden md:flex space-x-8 text-lg font-medium">
                            {[
                            { id: 'intro', label: 'Intro' },
                            { id: 'features', label: 'Features' },
                            { id: 'about', label: 'About' },
                            { id: 'contact', label: 'Contact' },
                            { id: 'chat', label: 'Chat', isRoute: true }
                            ].map(({ id, label, isRoute }) => (
                            <li key={id}>
                                <a
                                href={isRoute ? '/chat' : `#${id}`}
                                onClick={(e) => {
                                    if (!isRoute) {
                                    e.preventDefault();
                                    scrollToSection(id);
                                    }
                                }}
                                className={`nav-link transition-all duration-300 py-2 px-3 rounded-md ${currentSection === id ? 'active text-amber-500' : 'text-amber-700 hover:text-amber-500'}`}
                                >
                                {label}
                                </a>
                            </li>
                            ))}
                        </ul>
                        {user ? (
                        <button
                            onClick={handleLogout}
                            className="hidden md:block bg-amber-600 hover:bg-amber-500 text-white font-medium px-5 py-2 rounded-full shadow transition-all text-sm"
                        >
                            Logout
                        </button>
                        ) : (
                        <div className="hidden md:block">
                            <GoogleLoginButton />
                        </div>
                        )}
                        <div className="md:hidden">
                            <button className="text-amber-700 hover:text-amber-500">
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Intro Section */}
            <div
                id="intro"
                ref={heroSectionRef}
                className="relative bg-cover bg-center pt-32 pb-32 md:pt-48 md:pb-16 overflow-hidden bg-parallax"
                style={{
                    backgroundImage: "url('/bg-1.jpg')",
                }}
            >
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="py-20">
                        {/* Title and Description in single container */}
                        <div
                            ref={titleDivRef}
                            className="glass-morph rounded-2xl p-12 mb-8 text-center shadow-2xl transition-all duration-700"
                            style={{
                                transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)"
                            }}
                        >
                            <h1 className="text-white text-5xl font-serif mb-6">
                                Your <span className="text-amber-500">AI-Powered</span> Private Chef
                            </h1>
                            <div
                                ref={descriptionDivRef}
                                className="transition-all duration-700"
                                style={{
                                    transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)"
                                }}
                            >
                                <p className="text-amber-100 leading-8 text-lg">
                                    Savr plans your meals like a private chef would: listening to what you need,
                                    working with what you have, and personalizing for your goals and health.
                                </p>
                            </div>
                        </div>

                        {/* Try Savr Input Bar - Now inside intro section */}
                        <div className="glass-morph rounded-2xl p-8 mb-8 shadow-xl transition-all duration-700">
                            <div className="text-center mb-6">
                                <div className="flex justify-center mb-3">
                                    <BotIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-serif text-amber-300 mb-2">Try Savr Assistant</h3>
                                <p className="text-amber-100 text-sm">Ask me anything about what to eat, how to cook, or how to nourish your body.</p>
                            </div>

                            {/* Quick prompts */}
                            <div className="flex justify-center gap-2 mb-4 flex-wrap">
                                {[
                                    "Dinner idea with steak",
                                    "Low-calorie dessert", 
                                    "Meal prep for 3 days",
                                    "Best source of iron"
                                ].map((text, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(text)}
                                        className="px-3 py-1 rounded-full border border-amber-300 text-xs text-amber-200 hover:bg-amber-800 hover:bg-opacity-30 transition whitespace-nowrap"
                                    >
                                        {text}
                                    </button>
                                ))}
                            </div>

                            {/* Input bar */}
                            <div className="max-w-xl mx-auto">
                                <div className="flex items-center bg-white border border-stone-300 rounded-full px-4 py-3 shadow-lg relative">
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
                                        onKeyDown={(e) => {if(e.key === 'Enter') handleSend(); }}
                                        placeholder=" "
                                        className="flex-grow bg-transparent text-stone-700 text-lg px-2 py-1 focus:outline-none placeholder-transparent"
                                    />
                                    {input === '' && (
                                        <div className="absolute left-12 text-stone-400 text-lg pointer-events-none">
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

                                    {/* Send button - Improved design */}
                                    <button 
                                        onClick={handleSend} 
                                        className="ml-3 bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg" 
                                        title="Send message"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {/* Optional: Login prompt if not logged in */}
                                {!user && (
                                    <div className="text-center mt-3">
                                        <p className="text-amber-200 text-xs mb-2">Want to save your conversations?</p>
                                        <GoogleLoginButton />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Let's Explore Button */}
                        <div className="text-center">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="glass-morph hover:bg-amber-800 hover:bg-opacity-30 text-amber-100 hover:text-white font-medium text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                            >
                                Let's Explore
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div
                id="features"
                ref={featuresSectionRef}
                className="relative bg-cover bg-center py-32 md:py-40 bg-parallax"
                style={{
                    backgroundImage: "url('/bg-2.jpg')",
                }}
            >
                <div className="container mx-auto px-4 py-24">
                    <div className="text-center mb-20 animate-on-scroll">
                        <h2 className="bg-amber-800 text-white py-5 px-12 text-3xl font-medium inline-block rounded-full shadow-md">
                            Personalized Nourishment
                        </h2>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-around items-center max-w-6xl mx-auto gap-8">
                        <div className="flex-1 rounded-2xl px-8 py-10 bg-stone-100 border border-stone-200 shadow-xl animate-on-scroll from-left">
                            {[
                                { icon: ChefHat, title: "AI-Powered Chef", desc: "Tell Savr what you're craving or need, and it creates personalized meal plans that fit your preferences, dietary needs, and what's already in your kitchen." },
                                { icon: Heart, title: "Health Companion", desc: "Whether you're dealing with hair loss, eye strain, fatigue, or brain fog, Savr creates personalized meal plans to support your specific needs." },
                                { icon: Apple, title: "Ingredient Intelligence", desc: "Learn how each ingredient fuels your body and supports your well-being, from how miso boosts gut health to why sesame seeds support hormone balance." }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start mb-8 opacity-0 animate-on-scroll" style={{ animationDelay: `${index * 200}ms` }}>
                                    <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-500 hover:scale-110">
                                        <feature.icon className="h-8 w-8 text-amber-700" />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl mb-3 text-amber-800 font-medium">{feature.title}</h3>
                                        <p className="text-stone-700">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 rounded-2xl px-8 py-10 bg-stone-100 border border-stone-200 shadow-xl animate-on-scroll from-right">
                            {[
                                { icon: Leaf, title: "Reduce Food Waste", desc: "With every plan, track your environmental impact by reducing food waste, supporting local ingredients and fostering more sustainable eating habits." },
                                { icon: Clock, title: "Rescue Near-Expiry Items", desc: "Savr connects you to perfectly edible, near-expiry items, making it quick and easy to rescue them and turn them into delicious meals at home." },
                                { icon: Users, title: "Community Impact", desc: "Connect to food rescue hubs, community kitchens, and non-profits to tackle food insecurity and build a sustainable food system." }
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start mb-8 opacity-0 animate-on-scroll" style={{ animationDelay: `${(index + 3) * 200}ms` }}>
                                    <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-500 hover:scale-110">
                                        <feature.icon className="h-8 w-8 text-amber-700" />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-xl mb-3 text-amber-800 font-medium">{feature.title}</h3>
                                        <p className="text-stone-700">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section - Enhanced with scroll-triggered animations */}
            <div
                id="about"
                ref={aboutSectionRef}
                className="relative bg-cover bg-center py-32 md:py-40 bg-parallax"
                style={{
                    backgroundImage: "url('/bg-3.jpg')",
                }}
            >
                <div className="container mx-auto px-4 py-24">
                    <div className="ml-auto mr-auto max-w-2xl">
                        <div className="bg-white bg-opacity-95 p-12 rounded-2xl mb-12 shadow-xl animate-on-scroll scale-up">
                            <h2 className="mb-8 text-amber-800 text-4xl font-serif">How Savr Works</h2>
                            <div className="space-y-12">
                                {[
                                    { num: 1, title: "Tell Savr What You Want", desc: "I want something warm and comforting tonight or Make a meal plan for my marathon prep" },
                                    { num: 2, title: "Get Personalized Plans", desc: "Savr creates meal plans based on your preferences, ingredients, and nutritional needs" },
                                    { num: 3, title: "Cook With Guidance", desc: "Follow simple instructions tailored to your cooking skill level with nutritional insights" },
                                    { num: 4, title: "Track Your Impact", desc: "See your sustainability progress and health improvements over time" }
                                ].map((step, index) => (
                                    <div key={index} className="flex items-center animate-on-scroll" data-delay={String(index * 200)}>
                                        <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mr-5 shadow-md transform transition-transform duration-500 hover:scale-110">
                                            <span className="text-xl font-bold text-amber-800">{step.num}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-stone-900">{step.title}</h3>
                                            <p className="text-stone-600">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <a
                            href="#contact"
                            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                            className="inline-block bg-amber-800 hover:bg-amber-700 transition-all text-white text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-2 duration-500 animate-on-scroll"
                        >
                            <Users className="inline mr-3" />
                            Join Our Community
                        </a>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div
                id="contact"
                ref={contactSectionRef}
                className="relative bg-cover bg-center py-32 pb-48 md:py-40 bg-parallax"
                style={{
                    backgroundImage: "url('/bg-4.jpg')",
                }}
            >
                <div className="container mx-auto px-4 pt-24 pb-48">
                    <div className="flex flex-col lg:flex-row justify-center max-w-6xl mx-auto gap-8">
                        <div className="flex-1 rounded-2xl px-10 py-12 bg-white shadow-xl animate-on-scroll from-left">
                            <h2 className="text-3xl mb-8 text-amber-800 font-serif">What Our Users Say</h2>
                            <div className="space-y-12">
                                {[
                                    { name: "Chi Lan", role: "Food creator", avatar: "https://api.dicebear.com/7.x/avataaars/svg/seed=ok1", quote: "Savr turned my end-of-day exhaustion into excitement for cooking again. I love how it works with whatever I have in my fridge!" },
                                    { name: "Alex T.", role: "Marathon runner", avatar: "https://api.dicebear.com/7.x/avataaars/svg/seed=ok", quote: "The personalized nutrition advice has transformed my training. I've noticed better recovery times and more energy during my runs." }
                                ].map((testimonial, index) => (
                                    <div key={index} className="border-l-4 border-amber-300 pl-6 py-1 animate-on-scroll" data-delay={String(index * 300)}>
                                        <div className="flex items-center mb-4">
                                            <img src={testimonial.avatar} alt="User" className="h-12 w-12 rounded-full border-2 border-amber-100 shadow-md transform transition-transform duration-500 hover:scale-110" />
                                            <div className="ml-4">
                                                <h4 className="text-lg font-medium text-stone-900">{testimonial.name}</h4>
                                                <p className="text-stone-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        <p className="mb-6 text-lg leading-8 text-stone-700 italic">
                                            "{testimonial.quote}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <a
                                    href="#contact"
                                    className="inline-block text-white text-xl px-8 py-4 rounded-full transition-all bg-amber-800 hover:bg-amber-700 shadow-lg hover:shadow-xl hover:-translate-y-2 duration-500"
                                >
                                    <Leaf className="inline mr-3" />
                                    Join Community
                                </a>
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl p-12 bg-stone-800 bg-opacity-95 shadow-xl animate-on-scroll from-right">
                            <h2 className="text-3xl mb-6 text-amber-300 font-serif">Get in Touch</h2>
                            <form className="text-lg">
                                <div className="mb-6">
                                    <label className="block text-amber-100 text-sm mb-2" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="w-full bg-stone-700 border-b border-amber-500 px-4 py-3 text-white rounded-lg focus:outline-none focus:border-amber-300 transition-all duration-300"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-amber-100 text-sm mb-2" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full bg-stone-700 border-b border-amber-500 px-4 py-3 text-white rounded-lg focus:outline-none focus:border-amber-300 transition-all duration-300"
                                        placeholder="Your email"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-amber-100 text-sm mb-2" htmlFor="message">Message</label>
                                    <textarea
                                        rows={5}
                                        id="message"
                                        name="message"
                                        className="w-full bg-stone-700 border-b border-amber-500 px-4 py-3 text-white rounded-lg focus:outline-none focus:border-amber-300 transition-all duration-300"
                                        placeholder="Your message..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="container">
                        <Footer/>
                    </div>
                </div>
            </div>

            {/* Chatbot LLM */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsChatOpen((prev) => !prev)}
                    className="bg-amber-800 hover:bg-amber-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 cursor-pointer">
                    <ChatIcon />
                </button>
                {isChatOpen && <ChatFrame />}
            </div>
        </div>
    );
};

export default LandingPage;