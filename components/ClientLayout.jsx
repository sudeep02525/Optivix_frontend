'use client'

import { ThemeProvider } from './ThemeContext'

export default function ClientLayout({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
