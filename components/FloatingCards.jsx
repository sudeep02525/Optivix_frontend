/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield, Brain, Rocket, Target, Infinity, CloudLightning } from 'lucide-react'

const cards = [
  { icon: Sparkles,      title: 'Magic Code Generation', desc: 'AI writes production-ready code from your specs',       color: '#00d9ff', bg: 'rgba(0,217,255,0.08)'   },
  { icon: Zap,           title: 'Instant Bug Fixes',      desc: 'Detect and fix issues automatically in milliseconds',   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  { icon: Shield,        title: 'Proactive Security',     desc: 'Continuous vulnerability scanning and threat prevention',color: '#10b981', bg: 'rgba(16,185,129,0.08)'  },
  { icon: Brain,         title: 'Context-Aware AI',       desc: 'Understands your codebase and development patterns',    color: '#a855f7', bg: 'rgba(168,85,247,0.08)'  },
  { icon: Rocket,        title: 'Performance Boost',      desc: 'Optimize code execution and reduce resource usage',     color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
  { icon: Target,        title: 'Precision Analysis',     desc: 'Pinpoint exact issues with detailed recommendations',   color: '#f43f5e', bg: 'rgba(244,63,94,0.08)'   },
  { icon: Infinity,      title: 'Infinite Scale',         desc: 'Handle projects of any size with consistent performance',color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  { icon: CloudLightning,title: 'Cloud Native',           desc: 'Seamless integration with modern cloud infrastructure', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)'  },
]

export default function FloatingCards() {
  return (
    <section style={{ 
      paddingTop: '6rem', paddingBottom: '6rem', 
      paddingLeft: '1rem', paddingRight: '1rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Ambient orbs */}
      <motion.div style={{ 
        position: 'absolute', top: '33.333333%', left: '25%', 
        width: '18rem', height: '18rem', borderRadius: '9999px', 
        filter: 'blur(48px)', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,217,255,0.08), transparent)' 
      }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div style={{ 
        position: 'absolute', bottom: '33.333333%', right: '25%', 
        width: '18rem', height: '18rem', borderRadius: '9999px', 
        filter: 'blur(48px)', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(176,38,255,0.08), transparent)' 
      }}
        animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />

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
            border: '1px solid rgba(6,182,212,0.2)', 
            background: 'rgba(6,182,212,0.05)', marginBottom: '1.5rem' 
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>Superpowers</span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2.25rem, 5vw, 3rem)', 
            fontWeight: 700, marginBottom: '1.25rem' 
          }}>
            Built for{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Modern Developers
            </span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', color: '#9ca3af', 
            maxWidth: '32rem', margin: '0 auto' 
          }}>
            AI-powered tools that work alongside you — not instead of you
          </p>
        </motion.div>

        {/* Cards grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem'
        }}>
          {cards.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                style={{
                  position: 'relative',
                  borderRadius: '1rem',
                  padding: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'rgba(15,20,35,0.7)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s ease',
                  minHeight: '10rem',
                  maxHeight: '12rem'
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget
                  const hoverGlow = card.querySelector('.hover-glow')
                  const title = card.querySelector('.card-title')
                  const indicator = card.querySelector('.bottom-indicator')
                  
                  // Apply hover effects directly to the card
                  card.style.borderColor = 'rgba(255,255,255,0.1)'
                  card.style.boxShadow = `0 0 30px ${c.bg}, 0 0 60px ${c.bg}`
                  
                  if (hoverGlow) hoverGlow.style.opacity = '1'
                  if (title) title.style.color = '#fff'
                  if (indicator) indicator.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget
                  const hoverGlow = card.querySelector('.hover-glow')
                  const title = card.querySelector('.card-title')
                  const indicator = card.querySelector('.bottom-indicator')
                  
                  // Remove hover effects
                  card.style.borderColor = 'rgba(255,255,255,0.06)'
                  card.style.boxShadow = 'none'
                  
                  if (hoverGlow) hoverGlow.style.opacity = '0'
                  if (title) title.style.color = '#e0e0e0'
                  if (indicator) indicator.style.opacity = '0'
                }}
              >
                {/* Hover glow - matches card border radius */}
                <div 
                  className="hover-glow"
                  style={{
                    position: 'absolute', inset: 0, opacity: 0,
                    transition: 'opacity 0.5s', borderRadius: '1rem',
                    background: `radial-gradient(circle at 30% 30%, ${c.bg}, transparent 70%)`
                  }} 
                />

                <div style={{ position: 'relative', zIndex: 10 }}>
                  {/* Icon */}
                  <div style={{
                    marginBottom: '1rem', display: 'inline-flex',
                    padding: '0.75rem', borderRadius: '0.75rem',
                    background: c.bg, border: `1px solid ${c.color}25`
                  }}>
                    <Icon style={{ width: '1.25rem', height: '1.25rem', color: c.color }} />
                  </div>

                  {/* Text */}
                  <h3 
                    className="card-title"
                    style={{ 
                      fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem',
                      color: '#e0e0e0', transition: 'color 0.3s', lineHeight: 1.3
                    }}
                  >
                    {c.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5 }}>{c.desc}</p>

                  {/* Bottom indicator */}
                  <div 
                    className="bottom-indicator"
                    style={{
                      marginTop: '1rem', height: '1px', opacity: 0,
                      transition: 'opacity 0.3s',
                      background: `linear-gradient(to right, ${c.color}, transparent)`
                    }} 
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}