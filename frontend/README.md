# MPSC Revision AI

A React + Vite application for MPSC exam preparation with AI-powered content analysis.

## Project Structure

```
MPSC-Tech/
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── assets/            # Images, icons, fonts
│   │   ├── images/
│   │   └── styles/
│   │
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # UI library components
│   │   ├── Button.jsx
│   │   ├── Navbar.jsx
│   │   └── Loader.jsx
│   │
│   ├── pages/             # Page-level components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   └── Syllabus.jsx
│   │
│   ├── services/          # API calls
│   │   └── api.js
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.js
│   │
│   ├── context/           # Context API / global state
│   │   └── AuthContext.jsx
│   │
│   ├── utils/             # Helper functions
│   │   ├── constants.js
│   │   └── cn.js
│   │
│   ├── routes/            # App routing
│   │   └── AppRoutes.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── .env
├── .gitignore
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Installation

```bash
cd MPSC-Tech
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

- 📚 Upload and analyze study materials
- 🎯 AI-powered question prediction
- 📊 Track syllabus progress
- 🔐 User authentication
- 📱 Responsive design
- ⚡ Fast with Vite

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide Icons
