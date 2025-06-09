import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import UserProfilePage from "./pages/UserProfilePage";
import "./App.css";
import ForumDetails from "./pages/forumDetails";
import StartThreadPage from "./pages/startThread";
import Forum from "./pages/forum";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import { useEffect, useState } from "react";
import GlobalLoading from "./components/GlobalLoading";
import PersonalizationSurvey from "./pages/food-survey/Personalization";

function App() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const [loading, setLoading] = useState(false);

    // Ví dụ: bật loading khi chuyển trang
    useEffect(() => {
      setLoading(true);
      // Giả lập loading
      const timer = setTimeout(() => setLoading(false), 1800);
      return () => clearTimeout(timer);
    }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 App">
      {loading && <GlobalLoading />}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Home route */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                >
                  <LandingPage />
                </motion.div>
              }
            />
            {/* All other routes (with Navbar) */}
            <Route
              path="*"
              element={
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Navbar />

                  <Routes>
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/profile" element={<UserProfilePage />} />
                    <Route path="/forum" element={<Forum />} />
                    <Route path="/forum/:id" element={<ForumDetails />} />
                    <Route
                      path="/forum/start-thread"
                      element={<StartThreadPage />}
                    />
                    <Route path="/food-survey" element={<PersonalizationSurvey onSubmit={() => {}} />} />
                  </Routes>
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      {!isChatPage && <Footer />}
    </div>
  );
}

export default App;
