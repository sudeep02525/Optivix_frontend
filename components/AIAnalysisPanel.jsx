'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Brain, Info, Sparkles } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Real code analyzer ────────────────────────────────────────────────────────
function analyzeCodeForIssues(code, fileType = 'javascript') {
  if (!code || code.trim().length < 10) return []
  const issues = []
  const lines = code.split('\n')

  // ── JavaScript / TypeScript / JSX ──
  if (['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx'].includes(fileType)) {
    lines.forEach((line, i) => {
      const n = i + 1
      const t = line.trim()

      if (/console\.(log|warn|error|debug|info|table|trace)\(/.test(t) && !t.startsWith('//'))
        issues.push({ id:`bug-con-${n}`, type:'bug', severity:'low', line:n,
          title:'console left in code',
          description:`Line ${n}: console statements should not be in production. They can leak sensitive data and slow down performance.`,
          fix:'Remove all console statements or use a proper logging library.' })

      if (/([^=!])==([^=])/.test(line) && !t.startsWith('//') && !t.startsWith('*'))
        issues.push({ id:`bug-eq-${n}`, type:'bug', severity:'medium', line:n,
          title:'Loose equality (==)',
          description:`Line ${n}: == performs type coercion. Prefer === for strict checks.`,
          fix:'Replace == with === when both sides should be same type.' })

      if (/^\s*var\s+/.test(line))
        issues.push({ id:`bug-var-${n}`, type:'bug', severity:'low', line:n,
          title:'🐛 Using var instead of let/const',
          description:`Line ${n}: var has function scope and can cause hoisting bugs. Modern JavaScript uses let/const.`,
          fix:'Replace var with const (for values that don\'t change) or let (for values that change).' })

      if (/\.innerHTML\s*=/.test(t) && !t.startsWith('//'))
        issues.push({ id:`sec-ih-${n}`, type:'security', severity:'critical', line:n,
          title:'🔒 innerHTML — XSS Attack Risk!',
          description:`Line ${n}: Setting innerHTML with user data allows attackers to inject malicious scripts (XSS attacks).`,
          fix:'Use textContent for plain text, or use React JSX which auto-escapes content.' })

      if (/\beval\s*\(/.test(t) && !t.startsWith('//'))
        issues.push({ id:`sec-ev-${n}`, type:'security', severity:'critical', line:n,
          title:'🔒 eval() — Never use this!',
          description:`Line ${n}: eval() executes any string as code, making it extremely dangerous and a major security vulnerability.`,
          fix:'Remove eval(). Use JSON.parse() for JSON, or refactor your code logic.' })

      if (/(password|secret|api_key|apikey|token|private_key)\s*=\s*['"`][^'"`]{3,}/i.test(t) && !t.startsWith('//'))
        issues.push({ id:`sec-pw-${n}`, type:'security', severity:'critical', line:n,
          title:'🔒 Hardcoded Secret/Password!',
          description:`Line ${n}: Hardcoding secrets in source code is extremely dangerous. They can be exposed on GitHub or in client-side code.`,
          fix:'Move all secrets to environment variables (.env file) and add .env to .gitignore.' })

      if (/fetch\s*\(\s*['"`]http:\/\//.test(t) && !t.startsWith('//'))
        issues.push({ id:`sec-http-${n}`, type:'security', severity:'high', line:n,
          title:'🔒 Using HTTP instead of HTTPS',
          description:`Line ${n}: HTTP transmits data unencrypted, making it vulnerable to man-in-the-middle attacks.`,
          fix:'Always use https:// for API calls and external resources.' })

      if (/SELECT|INSERT|UPDATE|DELETE/i.test(t) && (/\+\s*\w+|"\s*\+|'[\s]*\+/.test(t)) && !t.startsWith('//'))
        issues.push({ id:`sec-sql-${n}`, type:'security', severity:'critical', line:n,
          title:'🔒 SQL injection risk',
          description:`Line ${n}: Building SQL with string concatenation allows attackers to inject malicious queries.`,
          fix:'Use parameterized queries: db.prepare(\'SELECT * FROM users WHERE id = ?\').get(userId)' })

      if (/JSON\.stringify/.test(t) && !t.startsWith('//') && /return|render|\{/.test(t))
        issues.push({ id:`pf-json-${n}`, type:'performance', severity:'medium', line:n,
          title:'⚡ JSON.stringify in render',
          description:`Line ${n}: JSON.stringify is expensive and runs on every render, causing performance issues.`,
          fix:'Wrap in useMemo: const stringified = useMemo(() => JSON.stringify(data), [data])' })

      if (/\.map\s*\(\s*\(.*,\s*index\s*\)/.test(t) || /key=\{index\}/.test(t))
        issues.push({ id:`pf-key-${n}`, type:'performance', severity:'medium', line:n,
          title:'⚡ Using array index as React key',
          description:`Line ${n}: Using index as key causes React to re-render incorrectly when items are added/removed/reordered.`,
          fix:'Use a unique identifier: key={item.id} or key={item.uniqueField}' })

      if (/setTimeout|setInterval/.test(t) && !t.startsWith('//') && !/clearTimeout|clearInterval/.test(code))
        issues.push({ id:`bug-timer-${n}`, type:'bug', severity:'medium', line:n,
          title:'🐛 Timer not cleaned up',
          description:`Line ${n}: Timers should be cleared to prevent memory leaks, especially in React components.`,
          fix:'Store timer ID and clear it: const id = setTimeout(...); return () => clearTimeout(id);' })
    })

    const effectCount = (code.match(/useEffect\s*\(/g)||[]).length
    const depsCount   = (code.match(/useEffect\s*\([^)]+,\s*\[/g)||[]).length
    if (effectCount > depsCount)
      issues.push({ id:'bug-eff', type:'bug', severity:'high', line:null,
        title:'🐛 useEffect missing dependency array',
        description:'useEffect without dependencies runs on every render, causing infinite loops and performance issues.',
        fix:'Add dependency array: useEffect(() => {...}, [dependencies])' })

    const asyncCount = (code.match(/async\s+function|async\s*\(/g)||[]).length
    const tryCount   = (code.match(/try\s*\{/g)||[]).length
    if (asyncCount > 0 && tryCount === 0)
      issues.push({ id:'bug-try', type:'bug', severity:'high', line:null,
        title:'🐛 Async function without error handling',
        description:`${asyncCount} async function(s) found but no try-catch. Unhandled promise rejections will crash your app.`,
        fix:'Wrap async code in try-catch: try { await fetch(...) } catch (error) { console.error(error) }' })
  }

  // ── JSON Analysis ──
  if (fileType === 'json') {
    try {
      JSON.parse(code)
      // Valid JSON - no issues
    } catch (e) {
      issues.push({ id:'json-invalid', type:'bug', severity:'critical', line:null,
        title:'🐛 Invalid JSON syntax',
        description:`JSON parsing error: ${e.message}`,
        fix:'Fix JSON syntax errors. Common issues: trailing commas, unquoted keys, single quotes instead of double quotes.' })
    }
  }

  // ── CSS Analysis ──
  if (fileType === 'css') {
    lines.forEach((line, i) => {
      const n = i + 1
      const t = line.trim()
      
      if (/!important/.test(t))
        issues.push({ id:`css-imp-${n}`, type:'bug', severity:'low', line:n,
          title:'⚠️ Using !important',
          description:`Line ${n}: !important makes CSS hard to maintain and override. It's usually a sign of poor CSS architecture.`,
          fix:'Refactor CSS to use proper specificity instead of !important.' })

      if (/color:\s*#[0-9a-f]{3}(?![0-9a-f])/i.test(t))
        issues.push({ id:`css-color-${n}`, type:'performance', severity:'low', line:n,
          title:'⚡ Use 6-digit hex colors',
          description:`Line ${n}: 3-digit hex colors are less precise. Use 6-digit for consistency.`,
          fix:'Convert #abc to #aabbcc for better color accuracy.' })
    })
  }

  // ── HTML Analysis ──
  if (fileType === 'html') {
    const imgWithoutAlt = (code.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length
    if (imgWithoutAlt > 0)
      issues.push({ id:'html-img-alt', type:'bug', severity:'high', line:null,
        title:`🐛 ${imgWithoutAlt} image(s) missing alt text`,
        description:'Images without alt text fail accessibility standards and hurt SEO.',
        fix:'Add descriptive alt text to all images: <img src="..." alt="Description of image">' })

    if (!/<title[^>]*>[^<]+<\/title>/i.test(code))
      issues.push({ id:'html-title', type:'bug', severity:'critical', line:null,
        title:'🐛 Missing <title> tag',
        description:'Every HTML page must have a title tag for SEO and browser tabs.',
        fix:'Add <title>Your Page Title</title> inside <head>.' })

    if (!/<meta[^>]+name=["']description["']/i.test(code))
      issues.push({ id:'html-desc', type:'bug', severity:'high', line:null,
        title:'🐛 Missing meta description',
        description:'Meta description is crucial for SEO and search engine snippets.',
        fix:'Add <meta name="description" content="Your page description"> in <head>.' })
  }

  const seen = new Set()
  return issues.filter(i => { const k=`${i.type}-${i.line}-${i.title}`; if(seen.has(k))return false; seen.add(k); return true })
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AIAnalysisPanel({ code, fileName, isHealing, isDarkMode, onRunFix, onCodeChange, onAnalysisUpdate }) {
  const [issues, setIssues]         = useState([])
  const [healthScore, setHealthScore] = useState(100)
  const [analyzing, setAnalyzing]   = useState(false)
  const [fileType, setFileType]     = useState('javascript')
  const [aiModel, setAiModel]       = useState(null)
  const [useRealAI, setUseRealAI]   = useState(true)
  const [aiError, setAiError]       = useState(null)
  const [hasAuthToken, setHasAuthToken] = useState(false)
  const [fixingId, setFixingId]     = useState(null)

  useEffect(() => {
    setHasAuthToken(!!(localStorage.getItem('nexus_token') || localStorage.getItem('token')))
  }, [])

  useEffect(() => {
    onAnalysisUpdate?.({ issues, healthScore, aiModel })
  }, [issues, healthScore, aiModel, onAnalysisUpdate])

  const fixSingleIssue = async (issue) => {
    if (!onCodeChange || isHealing) return
    setFixingId(issue.id)
    const token = localStorage.getItem('nexus_token') || localStorage.getItem('token')
    try {
      if (token) {
        const res = await fetch(`${API_URL}/api/ai/fix`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ code, issue, language: fileType }),
        })
        const data = await res.json()
        if (res.ok && data.fixedCode) {
          onCodeChange(data.fixedCode)
          if (data.aiModel) setAiModel(data.aiModel)
          return
        }
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
    if (!code || code.trim().length < 10) { setIssues([]); setHealthScore(100); return }
    
    setAnalyzing(true)
    setAiError(null)
    
    let cancelled = false
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem('nexus_token') || localStorage.getItem('token'))
      : null

    const applyLocal = () => {
      if (cancelled) return
      const found = analyzeCodeForIssues(code, fileType)
      setIssues(found)
      const c = found.filter(i=>i.severity==='critical').length
      const h = found.filter(i=>i.severity==='high').length
      const m = found.filter(i=>i.severity==='medium').length
      const l = found.filter(i=>i.severity==='low').length
      setHealthScore(Math.max(0, 100 - c*25 - h*15 - m*7 - l*2))
      setAnalyzing(false)
      setAiModel(null)
    }

    if (token && useRealAI) {
      ;(async () => {
        try {
          const res = await fetch(`${API_URL}/api/ai/analyze`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ code, language: fileType })
          })
          const data = await res.json()
          if (cancelled) return

          if (res.status === 429) {
            setAiError(data.message || 'Daily limit reached')
            applyLocal()
            return
          }

          if (res.ok && Array.isArray(data.issues)) {
            setIssues(data.issues)
            setHealthScore(typeof data.score === 'number' ? data.score : 50)
            setAiModel(data.aiModel || 'Server')
            setAnalyzing(false)
          } else {
            throw new Error(data.error || 'Analysis failed')
          }
        } catch (error) {
          console.error('AI Analysis error:', error)
          if (!cancelled) setAiError('Server unavailable — using local scan')
          applyLocal()
        }
      })()
      return () => { cancelled = true }
    }

    const t = setTimeout(applyLocal, 450)
    return () => { cancelled = true; clearTimeout(t) }
  }, [code, fileType, useRealAI])

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

  const healthColor = healthScore >= 80 ? '#4ade80'
                    : healthScore >= 60 ? '#fbbf24'
                    : healthScore >= 40 ? accent
                    : '#f87171'

  const healthLabel = healthScore >= 80 ? '✅ Good'
                    : healthScore >= 60 ? '⚠️ Fair'
                    : healthScore >= 40 ? '🔴 Has Issues'
                    : '🚨 Critical Issues'

  const secScore  = Math.max(0, 100 - issues.filter(i=>i.type==='security').length * 25)
  const perfScore = Math.max(0, 100 - issues.filter(i=>i.type==='performance').length * 15)

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: panelBg, border: `1px solid ${border}`, borderRadius: 12,
      overflow: 'hidden', color: textMain,
    }}>
      {/* Header */}
      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${divider}`, background: headerBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain style={{ width: 15, height: 15, color: accent }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>
            AI Analysis
          </span>
          {aiModel && (
            <span style={{ fontSize: 10, color: accent, background: 'rgba(91,156,245,0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>
              {aiModel}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasAuthToken && (
            <button
              onClick={() => setUseRealAI(!useRealAI)}
              title={useRealAI ? 'Using backend local AI' : 'Browser-only scan'}
              style={{
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: 6,
                border: 'none',
                background: useRealAI ? accent : 'rgba(91,156,245,0.15)',
                color: useRealAI ? '#0c0c0c' : textMid,
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Sparkles style={{ width: 10, height: 10 }} />
              {useRealAI ? 'Server' : 'Local'}
            </button>
          )}
          {analyzing && <span style={{ fontSize: 11, color: textDim }}>scanning...</span>}
        </div>
      </div>

      {aiError && (
        <div style={{ padding: '8px 12px', background: 'rgba(249,115,22,0.1)', borderBottom: `1px solid ${divider}` }}>
          <span style={{ fontSize: 11, color: '#fb923c' }}>⚠️ {aiError}</span>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Health Score */}
        <div style={{ padding: '14px', borderBottom: `1px solid ${divider}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: textMid }}>Code Health</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: healthColor }}>
              {healthScore}%
            </span>
          </div>
          <div style={{ fontSize: 11, color: textDim, marginBottom: 8 }}>{healthLabel}</div>
          <div style={{ height: 6, background: barBg, borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: healthColor, borderRadius: 99 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: scoreBg1, border: `1px solid rgba(91,156,245,0.2)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>{secScore}%</div>
              <div style={{ fontSize: 10, color: textDim }}>Security</div>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: scoreBg2, border: `1px solid rgba(91,156,245,0.15)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: accent }}>{perfScore}%</div>
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
          ) : issues.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', textAlign: 'center' }}>
              <CheckCircle style={{ width: 36, height: 36, color: '#4ade80', marginBottom: 10 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>No issues found!</span>
              <span style={{ fontSize: 11, color: textDim, marginTop: 4 }}>{fileType.toUpperCase()} · looks good</span>
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
            Apply bug fixes
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











