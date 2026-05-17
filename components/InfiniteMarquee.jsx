'use client'

import { motion } from 'framer-motion'
import { Code2, GitBranch, MessageSquare, Container, Cloud, Triangle, Server, Globe, Monitor, Cpu, Database, Box } from 'lucide-react'

const logos = [
  { icon: Code2,         name: 'GitHub',       color: '#d1d5db' },
  { icon: GitBranch,     name: 'GitLab',       color: '#fb923c' },
  { icon: Box,           name: 'Figma',        color: '#f472b6' },
  { icon: MessageSquare, name: 'Slack',        color: '#4ade80' },
  { icon: Container,     name: 'Docker',       color: '#60a5fa' },
  { icon: Cpu,           name: 'Kubernetes',   color: '#3b82f6' },
  { icon: Triangle,      name: 'Vercel',       color: '#fff' },
  { icon: Cloud,         name: 'AWS',          color: '#fbbf24' },
  { icon: Globe,         name: 'Google Cloud', color: '#38bdf8' },
  { icon: Monitor,       name: 'Azure',        color: '#93c5fd' },
  { icon: Server,        name: 'Linux',        color: '#facc15' },
  { icon: Database,      name: 'Supabase',     color: '#34d399' },
]

const doubled = [...logos, ...logos]

const cardStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.5rem 1rem',
  background: 'rgba(15,20,35,0.6)',
  border: '1px solid rgba(0,217,255,0.12)',
  borderRadius: '0.75rem',
  backdropFilter: 'blur(12px)',
  minWidth: '8rem', flexShrink: 0,
}

// CSS keyframes for smooth animation
const marqueeStyles = `
  @keyframes marquee-left {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0%); }
  }
  .marquee-left {
    animation: marquee-left 25s linear infinite;
  }
  .marquee-right {
    animation: marquee-right 25s linear infinite;
  }
`

export default function InfiniteMarquee() {
  return (
    <>
      <style>{marqueeStyles}</style>
      <section style={{ padding: '5rem 0', overflow: 'hidden' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.75rem' }}>
              Trusted by industry leaders
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Integrated with the tools and platforms you already use
            </p>
          </motion.div>

          {/* Marquee wrapper */}
          <div style={{ position: 'relative' }}>
            {/* Fade left */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '8rem', zIndex: 10,
              background: 'linear-gradient(to right, #0a0e27, transparent)', pointerEvents: 'none',
            }} />
            {/* Fade right */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '8rem', zIndex: 10,
              background: 'linear-gradient(to left, #0a0e27, transparent)', pointerEvents: 'none',
            }} />

            {/* Row 1 — left */}
            <div style={{ overflow: 'hidden', marginBottom: '1rem' }}>
              <div
                className="marquee-left"
                style={{ display: 'flex', gap: '1rem', width: 'max-content', willChange: 'transform' }}
              >
                {doubled.map((logo, i) => {
                  const Icon = logo.icon
                  return (
                    <div key={i} style={cardStyle}>
                      <Icon style={{ width: '1rem', height: '1rem', color: logo.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#d1d5db', whiteSpace: 'nowrap' }}>
                        {logo.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Row 2 — right */}
            <div style={{ overflow: 'hidden' }}>
              <div
                className="marquee-right"
                style={{ display: 'flex', gap: '1rem', width: 'max-content', willChange: 'transform' }}
              >
                {[...doubled].reverse().map((logo, i) => {
                  const Icon = logo.icon
                  return (
                    <div key={i} style={cardStyle}>
                      <Icon style={{ width: '1rem', height: '1rem', color: logo.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#d1d5db', whiteSpace: 'nowrap' }}>
                        {logo.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '2.5rem' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', borderRadius: '9999px',
              background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#00d9ff' }}>
                +100 more integrations available
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
