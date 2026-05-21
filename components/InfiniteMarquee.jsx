'use client'

import { motion } from 'framer-motion'
import { Code2, GitBranch, MessageSquare, Container, Cloud, Triangle, Server, Globe, Monitor, Cpu, Database, Box } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const logos = [
  { icon: Code2, name: 'GitHub' },
  { icon: GitBranch, name: 'GitLab' },
  { icon: Box, name: 'Figma' },
  { icon: MessageSquare, name: 'Slack' },
  { icon: Container, name: 'Docker' },
  { icon: Cpu, name: 'Kubernetes' },
  { icon: Triangle, name: 'Vercel' },
  { icon: Cloud, name: 'AWS' },
  { icon: Globe, name: 'Google Cloud' },
  { icon: Monitor, name: 'Azure' },
  { icon: Server, name: 'Linux' },
  { icon: Database, name: 'Supabase' },
]

const doubled = [...logos, ...logos]

const cardStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
  padding: '0.5rem 1rem',
  background: 'var(--landing-surface)',
  border: '1px solid var(--landing-border)',
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
      <section className="landing-section" style={{ paddingTop: '2rem', paddingBottom: '3rem', overflow: 'hidden' }}>
        <div className="landing-container">
          <SectionHeader
            eyebrow="Integrations"
            icon={Code2}
            title="Works with your"
            accent="entire stack"
            description="Integrated with the tools and platforms you already use"
            className="section-header--compact"
          />

          {/* Marquee wrapper */}
          <div style={{ position: 'relative' }}>
            {/* Fade left */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '8rem', zIndex: 10,
              background: 'linear-gradient(to right, var(--landing-bg), transparent)', pointerEvents: 'none',
            }} />
            {/* Fade right */}
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '8rem', zIndex: 10,
              background: 'linear-gradient(to left, var(--landing-bg), transparent)', pointerEvents: 'none',
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
                      <Icon style={{ width: '1rem', height: '1rem', color: 'var(--landing-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--landing-muted)', whiteSpace: 'nowrap' }}>
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
                      <Icon style={{ width: '1rem', height: '1rem', color: 'var(--landing-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--landing-muted)', whiteSpace: 'nowrap' }}>
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
              background: 'var(--landing-accent-soft)', border: '1px solid var(--landing-border-accent)',
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--landing-accent-bright)' }}>
                +100 more integrations available
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
