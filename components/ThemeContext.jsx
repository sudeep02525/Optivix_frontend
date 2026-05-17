'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem('optivix-theme')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error)
      // Continue with default theme (dark)
    }
  }, [])

  // Persist theme changes to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('optivix-theme', theme)
      } catch (error) {
        console.error('Failed to save theme preference:', error)
        // Continue without persistence
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return default values during SSR
    return { theme: 'dark', toggleTheme: () => {} }
  }
  return context
}
