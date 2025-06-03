import { Logo } from "../common/Logo"; // adjust path if needed
import { Users, Heart, Twitter, Instagram, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bottom-0 left-0 w-full bg-gradient-to-t from-stone-900 to-transparent pt-16 pb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo and Info */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center">
                            <Logo size="md" />
                        </div>
                        <p className="font-medium text-amber-100 mt-4 max-w-sm text-sm">
                            Helping you eat well and waste less
                        </p>
                        <div className="mt-4 flex flex-col space-y-2 text-stone-100">
                            <span className="text-sm flex items-center">
                                <Users size={16} className="mr-2 flex-shrink-0" /> 10,000+ happy users
                            </span>
                            <span className="text-sm flex items-center">
                                <Heart size={16} className="mr-2 flex-shrink-0" /> 15,000+ meals created
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h4 className="text-amber-200 font-medium mb-4 text-base">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Home", href: "#intro" },
                                { name: "Features", href: "#features" },
                                { name: "How It Works", href: "#about" },
                                { name: "Contact", href: "#contact" }
                            ].map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-stone-100 hover:text-amber-200 transition-colors block py-1 text-sm"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-1">
                        <h4 className="text-amber-200 font-medium mb-4 text-base">Contact Us</h4>
                        <address className="not-italic text-stone-100 space-y-3">
                            <p className="flex items-start">
                                <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                                <span className="text-sm">1625 Grand Avenue<br/>Chicago, IL 60616</span>
                            </p>
                            <p className="flex items-center">
                                <Mail size={16} className="mr-2 flex-shrink-0" />
                                <a href="mailto:hello@savrai.com" className="text-amber-100 hover:text-amber-50 transition-colors text-sm">
                                    hello@savrai.com
                                </a>
                            </p>
                            <p className="flex items-center">
                                <Phone size={16} className="mr-2 flex-shrink-0" />
                                <a href="tel:+13125551234" className="text-amber-100 hover:text-amber-50 transition-colors text-sm">
                                    (312) 555-1234
                                </a>
                            </p>
                        </address>
                    </div>

                    {/* Social Media */}
                    <div className="col-span-1">
                        <h4 className="text-amber-200 font-medium mb-4 text-base">Follow Us</h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="bg-stone-600 bg-opacity-70 hover:bg-amber-700 p-2 rounded-full transition-all duration-300 flex items-center justify-center border border-stone-500 backdrop-blur-sm"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5 text-white" />
                            </a>
                            <a
                                href="#"
                                className="bg-stone-600 bg-opacity-70 hover:bg-amber-700 p-2 rounded-full transition-all duration-300 flex items-center justify-center border border-stone-500 backdrop-blur-sm"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5 text-white" />
                            </a>
                            <a
                                href="#"
                                className="bg-stone-600 bg-opacity-70 hover:bg-amber-700 p-2 rounded-full transition-all duration-300 flex items-center justify-center border border-stone-500 backdrop-blur-sm"
                                aria-label="Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-amber-400 font-medium mb-3 text-lg">Join Our Newsletter</h4>
                            <form className="flex flex-col sm:flex-row">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-stone-700 text-white px-4 py-2 rounded-l-lg sm:rounded-r-none rounded-r-lg sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full mb-2 sm:mb-0"
                                    aria-label="Email for newsletter"
                                />
                                <button
                                    type="submit"
                                    className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-r-lg sm:rounded-l-none rounded-l-lg sm:rounded-r-lg transition-colors duration-300"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-12 pt-6 border-t border-stone-700 flex flex-col md:flex-row items-center justify-between text-sm text-stone-400">
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        © 2025 Savr AI. All rights reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-amber-300 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
