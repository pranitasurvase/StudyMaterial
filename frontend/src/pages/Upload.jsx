import { useState } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { 
  Upload as UploadIcon, 
  FileText, 
  Brain, 
  Target, 
  CheckCircle,
  Sparkles,
  HelpCircle
} from 'lucide-react'

const sampleAnalysis = {
  topic: "Permanent Settlement System (1793)",
  subject: "History",
  examRelevance: "High",
  confidence: 85,
  possibleQuestions: [
    {
      type: "MCQ",
      probability: "High",
      question: "The Permanent Settlement was introduced by which Governor-General?",
      options: ["Warren Hastings", "Lord Cornwallis", "Lord Wellesley", "Lord Dalhousie"],
      answer: "Lord Cornwallis",
      explanation: "Direct factual question frequently asked in Prelims"
    },
    {
      type: "MCQ", 
      probability: "Medium",
      question: "Which of the following was NOT an effect of Permanent Settlement?",
      options: ["Fixed revenue for British", "Exploitation of peasants", "Rise of zamindars", "Improvement in agriculture"],
      answer: "Improvement in agriculture",
      explanation: "Cause-effect analysis type question"
    },
    {
      type: "Mains",
      probability: "High", 
      question: "Analyze the impact of Permanent Settlement on Indian agriculture and society.",
      points: ["Economic impact on peasants", "Rise of zamindari system", "British revenue security", "Long-term consequences"],
      explanation: "Analytical question for Mains examination"
    }
  ],
  pyqReferences: [
    { year: 2019, exam: "Prelims", question: "Permanent Settlement related MCQ" },
    { year: 2021, exam: "Mains", question: "Land revenue systems comparison" },
    { year: 2022, exam: "Prelims", question: "British policies in India" }
  ]
}

export default function Upload() {
  const [uploadedText, setUploadedText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleAnalyze = () => {
    if (!uploadedText.trim()) return
    
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      console.log("File dropped:", files[0])
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stop watching. Start <span className="text-blue-600">revising</span> for MPSC.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Turn your syllabus, books, and notes into exam-ready revision
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          
          {!showResults ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-8 space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                    dragActive 
                      ? "border-blue-500 bg-blue-50 scale-105" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    Upload Your Study Material
                  </h3>
                  <p className="text-gray-600 mb-6">
                    PDF, image, or paste text from your notes
                  </p>
                  <Button size="lg" variant="outline" className="px-8">
                    Choose Files
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Paste your text content
                  </label>
                  <textarea
                    value={uploadedText}
                    onChange={(e) => setUploadedText(e.target.value)}
                    placeholder="Paste your notes, book content, or any study material here..."
                    className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {uploadedText.length}/5000 characters
                    </p>
                    {uploadedText.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setUploadedText("")}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!uploadedText.trim() || isAnalyzing}
                  className="w-full py-4 text-lg"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-5 h-5 mr-3 animate-spin" />
                      Analyzing content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      Analyze & Predict Questions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{sampleAnalysis.topic}</h2>
                      <p className="text-gray-600">{sampleAnalysis.subject} • MPSC Relevance</p>
                    </div>
                    <Badge 
                      variant={sampleAnalysis.examRelevance === "High" ? "destructive" : "default"}
                      className="text-lg px-4 py-2"
                    >
                      {sampleAnalysis.examRelevance} Priority
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Confidence Score</span>
                      <span className="text-sm font-bold">{sampleAnalysis.confidence}%</span>
                    </div>
                    <Progress value={sampleAnalysis.confidence} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Notes
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target className="w-4 h-4 mr-2" />
                      Practice MCQs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Possible Exam Questions</CardTitle>
                  <CardDescription>Based on PYQ patterns and content analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sampleAnalysis.possibleQuestions.map((q, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={q.probability === "High" ? "destructive" : "default"}>
                            {q.probability} Probability
                          </Badge>
                          <Badge variant="outline">{q.type}</Badge>
                        </div>
                        
                        <h4 className="font-semibold mb-2">{q.question}</h4>
                        
                        {q.type === "MCQ" && q.options && (
                          <div className="space-y-1 mb-3">
                            {q.options.map((option, i) => (
                              <div 
                                key={i} 
                                className={`p-2 rounded text-sm ${
                                  option === q.answer ? "bg-green-50 text-green-700 font-medium" : "bg-gray-50"
                                }`}
                              >
                                {String.fromCharCode(65 + i)}. {option}
                                {option === q.answer && <CheckCircle className="w-4 h-4 inline ml-2" />}
                              </div>
                            ))}
                          </div>
                        )}

                        {q.type === "Mains" && q.points && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-2">Key points to cover:</p>
                            <ul className="text-sm space-y-1">
                              {q.points.map((point, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <HelpCircle className="w-4 h-4 inline mr-1" />
                          {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Previous Year Questions</CardTitle>
                  <CardDescription>Similar topics asked in past exams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleAnalysis.pyqReferences.map((ref, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{ref.question}</p>
                          <p className="text-sm text-gray-600">{ref.exam} {ref.year}</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button onClick={() => setShowResults(false)} variant="outline" className="flex-1">
                  Analyze Another Topic
                </Button>
                <Button className="flex-1">
                  Start Revision for This Topic
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
