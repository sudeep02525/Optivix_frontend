/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import { Cpu, Code2, Shield, Zap, GitBranch, Cloud, Users, Clock, Sparkles } from 'lucide-react'

const stats = [
  { icon: Cpu,       label: 'AI Processing',         display: '12,500 TFLOPS', color: '#00d9ff', desc: 'Neural computations/sec'       },
  { icon: Code2,     label: 'Lines Analyzed',         display: '4.2B+',         color: '#a855f7', desc: 'Total code processed'          },
  { icon: Shield,    label: 'Vulnerabilities Caught', display: '2.8M+',         color: '#10b981', desc: 'Security issues prevented'     },
  { icon: Zap,       label: 'Avg Performance Gain',   display: '89%',           color: '#f59e0b', desc: 'Code execution improvement'    },
  { icon: GitBranch, label: 'Projects Monitored',     display: '15,000+',       color: '#6366f1', desc: 'Active repositories'           },
  { icon: Cloud,     label: 'Cloud Cost Saved',       display: '42%',           color: '#f43f5e', desc: 'Infrastructure reduction'      },
  { icon: Users,     label: 'Active Developers',      display: '10,250+',       color: '#34d399', desc: 'Engineers using Optivix daily' },
  { icon: Clock,     label: 'Dev Hours Saved',        display: '3.5M hrs',      color: '#38bdf8', desc: 'Time optimized globally'       },
]

export default function LiveStats() {
  return (
    <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>

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
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>Live Global Impact</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            Numbers That{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Speak for Themselves
            </span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '32rem', margin: '0 auto' }}>
            Real-time metrics from developers worldwide using Optivix
          </p>
        </motion.div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  position: 'relative', borderRadius: '1rem',
                  padding: '1rem', border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden', background: 'rgba(15,20,35,0.7)', backdropFilter: 'blur(12px)'
                }}
                onMouseEnter={(e) => { e.currentTarget.querySelector('.s-glow').style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.querySelector('.s-glow').style.opacity = '0' }}
              >
                <div className="s-glow" style={{
                  position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.5s',
                  background: `radial-gradient(circle at 30% 30%, ${s.color}12, transparent 70%)`
                }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '0.75rem', background: `${s.color}15` }}>
                    <Icon style={{ width: '1rem', height: '1rem', color: s.color }} />
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: s.color }}>
                    {s.display}
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>{s.label}</p>
                  <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{s.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.5rem' }}>
                    <div style={{ width: '0.3rem', height: '0.3rem', borderRadius: '9999px', background: '#10b981', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: '10px', color: '#4b5563' }}>Live</span>
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
            borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden', background: 'rgba(15,20,35,0.8)', backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h3 style={{ fontWeight: 700 }}>Global Coverage</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>Active users across 150+ countries</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', background: '#10b981', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#34d399', fontWeight: 500 }}>24/7 Active</span>
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
                  background: i % 3 === 0 ? '#00d9ff' : i % 3 === 1 ? '#b026ff' : '#10b981',
                }}
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.4, 1] }}
                transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </div>

          {/* Region stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { region: 'North America', users: '4,250',  growth: '+12%' },
              { region: 'Europe',        users: '3,800',  growth: '+15%' },
              { region: 'Asia Pacific',  users: '2,100',  growth: '+28%' },
              { region: 'Global Total',  users: '10,250', growth: '+18%' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.01)' }}>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.25rem' }}>{r.region}</p>
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{r.users}</p>
                <p style={{ fontSize: '0.7rem', color: '#34d399' }}>{r.growth}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
