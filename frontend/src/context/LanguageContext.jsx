import { createContext, useState, useContext } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [displayMode, setDisplayMode] = useState('both') // 'en', 'mr', 'both'

  const toggleLanguage = () => {
    if (displayMode === 'both') setDisplayMode('en')
    else if (displayMode === 'en') setDisplayMode('mr')
    else setDisplayMode('both')
  }

  return (
    <LanguageContext.Provider value={{ displayMode, setDisplayMode, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
