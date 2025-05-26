import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <LandingPage />
            </motion.div>
          }
        />
        <Route
          path="/chat"
          element={
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <ChatPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;