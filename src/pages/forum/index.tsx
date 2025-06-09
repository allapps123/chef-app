import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ThreadCard from "../../components/forum/ThreadCard/ThreadCard";
import ForumSidebar from "../../components/forum/ForumSidebar/ForumSidebar";
import ForumBanner from "../../components/forum/ForumBanner/ForumBanner";
import defaultAvatar from "../../assets/default_avatar.png";
import "./forum.css";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Category {
  id: string;
  name: string;
  description: string;
}

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

const Forum: React.FC = () => {
  const VITE_DEV_URL = import.meta.env.VITE_DEV_URL || "http://localhost:8888/.netlify/functions/server";
  const categories: Category[] = [
    {
      id: "1",
      name: "Ingredients",
      description: "Discuss herbs, spices, and pantry staples.",
    },
    {
      id: "2",
      name: "Cooking",
      description: "Share techniques, tips, and cooking styles.",
    },
    {
      id: "3",
      name: "Healthy Meals",
      description: "Talk about nutritious recipes and ingredients.",
    },
    {
      id: "4",
      name: "Food Processing",
      description: "Preservation, fermentation, and preparation methods.",
    },
    {
      id: "5",
      name: "Others",
      description: "General food discussions and fun ideas.",
    },
  ];

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userChecked, setUserChecked] = useState<boolean>(false);
  console.log(userChecked);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      let user_id = null;
      let token = null;

      if (firebaseUser) {
        user_id = firebaseUser.uid;
        token = await firebaseUser.getIdToken();
      }
      try {
        const res = await axios.get(`/.netlify/functions/server/forum/threads`, {
          params: { user_id },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("res", res.data);

        const formatted = res.data.map((t: any) => ({
          id: t.id.toString(),
          forumId: t.category_id.toString(),
          title: t.title,
          body: t.content,
          author: {
            displayName: t.user_name || "Anonymous",
            profilePicture: t.user_avatar || defaultAvatar,
          },
          createdAt: t.created_at,
          reactions: {
            likes: parseInt(t.like_count) || 0,
            comments: parseInt(t.replies_count) || 0,
          },
          likedByUser: !!t.liked_by_user,
        }));

        console.log(formatted);

        setThreads(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch threads:", err);
      } finally {
        setUserChecked(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => thread.forumId === activeCategory.id);
  }, [threads, activeCategory]);

  return (
    <div className="forum-layout">
      <ForumSidebar
        categories={categories}
        activeCategory={activeCategory.id}
        onSelectCategory={(id: string) => {
          const selected = categories.find((c) => c.id === id);
          if (selected) setActiveCategory(selected);
        }}
      />

      <div className="content pt-16 sm:pt-20 md:pt-24">
        <ForumBanner forum={activeCategory} />
        <h1 className="page-title">Threads</h1>
        <div className="thread-list">
          {filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
