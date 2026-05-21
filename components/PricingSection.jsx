'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Sparkles, Zap, ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
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

  const themeColors = {
    background: 'var(--landing-bg)',
    cardBg: 'var(--landing-surface)',
    text: 'var(--landing-text)',
    textSecondary: 'var(--landing-muted)',
    border: 'var(--landing-border)',
    highlightedBg: 'var(--landing-accent-soft)',
    highlightedBorder: 'var(--landing-border-accent)',
  }

  return (
    <section id="pricing" className="landing-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '50rem', height: '25rem', borderRadius: '9999px', 
          filter: 'blur(48px)', opacity: 0.1,
          background: 'transparent' 
        }} />
      </div>

      <div className="landing-container" style={{ position: 'relative', zIndex: 10 }}>
        <SectionHeader
          eyebrow="Pricing"
          icon={Sparkles}
          title="Invest in"
          accent="Better Code"
          description="Start free. Scale as you grow. No hidden fees."
        />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            padding: '0.375rem', borderRadius: '1rem',
            background: 'var(--landing-surface)', 
            border: `1px solid ${themeColors.border}`,
            backdropFilter: 'blur(12px)',
          }}>
            <button
              onClick={() => setYearly(false)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.75rem',
                fontSize: '0.875rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                background: !yearly ? 'var(--landing-accent)' : 'transparent',
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
                background: yearly ? 'var(--landing-accent)' : 'transparent',
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
        </div>

        {/* Cards */}
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              data-highlighted={plan.highlighted ? 'true' : 'false'}
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
                  e.currentTarget.style.borderColor = 'var(--landing-border-accent)'
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
                    background: 'var(--landing-accent)', 
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: '0 8px 24px rgba(var(--landing-accent-rgb),0.3)'
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
                  background: 'var(--landing-accent)'
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
                      color: 'var(--landing-accent)',
                    }}>
                      ${yearly ? plan.yearly : plan.monthly}
                    </span>
                    <span style={{ color: themeColors.textSecondary }}>/month</span>
                  </div>
                ) : (
                  <div style={{ 
                    fontSize: '2.25rem', fontWeight: 700,
                    color: 'var(--landing-accent)',
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
                    <CheckCircle style={{ width: '1rem', height: '1rem', color: 'var(--landing-accent-bright)', flexShrink: 0 }} />
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
                      ? { background: 'var(--landing-accent)', color: '#fff', boxShadow: '0 8px 24px rgba(var(--landing-accent-rgb),0.2)' }
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
