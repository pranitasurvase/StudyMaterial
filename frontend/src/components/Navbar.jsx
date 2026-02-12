import { Link } from 'react-router-dom'
import { Brain, BookOpen, Menu, Languages } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../context/LanguageContext'
import { useState } from 'react'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const { displayMode, toggleLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getLanguageLabel = () => {
    if (displayMode === 'both') return 'EN + मराठी'
    if (displayMode === 'en') return 'English'
    return 'मराठी'
  }

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
            <span className="text-lg lg:text-2xl font-bold text-white">MPSC Revision AI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              title="Toggle Language"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">{getLanguageLabel()}</span>
            </button>

            <Link to="/practice-hub">
              <button className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Practice Hub</span>
              </button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <button className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                    Dashboard
                  </button>
                </Link>
                <Link to="/syllabus">
                  <button className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                    Syllabus
                  </button>
                </Link>
                <button 
                  onClick={logout}
                  className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {/* Language Toggle Mobile */}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              <Languages className="w-4 h-4" />
              <span className="text-sm font-medium">{getLanguageLabel()}</span>
            </button>

            <Link to="/practice-hub" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                Practice Hub
              </button>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                    Dashboard
                  </button>
                </Link>
                <Link to="/syllabus" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                    Syllabus
                  </button>
                </Link>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
