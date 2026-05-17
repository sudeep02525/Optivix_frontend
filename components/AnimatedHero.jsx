'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const S = {
  section: {
    position: 'relative', minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', paddingTop: '5rem', paddingBottom: '3rem',
  },
  orb1: {
    position: 'absolute', top: '15%', left: '5%',
    width: '35rem', height: '35rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,217,255,0.2), transparent 70%)',
    filter: 'blur(80px)', pointerEvents: 'none',
    zIndex: 0,
  },
  orb2: {
    position: 'absolute', bottom: '10%', right: '5%',
    width: '35rem', height: '35rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(176,38,255,0.2), transparent 70%)',
    filter: 'blur(80px)', pointerEvents: 'none',
    zIndex: 0,
  },
  orb3: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '25rem', height: '25rem', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,203,0.1), transparent 70%)',
    filter: 'blur(100px)', pointerEvents: 'none',
    zIndex: 0,
  },
  content: {
    position: 'relative', zIndex: 10,
    width: '100%', maxWidth: '64rem',
    margin: '0 auto', padding: '0 1.5rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
    padding: '0.625rem 1.25rem', borderRadius: '9999px',
    background: 'rgba(0,217,255,0.1)',
    border: '1px solid rgba(0,217,255,0.3)',
    marginBottom: '2.5rem',
    boxShadow: '0 0 30px rgba(0,217,255,0.2)',
  },
  badgeText: {
    fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.02em',
    background: 'linear-gradient(90deg, #00d9ff, #b026ff)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  h1: { 
    fontWeight: 800, lineHeight: 1.15, marginBottom: '2rem',
    letterSpacing: '-0.02em',
  },
  gradLine: {
    display: 'block', marginTop: '0.5rem',
    background: 'linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    color: '#d1d5db', maxWidth: '42rem', margin: '0 auto 3rem',
    lineHeight: 1.8, fontSize: '1.15rem', fontWeight: 400,
  },
  btnRow: {
    display: 'flex', flexWrap: 'wrap', gap: '1.25rem',
    justifyContent: 'center', marginBottom: '0',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
    padding: '1rem 2.5rem', borderRadius: '0.875rem',
    background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
    color: '#fff', fontWeight: 600, fontSize: '1.05rem',
    textDecoration: 'none', whiteSpace: 'nowrap',
    boxShadow: '0 4px 20px rgba(0,217,255,0.3)',
    transition: 'all 0.3s ease',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem 2.5rem', borderRadius: '0.875rem',
    border: '2px solid rgba(0,217,255,0.5)',
    color: '#00d9ff', fontWeight: 600, fontSize: '1.05rem',
    textDecoration: 'none', whiteSpace: 'nowrap', 
    background: 'rgba(0,217,255,0.05)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 0 0 rgba(0,217,255,0)',
    transition: 'all 0.3s ease',
  },
  scrollDot: {
    position: 'absolute', bottom: '2.5rem', left: '50%',
    transform: 'translateX(-50%)', zIndex: 10,
  },
  scrollRing: {
    width: '1.75rem', height: '2.75rem',
    border: '2px solid rgba(0,217,255,0.4)',
    borderRadius: '9999px', display: 'flex', justifyContent: 'center',
  },
  scrollInner: {
    width: '0.3rem', height: '0.875rem',
    background: 'linear-gradient(to bottom, #00d9ff, #b026ff)',
    borderRadius: '9999px', marginTop: '0.5rem',
  },
}

export default function AnimatedHero() {
  return (
    <section style={S.section}>
      {/* Orbs */}
      <motion.div style={S.orb1}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div style={S.orb2}
        animate={{ scale: [1.3, 1, 1.3], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, delay: 3, ease: "easeInOut" }} />
      <motion.div style={S.orb3}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, delay: 1.5, ease: "easeInOut" }} />

      {/* Content */}
      <div style={S.content}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: "easeOut" }}
        >

          {/* Badge */}
          <motion.div 
            style={S.badge} 
            whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(0,217,255,0.3)' }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles style={{ width: '1.125rem', height: '1.125rem', color: '#00d9ff' }} />
            <span style={S.badgeText}>The Future of AI-Powered Development</span>
          </motion.div>

          {/* Headline — 3 lines max */}
          <motion.h1 
            style={{ ...S.h1, fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span style={{ display: 'block', color: '#fff' }}>Build the Future</span>
            <span style={S.gradLine}>With AI That Understands</span>
            <span style={{ display: 'block', marginTop: '0.5rem', color: '#fff' }}>Your Code</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            style={S.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Optivix is the world&apos;s first self-healing development environment that detects,
            analyzes, and fixes code issues in real-time — transforming how developers build software.
          </motion.p>

          {/* Buttons */}
          <motion.div 
            style={S.btnRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/ide" style={{
                ...S.btnPrimary,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,217,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,217,255,0.3)'
              }}
              >
                Start Building Free
                <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <a
                href="#features"
                onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{
                  ...S.btnSecondary,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,217,255,0.8)'
                  e.currentTarget.style.background = 'rgba(0,217,255,0.1)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,217,255,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'
                  e.currentTarget.style.background = 'rgba(0,217,255,0.05)'
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(0,217,255,0)'
                }}
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        style={S.scrollDot} 
        animate={{ y: [0, 12, 0] }} 
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div style={S.scrollRing}>
          <motion.div style={S.scrollInner}
            animate={{ y: [0, 14, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </section>
  )
}
