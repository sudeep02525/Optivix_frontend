'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Zap, Shield, Brain, Sparkles } from 'lucide-react'

const rows = [
  { label: 'Bug Detection',       old: 'Manual review (hours)',    neo: 'AI real-time (< 1ms)'   },
  { label: 'Security Scanning',   old: 'Periodic audits',          neo: 'Continuous 24/7'         },
  { label: 'Code Review Speed',   old: '2–3 days',                 neo: 'Instant'                 },
  { label: 'Auto-Fix',            old: 'Not available',            neo: 'One-click AI fix'        },
  { label: 'Performance Insight', old: 'Manual profiling',         neo: 'AI-powered suggestions'  },
  { label: 'Learning Curve',      old: 'Steep',                    neo: 'Zero — works out of box' },
  { label: 'Team Collaboration',  old: 'Siloed',                   neo: 'Shared AI context'       },
  { label: 'CI/CD Integration',   old: 'Complex setup',            neo: 'One-line install'        },
]

export default function ComparisonSection() {
  return (
    <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>

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
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>The Difference Is Clear</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Traditional vs{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Optivix AI
            </span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '32rem', margin: '0 auto' }}>
            See exactly how Optivix transforms every part of your development workflow
          </p>
        </motion.div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            borderRadius: '1.5rem', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(15,20,35,0.8)', backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', minWidth: '36rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</div>
              <div style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                Traditional
              </div>
              <div style={{ padding: '1rem 1.5rem', borderLeft: '1px solid rgba(0,217,255,0.2)', background: 'rgba(0,217,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#22d3ee' }}>Optivix AI</span>
                </div>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', minWidth: '36rem', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <div style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#d1d5db' }}>{row.label}</div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                  <XCircle style={{ width: '1rem', height: '1rem', color: 'rgba(248,113,113,0.6)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{row.old}</span>
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(0,217,255,0.1)', background: 'rgba(0,217,255,0.03)' }}>
                  <CheckCircle style={{ width: '1rem', height: '1rem', color: '#22d3ee', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: '#e5e7eb', fontWeight: 500 }}>{row.neo}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
          {[
            { icon: Zap,    title: '10x Faster',  desc: 'Development velocity',         color: '#00d9ff' },
            { icon: Shield, title: '99.9% Secure', desc: 'Vulnerability prevention',     color: '#10b981' },
            { icon: Brain,  title: 'Zero Errors',  desc: 'AI eliminates human mistakes', color: '#a855f7' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                viewport={{ once: true }}
                style={{
                  textAlign: 'center', padding: '1.5rem', borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(15,20,35,0.6)', backdropFilter: 'blur(12px)'
                }}
              >
                <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '0.75rem', background: `${s.color}15` }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: s.color }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: s.color }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{s.desc}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
