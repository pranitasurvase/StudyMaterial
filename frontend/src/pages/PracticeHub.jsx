import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SubjectSidebar from '../components/SubjectSidebar'
import { BookOpen, FileText, ArrowUp } from 'lucide-react'
import { mcqData, descriptiveData } from '../data/index'
import historyMCQsBilingual from '../data/mcqs/history-bilingual'
import modernIndiaMCQs from '../data/mcqs/modern-india'
import ancientHistoryMCQs from '../data/mcqs/ancient-history'
import geographyMCQs from '../data/mcqs/geography'
import { useLanguage } from '../context/LanguageContext'

console.log('PracticeHub loaded')
console.log('Geography MCQs:', geographyMCQs?.length || 0)
console.log('Modern India MCQs:', modernIndiaMCQs?.length || 0)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export default function PracticeHub() {
  const [selectedSubject, setSelectedSubject] = useState('Modern History')
  const [selectedType, setSelectedType] = useState('MCQ')
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const subjects = [
    { 
      name: 'History', 
      icon: '📚', 
      subTopics: [
        { name: 'Modern History', icon: '🇮🇳' },
        { name: 'Ancient History', icon: '🏛️' },
        { name: 'Medieval History', icon: '🏰' }
      ]
    },
    { name: 'Geography', icon: '🌍' },
    { name: 'Polity', icon: '⚖️' },
    { name: 'Economy', icon: '💰' },
    { name: 'Science', icon: '🔬' },
    { name: 'Environment', icon: '🌱' },
    { name: 'Current Affairs', icon: '📰' },
    { name: 'CSAT', icon: '🧮' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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

function MCQListComponent({ subject }) {
  const { displayMode } = useLanguage()
  const [allQuestions, setAllQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 10
  
  useEffect(() => {
    fetchQuestions()
  }, [subject])

  const fetchQuestions = async () => {
    setLoading(true)
    setCurrentPage(1)
    
    try {
      let backendQuestions = []
      let localQuestions = []
      
      // Try to fetch from backend
      try {
        const subjectsRes = await fetch(`${API_URL}/questions/subjects`)
        if (subjectsRes.ok) {
          const subjects = await subjectsRes.json()
          const subjectData = subjects.find(s => s.name === subject)
          
          if (subjectData) {
            const questionsRes = await fetch(`${API_URL}/questions/questions?subject_id=${subjectData.id}`)
            if (questionsRes.ok) {
              const data = await questionsRes.json()
              backendQuestions = data.questions || []
            }
          }
        }
      } catch (err) {
        console.log('Backend not available, using local data')
      }
      
      // Get local questions
      if (subject === 'History') {
        localQuestions = historyMCQsBilingual
      } else if (subject === 'Modern History') {
        localQuestions = modernIndiaMCQs
      } else if (subject === 'Ancient History') {
        localQuestions = ancientHistoryMCQs
      } else if (subject === 'Geography') {
        localQuestions = geographyMCQs
      } else {
        localQuestions = mcqData[subject] || []
      }
      
      // Merge: LOCAL FIRST, then backend (so backend questions come after local)
      const mergedQuestions = [...localQuestions]
      const localQuestionTexts = new Set(
        localQuestions.map(q => {
          if (!q || !q.question) return ''
          if (typeof q.question === 'string') return q.question.toLowerCase().trim()
          return (q.question.en || '').toLowerCase().trim()
        })
      )
      
      // Add backend questions that are not already in local (they will be added at the end)
      backendQuestions.forEach(backendQ => {
        if (!backendQ || !backendQ.question) return
        
        const backendText = typeof backendQ.question === 'string' 
          ? backendQ.question.toLowerCase().trim()
          : (backendQ.question.en || '').toLowerCase().trim()
        
        if (!localQuestionTexts.has(backendText)) {
          mergedQuestions.push(backendQ)
        }
      })
      
      const allQuestions = mergedQuestions.filter(q => q && q.question)
      console.log('📊 Merge Debug:', {
        subject,
        backendCount: backendQuestions.length,
        localCount: localQuestions.length,
        totalAfterMerge: allQuestions.length
      })
      setAllQuestions(allQuestions)
      
    } catch (err) {
      console.error('Error:', err)
      // Fallback to local only
      let localQuestions = []
      if (subject === 'History') {
        localQuestions = historyMCQsBilingual
      } else if (subject === 'Modern History') {
        localQuestions = modernIndiaMCQs
      } else {
        localQuestions = mcqData[subject] || []
      }
      setAllQuestions(localQuestions.filter(q => q && q.question))
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

  if (allQuestions.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
        <p className="text-yellow-800">
          ⚠️ No questions available for {subject} yet.
        </p>
      </div>
    )
  }

  // Pagination calculations
  const totalPages = Math.ceil(allQuestions.length / questionsPerPage)
  const startIndex = (currentPage - 1) * questionsPerPage
  const endIndex = startIndex + questionsPerPage
  const currentQuestions = allQuestions.slice(startIndex, endIndex)

  // Debug logging
  console.log('📊 Pagination Debug:')
  console.log('  Total Questions:', allQuestions.length)
  console.log('  Questions Per Page:', questionsPerPage)
  console.log('  Current Page:', currentPage)
  console.log('  Total Pages:', totalPages)
  console.log('  Start Index:', startIndex)
  console.log('  End Index:', endIndex)
  console.log('  Current Questions Count:', currentQuestions.length)
  console.log('  First question on page:', currentQuestions[0]?.question?.en || currentQuestions[0]?.question || 'None')

  // Debug: Check if current page is valid
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isBackendData = (q) => q && q.question && !q.question.en && !q.question_mr
  const isBilingual = (q) => {
    if (!q) return false
    // Check if it's backend bilingual data
    if (q.question_mr || q.options_mr || q.explanation_mr) return true
    // Check if it's frontend bilingual data
    return typeof q.question === 'object' && q.question.en
  }

  const getQuestionText = (q) => {
    if (!q || !q.question) return 'Question not available'
    
    // Backend bilingual format
    if (q.question_mr) {
      if (displayMode === 'en') return q.question
      if (displayMode === 'mr') return q.question_mr
      return (
        <div className="space-y-1">
          <p>{q.question}</p>
          <p className="text-gray-600">{q.question_mr}</p>
        </div>
      )
    }
    
    // Frontend bilingual format
    if (typeof q.question === 'object' && q.question.en) {
      if (displayMode === 'en') return q.question.en
      if (displayMode === 'mr') return q.question.mr
      return (
        <div className="space-y-1">
          <p>{q.question.en}</p>
          <p className="text-gray-600">{q.question.mr}</p>
        </div>
      )
    }
    
    return q.question
  }

  const getOptionText = (q, index) => {
    if (!q || !q.options) return ''
    
    // Backend bilingual format
    if (q.options_mr && q.options_mr[index]) {
      if (displayMode === 'en') return q.options[index] || ''
      if (displayMode === 'mr') return q.options_mr[index] || ''
      return (
        <div>
          <div>{q.options[index]}</div>
          <div className="text-sm text-gray-600">{q.options_mr[index]}</div>
        </div>
      )
    }
    
    // Frontend bilingual format
    if (typeof q.options === 'object' && q.options.en) {
      if (displayMode === 'en') return q.options.en[index]
      if (displayMode === 'mr') return q.options.mr[index]
      return (
        <div>
          <div>{q.options.en[index]}</div>
          <div className="text-sm text-gray-600">{q.options.mr[index]}</div>
        </div>
      )
    }
    
    return q.options[index] || ''
  }

  const getExplanationText = (q) => {
    if (!q) return 'No explanation available'
    
    // Backend bilingual format
    if (q.explanation_mr) {
      if (displayMode === 'en') return q.explanation || 'No explanation available'
      if (displayMode === 'mr') return q.explanation_mr
      return (
        <div className="space-y-2">
          <p>{q.explanation}</p>
          <p className="text-gray-600">{q.explanation_mr}</p>
        </div>
      )
    }
    
    // Frontend bilingual format
    if (typeof q.explanation === 'object' && q.explanation.en) {
      if (displayMode === 'en') return q.explanation.en
      if (displayMode === 'mr') return q.explanation.mr
      return (
        <div className="space-y-2">
          <p>{q.explanation.en}</p>
          <p className="text-gray-600">{q.explanation.mr}</p>
        </div>
      )
    }
    
    return q.explanation || 'No explanation available'
  }

  const getCorrectAnswer = (q) => {
    if (!q) return 0
    return q.correct_answer !== undefined ? q.correct_answer : q.correctAnswer
  }

  const getOptionsArray = (q) => {
    if (!q || !q.options) return []
    
    // Backend bilingual format
    if (q.options_mr && Array.isArray(q.options_mr)) {
      return q.options
    }
    
    // Frontend bilingual format
    if (typeof q.options === 'object' && q.options.en && Array.isArray(q.options.en)) {
      return q.options.en
    }
    
    // Simple array format
    if (Array.isArray(q.options)) {
      return q.options
    }
    
    return []
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded sticky top-20 z-10 shadow-sm">
        <p className="text-blue-900 font-medium text-sm lg:text-base">
          📊 Total Questions: <span className="font-bold text-lg">{allQuestions.length}</span> | 
          <span className="ml-2">📄 Page {currentPage} of {totalPages}</span> |
          <span className="ml-2">Showing {startIndex + 1}-{Math.min(endIndex, allQuestions.length)}</span>
        </p>
      </div>

      {currentQuestions.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
          <p className="text-yellow-800">
            ⚠️ No questions on this page. Please go back to page 1.
          </p>
          <button
            onClick={() => goToPage(1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Page 1
          </button>
        </div>
      ) : (
        currentQuestions.map((q, qIndex) => {
        const correctAnswer = getCorrectAnswer(q)
        const optionsArray = getOptionsArray(q)
        
        return (
          <div key={q.id || qIndex} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4 pb-3 border-b">
              <div className="flex-1">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                  Question {startIndex + qIndex + 1}
                </span>
                <div className="text-base lg:text-lg font-medium text-gray-900 mt-2">
                  {getQuestionText(q)}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1 ml-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{q.marks || 2} Marks</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{q.difficulty || 'Medium'}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {optionsArray && optionsArray.length > 0 ? (
                optionsArray.map((_, index) => (
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
              ))
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-sm">⚠️ Options not available for this question</p>
                </div>
              )}
            </div>

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
      })
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8 pb-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                )
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2">...</span>
              }
              return null
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

function DescriptiveListComponent({ subject }) {
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
          📊 Total Questions: <span className="font-bold text-lg">{questions.length}</span>
        </p>
      </div>

      {questions.map((q, qIndex) => (
        <div key={q.id} className="border-2 border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
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

          <div className="mb-4">
            <p className="text-base lg:text-lg font-medium text-gray-900">
              {q.question}
            </p>
          </div>

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

          {q.sampleAnswer && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="text-sm font-semibold text-green-900 mb-2">📝 Sample Answer:</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{q.sampleAnswer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
