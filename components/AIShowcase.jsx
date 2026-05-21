'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Shield, Brain, Code2, CheckCircle } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const showcaseItems = [
  {
    id: 'detect',
    icon: Brain,
    label: 'Bug Detection',
    code: `// AI scanning your code...
function processPayment(amount) {
  // ⚠️  Detected: SQL Injection risk
  const query = "SELECT * FROM users 
    WHERE id = " + userId  // ← unsafe
  
  // ✅  AI Fix Applied:
  const query = db.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).get(userId)
}`,
    insight: 'SQL injection vulnerability detected and patched in 0.3s',
    badge: 'Security Fix',
    badgeStyle: { background: 'rgba(239,68,68,0.12)', color: 'var(--landing-danger)', borderColor: 'rgba(239,68,68,0.25)' },
  },
  {
    id: 'optimize',
    icon: Zap,
    label: 'Performance',
    code: `// Analyzing performance bottleneck...
async function loadDashboard() {
  // ⚠️  N+1 Query detected (47 DB calls)
  const users = await getUsers()
  for (const u of users) {
    u.posts = await getPosts(u.id) // ← slow
  }
  
  // ✅  AI Optimized: Single query
  const users = await getUsersWithPosts()
  // 47 queries → 1 query  (98% faster)
}`,
    insight: 'Reduced 47 database queries to 1. Page load: 4.2s → 0.08s',
    badge: 'Performance +98%',
    badgeStyle: { background: 'rgba(245,158,11,0.12)', color: 'var(--landing-warning)', borderColor: 'rgba(245,158,11,0.25)' },
  },
  {
    id: 'review',
    icon: Code2,
    label: 'Code Review',
    code: `// AI reviewing pull request...

// ⚠️  Issues found:
// 1. Missing error boundary
// 2. Memory leak in useEffect
// 3. Prop types not validated

// ✅  AI Suggestions Applied:
export function UserCard({ user }) {
  useEffect(() => {
    const sub = subscribe(user.id)
    return () => sub.unsubscribe() // ← fixed
  }, [user.id])
  
  return <ErrorBoundary>...</ErrorBoundary>
}`,
    insight: '3 issues auto-fixed. Code quality score: 62 → 97',
    badge: 'Code Quality A+',
    badgeStyle: { background: 'rgba(168,85,247,0.12)', color: '#a855f7', borderColor: 'rgba(168,85,247,0.25)' },
  },
  {
    id: 'heal',
    icon: Shield,
    label: 'Self-Healing',
    code: `// Production error detected...
// ❌  TypeError: Cannot read 
//     properties of undefined
//     at UserProfile.jsx:42

// 🔍  AI Root Cause Analysis:
// API response shape changed in v2.1
// Missing optional chaining

// ✅  Auto-healed in production:
const name = user?.profile?.name 
          ?? 'Anonymous'
// Deployed hotfix in 8 seconds`,
    insight: 'Production crash auto-healed. Zero downtime. Hotfix deployed in 8s',
    badge: 'Self-Healed',
    badgeStyle: { background: 'rgba(16,185,129,0.12)', color: 'var(--landing-success)', borderColor: 'rgba(16,185,129,0.25)' },
  },
]

function TypewriterCode({ code }) {
  const [displayed, setDisplayed] = useState('')
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setDisplayed('')
    setIdx(0)
  }, [code])

  useEffect(() => {
    if (idx >= code.length) return
    const t = setTimeout(() => {
      setDisplayed(code.slice(0, idx + 1))
      setIdx(i => i + 1)
    }, 12)
    return () => clearTimeout(t)
  }, [idx, code])

  return (
    <pre style={{
      fontSize: '0.8125rem',
      fontFamily: 'var(--font-mono), ui-monospace, monospace',
      color: 'var(--landing-text)',
      lineHeight: 1.7,
      whiteSpace: 'pre-wrap',
      fontWeight: 500,
      margin: 0,
    }}>
      {displayed.split('\n').map((line, i) => {
        const isComment = line.trim().startsWith('//')
        const isGood = line.includes('✅')
        const isBad = line.includes('⚠️') || line.includes('❌')
        return (
          <span
            key={i}
            style={{
              display: 'block',
              color: isGood ? 'var(--landing-success)' : isBad ? 'var(--landing-warning)' : isComment ? 'var(--landing-dim)' : 'var(--landing-text)',
              fontWeight: isGood || isBad ? 600 : 500,
            }}
          >
            {line}
          </span>
        )
      })}
      <span style={{
        display: 'inline-block', width: '0.5rem', height: '1.125rem',
        background: 'var(--landing-accent)', animation: 'pulse 1s infinite',
        marginLeft: '0.125rem', verticalAlign: 'middle',
      }} />
    </pre>
  )
}

