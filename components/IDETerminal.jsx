'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Terminal, Trash2, RefreshCw, FolderSync } from 'lucide-react'
import { getTerminalCwd, setTerminalCwd, terminalExec } from '@/lib/terminal'
import { syncWorkspaceToServer } from '@/lib/workspaceSync'

export default function IDETerminal({ folderName, folderOpened, fileStructure }) {
  const [lines, setLines] = useState([
    'Optivix Terminal — open a folder in Explorer, then run: npm install, npm run dev, mkdir src, etc.',
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('')
  const [busy, setBusy] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [ready, setReady] = useState(false)
  const bottomRef = useRef(null)
  const historyRef = useRef([])
  const histIdx = useRef(-1)
  const lastSyncKey = useRef('')

  const append = useCallback((newLines) => {
    setLines((prev) => (Array.isArray(newLines) ? newLines : [...prev, newLines]))
  }, [])

  const syncProject = useCallback(async () => {
    if (!folderOpened || !folderName || !fileStructure?.length) {
      append('[info] Explorer → Open Folder, then sync again')
      setReady(false)
      return
    }
    const key = `${folderName}-${fileStructure[0]?.children?.length || 0}`
    setSyncing(true)
    try {
      const res = await syncWorkspaceToServer(folderName, fileStructure, (msg) => {
        setLines((prev) => {
          const last = prev[prev.length - 1]
          if (last?.startsWith('[sync]')) return [...prev.slice(0, -1), `[sync] ${msg}`]
          return [...prev, `[sync] ${msg}`]
        })
      })
      if (!res.ok) {
        append(`[error] ${res.error}`)
        setReady(false)
        return
      }
      lastSyncKey.current = key
      setCwd(res.cwd || res.workspacePath)
      if (res.cwd || res.workspacePath) setTerminalCwd(res.cwd || res.workspacePath)
      setReady(true)
      append(
        `[optivix] Project synced (${res.written}/${res.total} files)\n[optivix] ${res.cwd || res.workspacePath}\n[optivix] Try: npm install · npm run dev · mkdir components`
      )
    } catch (e) {
      append(`[error] ${e.message || 'Sync failed — is backend running?'}`)
      setReady(false)
    } finally {
      setSyncing(false)
    }
  }, [folderOpened, folderName, fileStructure, append])

  useEffect(() => {
    const saved = getTerminalCwd()
    if (saved) setCwd(saved)
  }, [])

  useEffect(() => {
    if (!folderOpened || !folderName) return
    const key = `${folderName}-${fileStructure?.[0]?.children?.length || 0}`
    if (key !== lastSyncKey.current) syncProject()
  }, [folderOpened, folderName, fileStructure, syncProject])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const run = async (cmd) => {
    const command = (cmd || input).trim()
    if (!command) return

    if (!ready && !command.match(/^help$/i)) {
      append('[info] Syncing project first…')
      await syncProject()
      if (!ready) return
    }

    setBusy(true)
    historyRef.current.unshift(command)
    histIdx.current = -1
    try {
      const res = await terminalExec(command)
      if (res.history?.length) setLines(res.history)
      else if (res.error) append(`[error] ${res.error}`)
      if (res.cwd) {
        setCwd(res.cwd)
        setTerminalCwd(res.cwd)
      }
    } catch (e) {
      append(`[error] ${e.message || 'Backend offline — start Optivix_backend (npm run dev)'}`)
    } finally {
      setBusy(false)
      setInput('')
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      run()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyRef.current.length === 0) return
      histIdx.current = Math.min(histIdx.current + 1, historyRef.current.length - 1)
      setInput(historyRef.current[histIdx.current])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      histIdx.current = Math.max(histIdx.current - 1, -1)
      setInput(histIdx.current < 0 ? '' : historyRef.current[histIdx.current])
    }
  }

  const shortCwd = cwd ? cwd.replace(/\\/g, '/').split('/').slice(-2).join('/') : 'no project'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 140, background: '#0c0c0c' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          title="Sync folder to terminal"
          disabled={syncing || !folderOpened}
          onClick={syncProject}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 6,
            border: '1px solid rgba(91,156,245,0.35)',
            background: 'rgba(91,156,245,0.12)',
            color: '#5b9cf5',
            fontSize: 10,
            fontWeight: 600,
            cursor: syncing || !folderOpened ? 'not-allowed' : 'pointer',
            opacity: folderOpened ? 1 : 0.5,
          }}
        >
          {syncing ? <RefreshCw style={{ width: 11, height: 11, animation: 'spin 1s linear infinite' }} /> : <FolderSync style={{ width: 11, height: 11 }} />}
          {syncing ? 'Syncing…' : 'Sync project'}
        </button>
        <span style={{ fontSize: 10, color: ready ? '#4ade80' : '#64748b' }}>
          {ready ? '● Ready' : '○ Open folder + sync'}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', fontFamily: 'Consolas, monospace', fontSize: 11, lineHeight: 1.55 }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              color:
                line.startsWith('[error]') || line.startsWith('[stderr]')
                  ? '#f87171'
                  : line.startsWith('$') || line.startsWith('[optivix]')
                    ? '#5b9cf5'
                    : line.startsWith('[sync]') || line.startsWith('[info]')
                      ? '#94a3b8'
                      : '#e6edf3',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {line}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <Terminal style={{ width: 12, height: 12, color: '#5b9cf5', flexShrink: 0 }} />
        <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }} title={cwd}>
          {shortCwd}
        </span>
        <span style={{ color: '#5b9cf5', fontFamily: 'monospace', fontSize: 11 }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy || syncing}
          placeholder={busy ? 'Running…' : 'npm install'}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e6edf3',
            fontFamily: 'Consolas, monospace',
            fontSize: 11,
          }}
        />
        <button
          type="button"
          title="Clear"
          onClick={() => setLines(['Terminal cleared'])}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}
        >
          <Trash2 style={{ width: 12, height: 12 }} />
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
