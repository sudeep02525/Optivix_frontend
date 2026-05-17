'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Shield, Brain, Code2, CheckCircle } from 'lucide-react'

const showcaseItems = [
  {
    id: 'detect',
    icon: Brain,
    label: 'Bug Detection',
    color: 'from-cyan-500 to-blue-500',
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
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  {
    id: 'optimize',
    icon: Zap,
    label: 'Performance',
    color: 'from-amber-500 to-orange-500',
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
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    id: 'review',
    icon: Code2,
    label: 'Code Review',
    color: 'from-purple-500 to-pink-500',
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
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  {
    id: 'heal',
    icon: Shield,
    label: 'Self-Healing',
    color: 'from-emerald-500 to-teal-500',
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
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
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
      fontSize: '0.9rem', 
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', 
      color: '#e5e7eb', 
      lineHeight: 1.7, 
      whiteSpace: 'pre-wrap',
      fontWeight: 500
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
              color: isGood ? '#34d399' : isBad ? '#fbbf24' : isComment ? '#6b7280' : '#e5e7eb',
              fontWeight: isGood || isBad ? 600 : 500
            }}
          >
            {line}
          </span>
        )
      })}
      <span style={{ 
        display: 'inline-block', width: '0.5rem', height: '1.125rem', 
        background: '#22d3ee', animation: 'pulse 1s infinite', 
        marginLeft: '0.125rem', verticalAlign: 'middle',
        boxShadow: '0 0 8px #22d3ee'
      }} />
    </pre>
  )
}

