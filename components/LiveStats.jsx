/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import { Cpu, Code2, Shield, Zap, GitBranch, Cloud, Users, Clock, Sparkles } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const stats = [
  { icon: Cpu,       label: 'AI Processing',         display: '12,500 TFLOPS', desc: 'Neural computations/sec' },
  { icon: Code2,     label: 'Lines Analyzed',         display: '4.2B+',         desc: 'Total code processed' },
  { icon: Shield,    label: 'Vulnerabilities Caught', display: '2.8M+',         desc: 'Security issues prevented' },
  { icon: Zap,       label: 'Avg Performance Gain',   display: '89%',           desc: 'Code execution improvement' },
  { icon: GitBranch, label: 'Projects Monitored',     display: '15,000+',       desc: 'Active repositories' },
  { icon: Cloud,     label: 'Cloud Cost Saved',       display: '42%',           desc: 'Infrastructure reduction' },
  { icon: Users,     label: 'Active Developers',      display: '10,250+',       desc: 'Engineers using Optivix daily' },
  { icon: Clock,     label: 'Dev Hours Saved',        display: '3.5M hrs',      desc: 'Time optimized globally' },
]

export default function LiveStats() {
  return (
    <section className="landing-section" style={{ position: 'relative', zIndex: 10 }}>
      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>

        <SectionHeader
          eyebrow="Impact"
          icon={Sparkles}
          title="Numbers That"
          accent="Speak for Themselves"
          description="Real-time metrics from developers worldwide using Optivix"
        />

        {/* Stats grid */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.label}
                className="landing-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ padding: '1rem' }}
              >
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '0.75rem', background: `var(--landing-accent-soft)` }}>
                    <Icon style={{ width: '1rem', height: '1rem', color: 'var(--landing-accent)' }} />
                  </div>
                  <div className="text-accent" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {s.display}
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>{s.label}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--landing-dim)' }}>{s.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
                    <div style={{ width: '0.3rem', height: '0.3rem', borderRadius: '9999px', background: 'var(--landing-accent)', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: '10px', color: 'var(--landing-dim)' }}>Live</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Global coverage banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          style={{
            borderRadius: '1.5rem', border: '1px solid var(--landing-border)',
            overflow: 'hidden', background: 'var(--landing-surface)', backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--landing-border)' }}>
            <div>
              <h3 style={{ fontWeight: 700 }}>Global Coverage</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', marginTop: '0.125rem' }}>Active users across 150+ countries</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', background: 'var(--landing-accent)', animation: 'pulse 2s infinite' }} />
              <span style={{ color: 'var(--landing-accent)', fontWeight: 500 }}>24/7 Active</span>
            </div>
          </div>

          {/* Dot map */}
          <div style={{ position: 'relative', height: '8rem', overflow: 'hidden', padding: '1rem 1.5rem' }}>
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: '0.3rem', height: '0.3rem', borderRadius: '9999px',
                  left: `${(i * 7.3 + 5) % 92}%`,
                  top: `${(i * 11.7 + 8) % 80}%`,
                  background: i % 3 === 0 ? 'var(--landing-accent)' : 'var(--landing-accent)',
                }}
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </div>

          {/* Region stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', borderTop: '1px solid var(--landing-border)' }}>
            {[
              { region: 'North America', users: '4,250',  growth: '+12%' },
              { region: 'Europe',        users: '3,800',  growth: '+15%' },
              { region: 'Asia Pacific',  users: '2,100',  growth: '+28%' },
              { region: 'Global Total',  users: '10,250', growth: '+18%' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', background: 'var(--landing-row-bg)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--landing-dim)', marginBottom: '0.25rem' }}>{r.region}</p>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--landing-text)' }}>{r.users}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--landing-accent)' }}>{r.growth}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
