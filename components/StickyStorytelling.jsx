/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Zap, Rocket, Shield, Sparkles, TrendingUp, Users } from 'lucide-react'

const stories = [
  { icon: Code2,      step: '01', title: 'The Problem',  description: 'Developers spend 30% of their time fixing bugs and security issues instead of building features that matter.', stat: '30%',  statLabel: 'time wasted on bugs',         color: '#f43f5e', bg: 'rgba(244,63,94,0.08)'   },
  { icon: Brain,      step: '02', title: 'The Insight',  description: 'AI can understand code patterns and predict issues before they become problems — at superhuman speed.',          stat: '10x',  statLabel: 'faster pattern recognition',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  { icon: Zap,        step: '03', title: 'The Solution', description: 'Optivix uses neural networks to analyze code in real-time and provide instant, context-aware fixes.',            stat: '<1ms', statLabel: 'detection speed',             color: '#00d9ff', bg: 'rgba(0,217,255,0.08)'   },
  { icon: Shield,     step: '04', title: 'The Security', description: 'Proactive vulnerability scanning catches threats before they reach production — zero false positives.',           stat: '99.9%',statLabel: 'threat prevention rate',      color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { icon: Rocket,     step: '05', title: 'The Result',   description: 'Teams ship faster, with higher quality code and dramatically fewer production incidents.',                        stat: '40%',  statLabel: 'faster shipping',             color: '#a855f7', bg: 'rgba(168,85,247,0.08)'  },
  { icon: TrendingUp, step: '06', title: 'The Impact',   description: 'Companies using Optivix see measurable improvements in developer productivity, code quality, and ROI.',          stat: '10x',  statLabel: 'return on investment',        color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
]

export default function StickyStorytelling() {
  return (
    <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '9999px',
            border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.05)', marginBottom: '1.5rem'
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>The Optivix Story</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            From{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Problem to Solution
            </span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '32rem', margin: '0 auto' }}>
            The journey that led us to build the world&apos;s first self-healing IDE
          </p>
        </motion.div>

        {/* Story cards - Clean 3-column grid, 2 rows */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.25rem', 
          marginBottom: '4rem' 
        }}>
          {stories.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                style={{
                  position: 'relative', 
                  borderRadius: '1.25rem',
                  padding: '1.75rem 1.5rem', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(15,20,35,0.95), rgba(20,25,40,0.8))',
                  backdropFilter: 'blur(16px)',
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.querySelector('.ss-glow').style.opacity = '1'
                  e.currentTarget.style.borderColor = `${s.color}50`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${s.color}25`
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.querySelector('.ss-glow').style.opacity = '0'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'
                }}
              >
                <div className="ss-glow" style={{
                  position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.4s',
                  background: `radial-gradient(circle at 50% 0%, ${s.bg}, transparent 60%)`
                }} />

                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Step + icon row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#4b5563' }}>STEP {s.step}</span>
                    <div style={{ 
                      padding: '0.75rem', 
                      borderRadius: '1rem', 
                      background: `${s.color}18`, 
                      border: `1px solid ${s.color}35`,
                      boxShadow: `0 4px 12px ${s.color}18`
                    }}>
                      <Icon style={{ width: '1.35rem', height: '1.35rem', color: s.color }} />
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.625rem', color: '#f3f4f6' }}>{s.title}</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>{s.description}</p>
                  </div>

                  {/* Stat */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.25rem',
                    paddingTop: '0.875rem', 
                    borderTop: '1px solid rgba(255,255,255,0.06)' 
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.stat}</span>
                    <span style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{s.statLabel}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Final outcome - Professional CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            borderRadius: '1.5rem', 
            padding: '3rem 2.5rem',
            border: '1px solid rgba(0,217,255,0.15)', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(0,217,255,0.06), rgba(176,38,255,0.06))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle animated background */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(0,217,255,0.05), transparent 70%)',
              opacity: 0.3
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Icon with gradient background */}
            <motion.div 
              style={{ 
                display: 'inline-flex', 
                padding: '1.25rem', 
                borderRadius: '1.25rem', 
                marginBottom: '1.75rem', 
                background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                boxShadow: '0 4px 16px rgba(0,217,255,0.2)'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Users style={{ width: '2.25rem', height: '2.25rem', color: '#fff' }} />
            </motion.div>

            {/* Heading */}
            <h3 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 700, 
              marginBottom: '1.25rem',
              background: 'linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}>
              The Future of Development
            </h3>

            {/* Description */}
            <p style={{ 
              color: '#d1d5db', 
              fontSize: '1.15rem', 
              maxWidth: '42rem', 
              margin: '0 auto 2rem',
              lineHeight: 1.7
            }}>
              Join thousands of developers who have transformed their workflow with AI-powered tools that work alongside them, not against them.
            </p>

            {/* Stats row */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2.5rem',
              flexWrap: 'wrap',
              marginTop: '2rem'
            }}>
              {[
                { value: '10K+', label: 'Developers' },
                { value: '98%', label: 'Satisfaction' },
                { value: '40%', label: 'Faster Shipping' },
                { value: '24/7', label: 'Support' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#00d9ff',
                    marginBottom: '0.25rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
