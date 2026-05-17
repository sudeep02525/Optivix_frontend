/* eslint-disable */
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, Globe, ExternalLink, Send, ArrowUp } from 'lucide-react'

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
  { label: 'Twitter',  symbol: '𝕏'  },
  { label: 'LinkedIn', symbol: 'in' },
  { label: 'Discord',  symbol: '◈'  },
]

export default function FuturisticFooter() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(0,217,255,0.1)' }}>
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '43.75rem', height: '18rem', borderRadius: '9999px', filter: 'blur(48px)',
            background: 'radial-gradient(ellipse, rgba(0,217,255,0.08) 0%, rgba(176,38,255,0.05) 60%, transparent 100%)'
          }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '0.125rem', height: '0.125rem', borderRadius: '9999px',
              background: 'rgba(34,211,238,0.4)',
              left: `${(i * 5.2) % 100}%`, bottom: `${(i * 6.3) % 55}%`
            }}
            animate={{ y: [0, -20, 0], opacity: [0, 0.7, 0] }}
            transition={{ duration: 2.5 + (i % 3), repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem' }}>

          {/* Brand — takes 2 cols on large screens */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #00d9ff, #b026ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, background: "linear-gradient(135deg, #00d9ff, #b026ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Optivix</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '20rem' }}>
              The future of software development. AI-powered tools that work alongside developers to build better, faster, and more secure code.
            </p>

            {/* Newsletter */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#d1d5db', marginBottom: '0.75rem' }}>Stay in the loop</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  style={{
                    flex: 1, padding: '0.625rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.875rem', color: '#e5e7eb', outline: 'none',
                    transition: 'border-color 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.625rem 1rem', borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                    color: '#fff', border: 'none', cursor: 'pointer',
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
                    background: 'rgba(15,20,35,0.6)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: '#d1d5db',
                    textDecoration: 'none', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.color = '#22d3ee' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#d1d5db' }}
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
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', marginBottom: '1.25rem' }}>{heading}</h4>
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
                      style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
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
        <div style={{ margin: '2.5rem 0', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Bottom */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
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
                style={{ color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#22d3ee'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              >{t.label}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(to right, #00d9ff, #b026ff, #ff6bcb)' }} />

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
          padding: '0.75rem', borderRadius: '0.75rem',
          background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,217,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ArrowUp style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
      </motion.button>
    </footer>
  )
}
