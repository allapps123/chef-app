// File: src/pages/StartThreadPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./startThread.css";

interface Category {
  id: string;
  name: string;
}

const forumCategories: Category[] = [
  { id: "1", name: "Ingredients" },
  { id: "2", name: "Cooking" },
  { id: "3", name: "Healthy Meals" },
  { id: "4", name: "Food Processing" },
  { id: "5", name: "Others" },
];

const StartThreadPage: React.FC = () => {
  const VITE_DEV_URL = import.meta.env.VITE_DEV_URL || "http://localhost:8888/.netlify/functions/server";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("forum");

  const [selectedForum, setSelectedForum] = useState(preselected || "1");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/sign-in");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in.");
      navigate("/sign-in");
      return;
    }

    const userId = user?.uid;
    const userEmail = user?.email || "";
    const userName =
      user?.displayName || userEmail !== ""
        ? userEmail.substring(0, userEmail.indexOf("@"))
        : "Anonymous";
    const userAvatar = user?.photoURL || null;

    try {
      const token = await user.getIdToken();

      await axios.post(
        `${VITE_DEV_URL}/forum/threads`,
        {
          category_id: parseInt(selectedForum),
          user_id: userId,
          user_name: userName,
          user_avatar: userAvatar,
          title,
          content: body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Thread successfully posted!");
      navigate("/forum");
    } catch (err) {
      console.error("❌ Failed to post thread:", err);
      alert("Failed to post thread. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-thread-container">
      <h1>Start a New Thread</h1>
      <form onSubmit={handleSubmit} className="thread-form">
        <label>
          Forum Category:
          <select
            value={selectedForum}
            onChange={(e) => setSelectedForum(e.target.value)}
          >
            {forumCategories.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Body:
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Thread"}
        </button>
      </form>
    </div>
  );
};

export default StartThreadPage;
