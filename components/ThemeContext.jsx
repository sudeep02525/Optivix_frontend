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

  // Apply theme to <html> for CSS variables (landing, auth, body)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.classList.toggle('light-mode', theme === 'light')
    document.body.classList.toggle('dark-mode', theme === 'dark')
  }, [theme])

  // Persist theme changes to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('optivix-theme', theme)
      } catch (error) {
        console.error('Failed to save theme preference:', error)
      }
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
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
