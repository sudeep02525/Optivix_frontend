'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Zap, Shield, Brain, Sparkles } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

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
    <section className="landing-section">
      <div className="landing-container" style={{ maxWidth: '64rem' }}>

        <SectionHeader
          eyebrow="Compare"
          icon={Sparkles}
          title="Traditional vs"
          accent="Optivix AI"
          description="See exactly how Optivix transforms every part of your development workflow"
        />

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            borderRadius: '1.5rem', overflow: 'hidden',
            border: '1px solid var(--landing-border)',
            background: 'var(--landing-surface)', backdropFilter: 'blur(16px)'
          }}
        >
          <div className="comparison-table-wrap">
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',  borderBottom: '1px solid var(--landing-border)' }}>
              <div style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--landing-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature</div>
              <div style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--landing-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', borderLeft: '1px solid var(--landing-border)' }}>
                Traditional
              </div>
              <div style={{ padding: '1rem 1.5rem', borderLeft: '1px solid rgba(var(--landing-accent-rgb),0.2)', background: 'rgba(var(--landing-accent-rgb),0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap style={{ width: '1rem', height: '1rem', color: 'var(--landing-accent-bright)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--landing-accent-bright)' }}>Optivix AI</span>
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
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',  borderBottom: i < rows.length - 1 ? '1px solid var(--landing-border)' : 'none' }}
              >
                <div style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--landing-muted)' }}>{row.label}</div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--landing-border)' }}>
                  <XCircle style={{ width: '1rem', height: '1rem', color: 'rgba(248,113,113,0.6)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--landing-dim)' }}>{row.old}</span>
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(var(--landing-accent-rgb),0.1)', background: 'rgba(var(--landing-accent-rgb),0.03)' }}>
                  <CheckCircle style={{ width: '1rem', height: '1rem', color: 'var(--landing-accent-bright)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--landing-text)', fontWeight: 500 }}>{row.neo}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
          {[
            { icon: Zap,    title: '10x Faster',  desc: 'Development velocity',         color: 'var(--landing-accent)' },
            { icon: Shield, title: '99.9% Secure', desc: 'Vulnerability prevention',     color: 'var(--landing-accent)' },
            { icon: Brain,  title: 'Zero Errors',  desc: 'AI eliminates human mistakes', color: 'var(--landing-accent)' },
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
                  border: '1px solid var(--landing-border)',
                  background: 'var(--landing-surface)', backdropFilter: 'blur(12px)'
                }}
              >
                <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '0.75rem', marginBottom: '0.75rem', background: `${s.color}15` }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: s.color }} />
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: s.color }}>{s.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--landing-muted)' }}>{s.desc}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
