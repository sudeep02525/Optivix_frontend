'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Rocket, CheckCircle } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const benefits = [
  { icon: Zap,         title: '10x Faster Development', desc: 'Ship features faster with AI assistance' },
  { icon: Shield,      title: 'Enterprise Security',     desc: 'SOC2 compliant, end-to-end encrypted' },
  { icon: Rocket,      title: 'Seamless Integration',    desc: 'Works with your existing tools in minutes' },
  { icon: CheckCircle, title: 'Proven Results',          desc: '98% customer satisfaction rate' },
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
    <section className="landing-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionHeader
          eyebrow="Get Started"
          icon={Sparkles}
          title="Start Building the"
          accent="Future Today"
          description="Join developers who ship faster with local AI in their IDE"
        />

        {/* Professional 2-column layout */}
        <div className="cta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', alignItems: 'stretch' }}>

          {/* Benefits - Professional card */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              borderRadius: '1.5rem',
              padding: '2.5rem',
              border: '1px solid var(--landing-border)',
              background: 'var(--landing-surface)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'var(--landing-shadow-md)'
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(var(--landing-accent-rgb),0.1)',
                border: '1px solid rgba(var(--landing-accent-rgb),0.2)',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--landing-accent)', letterSpacing: '0.05em' }}>
                  WHY OPTIVIX
                </span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2, color: 'var(--landing-text)' }}>
                Built for Modern Teams
              </h3>
              <p style={{ color: 'var(--landing-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
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
                      background: 'var(--landing-row-bg)',
                      border: '1px solid var(--landing-row-border)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--landing-row-bg-hover)'
                      e.currentTarget.style.borderColor = 'var(--landing-border-accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--landing-row-bg)'
                      e.currentTarget.style.borderColor = 'var(--landing-row-border)'
                    }}
                  >
                    <div style={{
                      padding: '0.75rem', borderRadius: '0.875rem', flexShrink: 0,
                      background: 'var(--landing-accent-soft)',
                      border: '1px solid var(--landing-border)',
                    }}>
                      <Icon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--landing-accent)' }} />
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, marginBottom: '0.375rem', fontSize: '1.05rem', color: 'var(--landing-text)' }}>{b.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--landing-muted)', lineHeight: 1.5 }}>{b.desc}</p>
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
              border: '1px solid rgba(var(--landing-accent-rgb),0.2)',
              background: 'rgba(var(--landing-accent-rgb),0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(var(--landing-accent-rgb),0.15), 0 0 80px rgba(var(--landing-accent-rgb),0.1)'
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
                <CheckCircle style={{ width: '0.875rem', height: '0.875rem', color: 'var(--landing-accent)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--landing-accent)', letterSpacing: '0.05em' }}>
                  START FREE TRIAL
                </span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                Get Started Today
              </h3>
              <p style={{ color: 'var(--landing-muted)', fontSize: '0.875rem' }}>
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
                    background: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
                  }}
                >
                  <CheckCircle style={{ width: '2rem', height: '2rem', color: '#fff' }} />
                </motion.div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--landing-accent)', marginBottom: '0.75rem' }}>
                  Welcome to Optivix!
                </h4>
                <p style={{ color: 'var(--landing-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Your account is being set up...
                </p>
                <p style={{ color: 'var(--landing-dim)', fontSize: '0.875rem' }}>
                  Redirecting you to the IDE
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--landing-text)', marginBottom: '0.625rem' }}>
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
                      border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'var(--landing-input-border)'}`,
                      fontSize: '0.95rem',
                      color: 'var(--landing-text)', background: 'var(--landing-input-bg)',
                      transition: 'all 0.3s', outline: 'none', boxSizing: 'border-box',
                      fontWeight: 500
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(var(--landing-accent-rgb),0.5)'
                      e.target.style.background = 'var(--landing-surface-hover)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'var(--landing-input-border)'
                      e.target.style.background = 'var(--landing-input-bg)'
                    }}
                  />
                  {error && <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.375rem', fontWeight: 500 }}>{error}</p>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--landing-text)', marginBottom: '0.625rem' }}>
                    Company Size
                  </label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    style={{
                      width: '100%', padding: '0.875rem 1.125rem', borderRadius: '0.875rem',
                      border: '1px solid var(--landing-input-border)', fontSize: '0.95rem',
                      color: 'var(--landing-text)', background: 'var(--landing-input-bg)',
                      appearance: 'none', cursor: 'pointer', outline: 'none', boxSizing: 'border-box',
                      fontWeight: 500,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center'
                    }}
                  >
                    <option value="" style={{ background: 'var(--landing-bg)' }}>Select company size</option>
                    <option style={{ background: 'var(--landing-bg)' }}>1–10 employees</option>
                    <option style={{ background: 'var(--landing-bg)' }}>11–50 employees</option>
                    <option style={{ background: 'var(--landing-bg)' }}>51–200 employees</option>
                    <option style={{ background: 'var(--landing-bg)' }}>201–500 employees</option>
                    <option style={{ background: 'var(--landing-bg)' }}>500+ employees</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--landing-text)', marginBottom: '0.625rem' }}>
                    Primary Use Case
                  </label>
                  <select
                    value={useCase}
                    onChange={e => setUseCase(e.target.value)}
                    style={{
                      width: '100%', padding: '0.875rem 1.125rem', borderRadius: '0.875rem',
                      border: '1px solid var(--landing-input-border)', fontSize: '0.95rem',
                      color: 'var(--landing-text)', background: 'var(--landing-input-bg)',
                      appearance: 'none', cursor: 'pointer', outline: 'none', boxSizing: 'border-box',
                      fontWeight: 500,
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center'
                    }}
                  >
                    <option value="" style={{ background: 'var(--landing-bg)' }}>Select primary use case</option>
                    <option style={{ background: 'var(--landing-bg)' }}>Web Development</option>
                    <option style={{ background: 'var(--landing-bg)' }}>Mobile Development</option>
                    <option style={{ background: 'var(--landing-bg)' }}>API Development</option>
                    <option style={{ background: 'var(--landing-bg)' }}>DevOps & Infrastructure</option>
                    <option style={{ background: 'var(--landing-bg)' }}>Data Science & ML</option>
                  </select>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(var(--landing-accent-rgb),0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    width: '100%', padding: '1.125rem', borderRadius: '0.875rem',
                    fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer',
                    background: 'var(--landing-accent)',
                    color: 'var(--landing-btn-text)',
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 24px rgba(var(--landing-accent-rgb),0.25)',
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
                  <Shield style={{ width: '1.25rem', height: '1.25rem', color: 'var(--landing-accent)', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--landing-muted)', lineHeight: 1.4 }}>
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
            border: '1px solid var(--landing-border)',
            background: 'var(--landing-row-bg)'
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
                color: 'var(--landing-accent)',
              }}>{s.v}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--landing-dim)', marginTop: '0.125rem' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
