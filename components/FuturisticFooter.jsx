/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Globe, ExternalLink, Send, ArrowUp } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

const footerLinks = {
  Product:   [
    { label: 'Features',       href: '/#features'     },
    { label: 'Pricing',        href: '/#pricing'      },
    { label: 'IDE',            href: '/ide'            },
    { label: 'Documentation',  href: '#'               },
    { label: 'Changelog',      href: '#'               },
  ],
  Company:   [
    { label: 'About',    href: '#' },
    { label: 'Blog',     href: '#' },
    { label: 'Careers',  href: '#' },
    { label: 'Press',    href: '#' },
    { label: 'Contact',  href: 'mailto:hello@optivix.com' },
  ],
  Resources: [
    { label: 'Help Center',  href: '#' },
    { label: 'Community',    href: '#' },
    { label: 'Status',       href: '#' },
    { label: 'Security',     href: '#' },
    { label: 'Legal',        href: '#' },
  ],
}

const socials = [
  { label: 'GitHub',   symbol: 'GH' },
  { label: 'Twitter',  symbol: 'X' },
  { label: 'LinkedIn', symbol: 'in' },
  { label: 'Discord',  symbol: 'DC' },
]

export default function FuturisticFooter() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--landing-border)', background: 'var(--landing-bg-soft)' }}>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem' }}>

          {/* Brand — takes 2 cols on large screens */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <BrandLogo size="lg" showWordmark showTagline />
            </div>
            <p style={{ color: 'var(--landing-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '20rem' }}>
              The future of software development. AI-powered tools that work alongside developers to build better, faster, and more secure code.
            </p>

            {/* Newsletter */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--landing-muted)', marginBottom: '0.75rem' }}>Stay in the loop</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  style={{
                    flex: 1, padding: '0.625rem 1rem', borderRadius: '0.75rem',
                    background: 'var(--landing-input-bg)', border: '1px solid var(--landing-input-border)',
                    fontSize: '0.875rem', color: 'var(--landing-text)', outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--landing-input-border)'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.625rem 1rem', borderRadius: '0.75rem',
                    background: 'var(--landing-accent)',
                    color: 'var(--landing-btn-text)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Send style={{ width: '1rem', height: '1rem' }} />
                </motion.button>
              </div>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {socials.map((s, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                    background: 'var(--landing-surface)', backdropFilter: 'blur(12px)',
                    border: '1px solid var(--landing-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--landing-muted)',
                    textDecoration: 'none', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.color = 'var(--landing-accent-bright)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--landing-border)'; e.currentTarget.style.color = 'var(--landing-muted)' }}
                  title={s.label}
                >
                  {s.symbol}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--landing-text)', marginBottom: '1.25rem' }}>{heading}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {links.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={item.href}
                      style={{ fontSize: '0.875rem', color: 'var(--landing-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-accent-bright)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-muted)'}
                    >
                      {item.label}
                      <ExternalLink style={{ width: '0.75rem', height: '0.75rem', opacity: 0.4 }} />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <motion.div style={{ margin: '2.5rem 0', height: '1px', background: 'var(--landing-border)' }} />

        {/* Bottom */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--landing-dim)' }}>
          <p>© {year} Optivix, Inc. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Globe style={{ width: '1rem', height: '1rem' }} />
              <span>English</span>
            </div>
            {[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms',          href: '#' },
              { label: 'Cookies',        href: '#' },
            ].map((t, i) => (
              <Link
                key={i} href={t.href}
                style={{ color: 'var(--landing-dim)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--landing-accent-bright)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--landing-dim)'}
              >{t.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
          padding: '0.75rem', borderRadius: '0.75rem',
          background: 'var(--landing-accent)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(var(--landing-accent-rgb),0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ArrowUp style={{ width: '1.25rem', height: '1.25rem', color: 'var(--landing-text)' }} />
      </motion.button>
    </footer>
  )
}
