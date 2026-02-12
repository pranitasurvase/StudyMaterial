import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/v1/questions';

export default function AdminDashboard() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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
      is_bilingual: false
    });
    setIsEditing(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsEditing(true);
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
      }
    } catch (error) {
      console.error('Error saving question:', error);
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
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Subjects Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Subjects</h2>
            <div className="space-y-2">
              {subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedSubject?.id === subject.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </div>

          {/* Questions List */}
          <div className="col-span-9">
            {!isEditing ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">
                    {selectedSubject ? `${selectedSubject.name} Questions` : 'Select a Subject'}
                  </h2>
                  {selectedSubject && (
                    <button
                      onClick={handleAddQuestion}
                      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      <Plus size={20} />
                      Add Question
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium mb-2">{idx + 1}. {q.question}</p>
                          {q.is_bilingual && q.question_mr && (
                            <p className="text-gray-600 mb-2">{q.question_mr}</p>
                          )}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`p-2 rounded ${
                                  i === q.correct_answer
                                    ? 'bg-green-100 border-green-500 border'
                                    : 'bg-gray-50'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditQuestion(q)}
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
              <QuestionForm
                question={editingQuestion}
                setQuestion={setEditingQuestion}
                onSave={handleSaveQuestion}
                onCancel={() => {
                  setIsEditing(false);
                  setEditingQuestion(null);
                }}
                subjects={subjects}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionForm({ question, setQuestion, onSave, onCancel, subjects }) {
  const updateOption = (index, value, isMr = false) => {
    const key = isMr ? 'options_mr' : 'options';
    const newOptions = [...question[key]];
    newOptions[index] = value;
    setQuestion({ ...question, [key]: newOptions });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
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

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Subject</label>
          <select
            value={question.subject_id}
            onChange={(e) => setQuestion({ ...question, subject_id: parseInt(e.target.value) })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={question.is_bilingual}
              onChange={(e) => setQuestion({ ...question, is_bilingual: e.target.checked })}
            />
            <span className="font-medium">Bilingual (English + Marathi)</span>
          </label>
        </div>

        <div>
          <label className="block font-medium mb-2">Question (English)</label>
          <textarea
            value={question.question}
            onChange={(e) => setQuestion({ ...question, question: e.target.value })}
            className="w-full p-2 border rounded-lg"
            rows="3"
          />
        </div>

        {question.is_bilingual && (
          <div>
            <label className="block font-medium mb-2">Question (Marathi)</label>
            <textarea
              value={question.question_mr}
              onChange={(e) => setQuestion({ ...question, question_mr: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows="3"
            />
          </div>
        )}

        <div>
          <label className="block font-medium mb-2">Options (English)</label>
          {question.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                checked={question.correct_answer === i}
                onChange={() => setQuestion({ ...question, correct_answer: i })}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder={`Option ${i + 1}`}
              />
            </div>
          ))}
        </div>

        {question.is_bilingual && (
          <div>
            <label className="block font-medium mb-2">Options (Marathi)</label>
            {question.options_mr.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, e.target.value, true)}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder={`Option ${i + 1} (Marathi)`}
              />
            ))}
          </div>
        )}

        <div>
          <label className="block font-medium mb-2">Explanation (English)</label>
          <textarea
            value={question.explanation}
            onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
            className="w-full p-2 border rounded-lg"
            rows="2"
          />
        </div>

        {question.is_bilingual && (
          <div>
            <label className="block font-medium mb-2">Explanation (Marathi)</label>
            <textarea
              value={question.explanation_mr}
              onChange={(e) => setQuestion({ ...question, explanation_mr: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows="2"
            />
          </div>
        )}

        <div>
          <label className="block font-medium mb-2">Difficulty</label>
          <select
            value={question.difficulty}
            onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
}
