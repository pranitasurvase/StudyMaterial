import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function SubjectSidebar({ subjects, selectedSubject, onSelectSubject }) {
  const [expandedSubjects, setExpandedSubjects] = useState({})

  const toggleSubject = (subjectName) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectName]: !prev[subjectName]
    }))
  }

  return (
    <div className="w-64 bg-gradient-to-b from-blue-500 to-blue-400 fixed left-0 top-0 bottom-0 overflow-y-auto hidden lg:block shadow-lg z-30 pt-16 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-500">
      {/* Full Width White Header */}
      <div className="bg-white py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">📚</span>
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Subjects</h2>
        </div>
      </div>
      
      {/* Subject List */}
      <div className="p-4">
        <div className="space-y-2">
          {subjects.map((subject) => (
            <div key={subject.name}>
              {/* Main Subject Button */}
              <button
                onClick={() => {
                  if (subject.subTopics) {
                    toggleSubject(subject.name)
                  } else {
                    onSelectSubject(subject.name)
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedSubject === subject.name && !subject.subTopics
                    ? 'bg-white text-blue-600 font-bold shadow-md transform scale-105'
                    : 'text-white hover:bg-white/20 font-semibold hover:translate-x-1'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{subject.icon}</span>
                    <span className="text-base">{subject.name}</span>
                  </div>
                  {subject.subTopics && (
                    <span className="text-white">
                      {expandedSubjects[subject.name] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* Sub-topics Dropdown */}
              {subject.subTopics && expandedSubjects[subject.name] && (
                <div className="ml-4 mt-2 space-y-1">
                  {subject.subTopics.map((subTopic) => (
                    <button
                      key={subTopic.name}
                      onClick={() => onSelectSubject(subTopic.name)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedSubject === subTopic.name
                          ? 'bg-white text-blue-600 font-bold shadow-md'
                          : 'text-white hover:bg-white/20 font-medium hover:translate-x-1'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{subTopic.icon}</span>
                        <span>{subTopic.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
