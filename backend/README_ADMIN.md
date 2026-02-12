# Admin Dashboard - Quick Start

## Setup (5 minutes)

### 1. Install PostgreSQL
Download: https://www.postgresql.org/download/

### 2. Create Database
```sql
CREATE DATABASE mpsc_revision;
```

### 3. Update .env
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/mpsc_revision
```

### 4. Initialize Database
```bash
pip install -r requirements.txt
python init_db.py
```

### 5. Start Backend
```bash
python run.py
```

Backend running on: http://localhost:8000

## Admin Dashboard Access

Frontend URL: http://localhost:5173/admin

## Features

✅ Add/Edit/Delete Questions
✅ Bilingual Support (English + Marathi)
✅ Subject Management
✅ Real-time Updates
✅ No Code Changes Needed

## API Documentation

Interactive API docs: http://localhost:8000/docs

## Database Schema

### Subjects Table
- id, name, name_mr, slug, icon
- Created automatically with 11 subjects

### Questions Table
- id, subject_id, question, question_mr
- options (JSON), options_mr (JSON)
- correct_answer, explanation, explanation_mr
- difficulty, is_bilingual, is_active
- timestamps

## Next Steps

1. Start backend server
2. Open admin dashboard
3. Select subject
4. Add questions
5. Questions automatically appear in PracticeHub!
