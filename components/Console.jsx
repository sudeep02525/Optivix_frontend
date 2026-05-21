'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const DEFAULT_MESSAGES = [
  { id: 'init', type: 'info', message: 'Optivix ready — open a folder or edit code to start', timestamp: now() },
]

function now() {
  return new Date().toLocaleTimeString('en-GB', { hour12: false })
}

export default function Console({ isDarkMode, fixLog = [], isFixing = false }) {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES)

  useEffect(() => {
    if (!fixLog || fixLog.length === 0) return
    const ts = now()
    const incoming = fixLog
      .filter((line) => line !== '')
      .map((line, i) => ({
        id: `fix-${ts}-${i}`,
        type: line.startsWith('──') ? 'info' : line.startsWith('✅') ? 'success' : line.startsWith('⚠️') ? 'warning' : line.includes('🔍') || line.includes('🐛') ? 'log' : 'info',
        message: line,
        timestamp: ts,
      }))
    setMessages((prev) => [...prev.slice(-80), ...incoming].slice(-120))
  }, [fixLog])

  useEffect(() => {
    if (isFixing) {
      setMessages((prev) => [
        ...prev,
        { id: `fix-start-${Date.now()}`, type: 'info', message: 'Running fix pipeline…', timestamp: now() },
      ])
    }
  }, [isFixing])

  const dark = isDarkMode !== false
  const textMid = dark ? 'rgba(224,224,224,0.7)' : 'rgba(26,26,46,0.7)'
  const textDim = dark ? 'rgba(224,224,224,0.4)' : 'rgba(26,26,46,0.4)'

  const getIcon = (type) => {
    const s = { width: 14, height: 14, flexShrink: 0 }
    switch (type) {
      case 'error':   return <AlertCircle style={{ ...s, color: '#f87171' }} />
      case 'warning': return <AlertTriangle style={{ ...s, color: '#facc15' }} />
      case 'success': return <CheckCircle style={{ ...s, color: '#4ade80' }} />
      case 'info':    return <Info style={{ ...s, color: '#38bdf8' }} />
      default:        return <Terminal style={{ ...s, color: textDim }} />
    }
  }

  const getMsgColor = (type) => {
    switch (type) {
      case 'error':   return '#f87171'
      case 'warning': return '#facc15'
      case 'success': return '#4ade80'
      case 'info':    return '#38bdf8'
      default:        return textMid
    }
  }

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', fontFamily: 'monospace', fontSize: '11px' }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: textDim }}>
            Console is empty
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '4px 8px',
                borderRadius: 6,
                marginBottom: 2,
                background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
              }}
            >
              <span style={{ color: textDim, width: 50, flexShrink: 0, fontSize: 10 }}>{msg.timestamp}</span>
              {getIcon(msg.type)}
              <span style={{ color: getMsgColor(msg.type), flex: 1, lineHeight: 1.4 }}>{msg.message}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
