import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { 
  BookOpen, 
  Brain, 
  Target, 
  Clock, 
  CheckCircle, 
  Play,
  FileText,
  HelpCircle,
  ArrowLeft
} from 'lucide-react'

const syllabusData = {
  prelims: {
    "General Studies": {
      History: [
        { 
          id: 1, 
          title: "Ancient India", 
          topics: ["Indus Valley Civilization", "Vedic Period", "Mauryan Empire", "Gupta Period"],
          completed: 2,
          total: 4,
          difficulty: "Medium",
          pyqCount: 15
        },
        { 
          id: 2, 
          title: "Medieval India", 
          topics: ["Delhi Sultanate", "Mughal Empire", "Maratha Empire", "Regional Kingdoms"],
          completed: 1,
          total: 4,
          difficulty: "Medium",
          pyqCount: 12
        },
        { 
          id: 3, 
          title: "Modern India", 
          topics: ["British Rule", "Freedom Movement", "Partition", "Post-Independence"],
          completed: 0,
          total: 4,
          difficulty: "High",
          pyqCount: 25
        }
      ],
      Geography: [
        { 
          id: 4, 
          title: "Physical Geography", 
          topics: ["Earth Structure", "Climate", "Natural Resources", "Disasters"],
          completed: 3,
          total: 4,
          difficulty: "Medium",
          pyqCount: 18
        },
        { 
          id: 5, 
          title: "Indian Geography", 
          topics: ["Physical Features", "Climate Zones", "Rivers", "Agriculture"],
          completed: 1,
          total: 4,
          difficulty: "High",
          pyqCount: 22
        }
      ],
      Polity: [
        { 
          id: 6, 
          title: "Constitution", 
          topics: ["Fundamental Rights", "DPSP", "Amendment Process", "Emergency Provisions"],
          completed: 0,
          total: 4,
          difficulty: "High",
          pyqCount: 30
        }
      ]
    }
  },
  mains: {
    "General Studies": {
      "GS Paper I": [
        { 
          id: 7, 
          title: "Indian Heritage", 
          topics: ["Art Forms", "Literature", "Architecture", "Philosophy"],
          completed: 0,
          total: 4,
          difficulty: "High",
          pyqCount: 8
        }
      ]
    }
  }
}

export default function Syllabus() {
  const [selectedExam, setSelectedExam] = useState("prelims")
  const [selectedSubject, setSelectedSubject] = useState("History")

  const currentData = syllabusData[selectedExam]["General Studies"]
  const subjects = Object.keys(currentData)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Exam Selection */}
        <div className="mb-8">
          <div className="flex justify-center gap-4">
            <Button
              variant={selectedExam === "prelims" ? "default" : "outline"}
              onClick={() => setSelectedExam("prelims")}
            >
              Prelims
            </Button>
            <Button
              variant={selectedExam === "mains" ? "default" : "outline"}
              onClick={() => setSelectedExam("mains")}
            >
              Mains
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Subject Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Subjects</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        selectedSubject === subject ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject}</span>
                        <Badge variant="secondary" className="text-xs">
                          {currentData[subject]?.length || 0}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedSubject}</h1>
              <p className="text-gray-600">
                {selectedExam === "prelims" ? "Prelims" : "Mains"} • {currentData[selectedSubject]?.length || 0} chapters
              </p>
            </div>

            {/* Topic Cards */}
            <div className="space-y-6">
              {currentData[selectedSubject]?.map((chapter) => (
                <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{chapter.title}</CardTitle>
                        <CardDescription className="mb-4">
                          {chapter.topics.join(" • ")}
                        </CardDescription>
                        
                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm font-medium">
                              {chapter.completed}/{chapter.total} topics
                            </span>
                          </div>
                          <Progress 
                            value={(chapter.completed / chapter.total) * 100} 
                            className="h-2"
                          />
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          <Badge 
                            variant={chapter.difficulty === "High" ? "destructive" : 
                                   chapter.difficulty === "Medium" ? "default" : "secondary"}
                          >
                            {chapter.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            <Target className="w-3 h-3 mr-1" />
                            {chapter.pyqCount} PYQs
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            ~{chapter.total * 5} min
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {chapter.topics.map((topic, index) => (
                        <Button
                          key={index}
                          variant={index < chapter.completed ? "default" : "outline"}
                          size="sm"
                          className="justify-start h-auto py-3 px-4"
                        >
                          <div className="flex items-center space-x-2">
                            {index < chapter.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            <div className="text-left">
                              <div className="font-medium text-sm">{topic}</div>
                              <div className="text-xs opacity-70">
                                {index < chapter.completed ? "Completed" : "Start"}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-4 border-t">
                      <Button className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Notes
                      </Button>
                      <Button variant="outline">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        PYQs
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {!currentData[selectedSubject] && (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No topics available</h3>
                  <p className="text-gray-600">This subject is coming soon!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
