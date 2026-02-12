# MPSC Revision AI - Backend

FastAPI backend for MPSC exam preparation platform with AI-powered content analysis.

## Project Structure

```
backend/
├── app/
│   ├── main.py            # Entry point
│   ├── api/
│   │   └── v1/
│   │       ├── routes/
│   │       │   ├── auth.py       # Authentication routes
│   │       │   ├── user.py       # User management
│   │       │   ├── analyze.py    # Content analysis
│   │       │   └── syllabus.py   # Syllabus management
│   │       └── api_router.py
│   ├── core/
│   │   ├── config.py      # Environment settings
│   │   └── security.py    # JWT & password hashing
│   ├── models/            # SQLAlchemy models
│   │   └── user.py
│   ├── schemas/           # Pydantic schemas
│   │   └── user.py
│   ├── services/          # Business logic
│   │   └── user_service.py
│   ├── db/
│   │   ├── session.py     # Database session
│   │   └── base.py        # Base model
│   ├── utils/
│   │   └── helpers.py
│   └── tests/
│       └── test_users.py
├── requirements.txt
├── .env
└── run.py
```

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Edit `.env` file with your settings:
- Database URL
- Secret key for JWT
- OpenAI API key (optional)

### 4. Run the Application

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

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

## Testing

```bash
pytest
```

## Features

- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ SQLAlchemy ORM
- ✅ Pydantic validation
- ✅ CORS middleware
- ✅ API documentation
- ✅ Modular architecture
- 🔄 AI content analysis (coming soon)
- 🔄 File upload processing (coming soon)

## Tech Stack

- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- SQLite (default) / PostgreSQL
- Python 3.8+
