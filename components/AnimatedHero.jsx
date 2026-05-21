'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, Bug, Shield, Zap, CheckCircle2, Sparkles } from 'lucide-react'
import Link from 'next/link'

const SCAN_LINES = [
  { id: 1, sev: 'critical', icon: Shield, text: 'innerHTML — XSS risk on line 4', fix: '→ textContent' },
  { id: 2, sev: 'medium', icon: Bug, text: '== loose equality on line 3', fix: '→ ===' },
  { id: 3, sev: 'low', icon: Zap, text: 'var on line 2', fix: '→ const' },
]

const CODE = `// auth.js — before Optivix
var user = getInput()
if (user == null) {
  el.innerHTML = user.name
  console.log('debug', user)
}`

const FIXED = `// auth.js — after auto-fix ✓
const user = getInput()
if (user === null) {
  el.textContent = user.name
  // console.log removed
}`

export default function AnimatedHero() {
  const [phase, setPhase] = useState(0)
  const [showFixed, setShowFixed] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => setPhase(3), 3600)
    const t4 = setTimeout(() => setShowFixed(true), 4200)
    const loop = setInterval(() => {
      setPhase(0)
      setShowFixed(false)
      setTimeout(() => setPhase(1), 400)
      setTimeout(() => setPhase(2), 1800)
      setTimeout(() => setPhase(3), 3200)
      setTimeout(() => setShowFixed(true), 3800)
    }, 9000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearInterval(loop)
    }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '7rem',
        paddingBottom: '5rem',
        overflow: 'hidden',
      }}
    >
      {/* Grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(var(--ide-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--ide-grid-line) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 15%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 15%, transparent 72%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '76rem',
          margin: '0 auto',
          padding: '0 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '3.5rem',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="section-eyebrow"
            style={{ marginBottom: '1.5rem' }}
          >
            <Sparkles className="section-eyebrow__icon" />
            <span>AI-native · Local-first · Self-healing</span>
          </motion.div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              marginBottom: '1.5rem',
              color: 'var(--landing-text)',
            }}
          >
            Code that{' '}
            <span className="text-accent">fixes itself</span>
            <br />
            while you build.
          </h1>

          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: 'var(--landing-muted)',
              maxWidth: '32rem',
              marginBottom: '2.25rem',
            }}
          >
            Not another chatbot wrapper — a real IDE that scans bugs, patches SEO, audits live websites, and runs entirely on{' '}
            <strong style={{ color: 'var(--landing-text)', fontWeight: 600 }}>your stack</strong>.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '2.75rem' }}>
            <Link href="/ide" className="btn-primary">
              Launch IDE
              <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
            <a
              href="#workflow"
              className="btn-secondary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Play style={{ width: 16, height: 16, color: 'var(--landing-accent)' }} />
              See workflow
            </a>
          </div>

          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--landing-border)',
            }}
          >
            {[
              { n: '<12ms', l: 'avg fix time' },
              { n: '0', l: 'cloud AI keys' },
              { n: '4-in-1', l: 'scan · fix · SEO · audit' },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <motion.div className="font-mono text-accent" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {s.n}
                </motion.div>
                <div style={{ fontSize: '12px', color: 'var(--landing-dim)', marginTop: 4 }}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2 }}
          style={{ position: 'relative' }}
        >
          <div
            className="landing-card"
            style={{
              overflow: 'hidden',
              boxShadow: 'var(--landing-shadow-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid var(--landing-border)',
                background: 'var(--ide-hero-panel)',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444', '#f59e0b', '#4ade80'].map((c) => (
                  <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--landing-dim)' }}>
                auth.js — Optivix IDE
              </span>
              <motion.span
                animate={{ opacity: phase >= 3 ? [1, 0.5, 1] : 0.6 }}
                transition={{ duration: 1, repeat: phase >= 3 ? Infinity : 0 }}
                className="font-mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: showFixed ? 'var(--landing-success)' : 'var(--landing-accent-bright)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {showFixed ? 'fixed ✓' : phase >= 1 ? 'scanning…' : 'idle'}
              </motion.span>
            </div>

            <div className="hero-ide-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', minHeight: 280 }}>
              <div style={{ position: 'relative', padding: 16, borderRight: '1px solid var(--landing-border)' }}>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={showFixed ? 'fixed' : 'buggy'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="font-mono"
                    style={{
                      margin: 0,
                      fontSize: 12,
                      lineHeight: 1.7,
                      color: 'var(--landing-muted)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {(showFixed ? FIXED : CODE).split('\n').map((line, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12 }}>
                        <span style={{ color: 'var(--landing-dim)', userSelect: 'none', width: 16, textAlign: 'right' }}>{i + 1}</span>
                        <span
                          style={{
                            color: line.includes('innerHTML') || line.includes('==')
                              ? 'var(--landing-danger)'
                              : line.includes('var') || line.includes('console')
                                ? 'var(--landing-warning)'
                                : line.includes('const') || line.includes('textContent') || line.includes('===')
                                  ? 'var(--landing-success)'
                                  : 'var(--landing-text)',
                          }}
                        >
                          {line}
                        </span>
                      </div>
                    ))}
                  </motion.pre>
                </AnimatePresence>

                {phase >= 1 && phase < 3 && (
                  <motion.div
                    initial={{ top: '10%' }}
                    animate={{ top: ['10%', '85%'] }}
                    transition={{ duration: 2, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      left: 16,
                      right: 16,
                      height: 2,
                      background: 'var(--landing-accent)',
                      boxShadow: '0 0 12px rgba(var(--landing-accent-rgb), 0.5)',
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>

              <div style={{ padding: 12, background: 'var(--landing-bg-soft)' }}>
                <div className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: 'var(--landing-dim)', marginBottom: 10, letterSpacing: '0.06em' }}>
                  AI ANALYSIS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SCAN_LINES.map((item, i) => {
                    const Icon = item.icon
                    const visible = phase > i
                    const fixed = showFixed
                    return (
                      <AnimatePresence key={item.id}>
                        {visible && (
                          <motion.div
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                              padding: 8,
                              borderRadius: 8,
                              fontSize: 10,
                              lineHeight: 1.4,
                              border: `1px solid ${
                                item.sev === 'critical'
                                  ? 'rgba(248,113,113,0.35)'
                                  : item.sev === 'medium'
                                    ? 'rgba(251,191,36,0.35)'
                                    : 'rgba(129,140,248,0.35)'
                              }`,
                              background: fixed ? 'rgba(74,222,128,0.08)' : 'var(--landing-row-bg)',
                              opacity: fixed ? 0.6 : 1,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                              {fixed ? (
                                <CheckCircle2 style={{ width: 12, height: 12, color: 'var(--landing-success)' }} />
                              ) : (
                                <Icon style={{ width: 12, height: 12, color: item.sev === 'critical' ? 'var(--landing-danger)' : 'var(--landing-warning)' }} />
                              )}
                              <span style={{ color: 'var(--landing-muted)' }}>{item.text}</span>
                            </div>
                            {fixed && (
                              <span className="font-mono" style={{ color: 'var(--landing-success)' }}>{item.fix}</span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )
                  })}
                </div>
              </div>
            </div>

            <div
              className="font-mono"
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--landing-border)',
                background: 'var(--ide-hero-panel)',
                fontSize: 11,
                color: showFixed ? 'var(--landing-success)' : 'var(--landing-dim)',
              }}
            >
              {showFixed
                ? '> 3 issues fixed · file saved · health 94%'
                : phase >= 2
                  ? '> analyzing auth.js… 3 issues found'
                  : '> optivix ready — waiting for input'}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: -14,
              right: -10,
              padding: '8px 14px',
              borderRadius: 10,
              background: 'var(--landing-surface)',
              border: '1px solid var(--landing-border)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--landing-muted)',
              backdropFilter: 'blur(12px)',
            }}
          >
            Live demo — no API key
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (min-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr 1.05fr !important;
            gap: 4rem !important;
          }
        }
        @media (max-width: 640px) {
          .hero-ide-inner {
            grid-template-columns: 1fr !important;
          }
          .hero-ide-inner > div:first-child {
            border-right: none !important;
            border-bottom: 1px solid var(--landing-border);
          }
        }
      `}</style>
    </section>
  )
}
