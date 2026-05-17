'use client'

import { motion } from 'framer-motion'
import {
  Activity, Cpu, Shield, Zap, TrendingUp, Code2,
  AlertCircle, CheckCircle, Sparkles
} from 'lucide-react'

const metrics = [
  { icon: Activity,   label: 'CPU Usage',      value: '24%',   change: '+2%',   color: '#10b981' },
  { icon: Cpu,        label: 'AI Speed',        value: '1.2ms', change: '-0.3ms',color: '#00d9ff' },
  { icon: Shield,     label: 'Security',        value: '98.7',  change: '+0.5',  color: '#34d399' },
  { icon: Zap,        label: 'Response',        value: '42ms',  change: '-8ms',  color: '#f59e0b' },
  { icon: TrendingUp, label: 'Code Quality',    value: 'A+',    change: '↑',     color: '#a855f7' },
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
    <section style={{ 
      paddingTop: '6rem', paddingBottom: '6rem', 
      paddingLeft: '1rem', paddingRight: '1rem' 
    }}>
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
            border: '1px solid rgba(6,182,212,0.2)', 
            background: 'rgba(6,182,212,0.05)', marginBottom: '1.5rem' 
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>Live Dashboard</span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2.25rem, 5vw, 3rem)', 
            fontWeight: 700, marginBottom: '1.25rem', lineHeight: 1.2 
          }}>
            Real-Time{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI Dashboard
            </span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', color: '#9ca3af', 
            maxWidth: '32rem', margin: '0 auto' 
          }}>
            Watch Optivix monitor, analyze, and optimize your code in real-time
          </p>
        </motion.div>

        {/* Row-wise layout: Main panel and Side panel side by side */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem'
        }}>

          {/* ── Main panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              borderRadius: '1.5rem',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              background: 'rgba(15,20,35,0.8)',
              backdropFilter: 'blur(16px)'
            }}
          >
            {/* Panel header */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              padding: '1rem 1.5rem', 
              borderBottom: '1px solid rgba(255,255,255,0.06)' 
            }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Live Code Analysis</h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>Project: Next.js E-commerce</p>
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
                  <span style={{ color: '#9ca3af' }}>Optimization progress</span>
                  <span style={{ fontWeight: 700, color: '#22d3ee' }}>78%</span>
                </div>
                <div style={{ height: '0.5rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <motion.div
                    style={{ 
                      height: '100%', borderRadius: '9999px',
                      background: "linear-gradient(to right, #00d9ff, #b026ff)" 
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
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ 
                          padding: '0.375rem', borderRadius: '0.5rem',
                          background: `${m.color}18` 
                        }}>
                          <Icon style={{ width: '0.875rem', height: '0.875rem', color: m.color }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</span>
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
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>Activity — last 24 hours</p>
                <div style={{
                  position: 'relative', height: '9rem', borderRadius: '1rem', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.04)',
                  background: 'rgba(0,0,0,0.2)'
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
                          background: 'linear-gradient(to top, #00d9ff, #b026ff)'
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
                        fontSize: '9px', color: '#4b5563', 
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
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(15,20,35,0.8)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ 
              padding: '1rem 1.5rem', 
              borderBottom: '1px solid rgba(255,255,255,0.06)' 
            }}>
              <h3 style={{ fontWeight: 700 }}>Recent Activity</h3>
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
                    background: 'rgba(255,255,255,0.03)'
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
                    <p style={{ fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.4 }}>{a.action}</p>
                    <p style={{ fontSize: '10px', color: '#4b5563', marginTop: '0.125rem' }}>{a.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System status */}
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { label: 'AI Engine',        pct: 100, color: '#10b981' },
                  { label: 'Security Scanner', pct: 98,  color: '#00d9ff' },
                  { label: 'Code Analysis',    pct: 85,  color: '#f59e0b' },
                  { label: 'Database',         pct: 100, color: '#10b981' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span style={{ color: '#9ca3af' }}>{s.label}</span>
                      <span style={{ fontWeight: 500, color: s.color }}>{s.pct}%</span>
                    </div>
                    <div style={{ height: '0.25rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
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