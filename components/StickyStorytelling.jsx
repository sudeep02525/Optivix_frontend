/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import { Code2, Brain, Zap, Rocket, Shield, Sparkles, TrendingUp, Users } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const stories = [
  { icon: Code2,      step: '01', title: 'The Problem',  description: 'Developers spend 30% of their time fixing bugs and security issues instead of building features that matter.', stat: '30%',  statLabel: 'time wasted on bugs',         color: '#f43f5e', bg: 'rgba(244,63,94,0.08)'   },
  { icon: Brain,      step: '02', title: 'The Insight',  description: 'AI can understand code patterns and predict issues before they become problems — at superhuman speed.',          stat: '10x',  statLabel: 'faster pattern recognition',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  { icon: Zap,        step: '03', title: 'The Solution', description: 'Optivix uses neural networks to analyze code in real-time and provide instant, context-aware fixes.',            stat: '<1ms', statLabel: 'detection speed',             color: 'var(--landing-accent)', bg: 'rgba(var(--landing-accent-rgb),0.08)'   },
  { icon: Shield,     step: '04', title: 'The Security', description: 'Proactive vulnerability scanning catches threats before they reach production — zero false positives.',           stat: '99.9%',statLabel: 'threat prevention rate',      color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { icon: Rocket,     step: '05', title: 'The Result',   description: 'Teams ship faster, with higher quality code and dramatically fewer production incidents.',                        stat: '40%',  statLabel: 'faster shipping',             color: 'var(--landing-accent)', bg: 'rgba(168,85,247,0.08)'  },
  { icon: TrendingUp, step: '06', title: 'The Impact',   description: 'Companies using Optivix see measurable improvements in developer productivity, code quality, and ROI.',          stat: '10x',  statLabel: 'return on investment',        color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
]

export default function StickyStorytelling() {
  return (
    <section className="landing-section">
      <div className="landing-container">

        <SectionHeader
          eyebrow="Story"
          icon={Sparkles}
          title="From"
          accent="Problem to Solution"
          description="The journey that led us to build the world's first self-healing IDE"
        />

        {/* Story cards - Clean 3-column grid, 2 rows */}
        <div className="story-grid">
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
                  border: '1px solid var(--landing-border)',
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  background: 'var(--landing-surface)',
                  backdropFilter: 'blur(16px)',
                  minHeight: 'min(260px, auto)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'var(--landing-shadow-md)'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.querySelector('.ss-glow').style.opacity = '1'
                  e.currentTarget.style.borderColor = `${s.color}50`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${s.color}25`
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.querySelector('.ss-glow').style.opacity = '0'
                  e.currentTarget.style.borderColor = 'var(--landing-border)'
                  e.currentTarget.style.boxShadow = 'var(--landing-shadow-md)'
                }}
              >
                <div className="ss-glow" style={{
                  position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 0.4s',
                  background: `${s.bg}`,
                }} />

                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Step + icon row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--landing-dim)' }}>STEP {s.step}</span>
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
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.625rem', color: 'var(--landing-text)' }}>{s.title}</h3>
                    <p style={{ color: 'var(--landing-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>{s.description}</p>
                  </div>

                  {/* Stat */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.25rem',
                    paddingTop: '0.875rem', 
                    borderTop: '1px solid var(--landing-border)' 
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: s.color }}>{s.stat}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--landing-dim)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{s.statLabel}</span>
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
            border: '1px solid rgba(var(--landing-accent-rgb),0.15)', 
            textAlign: 'center',
            background: 'rgba(var(--landing-accent-rgb),0.06)',
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
              background: 'rgba(var(--landing-accent-rgb),0.05)',
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
                background: 'var(--landing-accent)',
                boxShadow: '0 4px 16px rgba(var(--landing-accent-rgb),0.2)'
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
              color: 'var(--landing-accent)',
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
                    color: 'var(--landing-accent)',
                    marginBottom: '0.25rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'var(--landing-muted)',
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
