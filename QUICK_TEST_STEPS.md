# 🧪 Quick Test Steps

## Your API Key:
```
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
```

## Steps to Test:

### 1. Frontend Start Karo (if not running):
```bash
cd frontend
npm run dev
```

### 2. Open Admin Dashboard:
```
http://localhost:5173/admin
```

### 3. Test API Key:
1. Top right mein API key paste karo
2. "Save Key" click karo
3. **"Test API" button click karo** ← Ye naya button hai!
4. Agar "API is working!" message aaye to sab sahi hai ✅

### 4. Add Question:
1. Left side se "Modern History" select karo
2. "Add Question" button click karo
3. Question aur options fill karo:
   ```
   Question: When was the University of Calcutta founded?
   Options:
   - 1860
   - 1874
   - 1854
   - 1857 (correct)
   ```
4. "Generate with AI" button click karo
5. Wait 5-10 seconds
6. Check console (F12) for any errors

## 🐛 If Not Working:

### Check Browser Console (F12):
- Press F12 in browser
- Go to "Console" tab
- Look for red errors
- Share the error message

### Common Issues:

1. **CORS Error**:
   - DeepSeek API might have CORS restrictions
   - Solution: We'll create a backend proxy

2. **API Key Invalid**:
   - Verify key is correct
   - Check if you have credits

3. **Network Error**:
   - Check internet connection
   - Try in incognito mode

## 💡 Alternative: Backend Proxy

If CORS error aaye, main backend mein proxy bana dunga:
- Frontend → Your Backend → DeepSeek API
- This will solve CORS issues

Let me know kya error aa raha hai! 🚀
