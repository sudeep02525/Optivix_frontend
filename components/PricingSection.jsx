'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { useTheme } from './ThemeContext'

const plans = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    yearly: 0,
    description: 'Perfect for trying out Optivix',
    color: 'from-gray-500 to-slate-600',
    features: [
      '3 projects',
      'Basic AI analysis',
      '10 auto-fixes/day',
      'Community support',
      'VS Code extension',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    monthly: 99,
    yearly: 69,
    description: 'For serious developers who ship production code daily',
    color: 'from-cyan-500 to-purple-500',
    features: [
      'Unlimited projects',
      'Advanced AI features',
      'Unlimited auto-fixes',
      'Priority support',
      'Team collaboration (5 seats)',
      'CI/CD integration',
      'Security scanner',
    ],
    cta: 'Get Started',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthly: null,
    yearly: null,
    description: 'Custom AI solutions for large engineering teams',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Everything in Pro',
      'Unlimited seats',
      'Dedicated AI model',
      'On-premise option',
      'Custom integrations',
      'SLA guarantee',
      '24/7 dedicated support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingSection() {
  const [yearly, setYearly] = useState(false)
  const { theme } = useTheme()

  const colors = {
    dark: {
      background: '#0a0e27',
      cardBg: 'rgba(15,20,35,0.6)',
      text: '#e0e0e0',
      textSecondary: '#9ca3af',
      border: 'rgba(255,255,255,0.05)',
      highlightedBg: 'rgba(0,217,255,0.04)',
      highlightedBorder: 'rgba(6,182,212,0.3)',
    },
    light: {
      background: '#f8f9fa',
      cardBg: 'rgba(255,255,255,0.9)',
      text: '#1a1a1a',
      textSecondary: '#4b5563',
      border: 'rgba(0,0,0,0.08)',
      highlightedBg: 'rgba(0,217,255,0.08)',
      highlightedBorder: 'rgba(6,182,212,0.4)',
    }
  }

  const themeColors = colors[theme]

  return (
    <section id="pricing" style={{ 
      paddingTop: '6rem', paddingBottom: '6rem', 
      paddingLeft: '1rem', paddingRight: '1rem',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '50rem', height: '25rem', borderRadius: '9999px', 
          filter: 'blur(48px)', opacity: 0.1,
          background: 'radial-gradient(ellipse, #00d9ff 0%, #b026ff 50%, transparent 100%)' 
        }} />
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
            padding: '0.5rem 1rem', borderRadius: '9999px', 
            border: '1px solid rgba(6,182,212,0.2)', marginBottom: '1.5rem',
            background: "rgba(0,217,255,0.07)" 
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
            <span style={{ 
              fontSize: '0.875rem', fontWeight: 500,
              background: "linear-gradient(135deg, #00d9ff, #b026ff)", 
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" 
            }}>Simple Pricing</span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', 
            fontWeight: 700, marginBottom: '1.5rem' 
          }}>
            Invest in{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Better Code
            </span>
          </h2>
          <p style={{ 
            fontSize: '1.25rem', color: themeColors.textSecondary, 
            maxWidth: '32rem', margin: '0 auto', marginBottom: '2.5rem' 
          }}>
            Start free. Scale as you grow. No hidden fees.
          </p>

          {/* Toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.375rem', borderRadius: '1rem',
            background: theme === 'dark' ? 'rgba(15,20,35,0.6)' : 'rgba(255,255,255,0.9)', 
            border: `1px solid ${themeColors.border}`,
            backdropFilter: 'blur(12px)',
          }}>
            <button
              onClick={() => setYearly(false)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                background: !yearly ? 'linear-gradient(135deg, #00d9ff, #b026ff)' : 'transparent',
                color: !yearly ? '#fff' : themeColors.textSecondary,
                transition: 'all 0.2s',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: yearly ? 'linear-gradient(135deg, #00d9ff, #b026ff)' : 'transparent',
                color: yearly ? '#fff' : themeColors.textSecondary,
                transition: 'all 0.2s',
              }}
            >
              Yearly
              <span style={{
                fontSize: '0.7rem', padding: '0.125rem 0.5rem', borderRadius: '9999px',
                background: 'rgba(16,185,129,0.2)', color: '#34d399',
                border: '1px solid rgba(52,211,153,0.3)',
              }}>
                Save 30%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem', 
          alignItems: 'center',
        }}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: plan.highlighted ? -4 : -8 }}
              style={{
                position: 'relative',
                borderRadius: '1.5rem',
                padding: '2rem',
                border: '1px solid',
                transition: 'all 0.3s',
                ...(plan.highlighted
                  ? { 
                      borderColor: themeColors.highlightedBorder, 
                      transform: 'scale(1.05)',
                      background: themeColors.highlightedBg,
                      backdropFilter: 'blur(12px)',
                    }
                  : { 
                      background: themeColors.cardBg, 
                      backdropFilter: 'blur(12px)',
                      borderColor: themeColors.border 
                    }
                ),
              }}
              onMouseEnter={(e) => {
                if (!plan.highlighted) {
                  e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.highlighted) {
                  e.currentTarget.style.borderColor = themeColors.border
                }
              }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div style={{ position: 'absolute', top: '-1rem', left: '50%', transform: 'translateX(-50%)' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.375rem', 
                    padding: '0.375rem 1rem', borderRadius: '9999px', 
                    background: 'linear-gradient(135deg, #00d9ff, #b026ff)', 
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(0,217,255,0.3)'
                  }}>
                    <Zap style={{ width: '0.75rem', height: '0.75rem' }} />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan name */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'inline-flex', padding: '0.625rem', borderRadius: '0.75rem', marginBottom: '1rem',
                  background: `linear-gradient(135deg, ${plan.color.replace('from-', '').replace('to-', '').replace(' ', ', ')})`
                }}>
                  <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: themeColors.text }}>{plan.name}</h3>
                <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary }}>{plan.description}</p>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '2rem' }}>
                {plan.monthly ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '3rem', fontWeight: 700,
                      background: "linear-gradient(135deg, #00d9ff, #b026ff)", 
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" 
                    }}>
                      ${yearly ? plan.yearly : plan.monthly}
                    </span>
                    <span style={{ color: themeColors.textSecondary }}>/month</span>
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '2.25rem', fontWeight: 700,
                    background: "linear-gradient(135deg, #00d9ff, #b026ff)", 
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" 
                  }}>Custom</div>
                )}
                {plan.monthly && yearly && (
                  <p style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>
                    Billed yearly — save ${(plan.monthly - plan.yearly) * 12}/yr
                  </p>
                )}
              </div>

              {/* Features */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                    <CheckCircle style={{ width: '1rem', height: '1rem', color: '#22d3ee', flexShrink: 0 }} />
                    <span style={{ color: themeColors.text }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={plan.id === 'enterprise' ? 'mailto:sales@optivix.com' : `/payment?plan=${plan.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    width: '100%', padding: '0.875rem',
                    borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem',
                    textDecoration: 'none', transition: 'all 0.2s',
                    ...(plan.highlighted
                      ? { background: 'linear-gradient(135deg, #00d9ff, #b026ff)', color: '#fff', boxShadow: '0 8px 24px rgba(0,217,255,0.2)' }
                      : { background: 'transparent', color: themeColors.text, border: `1px solid ${themeColors.border}` }
                    ),
                  }}
                >
                  {plan.cta}
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          style={{ 
            textAlign: 'center', marginTop: '3.5rem', 
            fontSize: '0.875rem', color: themeColors.textSecondary 
          }}
        >
          All plans include a 14-day free trial · No credit card required · Cancel anytime
        </motion.div>
      </div>
    </section>
  )
}
