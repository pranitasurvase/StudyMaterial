# MPSC Revision AI - Complete Project Structure

## 📁 Project Overview

```
MPSCTech/
├── frontend/          # React + Vite Frontend
├── backend/           # FastAPI Backend
└── mpsc-revision-ai/  # Original Next.js project (for reference)
```

---

## 🎨 Frontend Structure (React + Vite)

```
frontend/
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
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Progress.jsx
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
├── postcss.config.js
└── README.md
```

### Frontend Tech Stack
- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS
- 🧭 React Router v6
- 🎯 Lucide Icons
- 📦 Class Variance Authority

---

## 🔧 Backend Structure (FastAPI)

```
backend/
├── app/
│   ├── main.py            # Entry point
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── routes/
│   │       │   ├── auth.py       # Authentication
│   │       │   ├── user.py       # User management
│   │       │   ├── analyze.py    # Content analysis
│   │       │   └── syllabus.py   # Syllabus data
│   │       └── api_router.py
│   │
│   ├── core/
│   │   ├── config.py      # Environment settings
│   │   └── security.py    # JWT & password hashing
│   │
│   ├── models/            # SQLAlchemy models
│   │   └── user.py
│   │
│   ├── schemas/           # Pydantic schemas
│   │   └── user.py
│   │
│   ├── services/          # Business logic
│   │   └── user_service.py
│   │
│   ├── db/
│   │   ├── session.py     # Database session
│   │   └── base.py        # Base model
│   │
│   ├── utils/
│   │   └── helpers.py
│   │
│   └── tests/
│       └── test_users.py
│
├── requirements.txt
├── .env
├── .gitignore
├── run.py
└── README.md
```

### Backend Tech Stack
- 🚀 FastAPI
- 🗄️ SQLAlchemy ORM
- ✅ Pydantic validation
- 🔐 JWT Authentication
- 🔒 Bcrypt password hashing
- 🧪 Pytest for testing
- 📊 SQLite (default) / PostgreSQL

---

## 🚀 Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

Backend runs on: http://localhost:8000
API Docs: http://localhost:8000/docs

---

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

### Users
- `GET /api/v1/users/` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### Content Analysis
- `POST /api/v1/analyze/` - Analyze study content
- `POST /api/v1/analyze/upload` - Upload and analyze file

### Syllabus
- `GET /api/v1/syllabus/` - Get syllabus data
- `GET /api/v1/syllabus/topics/{id}` - Get topic details

---

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./mpsc_revision.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your-openai-key (optional)
```

---

## ✨ Features

### Implemented
✅ User authentication (register/login)
✅ JWT token-based auth
✅ Password hashing
✅ User management CRUD
✅ Content analysis API structure
✅ Syllabus management
✅ Responsive UI
✅ React Router navigation
✅ Tailwind CSS styling
✅ API documentation (Swagger)

### Coming Soon
🔄 AI-powered content analysis
🔄 File upload processing (PDF, images)
🔄 Question prediction ML model
🔄 Progress tracking
🔄 Study analytics
🔄 PYQ database integration

---

## 📝 Notes

- Frontend uses React Router for navigation (converted from Next.js App Router)
- Backend uses FastAPI with async support
- Database: SQLite for development, easily switchable to PostgreSQL
- All components are modular and reusable
- API follows RESTful conventions
- CORS configured for local development

---

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run test  # (setup required)
```

### Backend
```bash
cd backend
pytest
```

---

## 📚 Documentation

- Frontend README: `frontend/README.md`
- Backend README: `backend/README.md`
- API Docs: http://localhost:8000/docs (when running)

---

**Happy Coding! 🎉**
