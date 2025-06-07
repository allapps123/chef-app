// File: src/components/ForumBanner.tsx
import React from "react";
import "./ForumBanner.css";
import { useNavigate } from "react-router-dom";

interface ForumBannerProps {
  forum: {
    id: string;
    name: string;
    description: string;
  };
}

const ForumBanner: React.FC<ForumBannerProps> = ({ forum }) => {
  const navigate = useNavigate();
  if (!forum) return null;

  const handleStartThread = () => {
    navigate("/forum/start-thread");
  };

  return (
    <div className="forum-banner">
      <div className="forum-info">
        <div className="forum-icon">{forum.name.charAt(0)}</div>
        <div className="forum-text">
          <h1>{forum.name}</h1>
          <p>{forum.description}</p>
        </div>
      </div>
      <button className="start-thread-btn" onClick={handleStartThread}>
        Start New Thread
      </button>
    </div>
  );
};

export default ForumBanner;
