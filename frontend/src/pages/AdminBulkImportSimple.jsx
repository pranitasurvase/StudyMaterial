import { useState } from 'react';
import { Upload, CheckCircle, XCircle, Loader, FileText } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1/questions';

export default function AdminBulkImportSimple() {
  const [textInput, setTextInput] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(2); // Modern History

  const parseTextQuestions = () => {
    const lines = textInput.split('\n').map(l => l.trim()).filter(l => l);
    const questions = [];
    
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
        
        for (let j = 1; j <= 4 && (i + j) < lines.length; j++) {
          const optLine = lines[i + j];
          const optMatch = optLine.match(/^([A-D])(.+)/);
          if (optMatch) {
            const optText = optMatch[2].trim();
            options.push(optText);
          }
        }
        
        if (options.length === 4) {
          questions.push({
            id: questionNum,
            question: questionText,
            options: options,
            correctAnswer: 0, // Default to A
            explanation: '',
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
    
    setParsedQuestions(questions);
    if (questions.length > 0) {
      alert(`✅ Parsed ${questions.length} questions!\n\nNow set correct answers and explanations.`);
    } else {
      alert('❌ No questions found! Check format.');
    }
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...parsedQuestions];
    updated[index][field] = value;
    setParsedQuestions(updated);
  };

  const handleBulkImport = async () => {
    setIsImporting(true);
    setResults([]);

    try {
      const importResults = [];

      for (let i = 0; i < parsedQuestions.length; i++) {
        const q = parsedQuestions[i];
        
        try {
          const payload = {
            subject_id: selectedSubject,
            question: q.question,
            question_mr: '',
            options: q.options,
            options_mr: [],
            correct_answer: q.correctAnswer,
            explanation: q.explanation || 'No explanation provided',
            explanation_mr: '',
            difficulty: q.difficulty.toLowerCase(),
            is_bilingual: false,
            is_active: true
          };

          const response = await fetch(`${API_URL}/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const saved = await response.json();
            importResults.push({
              success: true,
              question: q.question.substring(0, 50),
              id: saved.id
            });
          } else {
            const error = await response.json();
            importResults.push({
              success: false,
              question: q.question.substring(0, 50),
              error: error.detail || 'Failed'
            });
          }
        } catch (error) {
          importResults.push({
            success: false,
            question: q.question.substring(0, 50),
            error: error.message
          });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResults(importResults);
      
      const successCount = importResults.filter(r => r.success).length;
      alert(`✅ Import Complete!\n\nSuccess: ${successCount}/${parsedQuestions.length}`);

    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const exampleText = `192. In which year, Gandhiji established Sabarmati Ashram in Gujarat?
A1916
B1917
C1918
D1929

193. Lord Macaulay was associated with
ACodification of Laws
BPermanent settlement
CReforms in the army
DAbolition of Sati`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-500" />
            Bulk Import Questions (Simple)
          </h1>
          <p className="text-gray-600 mt-2">
            Paste questions, set answers, and import!
          </p>
        </div>

        {parsedQuestions.length === 0 ? (
          /* Step 1: Paste Text */
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📝 Step 1: Paste Questions</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Subject:</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg"
              >
                <option value={2}>Modern History</option>
                <option value={1}>History</option>
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
            </div>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
              placeholder={exampleText}
            />

            <div className="mt-4 flex gap-2">
              <button
                onClick={parseTextQuestions}
                disabled={!textInput}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Parse Questions
              </button>
              
              <button
                onClick={() => setTextInput(exampleText)}
                className="px-4 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Load Example
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
              <p className="font-semibold mb-2">Format:</p>
              <pre className="text-xs">
{`192. Question text here?
A Option 1
B Option 2
C Option 3
D Option 4`}
              </pre>
            </div>
          </div>
        ) : (
          /* Step 2: Review & Edit */
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  ✏️ Step 2: Review & Set Answers ({parsedQuestions.length} questions)
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setParsedQuestions([])}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleBulkImport}
                    disabled={isImporting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isImporting ? 'Importing...' : `Import All ${parsedQuestions.length}`}
                  </button>
                </div>
              </div>
            </div>

            {parsedQuestions.map((q, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start gap-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                    Q{idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium mb-3">{q.question}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="text-sm">{opt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Correct Answer:</label>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => updateQuestion(idx, 'correctAnswer', Number(e.target.value))}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value={0}>A</option>
                          <option value={1}>B</option>
                          <option value={2}>C</option>
                          <option value={3}>D</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Difficulty:</label>
                        <select
                          value={q.difficulty}
                          onChange={(e) => updateQuestion(idx, 'difficulty', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-1">Explanation (Optional):</label>
                      <textarea
                        value={q.explanation}
                        onChange={(e) => updateQuestion(idx, 'explanation', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={2}
                        placeholder="Add explanation here..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Import Results</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.success ? (
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={20} className="text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.question}...</p>
                      {result.success ? (
                        <p className="text-xs text-green-600 mt-1">✓ ID: {result.id}</p>
                      ) : (
                        <p className="text-xs text-red-600 mt-1">✗ {result.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