export default function AIShowcase() {
  const [active, setActive] = useState(0)
  const item = showcaseItems[active]
  const Icon = item.icon

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % showcaseItems.length), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="landing-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div
        style={{
          position: 'absolute', top: '33%', left: '25%',
          width: '20rem', height: '20rem', borderRadius: '9999px',
          filter: 'blur(48px)', opacity: 0.15, pointerEvents: 'none',
          background: 'var(--landing-accent-soft)',
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionHeader
          eyebrow="Live Demo"
          icon={Sparkles}
          title="AI That Actually"
          accent="Understands Code"
          description="Watch Optivix detect, analyze, and fix real code issues in milliseconds"
        />

        {/* Tabs */}
        <motion.div
          className="showcase-tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {showcaseItems.map((s, i) => {
            const TabIcon = s.icon
            const isActive = active === i
            return (
              <motion.button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isActive ? 'var(--landing-accent-soft)' : 'var(--landing-surface)',
                  border: isActive ? '1px solid var(--landing-border-accent)' : '1px solid var(--landing-border)',
                  color: isActive ? 'var(--landing-accent)' : 'var(--landing-muted)',
                  boxShadow: isActive ? 'var(--landing-shadow-md)' : 'none',
                }}
              >
                <TabIcon style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                {s.label}
                {isActive && (
                  <span style={{
                    width: '0.4rem', height: '0.4rem', borderRadius: '50%',
                    background: 'var(--landing-accent)', flexShrink: 0,
                  }} />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Main showcase */}
        <motion.div className="showcase-grid">
          {/* Code panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'var(--landing-surface)',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                border: '1px solid var(--landing-border)',
                boxShadow: 'var(--landing-shadow-lg)',
              }}
            >
              {/* Editor chrome */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1.25rem',
                borderBottom: '1px solid var(--landing-border)',
                background: 'var(--landing-code-header)',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <motion.div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                    <div key={c} style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: c }} />
                  ))}
                </motion.div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--landing-muted)', fontWeight: 500 }}>
                  <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: 'var(--landing-success)' }} />
                  AI Analyzing...
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', fontFamily: 'monospace' }}>app/utils.js</span>
              </div>

              {/* Code */}
              <div style={{
                padding: '1.25rem',
                minHeight: 'min(22rem, 50vh)',
                background: 'var(--landing-code-bg)',
              }}>
                <TypewriterCode key={item.id + '-code'} code={item.code} />
              </div>

              {/* Insight bar */}
              <div style={{
                padding: '0.875rem 1.25rem',
                borderTop: '1px solid var(--landing-border)',
                background: 'var(--landing-bg-soft)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                flexWrap: 'wrap',
              }}>
                <CheckCircle style={{ width: '1rem', height: '1rem', color: 'var(--landing-success)', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: '0.8125rem', color: 'var(--landing-muted)', flex: 1, lineHeight: 1.5, margin: 0 }}>
                  {item.insight}
                </p>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '9999px',
                  border: '1px solid',
                  flexShrink: 0,
                  fontWeight: 600,
                  ...item.badgeStyle,
                }}>
                  {item.badge}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id + '-title'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="landing-card"
                style={{ padding: '1.5rem' }}
              >
                <div style={{
                  display: 'inline-flex',
                  padding: '0.75rem',
                  borderRadius: '0.875rem',
                  background: 'var(--landing-accent-soft)',
                  border: '1px solid var(--landing-border-accent)',
                  marginBottom: '1rem',
                }}>
                  <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--landing-accent)' }} />
                </div>
                <h3 style={{
                  fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                  fontWeight: 800,
                  marginBottom: '0.75rem',
                  lineHeight: 1.3,
                  color: 'var(--landing-text)',
                }}>
                  {item.label}
                </h3>
                <p style={{ color: 'var(--landing-muted)', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
                  {item.insight}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Detection Speed', value: '< 1ms', icon: Zap },
                { label: 'Accuracy Rate', value: '99.7%', icon: CheckCircle },
                { label: 'Auto-Fix Rate', value: '94%', icon: Shield },
                { label: 'Time Saved', value: '8h/day', icon: Brain },
              ].map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={item.id + '-stat-' + i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="landing-card"
                    style={{ padding: '1rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <motion.div style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'var(--landing-accent-soft)',
                        border: '1px solid var(--landing-border-accent)',
                      }}>
                        <StatIcon style={{ width: '1rem', height: '1rem', color: 'var(--landing-accent)' }} />
                      </motion.div>
                      <motion.div style={{ fontSize: '0.75rem', color: 'var(--landing-muted)', fontWeight: 600 }}>
                        {stat.label}
                      </motion.div>
                    </div>
                    <motion.div style={{
                      fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                      fontWeight: 800,
                      color: 'var(--landing-accent)',
                      letterSpacing: '-0.02em',
                    }}>
                      {stat.value}
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '0.375rem', paddingTop: '0.25rem' }}>
              {showcaseItems.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${showcaseItems[i].label}`}
                  style={{
                    position: 'relative', height: '0.25rem', borderRadius: '9999px',
                    overflow: 'hidden', flex: 1, border: 'none', cursor: 'pointer',
                    background: 'var(--landing-border)',
                  }}
                >
                  {active === i && (
                    <motion.div
                      style={{ position: 'absolute', inset: 0, background: 'var(--landing-accent)' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 7, ease: 'linear' }}
                    />
                  )}
                  {active !== i && i < active && (
                    <div style={{ position: 'absolute', inset: 0, background: 'var(--landing-accent)', opacity: 0.4 }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
