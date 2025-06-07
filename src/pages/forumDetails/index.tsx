// File: src/pages/ChefThreadPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import defaultAvatar from "../../assets/default_avatar.png";
import "./forumDetails.css";

interface Author {
  displayName: string;
  profilePicture: string;
}

interface Thread {
  id: string;
  forumId: string;
  title: string;
  body: string;
  author: Author;
  createdAt: string;
  reactions: {
    likes: number;
    comments: number;
  };
  likedByUser: boolean;
}

interface Comment {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
  reactions: {
    likes: number;
  };
  likedByUser: boolean;
}

const ForumDetails: React.FC = () => {
  const VITE_DEV_URL = import.meta.env.VITE_DEV_URL || "http://localhost:8888/.netlify/functions/server";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser); // ✅ THIS WAS MISSING

      if (!id) return;

      let user_id = null;
      let token = null;

      if (firebaseUser) {
        user_id = firebaseUser.uid;
        token = await firebaseUser.getIdToken();
      }

      try {
        const res = await axios.get(`${VITE_DEV_URL}/forum/threads/${id}`, {
          params: { user_id },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const threadData = res.data;

        setThread({
          id: threadData.id.toString(),
          forumId: threadData.category_id.toString(),
          title: threadData.title,
          body: threadData.content,
          author: {
            displayName: threadData.user_name || "Anonymous",
            profilePicture: threadData.user_avatar || defaultAvatar,
          },
          createdAt: threadData.created_at,
          reactions: {
            likes: parseInt(threadData.like_count) || 0,
            comments: threadData.replies?.length || 0,
          },
          likedByUser: !!threadData.liked_by_user,
        });

        setComments(
          threadData.replies.map((reply: any) => ({
            id: reply.id.toString(),
            body: reply.content,
            author: {
              displayName: reply.user_name || "Anonymous",
              profilePicture: reply.user_avatar || defaultAvatar,
            },
            createdAt: reply.created_at,
            reactions: {
              likes: parseInt(reply.like_count) || 0,
            },
            likedByUser: !!reply.liked_by_user,
          }))
        );
      } catch (err) {
        console.error("❌ Failed to fetch thread:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleLikeThread = async () => {
    if (!user) {
      alert("Please sign in to like threads.");
      return;
    }
    if (!thread || !auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.put(
        `${VITE_DEV_URL}/forum/threads/${thread.id}/like`,
        {
          user_id: auth.currentUser.uid,
          user_name: auth.currentUser.displayName,
          user_avatar: auth.currentUser.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setThread((prev) =>
        prev
          ? {
              ...prev,
              reactions: {
                ...prev.reactions,
                likes: res.data.liked
                  ? prev.reactions.likes + 1
                  : prev.reactions.likes - 1,
              },
              likedByUser: res.data.liked,
            }
          : null
      );
    } catch (err) {
      console.error("❌ Failed to like thread:", err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      alert("Please sign in to like comments.");
      return;
    }
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.put(
        `${VITE_DEV_URL}/forum/replies/${commentId}/like`,
        {
          user_id: auth.currentUser.uid,
          user_name: auth.currentUser.displayName,
          user_avatar: auth.currentUser.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                reactions: {
                  ...comment.reactions,
                  likes: res.data.liked
                    ? comment.reactions.likes + 1
                    : comment.reactions.likes - 1,
                },
                likedByUser: res.data.liked,
              }
            : comment
        )
      );
    } catch (err) {
      console.error("❌ Failed to like comment:", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to comment.");
      return;
    }
    if (!newComment.trim() || !thread || !auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const user = auth.currentUser;
      const email = user.email || "anonymous@email.com";
      const username = user.displayName || email.split("@")[0];
      const res = await axios.post(
        `${VITE_DEV_URL}/forum/threads/${thread.id}/replies`,
        {
          user_id: user.uid,
          content: newComment,
          user_name: username,
          user_avatar: user.photoURL || defaultAvatar,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newCommentData = {
        id: res.data.id.toString(),
        body: res.data.content,
        author: {
          displayName: username,
          profilePicture: user.photoURL || defaultAvatar,
        },
        createdAt: res.data.created_at,
        reactions: {
          likes: 0,
        },
        likedByUser: false,
      };
      setComments((prev) => [...prev, newCommentData]);
      setNewComment("");
    } catch (err) {
      console.error("❌ Failed to add comment:", err);
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString();
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (!thread) return <p className="error">Thread not found.</p>;

  return (
    <div className="thread-container">
      <div className="thread-header">
        <img
          className="avatar"
          src={thread.author.profilePicture}
          alt="avatar"
        />
        <div>
          <h2 className="thread-title">{thread.title}</h2>
          <p className="meta">
            {thread.author.displayName} • {formatDate(thread.createdAt)}
          </p>
        </div>
      </div>
      <p className="thread-body">{thread.body}</p>

      <div className="reactions">
        <button
          className={`like-button ${thread.likedByUser ? "liked" : ""}`}
          onClick={handleLikeThread}
          disabled={!user}
          title={!user ? "Sign in to like" : ""}
        >
          {thread.likedByUser ? "❤️" : "🤍"} {thread.reactions.likes}
        </button>
        <span>💬 {thread.reactions.comments}</span>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {user ? (
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              required
            />
            <button type="submit">Post Comment</button>
          </form>
        ) : (
          <div style={{ marginBottom: 24, color: "#888" }}>
            <em>Sign in to post a comment.</em>
          </div>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <img
              className="avatar"
              src={comment.author.profilePicture}
              alt="avatar"
            />
            <div>
              <strong>{comment.author.displayName}</strong>
              <span className="meta"> • {formatDate(comment.createdAt)}</span>
              <p>{comment.body}</p>
              <button
                className={`like-button ${comment.likedByUser ? "liked" : ""}`}
                onClick={() => handleLikeComment(comment.id)}
                disabled={!user}
                title={!user ? "Sign in to like" : ""}
              >
                {comment.likedByUser ? "❤️" : "🤍"} {comment.reactions.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumDetails;
