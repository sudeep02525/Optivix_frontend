'use client'

import { motion } from 'framer-motion'
import {
  Activity, Cpu, Shield, Zap, TrendingUp, Code2,
  AlertCircle, CheckCircle, Sparkles
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const metrics = [
  { icon: Activity,   label: 'CPU Usage',      value: '24%',   change: '+2%',   color: '#10b981' },
  { icon: Cpu,        label: 'AI Speed',        value: '1.2ms', change: '-0.3ms',color: 'var(--landing-accent)' },
  { icon: Shield,     label: 'Security',        value: '98.7',  change: '+0.5',  color: '#34d399' },
  { icon: Zap,        label: 'Response',        value: '42ms',  change: '-8ms',  color: '#f59e0b' },
  { icon: TrendingUp, label: 'Code Quality',    value: 'A+',    change: '↑',     color: 'var(--landing-accent)' },
  { icon: Code2,      label: 'Issues Fixed',    value: '1,247', change: '+89',   color: '#ec4899' },
]

const activity = [
  { time: '2m ago',  action: 'Auto-fixed SQL injection vulnerability', ok: true },
  { time: '5m ago',  action: 'Optimized N+1 database query',           ok: true },
  { time: '12m ago', action: 'Detected memory leak in useEffect',      ok: false },
  { time: '25m ago', action: 'Refactored legacy authentication code',  ok: true },
  { time: '1h ago',  action: 'Deployed hotfix to production',          ok: true },
]

const bars = [30, 45, 60, 75, 90, 85, 70, 55, 40, 65, 80, 95]
const barLabels = ['12A','2A','4A','6A','8A','10A','12P','2P','4P','6P','8P','10P']

export default function DashboardPreview() {
  return (
    <section className="landing-section">
      <div className="landing-container">

        <SectionHeader
          eyebrow="Dashboard"
          icon={Sparkles}
          title="Real-Time"
          accent="AI Dashboard"
          description="Watch Optivix monitor, analyze, and optimize your code in real-time"
        />

        {/* Row-wise layout: Main panel and Side panel side by side */}
        <div className="dashboard-grid">

          {/* ── Main panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              borderRadius: '1.5rem',
              border: '1px solid var(--landing-border)',
              overflow: 'hidden',
              background: 'var(--landing-surface)',
              backdropFilter: 'blur(16px)'
            }}
          >
            {/* Panel header */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '1rem 1.5rem', 
              borderBottom: '1px solid var(--landing-border)' 
            }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--landing-text)' }}>Live Code Analysis</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', marginTop: '0.125rem' }}>Project: Next.js E-commerce</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', background: '#10b981', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#34d399', fontWeight: 500 }}>Active</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--landing-muted)' }}>Optimization progress</span>
                  <span style={{ fontWeight: 700, color: 'var(--landing-accent-bright)' }}>78%</span>
                </div>
                <div style={{ height: '0.5rem', borderRadius: '9999px', background: 'var(--landing-border)', overflow: 'hidden' }}>
                  <motion.div
                    style={{ 
                      height: '100%', borderRadius: '9999px',
                      background: "var(--landing-accent)" 
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '78%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>

              {/* Metrics grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '0.75rem' 
              }}>
                {metrics.map((m, i) => {
                  const Icon = m.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      viewport={{ once: true }}
                      style={{
                        padding: '1rem',
                        borderRadius: '1rem',
                        border: '1px solid var(--landing-border)',
                        background: 'var(--landing-bg-soft)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ 
                          padding: '0.375rem', borderRadius: '0.5rem',
                          background: `${m.color}18` 
                        }}>
                          <Icon style={{ width: '0.875rem', height: '0.875rem', color: m.color }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: m.color }}>{m.value}</span>
                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{m.change}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bar chart */}
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', marginBottom: '0.75rem' }}>Activity — last 24 hours</p>
                <div style={{
                  position: 'relative', height: '9rem', borderRadius: '1rem', overflow: 'hidden',
                  border: '1px solid var(--landing-border)',
                  background: 'var(--landing-code-bg)'
                }}>
                  {/* Bars */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '0.75rem', right: '0.75rem', 
                    bottom: '1.5rem', top: '0.75rem', 
                    display: 'flex', alignItems: 'flex-end', gap: '0.25rem' 
                  }}>
                    {bars.map((h, i) => (
                      <motion.div
                        key={i}
                        style={{
                          flex: 1,
                          borderTopLeftRadius: '0.125rem',
                          borderTopRightRadius: '0.125rem',
                          background: 'var(--landing-accent)'
                        }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </div>
                  {/* Labels */}
                  <div style={{ 
                    position: 'absolute', bottom: 0, 
                    left: '0.75rem', right: '0.75rem', 
                    display: 'flex', justifyContent: 'space-between' 
                  }}>
                    {barLabels.map((l, i) => (
                      <span key={i} style={{ 
                        fontSize: '9px', color: 'var(--landing-dim)', 
                        flex: 1, textAlign: 'center' 
                      }}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Side panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              borderRadius: '1.5rem',
              border: '1px solid var(--landing-border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--landing-surface)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ 
              padding: '1rem 1.5rem', 
              borderBottom: '1px solid var(--landing-border)' 
            }}>
              <h3 style={{ fontWeight: 700, color: 'var(--landing-text)' }}>Recent Activity</h3>
            </div>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {activity.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '0.75rem', borderRadius: '0.75rem',
                    background: 'var(--landing-bg-soft)'
                  }}
                >
                  <div style={{
                    padding: '0.375rem', borderRadius: '0.5rem', flexShrink: 0,
                    background: a.ok ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'
                  }}>
                    {a.ok
                      ? <CheckCircle style={{ width: '0.875rem', height: '0.875rem', color: '#34d399' }} />
                      : <AlertCircle style={{ width: '0.875rem', height: '0.875rem', color: '#fbbf24' }} />
                    }
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4, color: 'var(--landing-text)' }}>{a.action}</p>
                    <p style={{ fontSize: '10px', color: 'var(--landing-dim)', marginTop: '0.125rem' }}>{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System status */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--landing-border)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--landing-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'AI Engine',        pct: 100, color: '#10b981' },
                  { label: 'Security Scanner', pct: 98,  color: 'var(--landing-accent)' },
                  { label: 'Code Analysis',    pct: 85,  color: '#f59e0b' },
                  { label: 'Database',         pct: 100, color: '#10b981' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: 'var(--landing-muted)' }}>{s.label}</span>
                      <span style={{ fontWeight: 500, color: s.color }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: '0.25rem', borderRadius: '9999px', background: 'var(--landing-border)', overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', borderRadius: '9999px', background: s.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}