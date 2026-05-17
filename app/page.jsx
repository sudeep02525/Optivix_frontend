'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'

import LoadingScreen           from '@/components/LoadingScreen'
import BackgroundParticles     from '@/components/BackgroundParticles'
import AnimatedHero            from '@/components/AnimatedHero'
import InfiniteMarquee         from '@/components/InfiniteMarquee'
import AIShowcase              from '@/components/AIShowcase'
import BentoGrid               from '@/components/BentoGrid'
import DashboardPreview        from '@/components/DashboardPreview'
import FloatingCards           from '@/components/FloatingCards'
import AIWorkflowVisualization from '@/components/AIWorkflowVisualization'
import LiveStats               from '@/components/LiveStats'
import ComparisonSection       from '@/components/ComparisonSection'
import StickyStorytelling      from '@/components/StickyStorytelling'
import AnimatedTestimonials    from '@/components/AnimatedTestimonials'
import PricingSection          from '@/components/PricingSection'
import ModernCTA               from '@/components/ModernCTA'
import FuturisticFooter        from '@/components/FuturisticFooter'
import SectionDivider          from '@/components/SectionDivider'
import ThemeToggle             from '@/components/ThemeToggle'
import { useTheme }            from '@/components/ThemeContext'

export const dynamic = 'force-dynamic'

const navLinks = [
  { label: 'Features',     href: '#features'     },
  { label: 'Dashboard',    href: '#dashboard'    },
  { label: 'Workflow',     href: '#workflow'     },
  { label: 'Pricing',      href: '#pricing'      },
  { label: 'Testimonials', href: '#testimonials' },
]

function smoothScroll(e, href) {
  e.preventDefault()
  const id = href.replace('#', '')
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      <BackgroundParticles count={55} color="#00d9ff" />

      <div style={{ 
        background: theme === 'dark' ? '#0a0e27' : '#f8f9fa', 
        minHeight: '100vh', 
        color: theme === 'dark' ? '#e0e0e0' : '#1a1a1a', 
        overflowX: 'hidden', 
        position: 'relative',
        width: '100%',
        margin: '0 auto',
        scrollBehavior: 'smooth',
        zIndex: 10
      }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: theme === 'dark' ? 'rgba(10,14,39,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: theme === 'dark' ? '1px solid rgba(0,217,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

              {/* Logo */}
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
                <div style={{
                  padding: '0.375rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
                </div>
                <span style={{
                  fontSize: '1.25rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Optivix
                </span>
              </Link>

              {/* Desktop links — only shown on desktop */}
              {isDesktop && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                  {navLinks.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={e => smoothScroll(e, l.href)}
                      style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#9ca3af' : '#4b5563', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#00d9ff'}
                      onMouseLeave={e => e.target.style.color = theme === 'dark' ? '#9ca3af' : '#4b5563'}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Desktop CTA buttons — only shown on desktop */}
              {isDesktop && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ThemeToggle />
                  <Link href="/auth" style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0,217,255,0.35)',
                    color: '#00d9ff',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    Sign In
                  </Link>
                  <Link href="/ide" style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}>
                    Get Started Free
                  </Link>
                </div>
              )}

              {/* Mobile toggle — only shown on mobile */}
              {!isDesktop && (
                <button
                  onClick={() => setMobileOpen(o => !o)}
                  style={{ 
                    padding: '0.5rem', 
                    color: '#d1d5db', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer'
                  }}
                >
                  {mobileOpen ? <X style={{ width: '1.5rem', height: '1.5rem' }} /> : <Menu style={{ width: '1.5rem', height: '1.5rem' }} />}
                </button>
              )}
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {mobileOpen && !isDesktop && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', borderTop: theme === 'dark' ? '1px solid rgba(0,217,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}
                >
                  <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {navLinks.map(l => (
                      <a
                        key={l.label}
                        href={l.href}
                        onClick={e => { smoothScroll(e, l.href); setMobileOpen(false) }}
                        style={{ fontSize: '0.875rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563', textDecoration: 'none' }}
                      >
                        {l.label}
                      </a>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem', borderTop: theme === 'dark' ? '1px solid rgba(0,217,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>
                      <Link href="/auth" style={{
                        textAlign: 'center', padding: '0.625rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(0,217,255,0.35)',
                        color: '#00d9ff', fontSize: '0.875rem', textDecoration: 'none',
                      }}>
                        Sign In
                      </Link>
                      <Link href="/ide" style={{
                        textAlign: 'center', padding: '0.625rem',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                        color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none',
                      }}>
                        Get Started Free
                      </Link>
                      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* ── SECTIONS ── */}

        <AnimatedHero />
        <SectionDivider variant="glow" />

        <InfiniteMarquee />
        <SectionDivider variant="dots" />

        <div id="features"><AIShowcase /></div>
        <SectionDivider variant="glow" />

        <BentoGrid />
        <SectionDivider variant="dots" />

        <div id="dashboard"><DashboardPreview /></div>
        <SectionDivider variant="glow" />

        <FloatingCards />
        <SectionDivider variant="dots" />

        <div id="workflow"><AIWorkflowVisualization /></div>
        <SectionDivider variant="dots" />

        <LiveStats />
        <SectionDivider variant="glow" />

        <ComparisonSection />
        <SectionDivider variant="dots" />

        <StickyStorytelling />
        <SectionDivider variant="glow" />

        <div id="testimonials"><AnimatedTestimonials /></div>
        <SectionDivider variant="dots" />

        <PricingSection />
        <SectionDivider variant="glow" />

        <ModernCTA />

        <FuturisticFooter />

      </div>
    </>
  )
}
