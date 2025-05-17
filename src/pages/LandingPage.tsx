import { useState, useEffect, useRef } from 'react';
import { ChefHat, Clock, Leaf, Apple, Heart, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  // State for navbar scroll behavior
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // State to track scroll direction
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // Animation states
  const [animationProgress, setAnimationProgress] = useState<number>(0);

  // Refs for animation elements
  const titleDivRef = useRef<HTMLDivElement>(null);
  const descriptionDivRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);

  // Section visibility tracking
  const [currentSection, setCurrentSection] = useState<string>('intro');

  // Handle scroll event for navbar and animations
  useEffect(() => {
    let previousScrollPosition = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);

      // Calculate animation progress based on scroll position (0 to 1)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.max(0, Math.min(1, currentScrollY / docHeight));
      setAnimationProgress(scrollProgress);

      // Navbar behavior with enhanced animation
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hero section parallax and fade effects
      if (titleDivRef.current) {
        const scrollOffset = currentScrollY;
        const titleParallaxFactor = 0.35; // Adjust speed
        const opacityFactor = Math.max(0, 1 - (scrollOffset / 600));

        // Different animation based on scroll direction
        if (scrollDirection === 'down') {
          titleDivRef.current.style.transform = `translateY(${scrollOffset * titleParallaxFactor}px)`;
        } else {
          titleDivRef.current.style.transform = `translateY(${scrollOffset * titleParallaxFactor * 0.5}px)`;
        }

        titleDivRef.current.style.opacity = String(opacityFactor);
      }

      // Description div with different parallax rate
      if (descriptionDivRef.current) {
        const scrollOffset = currentScrollY;
        const descParallaxFactor = 0.2; // Slower than title
        const opacityFactor = Math.max(0, 1 - (scrollOffset / 700));

        descriptionDivRef.current.style.transform = `translateY(${scrollOffset * descParallaxFactor}px)`;
        descriptionDivRef.current.style.opacity = String(opacityFactor);
      }

      // Determine which section is currently in view
      const sections = [
        { id: 'intro', ref: heroSectionRef },
        { id: 'features', ref: featuresSectionRef },
        { id: 'about', ref: aboutSectionRef },
        { id: 'contact', ref: contactSectionRef }
      ];

      // Find the section that's most in view
      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionHeight = rect.height;

          // If the section is more than 25% in view, consider it the current section
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

    // Initial animation state
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

  // Handle smooth scrolling with enhanced easing
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Use smooth scrolling with custom timing function
      const start = window.pageYOffset;
      const target = section.getBoundingClientRect().top + window.pageYOffset;
      const distance = target - start;
      const duration = 1000; // ms
      let startTime: number | null = null;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Custom easing function for smoother scroll
        const ease = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

        window.scrollTo(0, start + distance * ease(progress));

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      requestAnimationFrame(animation);
    }
  };

  // Animation for elements entering viewport with enhanced timing and effects
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Apply staggered animation based on the element's position
          const target = entry.target as HTMLElement;
          const delay = target.dataset.delay || '0';
          setTimeout(() => {
            target.classList.add('animate-in');
          }, parseInt(delay));
        } else if ((entry.target as HTMLElement).classList.contains('animate-out-on-leave')) {
          // Optional: animate out when elements leave viewport
          (entry.target as HTMLElement).classList.remove('animate-in');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Get all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((element, index) => {
      // Add staggered delay based on element order
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
      {/* Navbar - Enhanced with active state */}
      <nav className={`fixed w-full transition-all duration-500 z-50 ${isScrolled ? 'bg-stone-900 bg-opacity-90 shadow-lg backdrop-blur-md py-3' : 'py-6'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className={`text-stone-700 font-bold text-2xl transition-all duration-500 ${isScrolled ? 'transform scale-90' : ''}`}>
              <span className="font-serif text-amber-800">Savr AI</span>
            </div>
            <ul className="hidden md:flex space-x-8 text-lg font-medium">
              {['intro', 'features', 'about', 'contact'].map((section) => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    onClick={(e) => {e.preventDefault(); scrollToSection(section);}}
                    className={`nav-link transition-all duration-300 py-2 px-3 rounded-md ${
                      currentSection === section ? 'active text-amber-500' : 'text-amber-700 hover:text-amber-500'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="md:hidden">
              <button className="text-amber-700 hover:text-amber-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Intro Section - Enhanced with scroll indicator */}
      <div
        id="intro"
        ref={heroSectionRef}
        className="relative bg-cover bg-center pt-32 pb-32 md:pt-48 md:pb-64 overflow-hidden bg-parallax"
        style={{
          backgroundImage: "url('/bg-1.jpg')",
        }}
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="py-20">
            <div
              ref={titleDivRef}
              className="glass-morph rounded-2xl p-12 mb-12 text-center shadow-2xl transition-all duration-700"
              style={{
                transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              <h1 className="text-white text-6xl font-serif mb-5">
                <span className="text-amber-500">Savr AI</span>
              </h1>
              <p className="text-amber-100 text-2xl font-light">Your AI-Powered Private Chef</p>
            </div>
            <div
              ref={descriptionDivRef}
              className="glass-morph rounded-2xl p-10 mb-12 shadow-xl transition-all duration-700"
              style={{
                transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)"
              }}
            >
              <p className="text-amber-100 leading-8 text-lg text-center">
                Savr plans your meals like a private chef would: listening to what you need,
                working with what you have, and personalizing for your goals and health.
              </p>
            </div>
            <div className="text-center animate-on-scroll scale-up">
              <div className="inline-block">
                <a
                  href="#features"
                  onClick={(e) => {e.preventDefault(); scrollToSection('features');}}
                  className="flex justify-center items-center bg-amber-800 hover:bg-amber-700 py-5 px-8 rounded-full font-medium text-xl text-white transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2"
                >
                  <ChefHat className="mr-3" />
                  <span>Let's explore...</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator"></div>
      </div>

      {/* Features Section - Enhanced with staggered animations */}
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
                    <feature.icon className="h-8 w-8 text-amber-700"/>
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
                { icon: Leaf, title: "Reduce Food Waste", desc: "With every plan, track your environmental impact by reducing food waste and supporting local ingredients." },
                { icon: Clock, title: "Rescue Near-Expiry Items", desc: "Savr connects you to perfectly edible, near-expiry items, making it easy to rescue and use them at home." },
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
              onClick={(e) => {e.preventDefault(); scrollToSection('contact');}}
              className="inline-block bg-amber-800 hover:bg-amber-700 transition-all text-white text-xl py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-2 duration-500 animate-on-scroll"
            >
              <Users className="inline mr-3" />
              Join Our Community
            </a>
          </div>
        </div>
      </div>

      {/* Contact Section - Enhanced with perspective effect */}
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
                  href="#"
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
          <footer className="absolute bottom-0 left-0 w-full">
            <div className="container mx-auto p-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-amber-600 mb-4 md:mb-0">
                <span className="font-medium">© 2025 Savr.</span> All rights reserved.
                <div className="text-sm mt-1">Helping you eat well and waste less</div>
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="text-amber-800 hover:text-amber-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Chatbot Button - Placeholder for future implementation */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-amber-800 hover:bg-amber-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
