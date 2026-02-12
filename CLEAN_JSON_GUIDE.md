# 🔧 JSON Cleaning Guide

## ❌ Problem: 
Aapke JSON mein syntax errors hain:
1. Trailing commas (last item ke baad comma)
2. `id` field (backend ko nahi chahiye)

## ✅ Solution:

### Option 1: Clean JSON Manually
Aapke JSON se ye remove karo:
1. Har object ke `id` field
2. Last item ke baad ka comma
3. Array ke end mein extra comma

### Option 2: Use This Tool

Paste your JSON here and it will clean it:
https://jsonlint.com/

### Option 3: Let Me Clean It For You

Aapka JSON:
```json
[
  {
    id: 242,  // ❌ Remove this line
    question: {...},
    ...
  },  // ❌ Last item ke baad comma nahi hona chahiye
]
```

Should be:
```json
[
  {
    question: {...},
    ...
  }
]
```

## 🚀 Quick Fix:

1. Aapka JSON copy karo
2. Is website pe paste karo: https://jsonformatter.org/json-parser
3. "Format/Beautify" click karo
4. Cleaned JSON copy karo
5. Import page pe paste karo

## 💡 Or Use This Format:

```json
[
  {
    "question": {
      "en": "Your question here",
      "mr": "मराठी प्रश्न"
    },
    "options": {
      "en": ["A", "B", "C", "D"],
      "mr": ["अ", "ब", "क", "ड"]
    },
    "correctAnswer": 0,
    "explanation": {
      "en": "Explanation",
      "mr": "स्पष्टीकरण"
    },
    "difficulty": "Medium",
    "topic": {
      "en": "Modern Indian History"
    }
  }
]
```

**Note**: 
- No `id` field
- No trailing commas
- Proper quotes around keys
- Last item has NO comma

Try again! 🎯
