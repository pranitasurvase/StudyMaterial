# Admin Dashboard Setup Guide

## ✅ What I've Done:

1. **Updated Database Configuration** - Connected to your PostgreSQL database `StudyMaterial`
2. **Added Admin Route** - Added `/admin` route to access the admin dashboard
3. **Admin Dashboard Ready** - Full-featured admin panel to add/edit/delete questions

## 📋 Steps to Complete Setup:

### Step 1: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

If you face timeout issues, try installing key packages individually:
```bash
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings psycopg2-binary python-dotenv
```

### Step 2: Initialize Database
```bash
python setup_db.py
```

This will:
- Create all necessary tables in your PostgreSQL database
- Add initial subjects (History, Geography, etc.)

### Step 3: Start Backend Server
```bash
python run.py
```

Backend will run on: `http://localhost:8000`

### Step 4: Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 5: Access Admin Dashboard
Open your browser and go to:
```
http://localhost:5173/admin
```

## 🎯 Using the Admin Dashboard:

### Adding Questions:
1. Select a subject from the left sidebar
2. Click "Add Question" button
3. Fill in the form:
   - **Subject**: Select from dropdown
   - **Bilingual**: Check if you want English + Marathi
   - **Question**: Enter question text
   - **Options**: Enter 4 options (select correct one with radio button)
   - **Explanation**: Add detailed explanation
   - **Difficulty**: Choose Easy/Medium/Hard
4. Click "Save"

### Editing Questions:
1. Click the edit icon (pencil) on any question
2. Modify the fields
3. Click "Save"

### Deleting Questions:
1. Click the delete icon (trash) on any question
2. Confirm deletion

## 📊 Database Structure:

Your PostgreSQL database `StudyMaterial` will have these tables:
- `subjects` - All subjects (History, Geography, etc.)
- `questions` - All MCQ questions with bilingual support

## 🔧 Configuration Files Updated:

1. **backend/.env** - Database URL updated to:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/StudyMaterial
   ```

2. **frontend/src/routes/AppRoutes.jsx** - Added admin route:
   ```javascript
   <Route path="/admin" element={<AdminDashboard />} />
   ```

## 🚀 Quick Start Commands:

```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python setup_db.py
python run.py

# Terminal 2 - Frontend
cd frontend
npm run dev

# Then open: http://localhost:5173/admin
```

## 💡 Tips:

1. **First Time Setup**: Run `setup_db.py` only once to create tables
2. **Adding Questions**: Use the admin dashboard instead of manually editing JS files
3. **Bilingual Support**: Check the "Bilingual" checkbox to add Marathi translations
4. **Database Backup**: Regularly backup your PostgreSQL database

## 🐛 Troubleshooting:

### Backend won't start:
- Check if PostgreSQL is running
- Verify database `StudyMaterial` exists in pgAdmin
- Check credentials in `backend/.env`

### Frontend can't connect:
- Make sure backend is running on port 8000
- Check browser console for errors
- Verify CORS settings in backend

### Questions not showing:
- Check if subjects are created (run `setup_db.py`)
- Verify database connection
- Check browser network tab for API errors

## 📝 Next Steps:

1. Start both servers
2. Go to http://localhost:5173/admin
3. Add your 10 questions about Modern India
4. Questions will be stored in PostgreSQL database
5. They'll automatically appear in the Practice Hub

---

**Note**: The admin dashboard provides a much better way to manage questions than manually editing JavaScript files. All questions are stored in the database and can be easily managed through the UI.
