import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1/questions';

export default function AdminBulkImport() {
  const [activeTab, setActiveTab] = useState('text') // 'json' or 'text'
  const [jsonInput, setJsonInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(2); // Default: Modern History
  const [subjectMapping, setSubjectMapping] = useState({
    'Modern Indian History': 2,
    'History': 1,
    'Ancient History': 3,
    'Medieval History': 4,
    'Geography': 5,
    'Polity': 6,
    'Economy': 7,
    'Science': 8,
    'Environment': 9,
    'Current Affairs': 10,
    'CSAT': 11,
    // Additional mappings for common variations
    'Education History': 2,
    'Literature': 2,
    'Press and Media': 2,
    'Social Reform Movements': 2,
    'Philosophy': 2,
    'Economic History': 2,
    'Constitutional History': 2,
    'Political History': 2,
    // Geography variations
    'Physical Geography': 5,
    'Human Geography': 5,
    'Indian Geography': 5,
    'World Geography': 5,
    'Economic Geography': 5,
    // Polity variations
    'Indian Polity': 6,
    'Constitution': 6,
    'Governance': 6,
    // Economy variations
    'Indian Economy': 7,
    'Economic Development': 7,
    // Science variations
    'General Science': 8,
    'Physics': 8,
    'Chemistry': 8,
    'Biology': 8,
    // Environment variations
    'Ecology': 9,
    'Environmental Science': 9,
    // Current Affairs variations
    'National Affairs': 10,
    'International Affairs': 10
  });

  const convertToBackendFormat = (question) => {
    // Get subject ID from topic with better matching
    const topicText = (question.topic?.en || question.topic || '').toLowerCase();
    const questionText = (question.question?.en || question.question || '').toLowerCase();
    
    // Combine topic and question text for better detection
    const combinedText = `${topicText} ${questionText}`;
    
    let subjectId = selectedSubject || 2; // Default to selected or Modern History
    
    // Check for subject keywords in topic AND question text (priority order)
    // Ancient History - check first
    if (combinedText.includes('ancient') || 
        combinedText.includes('maurya') || 
        combinedText.includes('gupta') || 
        combinedText.includes('harappa') || 
        combinedText.includes('indus valley') ||
        combinedText.includes('vedic') ||
        combinedText.includes('ashoka') ||
        combinedText.includes('chandragupta') ||
        combinedText.includes('buddha') ||
        combinedText.includes('mahavira') ||
        combinedText.includes('jainism') ||
        combinedText.includes('buddhism') ||
        topicText.includes('प्राचीन')) {
      subjectId = 3; // Ancient History
    } 
    // Medieval History
    else if (combinedText.includes('medieval') || 
             combinedText.includes('mughal') || 
             combinedText.includes('sultanate') ||
             combinedText.includes('akbar') ||
             combinedText.includes('aurangzeb') ||
             topicText.includes('मध्ययुगीन')) {
      subjectId = 4; // Medieval History
    } 
    // Modern History
    else if (combinedText.includes('modern') || 
             combinedText.includes('british') || 
             combinedText.includes('freedom') || 
             combinedText.includes('gandhi') ||
             combinedText.includes('independence') ||
             combinedText.includes('1857') ||
             topicText.includes('आधुनिक')) {
      subjectId = 2; // Modern History
    } 
    // Geography
    else if (combinedText.includes('geography') || 
             combinedText.includes('physical') || 
             combinedText.includes('climate') ||
             topicText.includes('भूगोल')) {
      subjectId = 5; // Geography
    } 
    // Polity
    else if (combinedText.includes('polity') || 
             combinedText.includes('constitution') || 
             combinedText.includes('governance') ||
             topicText.includes('राज्यशास्त्र')) {
      subjectId = 6; // Polity
    } 
    // Economy
    else if (combinedText.includes('economy') || 
             combinedText.includes('economic') ||
             topicText.includes('अर्थशास्त्र')) {
      subjectId = 7; // Economy
    } 
    // Science
    else if (combinedText.includes('science') || 
             combinedText.includes('physics') || 
             combinedText.includes('chemistry') || 
             combinedText.includes('biology') ||
             topicText.includes('विज्ञान')) {
      subjectId = 8; // Science
    } 
    // Environment
    else if (combinedText.includes('environment') || 
             combinedText.includes('ecology') ||
             topicText.includes('पर्यावरण')) {
      subjectId = 9; // Environment
    } 
    // Current Affairs
    else if (combinedText.includes('current affairs') || 
             combinedText.includes('national') || 
             combinedText.includes('international') ||
             topicText.includes('चालू घडामोडी')) {
      subjectId = 10; // Current Affairs
    } 
    // CSAT
    else if (combinedText.includes('csat') || 
             combinedText.includes('aptitude') ||
             topicText.includes('सीसॅट')) {
      subjectId = 11; // CSAT
    } 
    // General History (fallback)
    else if (combinedText.includes('history') && 
             !combinedText.includes('modern') && 
             !combinedText.includes('ancient') && 
             !combinedText.includes('medieval')) {
      subjectId = 1; // General History
    }
    
    console.log('🔍 Subject Detection:', {
      topic: topicText.substring(0, 50),
      question: questionText.substring(0, 50),
      detectedSubjectId: subjectId
    });

    return {
      subject_id: subjectId,
      question: question.question?.en || question.question || '',
      question_mr: question.question?.mr || '',
      options: Array.isArray(question.options?.en) ? question.options.en : 
               Array.isArray(question.options) ? question.options : [],
      options_mr: Array.isArray(question.options?.mr) ? question.options.mr : [],
      correct_answer: typeof question.correctAnswer === 'number' ? question.correctAnswer : 0,
      explanation: question.explanation?.en || question.explanation || '',
      explanation_mr: question.explanation?.mr || '',
      difficulty: (question.difficulty || 'medium').toLowerCase(),
      is_bilingual: !!(question.question?.mr || question.options?.mr),
      is_active: true
    };
  };

  const parseTextQuestions = (text) => {
    const questions = [];
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      
      // Check if line starts with number (question)
      const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
      if (questionMatch) {
        const questionNum = questionMatch[1];
        const questionText = questionMatch[2];
        
        // Get options (next 4 lines starting with A, B, C, D)
        const options = [];
        let correctAnswer = 0;
        
        for (let j = 1; j <= 4 && (i + j) < lines.length; j++) {
          const optLine = lines[i + j];
          const optMatch = optLine.match(/^([A-D])(.+)/);
          if (optMatch) {
            const optLetter = optMatch[1];
            const optText = optMatch[2].trim();
            options.push(optText);
            
            // Check if this is marked as correct (you can add logic here)
            // For now, we'll need to ask user or use AI
          }
        }
        
        if (options.length === 4) {
          questions.push({
            id: questionNum,
            question: questionText,
            options: options,
            correctAnswer: 0, // Will be set by AI or user
            explanation: '', // Will be generated by AI
            difficulty: 'Medium',
            marks: 2
          });
          
          i += 5; // Skip question + 4 options
        } else {
          i++;
        }
      } else {
        i++;
      }
    }
    
    return questions;
  };

  const handleTextImport = async () => {
    setIsParsing(true);
    
    try {
      const parsedQuestions = parseTextQuestions(textInput);
      
      if (parsedQuestions.length === 0) {
        alert('❌ No questions found! Please check format.');
        setIsParsing(false);
        return;
      }
      
      alert(`✅ Parsed ${parsedQuestions.length} questions!\n\nNote: Correct answers and explanations need to be added.\nYou can:\n1. Manually set correct answers\n2. Use AI to generate (coming soon)`);
      
      // Convert to JSON and show in JSON tab
      setJsonInput(JSON.stringify(parsedQuestions, null, 2));
      setActiveTab('json');
      
    } catch (error) {
      alert(`❌ Error parsing: ${error.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setResults([]);

    try {
      // Parse JSON input
      let questions = [];
      
      console.log('📝 Raw input length:', jsonInput.length);
      
      // Try to parse as array or single object
      try {
        const parsed = JSON.parse(jsonInput);
        questions = Array.isArray(parsed) ? parsed : [parsed];
        console.log(`✅ Parsed ${questions.length} questions`);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        alert(`❌ Invalid JSON format!\n\nError: ${parseError.message}\n\nPlease check:\n1. All brackets are closed\n2. No trailing commas\n3. Proper quotes around strings`);
        setIsImporting(false);
        return;
      }

      if (questions.length === 0) {
        alert('❌ No questions found in JSON!');
        setIsImporting(false);
        return;
      }

      console.log(`🚀 Starting import of ${questions.length} questions...`);

      const importResults = [];
      const BATCH_SIZE = 5; // Process 5 questions at a time

      // Import in batches
      for (let batchStart = 0; batchStart < questions.length; batchStart += BATCH_SIZE) {
        const batchEnd = Math.min(batchStart + BATCH_SIZE, questions.length);
        const batch = questions.slice(batchStart, batchEnd);
        
        console.log(`📦 Processing batch ${Math.floor(batchStart / BATCH_SIZE) + 1}/${Math.ceil(questions.length / BATCH_SIZE)}`);

        // Process batch in parallel
        const batchPromises = batch.map(async (question, batchIndex) => {
          const i = batchStart + batchIndex;
          
          try {
            const backendFormat = convertToBackendFormat(question);
            
            console.log(`📤 Importing question ${i + 1}/${questions.length}:`, {
              question: backendFormat.question.substring(0, 50),
              subject_id: backendFormat.subject_id
            });

            const response = await fetch(`${API_URL}/questions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(backendFormat)
            });

            if (response.ok) {
              const saved = await response.json();
              console.log(`✅ Question ${i + 1} saved with ID:`, saved.id);
              return {
                success: true,
                question: question.question?.en || question.question || 'Unknown',
                id: saved.id,
                subject_id: backendFormat.subject_id
              };
            } else {
              const errorText = await response.text();
              let errorDetail = errorText;
              let isDuplicate = false;
              
              try {
                const errorJson = JSON.parse(errorText);
                errorDetail = errorJson.detail || JSON.stringify(errorJson);
                isDuplicate = response.status === 409; // Conflict = Duplicate
              } catch (e) {
                // Keep errorText as is
              }
              
              if (isDuplicate) {
                console.warn(`⚠️ Question ${i + 1} skipped (duplicate):`, errorDetail);
              } else {
                console.error(`❌ Question ${i + 1} failed (${response.status}):`, errorDetail);
              }
              
              return {
                success: false,
                question: question.question?.en || question.question || 'Unknown',
                error: `HTTP ${response.status}: ${errorDetail}`,
                subject_id: backendFormat.subject_id,
                isDuplicate: isDuplicate
              };
            }
          } catch (error) {
            console.error(`❌ Question ${i + 1} error:`, error);
            return {
              success: false,
              question: question.question?.en || question.question || 'Unknown',
              error: error.message,
              subject_id: 'N/A'
            };
          }
        });

        // Wait for batch to complete
        const batchResults = await Promise.all(batchPromises);
        importResults.push(...batchResults);
        
        // Small delay between batches
        if (batchEnd < questions.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setResults(importResults);
      
      const successCount = importResults.filter(r => r.success).length;
      const duplicateCount = importResults.filter(r => r.isDuplicate).length;
      const failCount = questions.length - successCount - duplicateCount;
      
      console.log(`📊 Import complete: ${successCount} success, ${duplicateCount} duplicates skipped, ${failCount} failed`);
      
      // Verify actual database count
      try {
        const subjectsRes = await fetch(`${API_URL}/subjects`);
        if (subjectsRes.ok) {
          const subjects = await subjectsRes.json();
          const questionsRes = await fetch(`${API_URL}/questions?limit=10000`);
          if (questionsRes.ok) {
            const data = await questionsRes.json();
            console.log(`🔍 Database verification: ${data.total} total questions in database`);
          }
        }
      } catch (e) {
        console.log('Could not verify database count');
      }
      
      alert(`✅ Import Complete!\n\n✓ New Questions Added: ${successCount}\n⚠️ Duplicates Skipped: ${duplicateCount}\n✗ Failed: ${failCount}\n\nTotal Attempted: ${questions.length} questions\n\n💡 Check browser console (F12) for detailed logs`);

    } catch (error) {
      console.error('❌ Import error:', error);
      alert(`❌ Error: ${error.message}\n\nCheck browser console (F12) for details.`);
    } finally {
      setIsImporting(false);
    }
  };

  const exampleJSON = `{
  "question": {
    "en": "When was the University of Calcutta founded?",
    "mr": "कलकत्ता विद्यापीठाची स्थापना कधी झाली?"
  },
  "options": {
    "en": ["1860", "1874", "1854", "1857"],
    "mr": ["१८६०", "१८७४", "१८५४", "१८५७"]
  },
  "correctAnswer": 3,
  "explanation": {
    "en": "The University of Calcutta was founded in 1857...",
    "mr": "कलकत्ता विद्यापीठाची स्थापना १८५७ मध्ये झाली..."
  },
  "difficulty": "Medium",
  "topic": {
    "en": "Modern Indian History",
    "mr": "आधुनिक भारतीय इतिहास"
  }
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Upload className="text-purple-500" />
            Bulk Import Questions
          </h1>
          <p className="text-gray-600 mt-2">
            Paste your JSON questions below and import them all at once!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📝 Paste JSON Here
            </h2>
            
            {/* Subject Selector */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📚 Default Subject (if auto-detection fails):
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value={1}>History (General)</option>
                <option value={2}>Modern History</option>
                <option value={3}>Ancient History</option>
                <option value={4}>Medieval History</option>
                <option value={5}>Geography</option>
                <option value={6}>Polity</option>
                <option value={7}>Economy</option>
                <option value={8}>Science</option>
                <option value={9}>Environment</option>
                <option value={10}>Current Affairs</option>
                <option value={11}>CSAT</option>
              </select>
              <p className="text-xs text-gray-600 mt-2">
                💡 System will try to auto-detect subject from topic/question. This is fallback.
              </p>
            </div>
            
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
              placeholder="Paste your question JSON here..."
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleImport}
                disabled={isImporting || !jsonInput}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Import Questions
                  </>
                )}
              </button>
              
              <button
                onClick={() => setJsonInput(exampleJSON)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Load Example
              </button>
            </div>

            {/* Subject Mapping Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">
                📚 Subject Mapping:
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                {Object.entries(subjectMapping).map(([name, id], index) => (
                  <div key={`${id}-${index}`}>• {name} → ID: {id}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📊 Import Results
            </h2>

            {results.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <Upload size={48} className="mx-auto mb-4 opacity-50" />
                <p>No imports yet</p>
                <p className="text-sm mt-2">Results will appear here after import</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      result.success
                        ? 'bg-green-50 border-green-500'
                        : result.isDuplicate
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {result.success ? (
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      ) : result.isDuplicate ? (
                        <span className="text-yellow-500 flex-shrink-0 mt-0.5 text-lg">⚠️</span>
                      ) : (
                        <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-800">
                          {result.question.substring(0, 60)}...
                        </p>
                        {result.success ? (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Saved with ID: {result.id} | Subject: {result.subject_id}
                          </p>
                        ) : result.isDuplicate ? (
                          <p className="text-xs text-yellow-600 mt-1">
                            ⚠️ Duplicate skipped | Subject: {result.subject_id}
                          </p>
                        ) : (
                          <p className="text-xs text-red-600 mt-1">
                            ✗ Error: {result.error} | Attempted Subject: {result.subject_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-semibold">
                    ✓ Success: {results.filter(r => r.success).length}
                  </span>
                  <span className="text-yellow-600 font-semibold">
                    ⚠️ Duplicates: {results.filter(r => r.isDuplicate).length}
                  </span>
                  <span className="text-red-600 font-semibold">
                    ✗ Failed: {results.filter(r => !r.success && !r.isDuplicate).length}
                  </span>
                  <span className="text-gray-600 font-semibold">
                    Total: {results.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📖 How to Use
          </h2>
          <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Single Question:</h3>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "question": {
    "en": "Question text",
    "mr": "प्रश्न मराठी"
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
}`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Multiple Questions:</h3>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{`[
  {
    "question": {...},
    "options": {...},
    ...
  },
  {
    "question": {...},
    "options": {...},
    ...
  }
]`}
              </pre>
              <div className="mt-3 space-y-1">
                <p>✓ Paste single question or array</p>
                <p>✓ Auto-detects subject from topic</p>
                <p>✓ Supports bilingual content</p>
                <p>✓ Shows detailed results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
