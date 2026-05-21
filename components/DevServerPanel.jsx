'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Square, ExternalLink, Terminal } from 'lucide-react'
import { getDevCwd, setDevCwd, startDevServer, stopDevServer, fetchDevStatus } from '@/lib/devServer'

export default function DevServerPanel({ folderName, onLogs, onPreviewUrl, isDarkMode }) {
  const [cwd, setCwd] = useState('')
  const [running, setRunning] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  useEffect(() => {
    setCwd(getDevCwd())
  }, [])

  useEffect(() => {
    if (folderName && !getDevCwd()) {
      setCwd(`C:\\Users\\${typeof window !== 'undefined' && navigator?.userAgent?.includes('Windows') ? 'user' : 'user'}\\Projects\\${folderName}`)
    }
  }, [folderName])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      const st = await fetchDevStatus()
      setRunning(st.running)
      if (st.previewUrl) {
        setPreviewUrl(st.previewUrl)
        onPreviewUrl?.(st.previewUrl)
      }
      if (st.logs?.length) onLogs?.(st.logs)
      if (!st.running) clearInterval(pollRef.current)
    }, 1500)
  }

  const handleStart = async () => {
    if (!cwd.trim()) {
      setError('Enter full folder path (where package.json lives)')
      return
    }
    setError('')
    setBusy(true)
    setDevCwd(cwd.trim())
    try {
      const res = await startDevServer(cwd.trim())
      if (!res.ok) {
        setError(res.error || 'Could not start')
        setRunning(false)
      } else {
        setRunning(true)
        onLogs?.([`▶ npm run dev — ${res.cwd}`, res.message || ''])
        startPolling()
      }
    } catch (e) {
      setError(e.message || 'Backend offline — start Optivix_backend')
    } finally {
      setBusy(false)
    }
  }

  const handleStop = async () => {
    setBusy(true)
    await stopDevServer()
    setRunning(false)
    setPreviewUrl(null)
    onPreviewUrl?.(null)
    onLogs?.(['⏹ Dev server stopped'])
    if (pollRef.current) clearInterval(pollRef.current)
    setBusy(false)
  }

  const border = 'var(--ide-border)'
  const textMain = 'var(--ide-text)'
  const textDim = 'var(--ide-text-muted)'
  const accent = 'var(--landing-accent)'

  return (
    <div style={{ padding: '10px 12px', borderTop: `1px solid ${border}`, background: 'var(--ide-hero-panel)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <Terminal style={{ width: 14, height: 14, color: accent }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: textMain }}>npm run dev</span>
        {running && (
          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: 'var(--landing-success)', fontWeight: 700 }}>
            LIVE
          </span>
        )}
      </div>
      <p style={{ fontSize: 10, color: textDim, marginBottom: 8, lineHeight: 1.45 }}>
        Same as terminal: runs <code style={{ fontSize: 9 }}>npm run dev</code> on your PC. Paste the full project path (Open Folder name: <strong>{folderName || '—'}</strong>).
      </p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input
          value={cwd}
          onChange={(e) => setCwd(e.target.value)}
          placeholder="C:\Projects\my-app"
          disabled={running}
          style={{
            flex: 1,
            fontSize: 11,
            padding: '7px 10px',
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: 'var(--ide-surface)',
            color: textMain,
            outline: 'none',
          }}
        />
      </div>
      {error && <div style={{ fontSize: 10, color: '#f87171', marginBottom: 8 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {!running ? (
          <button
            type="button"
            onClick={handleStart}
            disabled={busy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 8,
              border: 'none',
              background: accent,
              color: 'var(--landing-btn-text)',
              fontSize: 11,
              fontWeight: 700,
              cursor: busy ? 'wait' : 'pointer',
            }}
          >
            <Play style={{ width: 12, height: 12 }} />
            {busy ? 'Starting…' : 'npm run dev'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStop}
            disabled={busy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 8,
              border: '1px solid rgba(239,68,68,0.4)',
              background: 'rgba(239,68,68,0.1)',
              color: '#f87171',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Square style={{ width: 12, height: 12 }} />
            Stop
          </button>
        )}
        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 8,
              border: `1px solid ${border}`,
              color: accent,
              fontSize: 11,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ExternalLink style={{ width: 12, height: 12 }} />
            {previewUrl.replace(/^https?:\/\//, '')}
          </a>
        )}
      </div>
    </div>
  )
}
