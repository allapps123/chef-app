import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { Logo } from "./Logo";
import GoogleLoginButton from "./Login";
import UserAvatar from "./UserAvatar";
import { signOut, auth } from "../../lib/firebase";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("savr-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("savr-user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed w-full bg-stone-900 bg-opacity-90 shadow-lg backdrop-blur-md py-2 sm:py-3 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center">
          <div className="text-stone-700 font-bold text-lg sm:text-xl md:text-2xl transform scale-90">
            <Logo onClick={() => navigate("/")} size="sm" />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex space-x-4 xl:space-x-8 text-sm xl:text-lg font-medium">
            {[
              { id: "intro", label: "Intro", path: "/#intro" },
              { id: "features", label: "Features", path: "/#features" },
              { id: "about", label: "About", path: "/#about" },
              { id: "contact", label: "Contact", path: "/#contact" },
              { id: "chat", label: "Chat", path: "/chat", active: true },
              { id: "forum", label: "Forum", path: "/forum", active: true },
            ].map(({ id, label, path }) => (
              <li key={id}>
                <a
                  href={path}
                  onClick={(e) => {
                    if (path.startsWith("/#")) {
                      e.preventDefault();
                      navigate("/");
                      setTimeout(() => {
                        const section = document.getElementById(id);
                        if (section) {
                          section.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 100);
                    }
                  }}
                  className={`nav-link transition-all duration-300 py-2 px-3 rounded-md ${
                    location.pathname === path
                      ? "text-amber-500 border-b-2 border-amber-500"
                      : "text-amber-700 hover:text-amber-500"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Auth */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-3">
              <UserAvatar user={user} size="sm" />
              <button
                onClick={handleLogout}
                className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-3 lg:px-4 py-1.5 lg:py-2 rounded-full shadow transition-all text-xs lg:text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:block">
              <GoogleLoginButton />
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && <UserAvatar user={user} size="sm" />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-amber-700 hover:text-amber-500 p-2"
            >
              <MenuIcon size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pb-3 border-t border-stone-700">
            <ul className="space-y-2 pt-3">
              {[
                { id: "intro", label: "Intro", path: "/#intro" },
                { id: "features", label: "Features", path: "/#features" },
                { id: "about", label: "About", path: "/#about" },
                { id: "contact", label: "Contact", path: "/#contact" },
                { id: "chat", label: "Chat", path: "/chat", active: true },
                { id: "forum", label: "Forum", path: "/forum", active: true },
              ].map(({ id, label, path }) => (
                <li key={id}>
                  <a
                    href={path}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (path.startsWith("/#")) {
                        e.preventDefault();
                        navigate("/");
                        setTimeout(() => {
                          const section = document.getElementById(id);
                          if (section) {
                            section.scrollIntoView({ behavior: "smooth" });
                          }
                        }, 100);
                      }
                    }}
                    className={`block py-2 px-3 text-sm font-medium rounded-md transition-all duration-300 ${
                      location.pathname === path
                        ? "text-amber-500 border-b-2 border-amber-500"
                        : "text-amber-700 hover:text-amber-500 hover:bg-amber-900 hover:bg-opacity-10"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-stone-700 mt-3">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-2 rounded-full shadow transition-all text-sm"
                >
                  Logout
                </button>
              ) : (
                <div className="w-full">
                  <GoogleLoginButton />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
