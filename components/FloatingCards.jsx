/* eslint-disable */
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Shield, Brain, Rocket, Target, Infinity, CloudLightning } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const cards = [
  { icon: Sparkles,      title: 'Magic Code Generation', desc: 'AI writes production-ready code from your specs',       color: 'var(--landing-accent)', bg: 'rgba(var(--landing-accent-rgb),0.08)'   },
  { icon: Zap,           title: 'Instant Bug Fixes',      desc: 'Detect and fix issues automatically in milliseconds',   color: 'var(--landing-accent)', bg: 'rgba(245,158,11,0.08)'  },
  { icon: Shield,        title: 'Proactive Security',     desc: 'Continuous vulnerability scanning and threat prevention',color: 'var(--landing-accent)', bg: 'rgba(16,185,129,0.08)'  },
  { icon: Brain,         title: 'Context-Aware AI',       desc: 'Understands your codebase and development patterns',    color: 'var(--landing-accent)', bg: 'rgba(168,85,247,0.08)'  },
  { icon: Rocket,        title: 'Performance Boost',      desc: 'Optimize code execution and reduce resource usage',     color: '#6366f1', bg: 'rgba(99,102,241,0.08)'  },
  { icon: Target,        title: 'Precision Analysis',     desc: 'Pinpoint exact issues with detailed recommendations',   color: '#f43f5e', bg: 'rgba(244,63,94,0.08)'   },
  { icon: Infinity,      title: 'Infinite Scale',         desc: 'Handle projects of any size with consistent performance',color: '#34d399', bg: 'rgba(52,211,153,0.08)'  },
  { icon: CloudLightning,title: 'Cloud Native',           desc: 'Seamless integration with modern cloud infrastructure', color: 'var(--landing-accent)', bg: 'rgba(56,189,248,0.08)'  },
]

export default function FloatingCards() {
  return (
    <section className="landing-section">
      {/* Ambient orbs */}
      <motion.div style={{ 
        position: 'absolute', top: '33.333333%', left: '25%', 
        width: '18rem', height: '18rem', borderRadius: '9999px', 
        filter: 'blur(48px)', pointerEvents: 'none',
        background: 'rgba(var(--landing-accent-rgb),0.08)' 
      }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div style={{ 
        position: 'absolute', bottom: '33.333333%', right: '25%', 
        width: '18rem', height: '18rem', borderRadius: '9999px', 
        filter: 'blur(48px)', pointerEvents: 'none',
        background: 'rgba(var(--landing-accent-rgb),0.08)' 
      }}
        animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />

      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionHeader
          eyebrow="Superpowers"
          icon={Sparkles}
          title="Built for"
          accent="Modern Developers"
          description="AI-powered tools that work alongside you — not instead of you"
        />

        {/* Cards grid */}
        <div className="floating-cards-grid">
          {cards.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                style={{
                  position: 'relative',
                  borderRadius: '1.25rem',
                  padding: '2rem',
                  border: '1px solid rgba(var(--landing-accent-rgb),0.15)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'var(--landing-surface)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  minHeight: '220px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget
                  const hoverGlow = card.querySelector('.hover-glow')
                  const icon = card.querySelector('.card-icon')
                  const title = card.querySelector('.card-title')
                  const indicator = card.querySelector('.bottom-indicator')
                  
                  card.style.borderColor = `${c.color}40`
                  card.style.boxShadow = `0 8px 32px ${c.bg}, 0 0 0 1px ${c.color}20`
                  card.style.background = 'var(--landing-surface-hover)'
                  
                  if (hoverGlow) hoverGlow.style.opacity = '1'
                  if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)'
                  }
                  if (title) title.style.color = c.color
                  if (indicator) {
                    indicator.style.opacity = '1'
                    indicator.style.width = '100%'
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget
                  const hoverGlow = card.querySelector('.hover-glow')
                  const icon = card.querySelector('.card-icon')
                  const title = card.querySelector('.card-title')
                  const indicator = card.querySelector('.bottom-indicator')
                  
                  card.style.borderColor = 'rgba(var(--landing-accent-rgb),0.15)'
                  card.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)'
                  card.style.background = 'var(--landing-surface)'
                  
                  if (hoverGlow) hoverGlow.style.opacity = '0'
                  if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)'
                  }
                  if (title) title.style.color = 'var(--landing-text)'
                  if (indicator) {
                    indicator.style.opacity = '0'
                    indicator.style.width = '0%'
                  }
                }}
              >
                {/* Hover glow effect */}
                <div 
                  className="hover-glow"
                  style={{
                    position: 'absolute',
                    inset: '-50%',
                    opacity: 0,
                    transition: 'opacity 0.6s ease',
                    borderRadius: '1.25rem',
                    background: `${c.bg}`,
                    pointerEvents: 'none'
                  }} 
                />

                {/* Gradient border effect */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '1.25rem',
                  padding: '1px',
                  background: `${c.color}20`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Icon */}
                  <div 
                    className="card-icon"
                    style={{
                      marginBottom: '1.5rem',
                      display: 'inline-flex',
                      alignSelf: 'flex-start',
                      padding: '1rem',
                      borderRadius: '1rem',
                      background: c.bg,
                      border: `1px solid ${c.color}30`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 4px 12px ${c.bg}`
                    }}
                  >
                    <Icon style={{ width: '1.5rem', height: '1.5rem', color: c.color }} />
                  </div>

                  {/* Text content */}
                  <div style={{ flex: 1 }}>
                    <h3 
                      className="card-title"
                      style={{ 
                        fontSize: '1.125rem',
                        fontWeight: 700,
                        marginBottom: '0.75rem',
                        color: 'var(--landing-text)',
                        transition: 'color 0.3s ease',
                        lineHeight: 1.3
                      }}
                    >
                      {c.title}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--landing-muted)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem'
                    }}>
                      {c.desc}
                    </p>
                  </div>

                  {/* Bottom indicator line */}
                  <div 
                    className="bottom-indicator"
                    style={{
                      height: '2px',
                      width: '0%',
                      opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: `${c.color}`,
                      borderRadius: '2px'
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