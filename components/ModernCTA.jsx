'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Rocket, CheckCircle } from 'lucide-react'

const benefits = [
  { icon: Zap,         title: '10x Faster Development', desc: 'Ship features faster with AI assistance',   color: '#00d9ff' },
  { icon: Shield,      title: 'Enterprise Security',     desc: 'SOC2 compliant, end-to-end encrypted',      color: '#10b981' },
  { icon: Rocket,      title: 'Seamless Integration',    desc: 'Works with your existing tools in minutes', color: '#a855f7' },
  { icon: CheckCircle, title: 'Proven Results',          desc: '98% customer satisfaction rate',            color: '#f59e0b' },
]

export default function ModernCTA() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [size, setSize] = useState('')
  const [useCase, setUseCase] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter your email'); return }
    if (!email.includes('@')) { setError('Please enter a valid email'); return }
    setError('')
    setSubmitted(true)
    // Store lead info and redirect to auth/IDE
    localStorage.setItem('optivix_lead', JSON.stringify({ email, size, useCase }))
    setTimeout(() => router.push('/auth'), 1200)
  }

  return (
    <section style={{ 
      paddingTop: '6rem', paddingBottom: '6rem', 
      paddingLeft: '1rem', paddingRight: '1rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div style={{ 
          position: 'absolute', top: '25%', left: '25%', 
          width: '24rem', height: '24rem', borderRadius: '9999px', 
          filter: 'blur(48px)', opacity: 0.15,
          background: 'radial-gradient(circle, #00d9ff, transparent)' 
        }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div style={{ 
          position: 'absolute', bottom: '25%', right: '25%', 
          width: '24rem', height: '24rem', borderRadius: '9999px', 
          filter: 'blur(48px)', opacity: 0.15,
          background: 'radial-gradient(circle, #b026ff, transparent)' 
        }}
          animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} />
      </div>

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
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>Ready to Transform?</span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2.25rem, 5vw, 3rem)', 
            fontWeight: 700, marginBottom: '1.25rem' 
          }}>
            Start Building the{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Future Today
            </span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', color: '#9ca3af', 
            maxWidth: '32rem', margin: '0 auto' 
          }}>
            Join thousands of developers who have already transformed their workflow
          </p>
        </motion.div>

        {/* Professional 2-column layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'stretch'
        }}>

          {/* Benefits - Professional card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(135deg, rgba(15,20,35,0.95), rgba(20,25,40,0.85))',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(0,217,255,0.1)',
                border: '1px solid rgba(0,217,255,0.2)',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00d9ff', letterSpacing: '0.05em' }}>
                  WHY OPTIVIX
                </span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
                Built for Modern Teams
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Join thousands of developers who have transformed their workflow with AI-powered development
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {benefits.map((b, i) => {
                const Icon = b.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 4 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '1.25rem',
                      padding: '1.25rem', borderRadius: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.borderColor = `${b.color}40`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <div style={{ 
                      padding: '0.75rem', borderRadius: '0.875rem', flexShrink: 0,
                      background: `${b.color}18`,
                      border: `1px solid ${b.color}30`,
                      boxShadow: `0 4px 12px ${b.color}15`
                    }}>
                      <Icon style={{ width: '1.5rem', height: '1.5rem', color: b.color }} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, marginBottom: '0.375rem', fontSize: '1.05rem', color: '#f3f4f6' }}>{b.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.5 }}>{b.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Form - Professional card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid rgba(0,217,255,0.2)',
              background: 'linear-gradient(135deg, rgba(0,217,255,0.08), rgba(176,38,255,0.08))',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0,217,255,0.15), 0 0 80px rgba(0,217,255,0.1)'
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(16,185,129,0.15)',
                border: '1px solid rgba(16,185,129,0.3)',
                marginBottom: '1rem'
              }}>
                <CheckCircle style={{ width: '0.875rem', height: '0.875rem', color: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', letterSpacing: '0.05em' }}>
                  START FREE TRIAL
                </span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                Get Started Today
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  style={{
                    width: '4rem',
                    height: '4rem',
                    margin: '0 auto 1.5rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #10b981, #0d9488)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
                  }}
                >
                  <CheckCircle style={{ width: '2rem', height: '2rem', color: '#fff' }} />
                </motion.div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginBottom: '0.75rem' }}>
                  Welcome to Optivix!
                </h4>
                <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Your account is being set up...
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  Redirecting you to the IDE
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.625rem' }}>
                    Work Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '0.875rem 1.125rem', borderRadius: '0.875rem',
                      border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'}`,
                      fontSize: '0.95rem',
                      color: '#f3f4f6', background: 'rgba(255,255,255,0.06)',
                      transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box',
                      fontWeight: 500
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0,217,255,0.5)'
                      e.target.style.background = 'rgba(255,255,255,0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'
                      e.target.style.background = 'rgba(255,255,255,0.06)'
                    }}
                  />
                  {error && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.375rem', fontWeight: 500 }}>{error}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.625rem' }}>
                    Company Size
                  </label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    style={{
                      width: '100%', padding: '0.875rem 1.125rem', borderRadius: '0.875rem',
                      border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.95rem',
                      color: '#f3f4f6', background: 'rgba(15,20,35,0.98)',
                      appearance: 'none', cursor: 'pointer', outline: 'none', boxSizing: 'border-box',
                      fontWeight: 500,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%239ca3af\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center'
                    }}
                  >
                    <option value="" style={{ background: '#0a0e27' }}>Select company size</option>
                    <option style={{ background: '#0a0e27' }}>1–10 employees</option>
                    <option style={{ background: '#0a0e27' }}>11–50 employees</option>
                    <option style={{ background: '#0a0e27' }}>51–200 employees</option>
                    <option style={{ background: '#0a0e27' }}>201–500 employees</option>
                    <option style={{ background: '#0a0e27' }}>500+ employees</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '0.625rem' }}>
                    Primary Use Case
                  </label>
                  <select
                    value={useCase}
                    onChange={e => setUseCase(e.target.value)}
                    style={{
                      width: '100%', padding: '0.875rem 1.125rem', borderRadius: '0.875rem',
                      border: '1px solid rgba(255,255,255,0.12)', fontSize: '0.95rem',
                      color: '#f3f4f6', background: 'rgba(15,20,35,0.98)',
                      appearance: 'none', cursor: 'pointer', outline: 'none', boxSizing: 'border-box',
                      fontWeight: 500,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%239ca3af\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center'
                    }}
                  >
                    <option value="" style={{ background: '#0a0e27' }}>Select primary use case</option>
                    <option style={{ background: '#0a0e27' }}>Web Development</option>
                    <option style={{ background: '#0a0e27' }}>Mobile Development</option>
                    <option style={{ background: '#0a0e27' }}>API Development</option>
                    <option style={{ background: '#0a0e27' }}>DevOps & Infrastructure</option>
                    <option style={{ background: '#0a0e27' }}>Data Science & ML</option>
                  </select>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(0,217,255,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    width: '100%', padding: '1.125rem', borderRadius: '0.875rem',
                    fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 24px rgba(0,217,255,0.2)',
                    transition: 'all 0.3s'
                  }}
                >
                  Start Free Trial
                  <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.button>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  background: 'rgba(16,185,129,0.08)',
                  border: '1px solid rgba(16,185,129,0.2)'
                }}>
                  <Shield style={{ width: '1.25rem', height: '1.25rem', color: '#10b981', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>
                    Your data is encrypted and secure. We never share your information.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          style={{
            marginTop: '3rem',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem',
            padding: '1.5rem 2rem', borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          {[
            { v: '10K+',  l: 'Developers'   },
            { v: '4.9/5', l: 'Rating'        },
            { v: '99.9%', l: 'Uptime'        },
            { v: '24/7',  l: 'Support'       },
            { v: 'SOC2',  l: 'Certified'     },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '1.25rem', fontWeight: 700,
                background: "linear-gradient(135deg,#00d9ff,#b026ff)", 
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" 
              }}>{s.v}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.125rem' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
