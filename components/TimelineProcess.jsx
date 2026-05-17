/* eslint-disable */
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Brain, Zap, CheckCircle, Rocket, Sparkles, Shield } from 'lucide-react'

const steps = [
  { 
    icon: Search, 
    title: 'The Problem', 
    description: 'Developers spend 30% of their time fixing bugs and security issues instead of building features that matter.', 
    iconBg: '#ef4444', 
    num: '01',
    stat: '30%',
    statLabel: 'Time wasted on bugs'
  },
  { 
    icon: Brain, 
    title: 'The Insight', 
    description: 'AI can understand code patterns and predict issues before they become problems — at superhuman speed.', 
    iconBg: '#f59e0b', 
    num: '02',
    stat: '10x',
    statLabel: 'Faster pattern recognition'
  },
  { 
    icon: Zap, 
    title: 'The Solution', 
    description: 'Optivix uses neural networks to analyze code in real-time and provide instant, context-aware fixes.', 
    iconBg: '#00d9ff', 
    num: '03',
    stat: '<1ms',
    statLabel: 'Detection speed'
  },
  { 
    icon: Shield, 
    title: 'The Security', 
    description: 'Proactive vulnerability scanning catches threats before they reach production — zero false positives.', 
    iconBg: '#10b981', 
    num: '04',
    stat: '99.9%',
    statLabel: 'Threat prevention rate'
  },
  { 
    icon: Rocket, 
    title: 'The Result', 
    description: 'Teams ship faster, with higher quality code and dramatically fewer production incidents.', 
    iconBg: '#a855f7', 
    num: '05',
    stat: '40%',
    statLabel: 'Faster deployment'
  },
  { 
    icon: CheckCircle, 
    title: 'The Impact', 
    description: 'Companies using Optivix see measurable improvements in developer productivity, code quality, and ROI.', 
    iconBg: '#ec4899', 
    num: '06',
    stat: '10x',
    statLabel: 'Return on investment'
  },
]

export default function TimelineProcess() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>The Optivix Story</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            From{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Problem to Solution
            </span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '36rem', margin: '0 auto' }}>
            The journey that led us to build the world&apos;s first self-healing IDE
          </p>
        </motion.div>

        {/* Steps - Clean 3-column grid, 2 rows */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {steps.map((step, i) => {
            const Icon = step.icon

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                style={{
                  position: 'relative',
                  borderRadius: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(15,20,35,0.95), rgba(20,25,40,0.8))',
                  backdropFilter: 'blur(16px)',
                  padding: '1.75rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  minHeight: '260px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${step.iconBg}50`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${step.iconBg}25`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'
                }}
              >
                {/* Step number badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#4b5563',
                  letterSpacing: '0.1em'
                }}>
                  STEP {step.num}
                </div>

                {/* Icon */}
                <div
                  style={{
                    display: 'inline-flex',
                    padding: '0.875rem',
                    borderRadius: '1rem',
                    alignSelf: 'flex-start',
                    background: `${step.iconBg}18`,
                    border: `1px solid ${step.iconBg}35`,
                    boxShadow: `0 4px 12px ${step.iconBg}18`
                  }}
                >
                  <Icon style={{ width: '1.35rem', height: '1.35rem', color: step.iconBg }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#f3f4f6',
                    lineHeight: 1.3
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: '#9ca3af',
                    lineHeight: 1.6,
                    fontSize: '0.85rem',
                    flex: 1
                  }}>
                    {step.description}
                  </p>
                </div>

                {/* Stat */}
                <div style={{
                  paddingTop: '0.875rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: step.iconBg
                  }}>
                    {step.stat}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em'
                  }}>
                    {step.statLabel}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
