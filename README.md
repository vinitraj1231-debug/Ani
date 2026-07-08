
---

## 20. `README.md` — Full Project Documentation

````markdown
# 🎬 AniVerse — Premium Anime Streaming Platform

A production-ready, app-like anime streaming frontend with advanced admin panel, built with HTML, CSS, JavaScript, and Python Flask backend.

## ✨ Features

### Frontend
- **App-like SPA** with hash-based routing
- **Premium dark theme** with glassmorphism and gradient accents
- **Fixed bottom navigation** (Home, Explore, Trending, Saved, Downloads, Profile)
- **Sticky header** with search, notifications, theme toggle, profile
- **Anime cards** with fixed action buttons (Watch, Save, Share)
- **Hero carousel** with spotlight cards
- **Continue watching** with progress indicators
- **Search** with instant suggestions
- **Watch page** with episode sidebar and sticky player controls
- **Auto-play next episode** UI
- **Save/bookmark system** with localStorage persistence
- **Download management** for offline viewing
- **Profile & settings** with theme and luxury mode toggles
- **Skeleton loading states**
- **Empty state designs**
- **Toast notifications**
- **Onboarding flow** for first-time users
- **Luxury mode** with gold accents
- **Fully responsive** (mobile, tablet, desktop)

### Admin Panel
- **Secure login** with credentials: `rajpapa` / `28@RajPapa`
- **IP-based brute force protection** — 3 failed attempts → 24h block
- **Dashboard** with stats and charts
- **Anime management** (CRUD operations)
- **Episode management**
- **User management**
- **Analytics** with genre performance
- **Security panel** with blocked IPs and login activity
- **Settings** with password change and security config

### Backend (Python Flask)
- RESTful API with CORS support
- Session-based authentication
- IP tracking and blocking system
- Persistent attempt logging
- Configurable block duration

## 🚀 Quick Start

### Frontend
```bash
# Just open index.html in a browser, or use a local server:
python -m http.server 5500
# Then visit http://localhost:5500
