# 🚀 MPSC Tech - Complete Deployment Guide

## 📋 Overview

Your project has 2 parts that need to be deployed:
1. **Frontend** (React) → Netlify
2. **Backend** (FastAPI + Database) → Render.com

## 🎯 Deployment Options

### Option 1: Netlify + Render (Recommended - FREE)
- ✅ Frontend: Netlify (Free)
- ✅ Backend: Render.com (Free tier)
- ✅ Database: PostgreSQL on Render (Free)

### Option 2: Vercel (All-in-One)
- ✅ Frontend + Backend: Vercel (Free tier)
- ⚠️ Database: Need external (Supabase/Railway)

---

## 🔧 Option 1: Netlify + Render (Step by Step)

### Part A: Deploy Backend on Render.com

#### Step 1: Prepare Backend for Deployment

1. **Create `render.yaml` in project root:**

```yaml
services:
  - type: web
    name: mpsc-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: mpsc-db
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: PYTHON_VERSION
        value: 3.13.3

databases:
  - name: mpsc-db
    databaseName: mpsc_revision
    user: mpsc_user
```

2. **Update `backend/app/core/config.py`:**

```python
# Add this to ALLOWED_ORIGINS
ALLOWED_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-netlify-app.netlify.app",  # Add your Netlify URL
    "*"  # For testing only, remove in production
]
```

#### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Select:
   - **Environment:** Python
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `DATABASE_URL` (will be auto-filled from database)
   - `SECRET_KEY` (generate random string)
7. Click "Create Web Service"

#### Step 3: Create Database on Render

1. Click "New +" → "PostgreSQL"
2. Name: `mpsc-db`
3. Click "Create Database"
4. Copy the "Internal Database URL"
5. Go back to your web service
6. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: (paste the database URL)

#### Step 4: Import Data to Render Database

```bash
# On your local machine
cd backend

# Export your local data
python export_database.py

# Install PostgreSQL client (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql

# Connect to Render database and import
# (You'll get the connection details from Render dashboard)
psql <RENDER_DATABASE_URL>

# Then run import script pointing to Render DB
# Update DATABASE_URL in .env temporarily to Render URL
python import_database_backup.py
```

**Your Backend URL:** `https://mpsc-backend.onrender.com`

---

### Part B: Deploy Frontend on Netlify

#### Step 1: Update Frontend API URL

1. **Create `frontend/.env.production`:**

```env
VITE_API_URL=https://mpsc-backend.onrender.com/api/v1
```

2. **Update API calls to use environment variable:**

In `frontend/src/config/api.js` (create if doesn't exist):

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
```

Then update all API calls to use `API_BASE_URL`.

#### Step 2: Deploy on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub repository
5. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
6. Add Environment Variables:
   - `VITE_API_URL`: `https://mpsc-backend.onrender.com/api/v1`
7. Click "Deploy site"

**Your Frontend URL:** `https://your-app-name.netlify.app`

---

## 🔧 Option 2: Vercel (All-in-One)

### Step 1: Prepare for Vercel

1. **Create `vercel.json` in project root:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/app/main.py"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

2. **Deploy:**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Vercel will auto-detect and deploy

---

## 📊 Database Options for Production

### Option A: Render PostgreSQL (Free)
- ✅ Free tier available
- ✅ 90 days data retention
- ✅ Easy integration

### Option B: Supabase (Recommended)
- ✅ Free tier: 500MB database
- ✅ Built-in authentication
- ✅ Real-time features
- 🔗 [supabase.com](https://supabase.com)

### Option C: Railway
- ✅ Free $5 credit monthly
- ✅ PostgreSQL included
- 🔗 [railway.app](https://railway.app)

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at `https://your-backend.onrender.com/health`
- [ ] Frontend is accessible at `https://your-app.netlify.app`
- [ ] API calls from frontend to backend work
- [ ] Database has all questions imported
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Test on mobile and desktop

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Solution:** Add your Netlify URL to `ALLOWED_ORIGINS` in backend config

### Issue 2: Database Connection Failed
**Solution:** Check `DATABASE_URL` environment variable is correct

### Issue 3: 404 on API Routes
**Solution:** Ensure backend is running and URL is correct in frontend

### Issue 4: Slow First Load (Render)
**Solution:** Render free tier sleeps after 15 min inactivity. First request takes 30-60 seconds.

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Start)
- Netlify: FREE (100GB bandwidth)
- Render: FREE (750 hours/month)
- Database: FREE (Render PostgreSQL)
- **Total: ₹0/month** 🎉

### Paid Tier (For Production)
- Netlify Pro: $19/month
- Render Starter: $7/month
- Database: Included
- **Total: ~₹2,000/month**

---

## 📞 Need Help?

If you face any issues during deployment:
1. Check Render/Netlify logs
2. Verify environment variables
3. Test API endpoints manually
4. Check CORS configuration

---

## 🎯 Quick Deploy Commands

```bash
# 1. Export database
cd backend
python export_database.py

# 2. Commit and push to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main

# 3. Deploy backend on Render (via dashboard)
# 4. Deploy frontend on Netlify (via dashboard)
# 5. Import database to production
python import_database_backup.py
```

---

**🎊 Congratulations! Your app is now live and accessible worldwide!**
