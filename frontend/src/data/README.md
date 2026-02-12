# Practice Hub Data Structure

This folder contains all MCQ and Descriptive questions for MPSC subjects.

## Folder Structure

```
data/
├── mcqs/                    # MCQ Questions
│   ├── history.js
│   ├── geography.js
│   ├── polity.js
│   ├── economy.js
│   ├── science.js
│   ├── environment.js
│   ├── current-affairs.js
│   └── csat.js
│
├── descriptive/             # Descriptive Questions
│   ├── history.js
│   ├── geography.js
│   ├── polity.js
│   ├── economy.js
│   ├── science.js
│   ├── environment.js
│   ├── current-affairs.js
│   └── csat.js
│
└── index.js                 # Central export file
```

## How to Add Questions

### Adding MCQ Questions

Edit the respective subject file in `mcqs/` folder:

```javascript
export const historyMCQs = [
  {
    id: 1,
    question: "Your question here?",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correctAnswer: 0,  // Index of correct option (0-3)
    explanation: "Detailed explanation of the answer",
    difficulty: "Easy",  // Easy, Medium, Hard
    topic: "Topic Name",
    marks: 2
  },
  // Add more questions...
]
```

### Adding Descriptive Questions

Edit the respective subject file in `descriptive/` folder:

```javascript
export const historyDescriptive = [
  {
    id: 1,
    question: "Your descriptive question here?",
    marks: 15,
    wordLimit: 250,
    timeLimit: 15,  // in minutes
    keyPoints: [
      "Key point 1 to cover",
      "Key point 2 to cover",
      "Key point 3 to cover"
    ],
    difficulty: "Medium",
    topic: "Topic Name",
    sampleAnswer: "Optional sample answer for reference"
  },
  // Add more questions...
]
```

## Subjects Available

1. **History** - Ancient, Medieval, Modern India & Maharashtra History
2. **Geography** - Physical, Indian, Maharashtra Geography
3. **Polity** - Constitution, Governance, Rights
4. **Economy** - Indian Economy, Budget, Taxation
5. **Science** - Physics, Chemistry, Biology
6. **Environment** - Ecology, Climate Change, Conservation
7. **Current Affairs** - National & International Events
8. **CSAT** - Comprehension, Logical Reasoning, Numeracy

## Tips for Adding Quality Questions

### For MCQs:
- ✅ Keep questions clear and concise
- ✅ Ensure only one correct answer
- ✅ Provide detailed explanations
- ✅ Include difficulty level
- ✅ Tag with specific topics
- ✅ Add marks (usually 2 for Prelims)

### For Descriptive:
- ✅ Frame questions that test analytical ability
- ✅ Provide comprehensive key points
- ✅ Set appropriate word limits (150-300 words)
- ✅ Mention time limits (10-20 minutes)
- ✅ Include marks (10-20 for Mains)
- ✅ Optionally add sample answers

## Question Difficulty Levels

- **Easy**: Basic factual questions, direct recall
- **Medium**: Requires understanding and application
- **Hard**: Analytical, multi-concept questions

## Updating Questions

1. Open the relevant subject file
2. Add your question object to the array
3. Ensure unique IDs
4. Test in the Practice Hub
5. Questions will automatically appear in the UI

## Example Usage in Code

```javascript
import { mcqData, descriptiveData } from './data'

// Get History MCQs
const historyQuestions = mcqData['History']

// Get Geography Descriptive
const geoDescriptive = descriptiveData['Geography']
```

## Notes

- Questions are loaded dynamically in Practice Hub
- Each subject can have unlimited questions
- Questions are displayed one at a time
- Navigation between questions is automatic
- Progress tracking coming soon

---

**Happy Question Adding! 📚**
