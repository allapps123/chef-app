import { Logo } from "../common/Logo"; // adjust path if needed
import { Users, Heart, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-stone-900 to-transparent pt-20 pb-6">
            <div className="container mx-auto px-8">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    {/* Logo and Info */}
                    <div className="mb-8 md:mb-0">
                        <div className="flex items-center">
                            <Logo size="md" />
                        </div>
                        <p className="font-medium text-amber-100 mt-4 max-w-sm">
                            Helping you eat well and waste less
                        </p>
                        <div className="mt-4 flex flex-col space-y-2 text-stone-300">
                            <span className="text-sm flex items-center">
                                <Users size={16} className="mr-2" /> 10,000+ happy users
                            </span>
                            <span className="text-sm flex items-center">
                                <Heart size={16} className="mr-2" /> 15,000+ meals created
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16">
                        {/* Quick Links */}
                        <div>
                            <h4 className="text-amber-400 font-medium mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#intro" className="text-stone-300 hover:text-amber-300 transition-colors">Home</a></li>
                                <li><a href="#features" className="text-stone-300 hover:text-amber-300 transition-colors">Features</a></li>
                                <li><a href="#about" className="text-stone-300 hover:text-amber-300 transition-colors">How It Works</a></li>
                                <li><a href="#contact" className="text-stone-300 hover:text-amber-300 transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="text-amber-400 font-medium mb-4">Contact Us</h4>
                            <address className="not-italic text-stone-300">
                                <p>1625 Grand Avenue</p>
                                <p>Chicago, IL 60616</p>
                                <p className="mt-2">
                                    <a href="mailto:hello@savrai.com" className="text-amber-300 hover:text-amber-200 transition-colors">
                                        hello@savrai.com
                                    </a>
                                </p>
                            </address>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h4 className="text-amber-400 font-medium mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-stone-700 hover:bg-amber-700 p-2 rounded-full transition-all duration-300">
                                    <span className="sr-only">Instagram</span>
                                    <Instagram className="h-6 w-6 text-white" />
                                </a>
                                <a href="#" className="bg-stone-700 hover:bg-amber-700 p-2 rounded-full transition-all duration-300">
                                    <span className="sr-only">Twitter</span>
                                    <Twitter className="h-6 w-6 text-white" />
                                </a>
                                <a href="#" className="bg-stone-700 hover:bg-amber-700 p-2 rounded-full transition-all duration-300">
                                    <span className="sr-only">Facebook</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-12 pt-6 border-t border-stone-700 flex flex-col md:flex-row items-center justify-between text-sm text-stone-400">
                    <div className="mb-4 md:mb-0">
                        © 2025 Savr AI. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
