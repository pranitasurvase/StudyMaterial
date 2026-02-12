# Admin Dashboard Setup Guide

## 🎯 Overview
Admin dashboard banaya hai jahan se aap directly questions add/edit/delete kar sakte ho. Questions PostgreSQL database mein store honge aur frontend automatically fetch karega.

## 📋 Prerequisites

1. **PostgreSQL Install karo**
   - Windows: https://www.postgresql.org/download/windows/
   - Download karke install karo
   - Installation ke time password set karo (yaad rakhna!)

2. **Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

## 🚀 Setup Steps

### Step 1: PostgreSQL Database Create karo

1. PostgreSQL open karo (pgAdmin ya command line)
2. Naya database banao:
   ```sql
   CREATE DATABASE mpsc_revision;
   ```

### Step 2: Backend Configuration

1. `backend/.env` file update karo:
   ```env
   # PostgreSQL connection string
   DATABASE_URL=postgresql://postgres:your_password@localhost/mpsc_revision
   
   # Baaki settings same rahenge
   SECRET_KEY=your-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

   **Important**: `your_password` ko apne PostgreSQL password se replace karo!

### Step 3: Database Tables Create karo

```bash
cd backend
python init_db.py
```

Ye command:
- Saare tables create karegi (subjects, questions)
- Initial subjects add karegi (History, Geography, etc.)

### Step 4: Backend Server Start karo

```bash
cd backend
python run.py
```

Server start hoga on: http://localhost:8000

API docs dekho: http://localhost:8000/docs

### Step 5: Frontend Update karo

Frontend mein admin route add karo. `frontend/src/App.jsx` mein:

```jsx
import AdminDashboard from './pages/AdminDashboard'

// Routes mein add karo:
<Route path="/admin" element={<AdminDashboard />} />
```

### Step 6: Frontend Start karo

```bash
cd frontend
npm run dev
```

## 🎨 Admin Dashboard Use karo

1. Browser mein jao: http://localhost:5173/admin
2. Left sidebar se subject select karo
3. "Add Question" button click karo
4. Question details bharo:
   - Subject select karo
   - Bilingual checkbox check karo (agar English + Marathi chahiye)
   - Question likho (English aur Marathi)
   - 4 options add karo
   - Correct answer select karo (radio button se)
   - Explanation likho
   - Difficulty select karo
5. "Save" button click karo

## 📊 Existing Questions Import karo (Optional)

Agar aapke paas already questions hain JS files mein:

1. `backend/migrate_questions.py` file open karo
2. Apne questions ko Python dict format mein convert karo
3. Script run karo:
   ```bash
   python migrate_questions.py
   ```

## 🔄 Frontend ko Backend se Connect karo

`frontend/src/pages/PracticeHub.jsx` mein update karo:

```jsx
import { api } from '../services/api'

// Component mein:
const [questions, setQuestions] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function loadQuestions() {
    try {
      const data = await api.getQuestions(selectedSubjectId)
      setQuestions(data.questions)
    } catch (error) {
      console.error('Error loading questions:', error)
    } finally {
      setLoading(false)
    }
  }
  loadQuestions()
}, [selectedSubjectId])
```

## 🧪 Test karo

1. Admin dashboard mein ek question add karo
2. PracticeHub page pe jao
3. Wo subject select karo
4. Naya question dikhna chahiye!

## 📝 API Endpoints

Backend ye endpoints provide karta hai:

- `GET /api/v1/questions/subjects` - Saare subjects
- `GET /api/v1/questions/questions` - Saare questions
- `GET /api/v1/questions/questions?subject_id=1` - Specific subject ke questions
- `POST /api/v1/questions/questions` - Naya question add karo
- `PUT /api/v1/questions/questions/{id}` - Question update karo
- `DELETE /api/v1/questions/questions/{id}` - Question delete karo

## 🐛 Troubleshooting

### Database connection error
- Check karo PostgreSQL running hai
- `.env` file mein password sahi hai
- Database name sahi hai

### CORS error
- Backend `.env` mein `ALLOWED_ORIGINS` check karo
- Frontend URL add karo

### Questions nahi dikh rahe
- Browser console check karo
- Backend logs check karo
- API endpoint test karo: http://localhost:8000/docs

## 🎉 Done!

Ab aap:
- ✅ Admin dashboard se questions add kar sakte ho
- ✅ Questions database mein store honge
- ✅ Frontend automatically fetch karega
- ✅ Code edit karne ki zarurat nahi!
