'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, ChevronDown, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export default function Console({ isDarkMode }) {
  const [messages, setMessages] = useState([
    { id: '1', type: 'info',    message: 'Optivix initialized successfully',                          timestamp: '10:23:45' },
    { id: '2', type: 'log',     message: 'Analyzing code for issues...',                               timestamp: '10:23:46' },
    { id: '3', type: 'warning', message: 'Missing dependency in useEffect hook',                       timestamp: '10:23:47' },
    { id: '4', type: 'error',   message: 'SQL Injection vulnerability detected in searchUsers function', timestamp: '10:23:48' },
    { id: '5', type: 'warning', message: 'Performance issue: Using array index as React key',          timestamp: '10:23:49' },
    { id: '6', type: 'success', message: 'Analysis complete. 4 issues found.',                         timestamp: '10:23:50' },
  ])

  const dark = isDarkMode !== false

  const border  = dark ? 'rgba(99,102,241,0.1)' : 'rgba(0,150,200,0.2)'
  const textMid = dark ? 'rgba(224,224,224,0.7)' : 'rgba(26,26,46,0.7)'
  const textDim = dark ? 'rgba(224,224,224,0.4)' : 'rgba(26,26,46,0.4)'

  const getIcon = (type) => {
    switch (type) {
      case 'error':   return <AlertCircle  className="w-3.5 h-3.5 text-red-500 shrink-0" />
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
      case 'success': return <CheckCircle  className="w-3.5 h-3.5 text-green-500 shrink-0" />
      case 'info':    return <Info         className="w-3.5 h-3.5 text-sky-400 shrink-0" />
      default:        return <Terminal     className="w-3.5 h-3.5 shrink-0" style={{ color: textDim }} />
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
    <div
      style={{
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Messages */}
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
      
      {/* Footer with clear button */}
      <div style={{
        borderTop: `1px solid ${border}`,
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'flex-end',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setMessages([])}
          style={{ 
            fontSize: '11px', 
            color: textDim, 
            background: dark ? 'rgba(99,102,241,0.1)' : 'rgba(0,150,200,0.1)', 
            border: `1px solid ${border}`, 
            cursor: 'pointer', 
            padding: '4px 12px', 
            borderRadius: 6,
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.2)' : 'rgba(0,150,200,0.2)'
            e.currentTarget.style.color = textMid
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.1)' : 'rgba(0,150,200,0.1)'
            e.currentTarget.style.color = textDim
          }}
        >
          Clear Console
        </button>
      </div>
    </div>
  )
}











