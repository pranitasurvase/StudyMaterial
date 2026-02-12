# Practice Hub - Testing Guide

## ✅ Fixed Issues

1. **Import Error Fixed**: Changed from `require()` to ES6 `import`
2. **Data Loading**: Now properly imports mcqData and descriptiveData
3. **Component Structure**: All components properly defined

## 🧪 How to Test

### Step 1: Start the Development Server

```bash
cd frontend
npm run dev
```

### Step 2: Open Browser

Navigate to: `http://localhost:5173/practice-hub`

### Step 3: Test Features

#### Test Sidebar Navigation:
- ✅ Click on "History" - should show History questions
- ✅ Click on "Geography" - should show Geography questions
- ✅ Click on other subjects - should update content

#### Test Question Types:
- ✅ Click "MCQ Questions" button - should show MCQ interface
- ✅ Click "Descriptive Questions" button - should show text area

#### Test MCQ Functionality:
1. Select "History" from sidebar
2. Click "MCQ Questions"
3. You should see 10 questions available
4. Click on an option (A, B, C, or D)
5. Click "Submit Answer"
6. Should show ✅ or ❌ with explanation
7. Click "Next" to go to next question
8. Click "Previous" to go back

#### Test Descriptive Functionality:
1. Select "History" from sidebar
2. Click "Descriptive Questions"
3. You should see 5 questions available
4. Type in the text area
5. Word counter should update
6. Click "Next" to go to next question

## 🐛 If Page is Still Blank

### Check Browser Console:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for any errors

### Common Issues:

#### Issue 1: Module Not Found
**Error**: `Cannot find module './mcqs/history'`

**Solution**: Make sure all data files exist:
```bash
ls frontend/src/data/mcqs/
ls frontend/src/data/descriptive/
```

#### Issue 2: Import Error
**Error**: `Unexpected token 'export'`

**Solution**: Check that all data files use `export default`:
```javascript
export const historyMCQs = [...]
export default historyMCQs
```

#### Issue 3: Blank Page with No Errors
**Solution**: Check if Navbar component is working:
- Try visiting `/upload` or `/dashboard`
- If those work, issue is in PracticeHub component

### Quick Debug Steps:

1. **Check if data is loading:**
```javascript
// Add this temporarily in PracticeHub.jsx
console.log('MCQ Data:', mcqData)
console.log('Descriptive Data:', descriptiveData)
```

2. **Check if component is rendering:**
```javascript
// Add this in PracticeHub component
console.log('PracticeHub rendered')
console.log('Selected Subject:', selectedSubject)
```

3. **Check browser network tab:**
- Look for any failed requests
- Check if all JS files are loading

## 📊 Expected Behavior

### On Page Load:
- ✅ Navbar should appear at top
- ✅ "Practice Hub" heading visible
- ✅ 3 stat cards showing (Questions Attempted, Time Spent, Accuracy)
- ✅ Sidebar with 8 subjects visible
- ✅ "History" selected by default
- ✅ "MCQ Questions" selected by default
- ✅ First History MCQ question displayed

### Available Questions:
- **History MCQs**: 10 questions
- **Geography MCQs**: 10 questions
- **Other MCQs**: 2-3 questions each
- **History Descriptive**: 5 questions
- **Geography Descriptive**: 2 questions
- **Other Descriptive**: 1 question each

## 🔧 Manual Verification

### Verify Data Files Exist:
```bash
# Check MCQ files
cat frontend/src/data/mcqs/history.js
cat frontend/src/data/mcqs/geography.js

# Check Descriptive files
cat frontend/src/data/descriptive/history.js
cat frontend/src/data/descriptive/geography.js

# Check index file
cat frontend/src/data/index.js
```

### Verify Imports:
```bash
# Check PracticeHub imports
grep "import.*data" frontend/src/pages/PracticeHub.jsx
```

## 📸 Screenshots to Verify

You should see:
1. **Header**: "Practice Hub" with description
2. **Stats**: 3 cards with icons
3. **Sidebar**: 8 subjects with emojis
4. **Main Area**: Question type selector (MCQ/Descriptive)
5. **Question Display**: Question with options or text area

## 🆘 Still Having Issues?

### Check These Files:
1. `frontend/src/pages/PracticeHub.jsx` - Main component
2. `frontend/src/data/index.js` - Data exports
3. `frontend/src/data/mcqs/history.js` - Sample MCQ data
4. `frontend/src/routes/AppRoutes.jsx` - Route configuration
5. `frontend/src/components/Navbar.jsx` - Navigation

### Run Diagnostics:
```bash
cd frontend
npm run build
```

If build succeeds, the code is valid. If it fails, check the error message.

---

**If everything is correct, you should see a beautiful Practice Hub with working questions! 🎉**
