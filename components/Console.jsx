'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, ChevronDown, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

export default function Console({ isDarkMode }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState([
    { id: '1', type: 'info',    message: 'Optivix initialized successfully',                          timestamp: '10:23:45' },
    { id: '2', type: 'log',     message: 'Analyzing code for issues...',                               timestamp: '10:23:46' },
    { id: '3', type: 'warning', message: 'Missing dependency in useEffect hook',                       timestamp: '10:23:47' },
    { id: '4', type: 'error',   message: 'SQL Injection vulnerability detected in searchUsers function', timestamp: '10:23:48' },
    { id: '5', type: 'warning', message: 'Performance issue: Using array index as React key',          timestamp: '10:23:49' },
    { id: '6', type: 'success', message: 'Analysis complete. 4 issues found.',                         timestamp: '10:23:50' },
  ])

  const dark = isDarkMode !== false

  const bg      = dark ? '#0f1419'           : '#e2e8f0'
  const border  = dark ? 'rgba(0,217,255,0.1)' : 'rgba(0,150,200,0.2)'
  const textMid = dark ? 'rgba(224,224,224,0.7)' : 'rgba(26,26,46,0.7)'
  const textDim = dark ? 'rgba(224,224,224,0.4)' : 'rgba(26,26,46,0.4)'
  const hoverBg = dark ? 'rgba(0,217,255,0.05)'  : 'rgba(0,150,200,0.07)'

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
        background: bg,
        borderTop: `1px solid ${border}`,
        borderRadius: '10px',
        overflow: 'hidden',
        height: isExpanded ? '160px' : '38px',
        transition: 'height 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{
        height: '38px',
        borderBottom: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: textMid, fontSize: '12px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronDown
            style={{ width: 14, height: 14, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          />
          <Terminal style={{ width: 14, height: 14 }} />
          Console
        </button>
        <button
          onClick={() => setMessages([])}
          style={{ fontSize: '11px', color: textDim, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 4 }}
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      {isExpanded && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px', fontFamily: 'monospace', fontSize: '11px' }}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: textDim }}>
              Console is empty
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  padding: '3px 6px',
                  borderRadius: 4,
                  marginBottom: 1,
                }}
              >
                <span style={{ color: textDim, width: 44, flexShrink: 0 }}>{msg.timestamp}</span>
                {getIcon(msg.type)}
                <span style={{ color: getMsgColor(msg.type), flex: 1 }}>{msg.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

