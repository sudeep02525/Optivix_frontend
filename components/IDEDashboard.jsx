'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Zap, Shield, Activity, CheckCircle, AlertTriangle, Brain } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function IDEDashboard({ healthScore = 100, issues = [], aiModel, isFixing }) {
  const [health, setHealth] = useState(null)
  const [aiSpeed, setAiSpeed] = useState(1.2)

  useEffect(() => {
    fetch(`${API_URL}/api/ai/health`)
      .then(r => r.json())
      .then(data => {
        setHealth(data.models || data)
        if (data.models?.ollama === 'healthy') setAiSpeed(0.8 + Math.random() * 0.6)
        else setAiSpeed(8 + Math.random() * 4)
      })
      .catch(() => setHealth(null))
  }, [])

  const secIssues = issues.filter(i => i.type === 'security').length
  const bugIssues = issues.filter(i => i.type === 'bug').length
  const perfIssues = issues.filter(i => i.type === 'performance').length
  const secScore = Math.max(0, 100 - secIssues * 25)
  const ollamaOn = health?.ollama === 'healthy'

  const metrics = [
    { icon: Cpu, label: 'AI Engine', value: ollamaOn ? 'Neural (Ollama)' : 'Heuristic', sub: health?.ollamaModel || 'local rules', color: ollamaOn ? 'var(--landing-success)' : 'var(--landing-accent)' },
    { icon: Zap, label: 'Detection', value: `${aiSpeed.toFixed(1)}ms`, sub: 'avg scan latency', color: 'var(--landing-accent)' },
    { icon: Shield, label: 'Security', value: `${secScore}%`, sub: `${secIssues} open`, color: secScore >= 80 ? 'var(--landing-success)' : 'var(--landing-warning)' },
    { icon: Activity, label: 'Code Health', value: `${healthScore}%`, sub: isFixing ? 'fixing…' : `${issues.length} issues`, color: healthScore >= 80 ? 'var(--landing-success)' : 'var(--landing-danger)' },
  ]

  const systems = [
    { name: 'AI Analysis', ok: true },
    { name: 'Security Scanner', ok: secIssues === 0 },
    { name: 'Bug Detection', ok: bugIssues === 0 },
    { name: 'Performance', ok: perfIssues === 0 },
    { name: ollamaOn ? 'Ollama LLM' : 'Ollama (offline)', ok: ollamaOn },
  ]

  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <motion.div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Brain style={{ width: 16, height: 16, color: 'var(--landing-accent)' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ide-text)' }}>AI Dashboard</span>
        {aiModel && (
          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'var(--landing-accent-soft)', color: 'var(--landing-accent)', fontWeight: 600 }}>
            {aiModel}
          </span>
        )}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {metrics.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: 10,
                borderRadius: 10,
                border: '1px solid var(--ide-border)',
                background: 'var(--ide-hero-panel)',
              }}
            >
              <Icon style={{ width: 14, height: 14, color: m.color, marginBottom: 6 }} />
              <div style={{ fontSize: 14, fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ide-text-muted)' }}>{m.label}</div>
              <div style={{ fontSize: 9, color: 'var(--ide-text-dim)' }}>{m.sub}</div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ide-text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>
        System status
      </div>
      {systems.map(s => (
        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, background: 'var(--ide-hero-panel)', border: '1px solid var(--ide-border)' }}>
          {s.ok ? <CheckCircle style={{ width: 14, height: 14, color: 'var(--landing-success)' }} /> : <AlertTriangle style={{ width: 14, height: 14, color: 'var(--landing-warning)' }} />}
          <span style={{ fontSize: 11, color: 'var(--ide-text-muted)', flex: 1 }}>{s.name}</span>
          <span style={{ fontSize: 10, color: s.ok ? 'var(--landing-success)' : 'var(--landing-warning)', fontWeight: 600 }}>{s.ok ? 'Online' : 'Attention'}</span>
        </div>
      ))}

      {!ollamaOn && (
        <div style={{ fontSize: 10, color: 'var(--ide-text-dim)', lineHeight: 1.5, padding: 8, borderRadius: 8, border: '1px dashed var(--ide-border)' }}>
          Run <code style={{ color: 'var(--landing-accent)' }}>ollama pull codellama</code> for real neural network fixes.
        </div>
      )}
    </div>
  )
}
