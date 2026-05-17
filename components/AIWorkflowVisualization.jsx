'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Zap, CheckCircle, Rocket, Sparkles, Cpu, GitBranch } from 'lucide-react'

const steps = [
  { icon: Code2,       label: 'Code Input',          desc: 'Developer writes code',             color: '#00d9ff', num: 1 },
  { icon: Cpu,         label: 'AI Analysis',          desc: 'Neural networks scan patterns',     color: '#a855f7', num: 2 },
  { icon: Brain,       label: 'Pattern Recognition',  desc: 'Issues & optimizations identified', color: '#f59e0b', num: 3 },
  { icon: Zap,         label: 'Real-Time Feedback',   desc: 'Instant suggestions in editor',     color: '#10b981', num: 4 },
  { icon: CheckCircle, label: 'Auto-Fix Applied',     desc: 'One-click AI solution',             color: '#6366f1', num: 5 },
  { icon: GitBranch,   label: 'Version Control',      desc: 'AI-generated commit message',       color: '#f43f5e', num: 6 },
  { icon: Rocket,      label: 'Deployed',             desc: 'Production-ready code ships',       color: '#34d399', num: 7 },
]

const timings = [
  { label: 'Traditional Workflow', time: '48 hours',    color: '#f43f5e' },
  { label: 'With Optivix',         time: '2.3 seconds', color: '#10b981' },
  { label: 'Improvement',          time: '99.9% faster',color: '#00d9ff' },
]

export default function AIWorkflowVisualization() {
  return (
    <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '9999px',
            border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.05)', marginBottom: '1.5rem'
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>AI Workflow</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            See the{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI in Action
            </span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '32rem', margin: '0 auto' }}>
            Every step of your development cycle, supercharged by AI
          </p>
        </motion.div>

        {/* Flow steps */}
        <div style={{ position: 'relative', marginBottom: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            {steps.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  {/* Step circle */}
                  <div style={{ position: 'relative', marginBottom: '1rem' }}>
                    <div style={{
                      width: '5rem', height: '5rem', borderRadius: '1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: `${s.color}12`, backdropFilter: 'blur(8px)'
                    }}>
                      <Icon style={{ width: '1.75rem', height: '1.75rem', color: s.color }} />
                    </div>
                    {/* Step number */}
                    <div style={{
                      position: 'absolute', top: '-0.5rem', right: '-0.5rem',
                      width: '1.25rem', height: '1.25rem', borderRadius: '9999px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 700, color: '#fff', background: s.color
                    }}>
                      {s.num}
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                      style={{ position: 'absolute', inset: 0, borderRadius: '1rem', border: `1px solid ${s.color}` }}
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>{s.label}</p>
                  <p style={{ fontSize: '10px', color: '#6b7280', lineHeight: 1.4 }}>{s.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Timeline comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden', background: 'rgba(15,20,35,0.8)', backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Workflow Timeline Comparison</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>Average time per complete development cycle</p>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '7rem', fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0 }}>{s.label}</div>
                <div style={{ flex: 1, height: '0.5rem', borderRadius: '9999px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: '9999px', background: `linear-gradient(to right, ${s.color}, ${s.color}88)` }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(i + 1) * 14}%` }}
                    transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                </div>
                <div style={{ width: '3rem', textAlign: 'right', fontSize: '0.75rem', color: '#9ca3af', flexShrink: 0 }}>
                  {((i + 1) * 0.33).toFixed(1)}s
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {timings.map((t, i) => (
              <div key={i} style={{ padding: '1.25rem 1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>{t.label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: t.color }}>{t.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
