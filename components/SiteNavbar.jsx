'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal, ArrowUpRight } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import BrandLogo from '@/components/BrandLogo'
import { useTheme } from '@/components/ThemeContext'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
]

function smoothScroll(e, href) {
  e.preventDefault()
  document.getElementById(href.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
}

export default function SiteNavbar() {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const shellBg = dark
    ? scrolled ? 'rgba(9,9,11,0.92)' : 'rgba(24,24,27,0.65)'
    : scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.88)'

  const border = dark ? 'var(--landing-border)' : 'rgba(0,0,0,0.08)'
  const textMuted = dark ? 'var(--landing-muted)' : '#64748b'
  const textMain = dark ? 'var(--landing-text)' : '#18181b'

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isDesktop ? '14px 20px' : '10px 12px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            pointerEvents: 'auto',
            borderRadius: isDesktop ? '9999px' : '16px',
            border: `1px solid ${border}`,
            background: shellBg,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: scrolled
              ? dark
                ? '0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(129,140,248,0.08)'
                : '0 12px 32px rgba(0,0,0,0.08)'
              : dark
                ? '0 4px 24px rgba(0,0,0,0.3)'
                : '0 4px 20px rgba(0,0,0,0.04)',
            transition: 'all 0.35s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: isDesktop ? '8px 10px 8px 16px' : '10px 14px',
              minHeight: '52px',
            }}
          >
            <BrandLogo
              href="/"
              size="md"
              showWordmark
              showTagline={isDesktop}
            />

            {isDesktop && (
              <nav
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '4px',
                  borderRadius: '9999px',
                  background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  border: `1px solid ${dark ? 'var(--landing-border)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={(e) => smoothScroll(e, l.href)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: textMuted,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--landing-accent-bright)'
                      e.currentTarget.style.background = 'var(--landing-accent-soft)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = textMuted
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {isDesktop && (
                <>
                  <ThemeToggle />
                  <Link
                    href="/auth"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: textMain,
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--landing-accent-bright)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = textMain }}
                  >
                    Sign In
                  </Link>
                  <Link href="/ide" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '9999px' }}>
                    <Terminal style={{ width: 14, height: 14 }} />
                    Open IDE
                    <ArrowUpRight style={{ width: 13, height: 13, opacity: 0.8 }} />
                  </Link>
                </>
              )}

              {!isDesktop && (
                <button
                  type="button"
                  aria-label="Menu"
                  onClick={() => setMobileOpen((o) => !o)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    color: textMain,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              background: dark ? 'rgba(9,9,11,0.92)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(16px)',
              padding: '88px 20px 24px',
            }}
          >
            <motion.nav
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={(e) => {
                    smoothScroll(e, l.href)
                    setMobileOpen(false)
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 12,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: textMain,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${dark ? 'var(--landing-border)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  {l.label}
                </motion.a>
              ))}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  <ThemeToggle />
                </div>
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary"
                  style={{ textAlign: 'center', padding: '14px' }}
                >
                  Sign In
                </Link>
                <Link
                  href="/ide"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary"
                  style={{ justifyContent: 'center', padding: '14px' }}
                >
                  <Terminal size={16} />
                  Open IDE
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
