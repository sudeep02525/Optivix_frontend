'use client'

import { motion } from 'framer-motion'
import {
  Cpu, Shield, Zap, Code2, Brain, GitBranch,
  Lock, Cloud, Sparkles, BarChart3, Terminal, Workflow
} from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Neural Code Analysis',
    description: 'Deep learning models understand your code context, intent, and architecture patterns in real time.',
    color: 'from-cyan-500 to-blue-600',
    accent: 'rgba(0,217,255,0.15)',
    span: 'lg:col-span-2 lg:row-span-2',
    large: true,
  },
  {
    icon: Shield,
    title: 'Zero-Day Protection',
    description: 'Proactive security scanning before vulnerabilities emerge.',
    color: 'from-emerald-500 to-teal-600',
    accent: 'rgba(16,185,129,0.12)',
    span: '',
  },
  {
    icon: Zap,
    title: 'Real-Time Optimization',
    description: 'Continuous performance monitoring and automatic improvements.',
    color: 'from-amber-500 to-orange-600',
    accent: 'rgba(245,158,11,0.12)',
    span: '',
  },
  {
    icon: Brain,
    title: 'Predictive AI',
    description: 'Anticipate issues before they occur with machine learning models trained on millions of codebases.',
    color: 'from-purple-500 to-pink-600',
    accent: 'rgba(168,85,247,0.12)',
    span: 'lg:col-span-2',
  },
  {
    icon: Code2,
    title: 'Auto-Refactoring',
    description: 'Intelligent code restructuring with one-click approval.',
    color: 'from-violet-500 to-indigo-600',
    accent: 'rgba(139,92,246,0.12)',
    span: '',
  },
  {
    icon: GitBranch,
    title: 'Smart Git Integration',
    description: 'AI-powered commit messages and branch management.',
    color: 'from-rose-500 to-red-600',
    accent: 'rgba(244,63,94,0.12)',
    span: '',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SOC2 compliant with end-to-end encryption.',
    color: 'from-green-500 to-emerald-600',
    accent: 'rgba(34,197,94,0.12)',
    span: '',
  },
  {
    icon: Cloud,
    title: 'Cloud Native',
    description: 'Seamless integration with all major cloud providers.',
    color: 'from-sky-500 to-cyan-600',
    accent: 'rgba(14,165,233,0.12)',
    span: '',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights into your development workflow and team velocity.',
    color: 'from-blue-500 to-indigo-600',
    accent: 'rgba(59,130,246,0.12)',
    span: 'lg:col-span-2',
  },
  {
    icon: Terminal,
    title: 'CLI First',
    description: 'Full-featured command line interface for power users.',
    color: 'from-gray-400 to-slate-600',
    accent: 'rgba(148,163,184,0.10)',
    span: '',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Customizable automation for your development pipeline.',
    color: 'from-fuchsia-500 to-purple-600',
    accent: 'rgba(217,70,239,0.12)',
    span: '',
  },
  {
    icon: Sparkles,
    title: 'Magic Mode',
    description: 'Let AI write, test, and deploy code autonomously. Just describe what you want and watch it happen.',
    color: 'from-yellow-400 to-amber-600',
    accent: 'rgba(251,191,36,0.12)',
    span: 'lg:col-span-2 lg:row-span-2',
    large: true,
  },
]

export default function BentoGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.5rem 1rem', 
            borderRadius: '9999px', 
            border: '1px solid rgba(0,217,255,0.2)', 
            background: 'rgba(0,217,255,0.05)', 
            marginBottom: '1.5rem' 
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#00d9ff' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#00d9ff' }}>AI-Powered Features</span>
          </div>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.75rem)', 
            fontWeight: 700, 
            marginBottom: '1.25rem',
            lineHeight: 1.2
          }}>
            The Complete{' '}
            <span style={{ background: "linear-gradient(90deg, #00d9ff, #b026ff, #ff6bcb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Development Suite
            </span>
          </h2>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#9ca3af', 
            maxWidth: '32rem', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Everything you need to build, secure, and scale — powered by cutting-edge AI
          </p>
        </motion.div>

        {/* Bento grid - Clean 4-column layout with equal heights */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1.25rem',
          width: '100%',
          gridAutoRows: 'minmax(200px, auto)'
        }}>
          {features.map((f, i) => {
            const Icon = f.icon
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                style={{
                  position: 'relative',
                  borderRadius: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, rgba(15,20,35,0.8), rgba(20,25,40,0.6))',
                  backdropFilter: 'blur(16px)',
                  height: '100%',
                  minHeight: '200px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)'
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,217,255,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'
                }}
              >
                {/* Accent glow background */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    background: `radial-gradient(circle at 50% 0%, ${f.accent}, transparent 60%)`
                  }}
                  className="accent-glow"
                />

                <div style={{ 
                  position: 'relative', 
                  zIndex: 10, 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  justifyContent: 'space-between'
                }}>
                  {/* Icon with gradient background */}
                  <div
                    style={{ 
                      display: 'inline-flex', 
                      padding: '0.75rem', 
                      borderRadius: '1rem', 
                      marginBottom: '1rem', 
                      alignSelf: 'flex-start',
                      background: `linear-gradient(135deg, ${f.color.replace('from-', '').replace(' to-', ', ')})`,
                      boxShadow: `0 4px 16px ${f.accent}`
                    }}
                  >
                    <Icon style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontWeight: 700, 
                      marginBottom: '0.75rem',
                      fontSize: '1.125rem',
                      color: '#f3f4f6',
                      lineHeight: 1.3
                    }}>
                      {f.title}
                    </h3>
                    <p style={{ 
                      color: '#9ca3af', 
                      lineHeight: 1.6,
                      fontSize: '0.875rem'
                    }}>
                      {f.description}
                    </p>
                  </div>

                  {/* Bottom gradient line */}
                  <div style={{ 
                    marginTop: '1rem', 
                    height: '2px', 
                    borderRadius: '2px',
                    background: `linear-gradient(90deg, ${f.color.replace('from-', '').replace(' to-', ', ')})`,
                    opacity: 0.6
                  }} />
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            fontSize: '0.875rem', 
            marginTop: '3rem' 
          }}
        >
          And 50+ more features designed for modern development teams
        </motion.p>
      </div>
    </section>
  )
}
