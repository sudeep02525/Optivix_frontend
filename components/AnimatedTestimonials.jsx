'use client'

import { motion } from 'framer-motion'
import { Quote, Star, Sparkles } from 'lucide-react'

const testimonials = [
  { name: 'Alex Chen',       role: 'Senior Engineer',    company: 'TechCorp',   quote: "Optivix reduced our bug detection time by 80%. It's like having a senior engineer review every line of code.", avatar: 'AC', color: '#00d9ff', rating: 5 },
  { name: 'Sarah Williams',  role: 'CTO',                company: 'StartupXYZ', quote: 'The auto-heal feature is a game-changer. We ship faster and with more confidence than ever before.',           avatar: 'SW', color: '#a855f7', rating: 5 },
  { name: 'Marcus Johnson',  role: 'Full Stack Developer',company: 'Freelance',  quote: 'Finally, an IDE that understands security. Caught 3 critical vulnerabilities I would have missed.',           avatar: 'MJ', color: '#10b981', rating: 5 },
  { name: 'Priya Sharma',    role: 'Lead Developer',     company: 'FinTech Inc', quote: 'The performance optimizations alone paid for the tool in the first month. Incredible ROI.',                   avatar: 'PS', color: '#f59e0b', rating: 5 },
  { name: 'David Kim',       role: 'Engineering Manager', company: 'ScaleUp',   quote: 'Our team velocity increased by 40% after implementing Optivix. The AI suggestions are spot-on.',              avatar: 'DK', color: '#6366f1', rating: 5 },
  { name: 'Emma Rodriguez',  role: 'Senior DevOps',      company: 'CloudBase',  quote: 'The CI/CD integration is seamless. It catches issues before they reach production every single time.',         avatar: 'ER', color: '#f43f5e', rating: 5 },
]

export default function AnimatedTestimonials() {
  return (
    <section style={{ paddingTop: '6rem', paddingBottom: '6rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

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
            border: '1px solid rgba(6,182,212,0.2)', background: 'rgba(6,182,212,0.05)', marginBottom: '1.5rem'
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#22d3ee' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#22d3ee' }}>Loved by Developers</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1.25rem' }}>
            What Developers{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Are Saying
            </span>
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#9ca3af', maxWidth: '32rem', margin: '0 auto' }}>
            Join thousands of developers who have transformed their workflow
          </p>
        </motion.div>

        {/* Cards grid - Clean 3-column grid, 2 rows */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.25rem' 
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              style={{
                position: 'relative', 
                borderRadius: '1.25rem',
                padding: '1.75rem 1.5rem', 
                border: '1px solid rgba(255,255,255,0.08)',
                overflow: 'hidden', 
                background: 'linear-gradient(135deg, rgba(15,20,35,0.95), rgba(20,25,40,0.8))', 
                backdropFilter: 'blur(16px)',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('.t-glow').style.opacity = '1'
                e.currentTarget.style.borderColor = `${t.color}50`
                e.currentTarget.style.boxShadow = `0 8px 32px ${t.color}25`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('.t-glow').style.opacity = '0'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'
              }}
            >
              {/* Hover glow */}
              <div className="t-glow" style={{
                position: 'absolute', inset: 0, opacity: 0,
                transition: 'opacity 0.4s',
                background: `radial-gradient(circle at 50% 0%, ${t.color}15, transparent 60%)`
              }} />

              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Quote icon */}
                <Quote style={{ width: '1.5rem', height: '1.5rem', marginBottom: '0.875rem', opacity: 0.3, color: t.color }} />

                {/* Stars */}
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} style={{ width: '0.875rem', height: '0.875rem', fill: '#fbbf24', color: '#fbbf24' }} />
                  ))}
                </div>

                {/* Quote */}
                <p style={{ 
                  color: '#d1d5db', 
                  fontSize: '0.85rem', 
                  lineHeight: 1.7, 
                  marginBottom: '1.25rem', 
                  fontStyle: 'italic',
                  flex: 1
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid rgba(255,255,255,0.06)' 
                }}>
                  <div style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '9999px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.875rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                    background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                    boxShadow: `0 4px 12px ${t.color}30`
                  }}>
                    {t.avatar}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f3f4f6' }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.role} · {t.company}</p>
                  </div>
                  <div style={{ 
                    width: '0.5rem', 
                    height: '0.5rem', 
                    borderRadius: '9999px', 
                    background: '#10b981', 
                    flexShrink: 0,
                    boxShadow: '0 0 8px rgba(16,185,129,0.5)'
                  }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          style={{ marginTop: '3.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}
        >
          {[
            { value: '4.9/5',  label: 'Average Rating'    },
            { value: '10K+',   label: 'Active Developers' },
            { value: '98%',    label: 'Satisfaction Rate' },
            { value: '24/7',   label: 'Support Coverage'  },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '1.25rem', borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, background: "linear-gradient(135deg,#00d9ff,#b026ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
