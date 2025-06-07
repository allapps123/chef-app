// File: src/components/ForumSidebar.tsx
import React from 'react';
import './ForumSidebar.css';

interface Category {
  id: string;
  name: string;
}

interface ForumSidebarProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

const ForumSidebar: React.FC<ForumSidebarProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <aside className="sidebar">
      <h2>Forums</h2>
      <ul>
        {categories.map((forum) => (
          <li
            key={forum.id}
            className={forum.id === activeCategory ? 'selected' : ''}
            onClick={() => onSelectCategory(forum.id)}
          >
            <span className="forum-name">{forum.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ForumSidebar;
