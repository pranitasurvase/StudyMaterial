import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Sparkles, Loader } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1/questions';

export default function AdminDashboardAI() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deepseekApiKey, setDeepseekApiKey] = useState(localStorage.getItem('deepseek_api_key') || '');

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions(selectedSubject.id);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${API_URL}/subjects`);
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchQuestions = async (subjectId) => {
    try {
      const response = await fetch(`${API_URL}/questions?subject_id=${subjectId}`);
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      subject_id: selectedSubject?.id || '',
      question: '',
      question_mr: '',
      options: ['', '', '', ''],
      options_mr: ['', '', '', ''],
      correct_answer: 0,
      explanation: '',
      explanation_mr: '',
      difficulty: 'medium',
      is_bilingual: true
    });
    setIsEditing(true);
  };

  const generateWithAI = async () => {
    if (!deepseekApiKey) {
      alert('❌ Please enter your API key first!');
      return;
    }

    if (!editingQuestion.question || editingQuestion.options.some(opt => !opt)) {
      alert('❌ Please fill in the question and all options first!');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🚀 Calling AI API...');
      
      // Check if it's OpenRouter key (starts with sk-or-v1-)
      const isOpenRouter = deepseekApiKey.startsWith('sk-or-v1-');
      const apiUrl = isOpenRouter 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.deepseek.com/v1/chat/completions';
      
      const model = isOpenRouter ? 'deepseek/deepseek-chat' : 'deepseek-chat';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`,
          ...(isOpenRouter && {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'MPSC Admin Dashboard'
          })
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert in Indian history and MPSC exam preparation. You must respond ONLY with valid JSON. Generate detailed explanations in English and accurate Marathi translations.'
            },
            {
              role: 'user',
              content: `Generate a detailed explanation and Marathi translation for this MCQ. Respond ONLY with JSON, no other text:

Question: ${editingQuestion.question}
Options:
A) ${editingQuestion.options[0]}
B) ${editingQuestion.options[1]}
C) ${editingQuestion.options[2]}
D) ${editingQuestion.options[3]}
Correct Answer: ${editingQuestion.options[editingQuestion.correct_answer]}

Respond with this exact JSON format:
{
  "explanation": "detailed explanation in English (3-4 sentences)",
  "question_mr": "question in Marathi",
  "options_mr": ["option1 in Marathi", "option2 in Marathi", "option3 in Marathi", "option4 in Marathi"],
  "explanation_mr": "explanation in Marathi"
}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        alert(`❌ API Error: ${errorData.error?.message || 'Unknown error'}\n\nPlease check:\n1. API key is correct\n2. You have API credits\n3. Internet connection is working`);
        return;
      }

      const data = await response.json();
      console.log('📦 API Response:', data);
      
      if (data.choices && data.choices[0]) {
        const content = data.choices[0].message.content;
        console.log('📝 AI Content:', content);
        
        // Try to parse JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const aiData = JSON.parse(jsonMatch[0]);
            console.log('✅ Parsed AI Data:', aiData);
            
            setEditingQuestion({
              ...editingQuestion,
              explanation: aiData.explanation || '',
              question_mr: aiData.question_mr || '',
              options_mr: aiData.options_mr || ['', '', '', ''],
              explanation_mr: aiData.explanation_mr || ''
            });
            
            alert('✅ AI generated content successfully!\n\nPlease review the generated content and click Save.');
          } catch (parseError) {
            console.error('❌ JSON Parse Error:', parseError);
            alert('❌ Could not parse AI response. The AI returned:\n\n' + content.substring(0, 200) + '...\n\nPlease try again.');
          }
        } else {
          console.error('❌ No JSON found in response');
          alert('❌ AI did not return valid JSON. Response:\n\n' + content.substring(0, 200) + '...\n\nPlease try again.');
        }
      } else {
        console.error('❌ No choices in response:', data);
        alert('❌ Unexpected API response format. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error generating with AI:', error);
      alert(`❌ Error: ${error.message}\n\nPlease check:\n1. Internet connection\n2. API key is correct\n3. Browser console for details`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('deepseek_api_key', deepseekApiKey);
    alert('✅ API Key saved!\n\nClick "Test API" to verify it works.');
  };

  const testApiKey = async () => {
    if (!deepseekApiKey) {
      alert('❌ Please enter API key first!');
      return;
    }

    try {
      // Check if it's OpenRouter key (starts with sk-or-v1-)
      const isOpenRouter = deepseekApiKey.startsWith('sk-or-v1-');
      const apiUrl = isOpenRouter 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.deepseek.com/v1/chat/completions';
      
      const model = isOpenRouter ? 'deepseek/deepseek-chat' : 'deepseek-chat';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`,
          ...(isOpenRouter && {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'MPSC Admin Dashboard'
          })
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Say "Hello! API is working!" in one line.'
            }
          ],
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ API Key is working!\n\nResponse: ' + data.choices[0].message.content);
      } else {
        const error = await response.json();
        alert('❌ API Key Error:\n\n' + (error.error?.message || JSON.stringify(error)));
      }
    } catch (error) {
      alert('❌ Connection Error:\n\n' + error.message);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const url = editingQuestion.id 
        ? `${API_URL}/questions/${editingQuestion.id}`
        : `${API_URL}/questions`;
      
      const method = editingQuestion.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion)
      });

      if (response.ok) {
        setIsEditing(false);
        setEditingQuestion(null);
        if (selectedSubject) {
          fetchQuestions(selectedSubject.id);
        }
        alert('✅ Question saved successfully!');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question. Please try again.');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE'
      });

      if (response.ok && selectedSubject) {
        fetchQuestions(selectedSubject.id);
        alert('✅ Question deleted!');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="text-yellow-500" />
                AI-Powered Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Add questions easily - AI generates explanations & translations!</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="OpenRouter/DeepSeek API Key"
                value={deepseekApiKey}
                onChange={(e) => setDeepseekApiKey(e.target.value)}
                className="px-4 py-2 border rounded-lg w-64"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save Key
              </button>
              <button
                onClick={testApiKey}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Test API
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Subjects Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Subjects</h2>
            <div className="space-y-2">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedSubject?.id === subject.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{subject.icon}</span>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Questions List or Form */}
          <div className="col-span-9">
            {!isEditing ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedSubject ? `${selectedSubject.name} Questions` : 'Select a Subject'}
                  </h2>
                  {selectedSubject && (
                    <button
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
                    >
                      <Plus size={20} />
                      Add Question
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium mb-2 text-gray-800">{idx + 1}. {q.question}</p>
                          {q.is_bilingual && q.question_mr && (
                            <p className="text-gray-600 mb-2 text-sm">{q.question_mr}</p>
                          )}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded text-sm ${
                                  i === q.correct_answer
                                    ? 'bg-green-100 border-green-500 border-2 font-medium'
                                    : 'bg-white border'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingQuestion(q);
                              setIsEditing(true);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <QuestionFormAI
                question={editingQuestion}
                setQuestion={setEditingQuestion}
                onSave={handleSaveQuestion}
                onCancel={() => {
                  setIsEditing(false);
                  setEditingQuestion(null);
                }}
                onGenerateAI={generateWithAI}
                isGenerating={isGenerating}
                subjects={subjects}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionFormAI({ question, setQuestion, onSave, onCancel, onGenerateAI, isGenerating, subjects }) {
  const updateOption = (index, value) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {question.id ? 'Edit Question' : 'Add New Question'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            <Save size={20} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Subject Selection */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block font-medium mb-2 text-gray-700">Subject</label>
          <select
            value={question.subject_id}
            onChange={(e) => setQuestion({ ...question, subject_id: parseInt(e.target.value) })}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Step 1: Question & Options */}
        <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">📝 Step 1: Enter Question & Options</h3>
          
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Question (English)</label>
            <textarea
              value={question.question}
              onChange={(e) => setQuestion({ ...question, question: e.target.value })}
              className="w-full p-3 border rounded-lg"
              rows="3"
              placeholder="Enter your question here..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Options (English)</label>
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  checked={question.correct_answer === i}
                  onChange={() => setQuestion({ ...question, correct_answer: i })}
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  placeholder={`Option ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Difficulty</label>
            <select
              value={question.difficulty}
              onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
              className="w-full p-3 border rounded-lg"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* AI Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={onGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg hover:shadow-xl transition text-lg font-semibold disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader className="animate-spin" size={24} />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Explanation & Marathi Translation with AI
              </>
            )}
          </button>
        </div>

        {/* Step 2: AI Generated Content */}
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">✨ Step 2: AI Generated Content</h3>
          
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Explanation (English)</label>
            <textarea
              value={question.explanation}
              onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white"
              rows="3"
              placeholder="AI will generate detailed explanation..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Question (Marathi)</label>
            <textarea
              value={question.question_mr}
              onChange={(e) => setQuestion({ ...question, question_mr: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white"
              rows="2"
              placeholder="AI will translate to Marathi..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Options (Marathi)</label>
            {question.options_mr.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...question.options_mr];
                  newOptions[i] = e.target.value;
                  setQuestion({ ...question, options_mr: newOptions });
                }}
                className="w-full p-3 border rounded-lg mb-2 bg-white"
                placeholder={`Option ${i + 1} (Marathi)`}
              />
            ))}
          </div>

          <div>
            <label className="block font-medium mb-2 text-gray-700">Explanation (Marathi)</label>
            <textarea
              value={question.explanation_mr}
              onChange={(e) => setQuestion({ ...question, explanation_mr: e.target.value })}
              className="w-full p-3 border rounded-lg bg-white"
              rows="3"
              placeholder="AI will translate explanation to Marathi..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
