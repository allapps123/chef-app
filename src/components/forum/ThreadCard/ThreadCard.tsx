// File: src/components/ThreadCard.tsx
import React, { useState } from "react";
import "./ThreadCard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../../lib/firebase";

interface Author {
  displayName: string;
  profilePicture: string;
}

interface Reactions {
  likes: number;
  comments: number;
}

interface Thread {
  id: string;
  forumId: string;
  title: string;
  body: string;
  author: Author;
  createdAt: string;
  reactions: Reactions;
  likedByUser: boolean;
}

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const VITE_DEV_URL = import.meta.env.VITE_DEV_URL || "http://localhost:8888/.netlify/functions/server";

  const navigate = useNavigate();
  const [likes, setLikes] = useState(thread.reactions.likes);
  const [liked, setLiked] = useState(thread.likedByUser);

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClick = () => {
    navigate(`/forum/${thread.id}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to like threads.");
      return;
    }

    try {
      const token = await user.getIdToken();
      console.log("Sending like request:", {
        threadId: thread.id,
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL,
      });

      const res = await axios.put(
        `${VITE_DEV_URL}/forum/threads/${thread.id}/like`,
        {
          user_id: user.uid,
          user_name: user.displayName,
          user_avatar: user.photoURL,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Like response:", res.data);

      if (res.data.liked) {
        setLiked(true);
        setLikes((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikes((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      if (axios.isAxiosError(err)) {
        console.error("Error details:", err.response?.data);
      }
    }
  };

  return (
    <div className="thread-card" onClick={handleClick}>
      <div className="thread-header">
        <img
          className="author-avatar"
          src={thread.author.profilePicture || "/default-avatar.png"}
          alt="avatar"
        />
        <span className="author">{thread.author.displayName}</span>
        <span className="separator">•</span>
        <span className="date">{formatDate(thread.createdAt)}</span>
      </div>

      <h2 className="thread-title">{thread.title}</h2>

      <p className="thread-preview">
        {thread.body.length > 150
          ? thread.body.slice(0, 150) + "..."
          : thread.body}
      </p>

      <div className="thread-footer">
        <span className="reaction" onClick={handleLikeClick}>
          {liked ? "❤️" : "🤍"} {likes}
        </span>
        <span className="reaction">💬 {thread.reactions.comments}</span>
        <span className="reaction">🔁</span>
      </div>
    </div>
  );
};

export default ThreadCard;
