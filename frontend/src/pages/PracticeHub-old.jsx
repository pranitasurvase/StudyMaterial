import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SubjectSidebar from '../components/SubjectSidebar'
import { BookOpen, FileText, ArrowUp } from 'lucide-react'
import { mcqData, descriptiveData } from '../data/index'
import historyMCQsBilingual from '../data/mcqs/history-bilingual'
import modernIndiaMCQs from '../data/mcqs/modern-india'
import { useLanguage } from '../context/LanguageContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export default function PracticeHub() {
  const [selectedSubject, setSelectedSubject] = useState('Modern History')
  const [selectedType, setSelectedType] = useState('MCQ')
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const subjects = [
    { 
      name: 'History', 
      icon: '📚', 
      color: 'bg-blue-100 text-blue-600',
      subTopics: [
        { name: 'Modern History', icon: '🇮🇳', dataKey: 'modernIndia' },
        { name: 'Ancient History', icon: '🏛️', dataKey: 'ancientHistory' },
        { name: 'Medieval History', icon: '🏰', dataKey: 'medievalHistory' }
      ]
    },
    { name: 'Geography', icon: '🌍', color: 'bg-green-100 text-green-600' },
    { name: 'Polity', icon: '⚖️', color: 'bg-purple-100 text-purple-600' },
    { name: 'Economy', icon: '💰', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Science', icon: '🔬', color: 'bg-pink-100 text-pink-600' },
    { name: 'Environment', icon: '🌱', color: 'bg-teal-100 text-teal-600' },
    { name: 'Current Affairs', icon: '📰', color: 'bg-orange-100 text-orange-600' },
    { name: 'CSAT', icon: '🧮', color: 'bg-indigo-100 text-indigo-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Mobile Subject Selector */}
      <div className="lg:hidden bg-gradient-to-r from-blue-500 to-blue-400 p-4 shadow-md">
        <div className="bg-white rounded-lg p-3">
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            📚 Select Subject
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base font-medium text-gray-900 cursor-pointer"
          >
            {subjects.map((subject) => (
              <option key={subject.name} value={subject.name}>
                {subject.icon} {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        <SubjectSidebar 
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
        />

        <div className="flex-1 lg:ml-64 p-4 lg:p-8 w-full">
          {/* Type Selector */}
          <div className="bg-white rounded-lg shadow mb-4 lg:mb-6">
            <div className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setSelectedType('MCQ')}
                  className={`flex-1 py-3 px-4 lg:px-6 rounded-lg font-medium transition-all ${
                    selectedType === 'MCQ'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm lg:text-base">MCQ Questions</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedType('Descriptive')}
                  className={`flex-1 py-3 px-4 lg:px-6 rounded-lg font-medium transition-all ${
                    selectedType === 'Descriptive'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span className="text-sm lg:text-base">Descriptive Questions</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Questions Display - Scrollable List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 lg:p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {selectedSubject} - {selectedType} Questions
              </h2>
              <p className="text-sm lg:text-base text-gray-600 mt-1">
                📜 Scroll down to view all questions with detailed answers
              </p>
            </div>

            <div className="p-4 lg:p-6">
              {selectedType === 'MCQ' ? (
                <MCQListComponent subject={selectedSubject} />
              ) : (
                <DescriptiveListComponent subject={selectedSubject} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}

// MCQ List Component - Fetches from Backend
function MCQListComponent({ subject }) {
  const { displayMode } = useLanguage()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchQuestions()
  }, [subject])

  const fetchQuestions = async () => {
    setLoading(true)
    setError(null)
    
    // First load local questions
    let localQuestions = []
    if (subject === 'History') {
      localQuestions = historyMCQsBilingual
    } else if (subject === 'Modern History') {
      localQuestions = modernIndiaMCQs
    } else {
      localQuestions = mcqData[subject] || []
    }
    
    try {
      // Try to fetch from backend and merge with local
      const subjectsRes = await fetch(`${API_URL}/questions/subjects`)
      if (!subjectsRes.ok) throw new Error('Failed to fetch subjects')
      const subjects = await subjectsRes.json()
      
      // Find matching subject
      const subjectData = subjects.find(s => s.name === subject)
      
      if (subjectData) {
        // Fetch questions for this subject
        const questionsRes = await fetch(`${API_URL}/questions/questions?subject_id=${subjectData.id}`)
        if (!questionsRes.ok) throw new Error('Failed to fetch questions')
        const data = await questionsRes.json()
        const backendQuestions = data.questions || []
        
        // Merge backend questions with local questions
        setQuestions([...backendQuestions, ...localQuestions])
      } else {
        // Use only local data if subject not found in backend
        setQuestions(localQuestions)
      }
    } catch (err) {
      console.error('Error fetching questions:', err)
      // Use local data on error
      setQuestions(localQuestions)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
        <p className="text-yellow-800">
          ⚠️ No questions available for {subject} yet.
        </p>
      </div>
    )
  }

  // Check if questions are from backend (have question field without nested structure) or frontend (have question as object)
  const isBackendData = questions.length > 0 && questions[0]?.question && typeof questions[0]?.question === 'string'
  const isBilingual = !isBackendData && typeof questions[0]?.question === 'object'

  const getQuestionText = (q) => {
    if (isBackendData) {
      // Backend data structure - separate question and question_mr fields
      const qTextEn = q.question || ''
      const qTextMr = q.question_mr || ''
      
      if (displayMode === 'en') return qTextEn
      if (displayMode === 'mr') return qTextMr
      return (
        <div className="space-y-1">
          <p>{qTextEn}</p>
          {qTextMr && <p className="text-gray-600">{qTextMr}</p>}
        </div>
      )
    }
    // Frontend data structure
    if (!isBilingual) return q.question
    if (displayMode === 'en') return q.question.en
    if (displayMode === 'mr') return q.question.mr
    return (
      <div className="space-y-1">
        <p>{q.question.en}</p>
        <p className="text-gray-600">{q.question.mr}</p>
      </div>
    )
  }

  const getOptionText = (q, index) => {
    if (isBackendData) {
      // Backend data structure - separate arrays for en and mr
      const optionEn = q.options?.[index] || ''
      const optionMr = q.options_mr?.[index] || ''
      
      if (displayMode === 'en') return optionEn
      if (displayMode === 'mr') return optionMr
      return (
        <div>
          <div>{optionEn}</div>
          {optionMr && <div className="text-sm text-gray-600">{optionMr}</div>}
        </div>
      )
    }
    // Frontend data structure
    if (!isBilingual) return q.options[index]
    if (displayMode === 'en') return q.options.en[index]
    if (displayMode === 'mr') return q.options.mr[index]
    return (
      <div>
        <div>{q.options.en[index]}</div>
        <div className="text-sm text-gray-600">{q.options.mr[index]}</div>
      </div>
    )
  }

  const getExplanationText = (q) => {
    if (isBackendData) {
      // Backend data structure - separate explanation and explanation_mr fields
      const expEn = q.explanation || ''
      const expMr = q.explanation_mr || ''
      
      if (displayMode === 'en') return expEn
      if (displayMode === 'mr') return expMr
      return (
        <div className="space-y-2">
          <p>{expEn}</p>
          {expMr && <p className="text-gray-600">{expMr}</p>}
        </div>
      )
    }
    // Frontend data structure
    if (!isBilingual) return q.explanation
    if (displayMode === 'en') return q.explanation.en
    if (displayMode === 'mr') return q.explanation.mr
    return (
      <div className="space-y-2">
        <p>{q.explanation.en}</p>
        <p className="text-gray-600">{q.explanation.mr}</p>
      </div>
    )
  }

  const getCorrectAnswer = (q) => {
    if (isBackendData) return q.correct_answer
    return q.correctAnswer
  }

  const getOptionsArray = (q) => {
    if (isBackendData) {
      // Backend has separate options and options_mr arrays
      return q.options || []
    }
    if (isBilingual) return q.options.en
    return q.options
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded sticky top-20 z-10 shadow-sm">
        <p className="text-blue-900 font-medium text-sm lg:text-base">
          📊 Total Questions: <span className="font-bold text-lg">{questions.length}</span> | 
          <span className="ml-2">📜 All questions are displayed below - scroll to view</span>
        </p>
      </div>

      {questions.map((q, qIndex) => {
        const correctAnswer = getCorrectAnswer(q)
        const optionsArray = getOptionsArray(q)
        
        return (
          <div key={q.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-4 pb-3 border-b">
              <div className="flex-1">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  Question {qIndex + 1}
                </span>
                <div className="text-base lg:text-lg font-medium text-gray-900 mt-2">
                  {getQuestionText(q)}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1 ml-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{q.marks} Marks</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{q.difficulty}</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-4">
              {optionsArray.map((_, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    index === correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-bold text-gray-700 min-w-[30px]">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div className="flex-1">
                      {getOptionText(q, index)}
                    </div>
                    {index === correctAnswer && (
                      <span className="text-green-600 font-bold whitespace-nowrap">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm font-semibold text-green-900 mb-2">
                ✅ Correct Answer: {String.fromCharCode(65 + correctAnswer)}
              </p>
              <p className="text-sm font-semibold text-green-800 mb-2">Explanation:</p>
              <div className="text-sm text-gray-700">
                {getExplanationText(q)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Descriptive List Component - Scrollable
function DescriptiveListComponent({ subject }) {
  const { displayMode } = useLanguage()
  const questions = descriptiveData[subject] || []

  if (questions.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
        <p className="text-yellow-800">
          ⚠️ No descriptive questions available for {subject} yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded sticky top-20 z-10 shadow-sm">
        <p className="text-purple-900 font-medium text-sm lg:text-base">
          📊 Total Questions: <span className="font-bold text-lg">{questions.length}</span> | 
          <span className="ml-2">📜 All questions are displayed below - scroll to view</span>
        </p>
      </div>

      {questions.map((q, qIndex) => (
        <div key={q.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b">
            <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
              Question {qIndex + 1}
            </span>
            <div className="flex items-center space-x-2 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded">{q.marks} Marks</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{q.wordLimit} Words</span>
              <span className="bg-gray-100 px-2 py-1 rounded">{q.timeLimit} Min</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-4">
            <p className="text-base lg:text-lg font-medium text-gray-900">
              {q.question}
            </p>
          </div>

          {/* Key Points */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">📌 Key Points to Cover:</p>
            <ul className="space-y-1">
              {q.keyPoints.map((point, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="mr-2 font-semibold">{index + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample Answer (if available) */}
          {q.sampleAnswer && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm font-semibold text-green-900 mb-2">📝 Sample Answer / Approach:</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{q.sampleAnswer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
