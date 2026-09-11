# BLOGNEXUS

### A Modern Full-Stack Blogging & Community Platform

BLOGNEXUS is a full-stack blogging and community platform designed to give users a modern space to create, publish, discover, and interact with stories.

The platform combines a responsive frontend, secure authentication, RESTful backend services, PostgreSQL database integration, and community engagement features into one complete application.

> **Create. Publish. Discover. Connect.**

---

## 🚀 Live Project

**Live Demo:** Coming Soon

**GitHub Repository:**  
https://github.com/abhinavreddy6342/BLOGNEXUS

---

## ✨ Features

### 🔐 Authentication

- User registration
- Secure login
- JWT-based authentication
- Persistent login sessions
- Protected user actions
- Logout functionality

### 👤 User Profiles

- Personal profile dashboard
- Editable username
- Editable biography
- Published story statistics
- Personal story collection
- Profile activity overview

### ✍️ Story Management

- Create and publish stories
- View individual stories
- Edit published stories
- Delete your own stories
- Organize stories by category
- Personal story management

### 🔎 Explore & Discovery

- Browse published stories
- Search stories by title and content
- Filter stories by category
- Featured stories
- Latest stories
- Category-based browsing

### ❤️ Community Interaction

- Like stories
- Remove likes
- Add comments
- Delete your own comments
- Bookmark stories
- Manage saved stories

### 🎨 User Experience

- Responsive interface
- Dark futuristic visual design
- Glass-style content cards
- Smooth page animations
- Interactive hover effects
- Mobile-friendly navigation
- Loading states
- Error handling
- Consistent visual system

---

# 🧠 Application Flow

```text
                    BLOGNEXUS
                        │
                        ▼
                User Registration
                        │
                        ▼
                      Login
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
         Explore                 Profile
            │                       │
            ▼                       ▼
       Read Stories           Your Stories
            │                       │
      ┌─────┼─────┐           ┌─────┴─────┐
      ▼     ▼     ▼           ▼           ▼
     Like Comment Bookmark   Edit        Delete


🏗️ System Architecture
┌──────────────────────────────────────────────┐
│                 BLOGNEXUS                    │
│                                              │
│              React Frontend                  │
│                                              │
│  Pages • Components • Routing • API Client  │
└──────────────────────┬───────────────────────┘
                       │
                       │ REST API
                       ▼
┌──────────────────────────────────────────────┐
│              FastAPI Backend                 │
│                                              │
│ Authentication • Posts • Users              │
│ Comments • Likes • Bookmarks • Categories   │
└──────────────────────┬───────────────────────┘
                       │
                       │ SQLAlchemy
                       ▼
┌──────────────────────────────────────────────┐
│                  PostgreSQL                  │
│                                              │
│ Users • Posts • Comments • Likes            │
│ Bookmarks • Categories                      │
└──────────────────────────────────────────────┘

🛠️ Technology Stack
Frontend
React
JavaScript
React Router
Tailwind CSS
Framer Motion
Axios
Lucide Icons
Backend
Python
FastAPI
SQLAlchemy
Pydantic
RESTful API
JWT Authentication
Passlib
bcrypt
Database
PostgreSQL
Development & Deployment
Git
GitHub
Docker
Render
Vercel / Netlify

📂 Project Structure

BLOGNEXUS/
│
├── backend/
│   │
│   ├── app/
│   │   ├── core/
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   └── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── bookmark.py
│   │   │   ├── category.py
│   │   │   ├── comment.py
│   │   │   ├── like.py
│   │   │   ├── post.py
│   │   │   └── user.py
│   │   │
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── bookmarks.py
│   │   │   ├── categories.py
│   │   │   ├── comments.py
│   │   │   ├── likes.py
│   │   │   ├── posts.py
│   │   │   └── users.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── bookmark.py
│   │   │   ├── category.py
│   │   │   ├── comment.py
│   │   │   ├── like.py
│   │   │   ├── post.py
│   │   │   └── user.py
│   │   │
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── PostCard.jsx
│       │   └── Snowfall.jsx
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── layouts/
│       │   └── MainLayout.jsx
│       │
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── Bookmarks.jsx
│       │   ├── Categories.jsx
│       │   ├── CreatePost.jsx
│       │   ├── EditPost.jsx
│       │   ├── Explore.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── MyPosts.jsx
│       │   ├── PostDetails.jsx
│       │   ├── Profile.jsx
│       │   └── Register.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── docker-compose.yml
├── .gitignore
└── README.md

🔑 Core Modules

Module	Responsibility
Authentication	Registration, login, and session management
Users	Profile management and user information
Posts	Story creation, retrieval, editing, and deletion
Categories	Story organization and filtering
Comments	Community discussion
Likes	Story engagement
Bookmarks	Saved story management
Explore	Search and content discovery

🔒 Security

BLOGNEXUS implements application-level security practices including:

JWT-based authentication
Password hashing
Protected API endpoints
Authenticated user actions
Ownership validation for story editing
Ownership validation for story deletion
Server-side request validation
Environment-based configuration
CORS configuration
