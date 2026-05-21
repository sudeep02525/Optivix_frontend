'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Zap, CheckCircle, Rocket, Sparkles, Cpu, GitBranch } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const steps = [
  { icon: Code2,       label: 'Code Input',          desc: 'Developer writes code',             color: 'var(--landing-accent)', num: 1 },
  { icon: Cpu,         label: 'AI Analysis',          desc: 'Neural networks scan patterns',     color: 'var(--landing-accent)', num: 2 },
  { icon: Brain,       label: 'Pattern Recognition',  desc: 'Issues & optimizations identified', color: '#f59e0b', num: 3 },
  { icon: Zap,         label: 'Real-Time Feedback',   desc: 'Instant suggestions in editor',     color: '#10b981', num: 4 },
  { icon: CheckCircle, label: 'Auto-Fix Applied',     desc: 'One-click AI solution',             color: '#6366f1', num: 5 },
  { icon: GitBranch,   label: 'Version Control',      desc: 'AI-generated commit message',       color: '#f43f5e', num: 6 },
  { icon: Rocket,      label: 'Deployed',             desc: 'Production-ready code ships',       color: '#34d399', num: 7 },
]

const timings = [
  { label: 'Traditional Workflow', time: '48 hours',    color: '#f43f5e' },
  { label: 'With Optivix',         time: '2.3 seconds', color: '#10b981' },
  { label: 'Improvement',          time: '99.9% faster',color: 'var(--landing-accent)' },
]

export default function AIWorkflowVisualization() {
  return (
    <section className="landing-section">
      <div className="landing-container">

        <SectionHeader
          eyebrow="Workflow"
          icon={Sparkles}
          title="See the"
          accent="AI in Action"
          description="Every step of your development cycle, supercharged by local AI"
        />

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
                      border: '1px solid var(--landing-border)',
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
                  <p style={{ fontSize: '10px', color: 'var(--landing-dim)', lineHeight: 1.4 }}>{s.desc}</p>
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
            borderRadius: '1.5rem', border: '1px solid var(--landing-border)',
            overflow: 'hidden', background: 'var(--landing-surface)', backdropFilter: 'blur(16px)',
            boxShadow: 'var(--landing-shadow-md)'
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--landing-border)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--landing-text)' }}>Workflow Timeline Comparison</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--landing-dim)', marginTop: '0.25rem' }}>Average time per complete development cycle</p>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '7rem', fontSize: '0.75rem', color: 'var(--landing-muted)', flexShrink: 0 }}>{s.label}</div>
                <div style={{ flex: 1, height: '0.5rem', borderRadius: '9999px', overflow: 'hidden', background: 'var(--landing-row-bg)' }}>
                  <motion.div
                    style={{ height: '100%', borderRadius: '9999px', background: s.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(i + 1) * 14}%` }}
                    transition={{ duration: 0.8, delay: i * 0.07, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                </div>
                <div style={{ width: '3rem', textAlign: 'right', fontSize: '0.75rem', color: 'var(--landing-muted)', flexShrink: 0 }}>
                  {((i + 1) * 0.33).toFixed(1)}s
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', borderTop: '1px solid var(--landing-border)' }}>
            {timings.map((t, i) => (
              <div key={i} style={{ padding: '1.25rem 1.5rem', textAlign: 'center', background: 'var(--landing-row-bg)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', marginBottom: '0.25rem' }}>{t.label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: t.color }}>{t.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