export default function AIShowcase() {
  const [active, setActive] = useState(0)
  const item = showcaseItems[active]
  const Icon = item.icon

  // Auto-cycle
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % showcaseItems.length), 7000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ 
      paddingTop: '6rem', paddingBottom: '6rem', 
      paddingLeft: '1rem', paddingRight: '1rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          style={{ 
            position: 'absolute', top: '33.333333%', left: '25%', 
            width: '20rem', height: '20rem', borderRadius: '9999px', 
            filter: 'blur(48px)', opacity: 0.2,
            background: 'radial-gradient(circle, #00d9ff, transparent)' 
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          style={{ 
            position: 'absolute', bottom: '33.333333%', right: '25%', 
            width: '20rem', height: '20rem', borderRadius: '9999px', 
            filter: 'blur(48px)', opacity: 0.2,
            background: 'radial-gradient(circle, #b026ff, transparent)' 
          }}
          animate={{ scale: [1.3, 1, 1.3] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <motion.div 
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.625rem', 
              padding: '0.625rem 1.25rem', borderRadius: '9999px', 
              border: '1px solid rgba(6,182,212,0.25)', marginBottom: '1.5rem',
              background: "rgba(0,217,255,0.08)",
              boxShadow: '0 0 15px rgba(0,217,255,0.1)'
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,217,255,0.15)' }}
          >
            <Sparkles style={{ width: '1.125rem', height: '1.125rem', color: '#22d3ee' }} />
            <span style={{ 
              fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em',
              background: "linear-gradient(135deg, #00d9ff, #b026ff)", 
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" 
            }}>Watch AI Work Live</span>
          </motion.div>
          <motion.h2 
            style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
              fontWeight: 800, marginBottom: '1.75rem', lineHeight: 1.15,
              letterSpacing: '-0.02em'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            AI That Actually{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Understands Code
            </span>
          </motion.h2>
          <motion.p 
            style={{ 
              fontSize: '1.25rem', color: '#9ca3af', 
              maxWidth: '48rem', margin: '0 auto', lineHeight: 1.7
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Watch Optivix detect, analyze, and fix real code issues in milliseconds
          </motion.p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div 
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.875rem', marginBottom: '3.5rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {showcaseItems.map((s, i) => {
            const TabIcon = s.icon
            return (
              <motion.button
                key={s.id}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.75rem 1.5rem', borderRadius: '0.875rem',
                  fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.3s', border: 'none',
                  ...(active === i
                    ? { 
                        background: 'rgba(0,217,255,0.12)', 
                        border: '1px solid rgba(0,217,255,0.35)', 
                        color: '#fff',
                        boxShadow: '0 2px 12px rgba(0,217,255,0.15)'
                      }
                    : { 
                        background: 'rgba(15,20,35,0.7)', 
                        border: '1px solid rgba(255,255,255,0.08)', 
                        color: '#9ca3af' 
                      }
                  ),
                }}
              >
                <TabIcon style={{ width: '1.125rem', height: '1.125rem' }} />
                {s.label}
                {active === i && (
                  <motion.div
                    layoutId="activeTab"
                    style={{ 
                      width: '0.5rem', height: '0.5rem', borderRadius: '9999px', 
                      background: '#00d9ff',
                      boxShadow: '0 0 8px #00d9ff'
                    }}
                  />
                )}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Main showcase */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem', 
          alignItems: 'flex-start',
        }}>
          {/* Code panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ 
                opacity: 0, 
                scale: 0.9,
                rotateX: 15,
                transformPerspective: 1000
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateX: 0,
                transformPerspective: 1000
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9,
                rotateX: -15,
                transformPerspective: 1000
              }}
              transition={{ 
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                scale: { duration: 0.6 },
                opacity: { duration: 0.5 }
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(15,20,35,0.95), rgba(10,15,30,0.95))',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '1px solid rgba(0,217,255,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 1px rgba(0,217,255,0.3)',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Editor chrome */}
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '1rem 1.5rem', 
                borderBottom: '1px solid rgba(0,217,255,0.1)', 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.2))' 
              }}>
                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  <div style={{ width: '0.875rem', height: '0.875rem', borderRadius: '9999px', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }} />
                  <div style={{ width: '0.875rem', height: '0.875rem', borderRadius: '9999px', background: '#f59e0b', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }} />
                  <div style={{ width: '0.875rem', height: '0.875rem', borderRadius: '9999px', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500 }}>
                  <motion.div 
                    style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', background: '#10b981', boxShadow: '0 0 8px #10b981' }}
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  AI Analyzing...
                </div>
                <span style={{ fontSize: '0.8rem', color: '#6b7280', fontFamily: 'monospace', fontWeight: 500 }}>app/utils.js</span>
              </div>

              {/* Code */}
              <div style={{ 
                padding: '2rem', 
                minHeight: '22rem',
                background: 'rgba(0,0,0,0.3)'
              }}>
                <TypewriterCode key={item.id + '-code'} code={item.code} />
              </div>

              {/* Insight bar */}
              <div style={{ 
                padding: '1rem 1.5rem', 
                borderTop: '1px solid rgba(255,255,255,0.05)', 
                background: 'rgba(0,0,0,0.1)', 
                display: 'flex', alignItems: 'center', gap: '0.75rem' 
              }}>
                <CheckCircle style={{ width: '1rem', height: '1rem', color: '#34d399', flexShrink: 0 }} />
                <p style={{ fontSize: '0.75rem', color: '#d1d5db' }}>{item.insight}</p>
                <span style={{
                  marginLeft: 'auto', fontSize: '0.75rem', 
                  padding: '0.25rem 0.625rem', borderRadius: '9999px', 
                  border: '1px solid', flexShrink: 0,
                  ...(item.badgeColor === 'bg-red-500/20 text-red-400 border-red-500/30' 
                    ? { background: 'rgba(239,68,68,0.2)', color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }
                    : item.badgeColor === 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }
                    : item.badgeColor === 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    ? { background: 'rgba(168,85,247,0.2)', color: '#c084fc', borderColor: 'rgba(168,85,247,0.3)' }
                    : { background: 'rgba(16,185,129,0.2)', color: '#34d399', borderColor: 'rgba(16,185,129,0.3)' }
                  )
                }}>
                  {item.badge}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Title Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id + '-title'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'linear-gradient(135deg, rgba(15,20,35,0.9), rgba(10,15,30,0.9))',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  border: '1px solid rgba(0,217,255,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ 
                    display: 'inline-flex', 
                    padding: '0.875rem', 
                    borderRadius: '1rem',
                    background: 'rgba(0,217,255,0.12)',
                    border: '1px solid rgba(0,217,255,0.25)',
                    marginBottom: '1.5rem',
                    boxShadow: '0 0 20px rgba(0,217,255,0.2)'
                  }}
                >
                  <Icon style={{ width: '1.75rem', height: '1.75rem', color: '#00d9ff' }} />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: 800, 
                    marginBottom: '1rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}
                >{item.label}</motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{ 
                    color: '#9ca3af', 
                    fontSize: '1rem', 
                    lineHeight: 1.7
                  }}
                >
                  {item.insight}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Stats Grid with staggered animation */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem' 
            }}>
              {[
                { label: 'Detection Speed', value: '< 1ms', icon: Zap, color: '#00d9ff' },
                { label: 'Accuracy Rate', value: '99.7%', icon: CheckCircle, color: '#10b981' },
                { label: 'Auto-Fix Rate', value: '94%', icon: Shield, color: '#a855f7' },
                { label: 'Time Saved', value: '8h/day', icon: Brain, color: '#f59e0b' },
              ].map((stat, i) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={item.id + '-stat-' + i}
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + (i * 0.15), 
                      duration: 0.6,
                      ease: [0.34, 1.56, 0.64, 1]
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -6,
                      boxShadow: `0 12px 40px ${stat.color}20`,
                      transition: { duration: 0.2 }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(15,20,35,0.9), rgba(10,15,30,0.9))',
                      backdropFilter: 'blur(20px)',
                      padding: '1.5rem',
                      borderRadius: '1.25rem',
                      border: `1px solid ${stat.color}20`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 1px ${stat.color}30`,
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <motion.div 
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.6 + (i * 0.15), 
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        marginBottom: '1rem' 
                      }}
                    >
                      <div style={{
                        padding: '0.625rem',
                        borderRadius: '0.625rem',
                        background: `${stat.color}15`,
                        border: `1px solid ${stat.color}30`,
                        boxShadow: `0 0 15px ${stat.color}20`
                      }}>
                        <StatIcon style={{ width: '1.125rem', height: '1.125rem', color: stat.color }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.02em' }}>
                        {stat.label}
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.7 + (i * 0.15), 
                        duration: 0.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      style={{ 
                        fontSize: '2rem', 
                        fontWeight: 900,
                        background: `linear-gradient(135deg, ${stat.color}, #b026ff)`, 
                        WebkitBackgroundClip: "text", 
                        WebkitTextFillColor: "transparent",
                        letterSpacing: '-0.02em'
                      }}
                    >{stat.value}</motion.div>
                  </motion.div>
                )
              })}
            </div>

            {/* Progress indicator */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem' }}
            >
              {showcaseItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    position: 'relative', height: '0.3rem', borderRadius: '9999px', 
                    overflow: 'hidden', flex: 1, border: 'none', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.1)'
                  }}
                >
                  {active === i && (
                    <motion.div
                      style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0,
                        background: 'linear-gradient(135deg, #00d9ff, #b026ff)'
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 7, ease: 'linear' }}
                    />
                  )}
                  {active !== i && i < active && (
                    <div style={{ 
                      position: 'absolute', inset: 0, 
                      background: 'linear-gradient(135deg, #00d9ff, #b026ff)', 
                      opacity: 0.6 
                    }} />
                  )}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
