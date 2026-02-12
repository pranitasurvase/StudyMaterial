# 🤖 AI-Powered Admin Dashboard Guide

## ✨ Features:

Aap sirf **Question + Options** dalogi, baaki sab AI karega:
- ✅ Detailed Explanation (English)
- ✅ Marathi Translation (Question, Options, Explanation)
- ✅ Automatic bilingual support

## 🚀 Setup Steps:

### 1. DeepSeek API Key Lena:

1. Visit: https://platform.deepseek.com/
2. Sign up / Login
3. Go to API Keys section
4. Create new API key
5. Copy the key

**Note**: DeepSeek is FREE for limited usage! Perfect for testing.

### 2. Frontend Start Karo:

```bash
cd frontend
npm run dev
```

### 3. Admin Dashboard Open Karo:

```
http://localhost:5173/admin
```

## 📝 How to Use:

### Step 1: API Key Setup
1. Top right corner mein "DeepSeek API Key" field mein apni key paste karo
2. "Save Key" button click karo (ye browser mein save ho jayegi)

### Step 2: Subject Select Karo
- Left sidebar se subject select karo (e.g., "Modern History")

### Step 3: Add Question
1. "Add Question" button click karo
2. **Step 1** mein fill karo:
   - Question (English)
   - 4 Options (English)
   - Correct answer select karo (radio button)
   - Difficulty level select karo

### Step 4: AI Magic! ✨
1. "Generate Explanation & Marathi Translation with AI" button click karo
2. Wait karo 5-10 seconds
3. AI automatically fill karega:
   - Detailed explanation (English)
   - Question (Marathi)
   - All 4 options (Marathi)
   - Explanation (Marathi)

### Step 5: Review & Save
1. AI-generated content check karo
2. Agar kuch edit karna ho to kar sakte ho
3. "Save" button click karo
4. Done! ✅

## 💡 Example:

### You Enter:
```
Question: When was the University of Calcutta founded?
Options:
- 1860
- 1874
- 1854
- 1857 ✓
Difficulty: Medium
```

### AI Generates:
```
Explanation: The University of Calcutta was founded in 1857, making it one of the oldest modern universities in India. It was established following the recommendations of Sir Charles Wood's Education Despatch of 1854. The university was modeled after the University of London and initially functioned as an examining and affiliating body.

Question (MR): कलकत्ता विद्यापीठाची स्थापना कधी झाली?

Options (MR):
- १८६०
- १८७४
- १८५४
- १८५७ ✓

Explanation (MR): कलकत्ता विद्यापीठाची स्थापना १८५७ मध्ये झाली, ज्यामुळे ते भारतातील सर्वात जुन्या आधुनिक विद्यापीठांपैकी एक बनले...
```

## 🎯 Benefits:

1. **Time Saving**: Manual translation nahi karna padega
2. **Consistency**: AI ensures consistent quality
3. **Detailed Explanations**: AI provides comprehensive explanations
4. **Accurate Marathi**: Better than Google Translate
5. **Fast**: 10 seconds mein complete question ready!

## 🔧 Troubleshooting:

### API Key Error:
- Check if key is correct
- Make sure you have API credits
- Try regenerating the key

### AI Not Generating:
- Check internet connection
- Verify API key is saved
- Make sure question and all options are filled

### Translation Issues:
- You can manually edit AI-generated content
- AI learns from context, so more details = better results

## 💰 Cost:

DeepSeek API is **FREE** for:
- First 10M tokens (bahut zyada hai!)
- Perfect for your use case
- No credit card needed for trial

## 🎉 Ready to Use!

1. Backend running hai: ✅
2. Frontend start karo
3. Go to: http://localhost:5173/admin
4. Enter DeepSeek API key
5. Start adding questions!

Bas 2 steps:
1. Question + Options dalo
2. AI button click karo
3. Save karo

That's it! 🚀
