'use client'

import { useState, useEffect } from 'react'
import SiteNavbar              from '@/components/SiteNavbar'
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
import { useTheme } from '@/components/ThemeContext'

export const dynamic = 'force-dynamic'

export default function Home() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <BackgroundParticles count={theme === 'light' ? 12 : 18} color="var(--landing-accent)" />

      <div
        className="landing-page"
        style={{
          minHeight: '100vh',
          overflowX: 'hidden',
          position: 'relative',
          width: '100%',
          scrollBehavior: 'smooth',
          zIndex: 10,
        }}
      >
        <SiteNavbar />

        <AnimatedHero />
        <InfiniteMarquee />

        <div id="features" className="landing-section--alt">
          <AIShowcase />
        </div>

        <BentoGrid />

        <div id="dashboard" className="landing-section--alt">
          <DashboardPreview />
        </div>

        <FloatingCards />

        <div id="workflow">
          <AIWorkflowVisualization />
        </div>

        <LiveStats />
        <ComparisonSection />
        <StickyStorytelling />

        <div id="testimonials" className="landing-section--alt">
          <AnimatedTestimonials />
        </div>

        <PricingSection />
        <ModernCTA />
        <FuturisticFooter />
      </div>
    </>
  )
}
