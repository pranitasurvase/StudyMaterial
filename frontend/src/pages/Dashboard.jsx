import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import { BookOpen, Upload, Target, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    { label: 'Topics Covered', value: '24', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Questions Practiced', value: '156', icon: Target, color: 'text-green-600' },
    { label: 'Study Streak', value: '7 days', icon: TrendingUp, color: 'text-purple-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/upload">
              <Button className="w-full justify-start">
                <Upload className="w-5 h-5 mr-2" />
                Upload New Material
              </Button>
            </Link>
            <Link to="/syllabus">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-5 h-5 mr-2" />
                View Syllabus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
