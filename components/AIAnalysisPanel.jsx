'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Brain, Info, Sparkles } from 'lucide-react'
import {
  analyzeCodeForIssues,
  applyLocalFix,
  checkIncompleteSource,
  computeHealthScore,
  mergeAnalysisIssues,
  MIN_CODE_LENGTH_FOR_SCAN,
} from '@/lib/codeAnalyzer'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const SCAN_MODE_KEY = 'optivix_scan_mode'

export default function AIAnalysisPanel({ code, fileName, isHealing, isDarkMode, onRunFix, onCodeChange, onAnalysisUpdate }) {
  const [issues, setIssues]         = useState([])
  const [healthScore, setHealthScore] = useState(null)
  const [analyzing, setAnalyzing]   = useState(false)
  const [scanStatus, setScanStatus] = useState('empty')
  const [fileType, setFileType]     = useState('javascript')
  const [aiModel, setAiModel]       = useState(null)
  const [useRealAI, setUseRealAI]   = useState(true)
  const [aiError, setAiError]       = useState(null)
  const [hasAuthToken, setHasAuthToken] = useState(false)
  const [fixingId, setFixingId]     = useState(null)
  const [backendOnline, setBackendOnline] = useState(null)

  useEffect(() => {
    setHasAuthToken(!!(localStorage.getItem('nexus_token') || localStorage.getItem('token')))
    const saved = localStorage.getItem(SCAN_MODE_KEY)
    if (saved === 'local') setUseRealAI(false)
    if (saved === 'backend') setUseRealAI(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch(`${API_URL}/api/ai/health`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => { if (!cancelled) setBackendOnline(true) })
      .catch(() => { if (!cancelled) setBackendOnline(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    onAnalysisUpdate?.({ issues, healthScore, aiModel })
  }, [issues, healthScore, aiModel, onAnalysisUpdate])

  const fixSingleIssue = async (issue) => {
    if (!onCodeChange || isHealing) return
    setFixingId(issue.id)
    const token = localStorage.getItem('nexus_token') || localStorage.getItem('token')
    try {
      if (token && useRealAI) {
        const res = await fetch(`${API_URL}/api/ai/fix`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ code, issue, language: fileType }),
        })
        const data = await res.json()
        if (res.ok && data.fixedCode && data.fixedCode !== code) {
          onCodeChange(data.fixedCode)
          if (data.aiModel) setAiModel(data.aiModel)
          return
        }
      }
      const locallyFixed = applyLocalFix(code, issue, fileType, fileName)
      if (locallyFixed !== code) {
        onCodeChange(locallyFixed)
        setAiModel(useRealAI ? 'Fixed in editor (local)' : 'Quick Scan fix')
        return
      }
      if (onRunFix) onRunFix('bugs')
    } finally {
      setFixingId(null)
    }
  }

  const dark = isDarkMode !== false

  // Colors based on mode
  const panelBg   = 'var(--ide-surface)'
  const headerBg  = 'var(--ide-hero-panel)'
  const border    = 'var(--ide-border)'
  const divider   = 'var(--ide-border)'
  const textMain  = 'var(--ide-text)'
  const textMid   = 'var(--ide-text-muted)'
  const textDim   = 'var(--ide-text-dim)'
  const scoreBg1  = 'var(--landing-accent-soft)'
  const scoreBg2  = 'var(--landing-accent-soft)'
  const barBg     = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)'
  const fixBg     = 'var(--ide-hero-panel)'
  const accent    = 'var(--landing-accent)'

  // Prefer extension from open file, then sniff content
  useEffect(() => {
    if (fileName) {
      const ext = fileName.split('.').pop()?.toLowerCase()
      const byExt = {
        html: 'html', htm: 'html', css: 'css', json: 'json',
        js: 'javascript', jsx: 'javascript', mjs: 'javascript',
        ts: 'typescript', tsx: 'typescript',
      }
      if (byExt[ext]) {
        setFileType(byExt[ext])
        return
      }
    }
    if (!code || code.trim().length < 10) return
    
    // Check if it's JSON
    const trimmed = code.trim()
    if ((trimmed.startsWith('{') || trimmed.startsWith('[')) && (trimmed.endsWith('}') || trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed)
        setFileType('json')
        return
      } catch (e) {
        // Not valid JSON, continue
      }
    }
    
    // Check if it's HTML
    if (/<html|<!DOCTYPE|<head|<body/i.test(code)) {
      setFileType('html')
      return
    }
    
    // Check if it's CSS
    if (/^[\s]*[.#]?[\w-]+\s*\{[\s\S]*\}/m.test(code) && !/(function|const|let|var|import|export)/i.test(code)) {
      setFileType('css')
      return
    }

    // TypeScript / TSX heuristics
    if (/\b(interface|type)\s+\w+/.test(code) || /:\s*(string|number|boolean|void|unknown)\b/.test(code)) {
      setFileType('typescript')
      return
    }
    
    // Default to JavaScript
    setFileType('javascript')
  }, [code, fileName])

  useEffect(() => {
    const trimmed = (code || '').trim()
    setAiError(null)

    if (!trimmed) {
      setIssues([])
      setHealthScore(null)
      setScanStatus('empty')
      setAnalyzing(false)
      setAiModel(null)
      return
    }

    if (trimmed.length < MIN_CODE_LENGTH_FOR_SCAN) {
      setIssues([])
      setHealthScore(null)
      setScanStatus('too_short')
      setAnalyzing(false)
      setAiModel(null)
      return
    }

    setAnalyzing(true)
    setScanStatus('scanning')
    setIssues([])

    let cancelled = false
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('nexus_token') || localStorage.getItem('token'))
      : null

    const applyLocal = () => {
      if (cancelled) return
      const result = analyzeCodeForIssues(code, fileType, fileName)
      setIssues(result.issues)
      setHealthScore(result.score)
      setScanStatus(result.status === 'ok' ? 'done' : result.status)
      setAnalyzing(false)
      setAiModel('Quick Scan · detect only')
    }

    if (token && useRealAI) {
      ;(async () => {
        try {
          const res = await fetch(`${API_URL}/api/ai/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ code, language: fileType, fileName: fileName || '' }),
          })
          const data = await res.json()
          if (cancelled) return

          if (res.status === 429) {
            setAiError(data.message || 'Daily limit reached')
            applyLocal()
            return
          }

          if (res.ok && Array.isArray(data.issues)) {
            const structural = checkIncompleteSource(code, fileName)
            const merged = mergeAnalysisIssues(data.issues, structural)
            setIssues(merged)
            setHealthScore(
              merged.length > 0
                ? computeHealthScore(merged)
                : typeof data.score === 'number'
                  ? data.score
                  : 100
            )
            setAiModel(data.aiModel ? `${data.aiModel} · scan only` : 'Backend · scan only')
            setScanStatus('done')
            setAnalyzing(false)
            setBackendOnline(true)
          } else {
            throw new Error(data.error || 'Analysis failed')
          }
        } catch (error) {
          console.error('AI Analysis error:', error)
          if (!cancelled) {
            setAiError('Backend offline — using Quick Scan. Start Optivix_backend on port 5000.')
            setBackendOnline(false)
          }
          applyLocal()
        }
      })()
      return () => { cancelled = true }
    }

    const t = setTimeout(applyLocal, 180)
    return () => { cancelled = true; clearTimeout(t) }
  }, [code, fileType, useRealAI])

  const toggleScanMode = () => {
    setUseRealAI((prev) => {
      const next = !prev
      localStorage.setItem(SCAN_MODE_KEY, next ? 'backend' : 'local')
      return next
    })
  }

  const severityColors = {
    critical: { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.35)',  text: '#f87171' },
    high:     { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.35)', text: '#fb923c' },
    medium:   { bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.35)',  text: '#facc15' },
    low:      { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.35)', text: '#60a5fa' },
  }

  const getIcon = (sev) => {
    const c = severityColors[sev]?.text || 'var(--ide-text-dim)'
    if (sev === 'critical' || sev === 'high') return <AlertTriangle style={{ width:14, height:14, color:c, flexShrink:0 }} />
    if (sev === 'medium') return <AlertCircle style={{ width:14, height:14, color:c, flexShrink:0 }} />
    return <Info style={{ width:14, height:14, color:c, flexShrink:0 }} />
  }

  const scoreReady = typeof healthScore === 'number'
  const hasOpenIssues = issues.length > 0 && scanStatus === 'done'

  const healthColor = !scoreReady
    ? textDim
    : hasOpenIssues
      ? healthScore >= 60
        ? '#fbbf24'
        : '#f87171'
      : healthScore >= 80
        ? '#4ade80'
        : healthScore >= 60
          ? '#fbbf24'
          : healthScore >= 40
            ? accent
            : '#f87171'

  const healthLabel = scanStatus === 'empty'
    ? 'Editor empty'
    : scanStatus === 'too_short'
      ? `Need ${MIN_CODE_LENGTH_FOR_SCAN}+ characters`
      : analyzing
        ? 'Scanning…'
        : !scoreReady
          ? '—'
          : hasOpenIssues
            ? `🔴 ${issues.length} issue(s) — click Fix below`
            : healthScore >= 80
              ? '✅ No issues detected'
              : healthScore >= 60
                ? '⚠️ Fair'
                : '🔴 Has Issues'

  const secScore  = scoreReady ? Math.max(0, 100 - issues.filter(i=>i.type==='security').length * 25) : null
  const perfScore = scoreReady ? Math.max(0, 100 - issues.filter(i=>i.type==='performance').length * 15) : null

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: panelBg, overflow: 'hidden', color: textMain,
    }}>
      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${divider}`, background: headerBg, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <Brain style={{ width: 14, height: 14, color: accent, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: textMain }}>Analysis</span>
            {aiModel && (
              <span style={{ fontSize: 9, color: accent, background: 'var(--landing-accent-soft)', padding: '2px 6px', borderRadius: 4, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                {aiModel}
              </span>
            )}
          </div>
          {hasAuthToken && (
            <button
              type="button"
              onClick={toggleScanMode}
              style={{
                fontSize: 10, padding: '4px 8px', borderRadius: 6, border: `1px solid ${border}`,
                background: useRealAI ? accent : 'transparent',
                color: useRealAI ? 'var(--landing-btn-text)' : textMid,
                cursor: 'pointer', fontWeight: 600, flexShrink: 0,
              }}
            >
              {useRealAI ? 'AI' : 'Quick'}
            </button>
          )}
        </div>
        {analyzing && <div style={{ fontSize: 10, color: textDim }}>Scanning…</div>}
      </div>

      {(aiError || (useRealAI && backendOnline === false)) && (
        <div style={{ padding: '6px 12px', background: 'rgba(249,115,22,0.08)', borderBottom: `1px solid ${divider}`, fontSize: 10, color: '#fb923c' }}>
          ⚠️ {aiError || 'Start backend: Optivix_backend npm run dev'}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Health Score */}
        <div style={{ padding: '14px', borderBottom: `1px solid ${divider}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: textMid }}>Code Health</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: healthColor }}>
              {scoreReady ? `${healthScore}%` : '—'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: textDim, marginBottom: 8 }}>{healthLabel}</div>
          <div style={{ height: 6, background: barBg, borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: scoreReady ? `${healthScore}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: healthColor, borderRadius: 99 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: scoreBg1, border: `1px solid rgba(91,156,245,0.2)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>{secScore != null ? `${secScore}%` : '—'}</div>
              <div style={{ fontSize: 10, color: textDim }}>Security</div>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: scoreBg2, border: `1px solid rgba(91,156,245,0.15)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>{perfScore != null ? `${perfScore}%` : '—'}</div>
              <div style={{ fontSize: 10, color: textDim }}>Performance</div>
            </div>
          </div>
        </div>

        {/* Issues */}
        <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {analyzing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(91,156,245,0.2)', borderTopColor: accent, marginBottom: 10 }}
              />
              <span style={{ fontSize: 11, color: textDim }}>Analyzing code...</span>
            </div>
          ) : scanStatus === 'empty' || scanStatus === 'too_short' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', textAlign: 'center' }}>
              <Info style={{ width: 32, height: 32, color: textDim, marginBottom: 10 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: textMid }}>
                {scanStatus === 'empty' ? 'Start typing to scan' : `Type at least ${MIN_CODE_LENGTH_FOR_SCAN} characters`}
              </span>
              <span style={{ fontSize: 11, color: textDim, marginTop: 4 }}>
                Score is not shown until there is enough code to analyze
              </span>
            </div>
          ) : issues.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', textAlign: 'center' }}>
              <CheckCircle style={{ width: 36, height: 36, color: '#4ade80', marginBottom: 10 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>No issues found</span>
              <span style={{ fontSize: 11, color: textDim, marginTop: 4 }}>
                {useRealAI ? 'Backend AI' : 'Quick Scan'} · {fileType.toUpperCase()} · no rule matches
              </span>
            </div>
          ) : (
            <>
              <span style={{ fontSize: 11, color: textDim }}>{issues.length} issue{issues.length !== 1 ? 's' : ''} found:</span>
              {issues.map((issue, idx) => {
                const sc = severityColors[issue.severity] || severityColors.low
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 10, padding: '10px 12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      {getIcon(issue.severity)}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: sc.text, lineHeight: 1.3 }}>{issue.title}</div>
                        {issue.line && <div style={{ fontSize: 10, color: textDim, marginTop: 2 }}>Line {issue.line}</div>}
                      </div>
                      <span style={{ fontSize: 9, color: sc.text, opacity: 0.7, textTransform: 'uppercase', flexShrink: 0, fontWeight: 600 }}>{issue.severity}</span>
                    </div>
                    <p style={{ fontSize: 11, color: textMid, lineHeight: 1.5, marginBottom: 8 }}>{issue.description}</p>
                    <div style={{ fontSize: 11, background: fixBg, borderRadius: 6, padding: '6px 8px', borderLeft: `2px solid ${sc.border}` }}>
                      <span style={{ color: textDim }}>💡 Fix: </span>
                      <span style={{ color: textMid }}>{issue.fix}</span>
                    </div>
                    {onCodeChange && (
                      <button type="button" disabled={isHealing || fixingId === issue.id} onClick={() => fixSingleIssue(issue)} style={{ width: '100%', marginTop: 8, padding: '6px 10px', borderRadius: 6, border: 'none', background: accent, color: 'var(--landing-btn-text)', fontSize: 10, fontWeight: 700, cursor: isHealing ? 'wait' : 'pointer' }}>
                        {fixingId === issue.id ? 'Applying…' : 'Apply this fix'}
                      </button>
                    )}
                  </motion.div>
                )
              })}
            </>
          )}
        </div>
      </div>

      {onRunFix && issues.length > 0 && !analyzing && (
        <div style={{
          padding: '10px 12px', borderTop: `1px solid ${divider}`,
          display: 'flex', gap: 8, flexWrap: 'wrap', flexShrink: 0,
        }}>
          <button
            type="button"
            disabled={isHealing}
            onClick={() => onRunFix('bugs')}
            style={{
              flex: 1, minWidth: 100, padding: '8px 12px', borderRadius: 8, border: 'none',
              background: accent, color: 'var(--landing-btn-text)', fontSize: 11, fontWeight: 700,
              cursor: isHealing ? 'wait' : 'pointer', opacity: isHealing ? 0.6 : 1,
            }}
          >
            Fix all in editor
          </button>
          {(fileType === 'html' || issues.some(i => String(i.id || '').startsWith('html'))) && (
            <button
              type="button"
              disabled={isHealing}
              onClick={() => onRunFix('seo')}
              style={{
                flex: 1, minWidth: 100, padding: '8px 12px', borderRadius: 8,
                border: `1px solid ${border}`, background: 'transparent',
                color: textMain, fontSize: 11, fontWeight: 700,
                cursor: isHealing ? 'wait' : 'pointer', opacity: isHealing ? 0.6 : 1,
              }}
            >
              Apply SEO fixes
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${divider}`, background: headerBg, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flexShrink: 0 }}>
        {[
          { label: 'Bugs',        color: '#f87171', count: issues.filter(i=>i.type==='bug').length },
          { label: 'Security',    color: '#fb923c', count: issues.filter(i=>i.type==='security').length },
          { label: 'Performance', color: '#facc15', count: issues.filter(i=>i.type==='performance').length },
        ].map(({ label, color, count }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color }}>{count}</div>
            <div style={{ fontSize: 10, color: textDim }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}











