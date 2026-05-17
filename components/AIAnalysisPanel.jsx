'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Brain, Info } from 'lucide-react'

// ── Real code analyzer ────────────────────────────────────────────────────────
function analyzeCodeForIssues(code) {
  if (!code || code.trim().length < 10) return []
  const issues = []
  const lines = code.split('\n')

  lines.forEach((line, i) => {
    const n = i + 1
    const t = line.trim()

    if (/console\.(log|warn|error|debug)\(/.test(t) && !t.startsWith('//'))
      issues.push({ id:`bug-con-${n}`, type:'bug', severity:'low', line:n,
        title:'🐛 console.log left in code',
        description:`Line ${n}: console.log should not be in production. It can leak data in the browser console.`,
        fix:'Remove this line or comment it out before deployment.' })

    if (/[^=!<>]==[^=]/.test(t) && !t.startsWith('//') && !t.startsWith('*'))
      issues.push({ id:`bug-eq-${n}`, type:'bug', severity:'medium', line:n,
        title:'🐛 Using == instead of ===',
        description:`Line ${n}: Double equals does not check type. "5"==5 returns true which is incorrect.`,
        fix:'Use === instead — it checks both value and type.' })

    if (/^\s*var\s+/.test(line))
      issues.push({ id:`bug-var-${n}`, type:'bug', severity:'low', line:n,
        title:'🐛 Using var instead of let/const',
        description:`Line ${n}: var is outdated and can cause hoisting bugs.`,
        fix:'Use let or const instead of var.' })

    if (/\.innerHTML\s*=/.test(t) && !t.startsWith('//'))
      issues.push({ id:`sec-ih-${n}`, type:'security', severity:'critical', line:n,
        title:'🔒 innerHTML — XSS Attack Risk!',
        description:`Line ${n}: Directly inserting user data into innerHTML is dangerous. Attackers can inject malicious code.`,
        fix:'Use textContent instead, or use React JSX.' })

    if (/\beval\s*\(/.test(t) && !t.startsWith('//'))
      issues.push({ id:`sec-ev-${n}`, type:'security', severity:'critical', line:n,
        title:'🔒 eval() — Never use this!',
        description:`Line ${n}: eval() executes any string as code — a major security hole.`,
        fix:'Remove eval(). There is no safe use case for it.' })

    if (/(password|secret|api_key|apikey|token)\s*=\s*['"`][^'"`]{3,}/i.test(t) && !t.startsWith('//'))
      issues.push({ id:`sec-pw-${n}`, type:'security', severity:'critical', line:n,
        title:'🔒 Password/Secret hardcoded in source!',
        description:`Line ${n}: Hardcoding secrets in source code is dangerous. It can be exposed on GitHub.`,
        fix:'Store secrets in a .env file and add it to .gitignore.' })

    if (/fetch\s*\(\s*['"`]http:\/\//.test(t) && !t.startsWith('//'))
      issues.push({ id:`sec-http-${n}`, type:'security', severity:'high', line:n,
        title:'🔒 Using HTTP instead of HTTPS',
        description:`Line ${n}: HTTP is not secure. Data is transmitted unencrypted.`,
        fix:'Replace http:// with https://.' })

    if (/JSON\.stringify/.test(t) && !t.startsWith('//'))
      issues.push({ id:`pf-json-${n}`, type:'performance', severity:'medium', line:n,
        title:'⚡ JSON.stringify is slow',
        description:`Line ${n}: Runs on every render which can slow down the app.`,
        fix:'Use useMemo so it only recalculates when data changes.' })

    if (/\.map\s*\(\s*\(.*,\s*index\s*\)/.test(t) || /key=\{index\}/.test(t))
      issues.push({ id:`pf-key-${n}`, type:'performance', severity:'medium', line:n,
        title:'⚡ Using array index as key',
        description:`Line ${n}: Using index as key confuses React when items are added or removed.`,
        fix:'Use a unique value like key={item.id} instead.' })
  })

  const effectCount = (code.match(/useEffect\s*\(/g)||[]).length
  const depsCount   = (code.match(/useEffect\s*\([^)]+,\s*\[/g)||[]).length
  if (effectCount > depsCount)
    issues.push({ id:'bug-eff', type:'bug', severity:'high', line:null,
      title:'🐛 useEffect missing dependency array',
      description:'useEffect without a dependency array can cause infinite loops or stale data.',
      fix:'Add [] as the second argument to useEffect.' })

  const asyncCount = (code.match(/async\s+function|async\s*\(/g)||[]).length
  const tryCount   = (code.match(/try\s*\{/g)||[]).length
  if (asyncCount > 0 && tryCount === 0)
    issues.push({ id:'bug-try', type:'bug', severity:'high', line:null,
      title:'🐛 Async function has no error handling',
      description:`${asyncCount} async function(s) found but no try-catch block. If the API fails, the app will crash.`,
      fix:'Wrap async functions in try-catch to handle errors gracefully.' })

  const seen = new Set()
  return issues.filter(i => { const k=`${i.type}-${i.line}-${i.title}`; if(seen.has(k))return false; seen.add(k); return true })
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AIAnalysisPanel({ code, isHealing, isDarkMode }) {
  const [issues, setIssues]         = useState([])
  const [healthScore, setHealthScore] = useState(100)
  const [analyzing, setAnalyzing]   = useState(false)

  const dark = isDarkMode !== false

  // Colors based on mode
  const panelBg   = dark ? '#18181b'              : '#e8edf5'
  const headerBg  = dark ? 'rgba(15,20,25,0.8)'   : 'rgba(210,220,235,0.9)'
  const border    = dark ? 'rgba(99,102,241,0.15)'  : 'rgba(0,150,200,0.25)'
  const divider   = dark ? 'rgba(99,102,241,0.08)'  : 'rgba(0,150,200,0.15)'
  const textMain  = dark ? '#e0e0e0'               : '#1a1a2e'
  const textMid   = dark ? 'rgba(224,224,224,0.65)': 'rgba(26,26,46,0.65)'
  const textDim   = dark ? 'rgba(224,224,224,0.4)' : 'rgba(26,26,46,0.4)'
  const scoreBg1  = dark ? 'rgba(99,102,241,0.08)'  : 'rgba(0,150,200,0.1)'
  const scoreBg2  = dark ? 'rgba(139,92,246,0.08)' : 'rgba(140,30,200,0.1)'
  const barBg     = dark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.08)'
  const fixBg     = dark ? 'rgba(0,0,0,0.25)'      : 'rgba(0,0,0,0.06)'

  useEffect(() => {
    if (!code || code.trim().length < 10) { setIssues([]); setHealthScore(100); return }
    setAnalyzing(true)
    const t = setTimeout(() => {
      const found = analyzeCodeForIssues(code)
      setIssues(found)
      const c = found.filter(i=>i.severity==='critical').length
      const h = found.filter(i=>i.severity==='high').length
      const m = found.filter(i=>i.severity==='medium').length
      const l = found.filter(i=>i.severity==='low').length
      setHealthScore(Math.max(0, 100 - c*25 - h*15 - m*7 - l*2))
      setAnalyzing(false)
    }, 600)
    return () => clearTimeout(t)
  }, [code])

  const severityColors = {
    critical: { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.35)',  text: '#f87171' },
    high:     { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.35)', text: '#fb923c' },
    medium:   { bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.35)',  text: '#facc15' },
    low:      { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.35)', text: '#60a5fa' },
  }

  const getIcon = (sev) => {
    const c = severityColors[sev]?.text || '#9ca3af'
    if (sev === 'critical' || sev === 'high') return <AlertTriangle style={{ width:14, height:14, color:c, flexShrink:0 }} />
    if (sev === 'medium') return <AlertCircle style={{ width:14, height:14, color:c, flexShrink:0 }} />
    return <Info style={{ width:14, height:14, color:c, flexShrink:0 }} />
  }

  const healthGrad = healthScore >= 80 ? '#b026ff, #00d9ff'
                   : healthScore >= 60 ? '#eab308, #00d9ff'
                   : healthScore >= 40 ? '#00d9ff, #ef4444'
                   : '#dc2626, #ef4444'

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
          <Brain style={{ width: 15, height: 15, color: '#00d9ff' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#00d9ff', WebkitTextFillColor: '#00d9ff' }}>
            AI Analysis
          </span>
        </div>
        {analyzing && <span style={{ fontSize: 11, color: textDim }}>scanning...</span>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Health Score */}
        <div style={{ padding: '14px', borderBottom: `1px solid ${divider}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: textMid }}>Code Health</span>
            <span style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(135deg,${healthGrad})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {healthScore}%
            </span>
          </div>
          <div style={{ fontSize: 11, color: textDim, marginBottom: 8 }}>{healthLabel}</div>
          <div style={{ height: 6, background: barBg, borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ height: '100%', background: `linear-gradient(90deg,${healthGrad})`, borderRadius: 99 }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: scoreBg1, border: `1px solid rgba(99,102,241,0.2)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#00d9ff' }}>{secScore}%</div>
              <div style={{ fontSize: 10, color: textDim }}>Security</div>
            </div>
            <div style={{ padding: '8px 10px', borderRadius: 8, background: scoreBg2, border: `1px solid rgba(139,92,246,0.2)` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#b026ff' }}>{perfScore}%</div>
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
                style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#00d9ff', marginBottom: 10 }}
              />
              <span style={{ fontSize: 11, color: textDim }}>Analyzing code...</span>
            </div>
          ) : issues.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', textAlign: 'center' }}>
              <CheckCircle style={{ width: 36, height: 36, color: '#b026ff', marginBottom: 10 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4ade80' }}>No issues found!</span>
              <span style={{ fontSize: 11, color: textDim, marginTop: 4 }}>Your code looks great 👍</span>
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
                  </motion.div>
                )
              })}
            </>
          )}
        </div>
      </div>

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











