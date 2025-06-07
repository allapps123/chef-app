-- Drop tables in reverse order of dependencies to avoid foreign key conflicts
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS replies;
DROP TABLE IF EXISTS threads;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Table: users
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY, -- Firebase UID
  name TEXT NOT NULL,
  avatar TEXT
);

-- Table: categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert default categories
INSERT INTO categories (name)
VALUES 
  ('Ingredients'),
  ('Cooking'),
  ('Healthy Meals'),
  ('Food Processing'),
  ('Others');

-- Table: threads
CREATE TABLE threads (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: replies
CREATE TABLE replies (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: likes (can reference either a thread or a reply, not both)
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  thread_id INTEGER REFERENCES threads(id) ON DELETE CASCADE,
  reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (thread_id IS NOT NULL AND reply_id IS NULL) OR
    (thread_id IS NULL AND reply_id IS NOT NULL)
  ),
  UNIQUE(thread_id, user_id),
  UNIQUE(reply_id, user_id)
);
