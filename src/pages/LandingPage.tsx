import { ChefHat, Clock, Leaf, Apple, Heart, Users } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* navbar */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                            <ChefHat className="h-8 w-8 text-emerald-600" />
                            <span className="ml-2 text-2xl font-bold text-gray-800">Savr</span>
                        </div>
                          <div className="hidden md:flex space-x-8">
                              <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
                              <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">How It Works</a>
                              <a href="#sustainability" className="text-gray-600 hover:text-emerald-600 transition-colors">Sustainability</a>
                              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">Testimonials</a>
                          </div>
                        </div>
                          <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md cursor-pointer">
                              Get Started
                          </button>
                    </div>
                </nav>
            </header>

            {/* hero */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2">
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight tracking-tight">
                                Your AI-Powered <span className="text-emerald-600">Private Chef</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600">
                                Savr plans your meals like a private chef would: listening to what you need, working with what you have, and personalizing for your goals and health.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors shadow-md cursor-pointer">
                                    Start Cooking
                                </button>
                                <button className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer">
                                    Learn More
                                </button>
                            </div>
                            <div className="mt-8 flex items-center text-gray-500">
                                <div className="flex -space-x-2">
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg/seed=demo" alt="User" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg/seed=ok" alt="User" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg/seed=test" alt="User" />
                                </div>
                                <span className="ml-4">Joined by 10,000+ health-conscious home cooks</span>
                            </div>
                        </div>
                        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
                            <div className="relative w-2/3 h-2/3">
                                <div className="absolute -top-6 -left-6 bg-emerald-100 p-4 rounded-lg shadow-lg">
                                    <p className="text-sm font-medium">"I'm craving something Vietnamese, vegetarian, and mom-approved"</p>
                                </div>
                                <img
                                    src="/api/placeholder/500/400"
                                    alt="AI meal planning demonstration"
                                    className="rounded-lg shadow-xl"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-emerald-100 p-4 rounded-lg shadow-lg max-w-xs">
                                    <p className="text-sm font-medium">"Give me a hormone-friendly meal plan for this week"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* features */}
            <section id="features" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Personalized Nourishment
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From craving to care: Savr turns everyday meals into personalized nourishment by listening like a chef, thinking like a nutritionist, and planning like a partner.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-white p-8 rounded-xl shadow-md">
                          <div className="flex flex items-center justify-center">
                            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <ChefHat className="h-8 w-8 text-emerald-600"/>
                            </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center">AI-Powered Chef</h3>
                            <p className="text-gray-600">
                                Tell Savr what you're craving or need, and it creates personalized meal plans that fit your preferences, dietary needs, and what's already in your kitchen.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md">
                          <div className="flex items-center justify-center">
                            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Heart className="h-8 w-8 text-emerald-600" />
                            </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center">Health Companion</h3>
                            <p className="text-gray-600">
                                Whether you're dealing with hair loss, eye strain, fatigue, or brain fog, Savr creates personalized meal plans to support your specific needs.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-md">
                          <div className="flex items-center justify-center">
                            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Apple className="h-8 w-8 text-emerald-600" />
                            </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-center">Ingredient Intelligence</h3>
                            <p className="text-gray-600">
                                Learn how each ingredient fuels your body and supports your well-being, from how miso boosts gut health to why sesame seeds support hormone balance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* values savr brings */}
            <section id="sustainability" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-12 md:mb-0">
                            <img
                                src="savr-values.jpg"
                                alt="Food waste reduction"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="md:w-1/2 md:pl-12">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                A Quiet Environmental Hero
                            </h2>
                            <div className="space-y-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600">
                                            <Leaf className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Reduce Food Waste</h3>
                                        <p className="mt-2 text-base text-gray-600">
                                            With every plan, track your environmental impact by reducing food waste and supporting local ingredients.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600">
                                            <Clock className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Rescue Near-Expiry Items</h3>
                                        <p className="mt-2 text-base text-gray-600">
                                            Savr connects you to perfectly edible, near-expiry items, making it easy to rescue and use them at home.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600">
                                            <Users className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Community Impact</h3>
                                        <p className="mt-2 text-base text-gray-600">
                                            Connect to food rescue hubs, community kitchens, and non-profits to tackle food insecurity and build a sustainable food system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* how it works */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            How Savr Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Personalized, science-backed, action-oriented, and community-impact-driven
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-emerald-600">1</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Tell Savr What You Want</h3>
                            <p className="text-gray-600 text-sm">
                                "I want something warm and comforting tonight" or "Make a meal plan for my marathon prep"
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-emerald-600">2</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Get Personalized Plans</h3>
                            <p className="text-gray-600 text-sm">
                                Savr creates meal plans based on your preferences, ingredients, and nutritional needs
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-emerald-600">3</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Cook With Guidance</h3>
                            <p className="text-gray-600 text-sm">
                                Follow simple instructions tailored to your cooking skill level with nutritional insights
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-emerald-600">4</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Track Your Impact</h3>
                            <p className="text-gray-600 text-sm">
                                See your sustainability progress and health improvements over time
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* testimonials section */}
            <section id="testimonials" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        What Our Users Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg/seed=fit" alt="User" className="h-12 w-12 rounded-full" />
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold">Chi Lan</h4>
                                    <p className="text-gray-500">Food creator</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "Savr turned my end-of-day exhaustion into excitement for cooking again. I love how it works with whatever I have in my fridge!"
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg/seed=fitness" alt="User" className="h-12 w-12 rounded-full" />
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold">Alex T.</h4>
                                    <p className="text-gray-500">Marathon runner</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "The personalized nutrition advice has transformed my training. I've noticed better recovery times and more energy during my runs."
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl shadow-md">
                            <div className="flex items-center mb-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg/seed=testuser" alt="User" className="h-12 w-12 rounded-full" />
                                <div className="ml-4">
                                    <h4 className="text-lg font-semibold">Maya K.</h4>
                                    <p className="text-gray-500">Community kitchen manager</p>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "Savr has helped our community kitchen reduce food waste by 40% while creating more nutritious meals for those in need."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-emerald-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Transform Your Relationship with Food?
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
                        Whether you're cooking for one or for many, join Savr and be part of a smarter, kinder food system.
                    </p>
                    <button className="bg-white text-emerald-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                        Join Now - It's Free!
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center">
                                <ChefHat className="h-8 w-8 text-emerald-500" />
                                <span className="ml-2 text-xl font-bold">Savr</span>
                            </div>
                            <p className="mt-4 text-gray-400">
                                Your AI-powered private chef for healthier living and a sustainable food system.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sustainability</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">TikTok</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                    </svg>
                                </a>
                            </div>
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
                                <div className="flex">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="px-4 py-2 rounded-l-lg w-full text-white focus:ring-blue-500 focus:border-blue-500 border border-gray-300"
                                    />
                                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-700 transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Savr. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
