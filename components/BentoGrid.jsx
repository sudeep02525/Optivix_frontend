'use client'

import { motion } from 'framer-motion'
import {
  Cpu, Shield, Zap, Code2, Brain, GitBranch,
  Lock, Cloud, Sparkles, BarChart3, Terminal, Workflow
} from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'

const features = [
  { icon: Cpu, title: 'Neural Code Analysis', description: 'Deep learning models understand your code context, intent, and architecture patterns in real time.' },
  { icon: Shield, title: 'Zero-Day Protection', description: 'Proactive security scanning before vulnerabilities emerge.' },
  { icon: Zap, title: 'Real-Time Optimization', description: 'Continuous performance monitoring and automatic improvements.' },
  { icon: Brain, title: 'Predictive AI', description: 'Anticipate issues before they occur with machine learning models trained on millions of codebases.' },
  { icon: Code2, title: 'Auto-Refactoring', description: 'Intelligent code restructuring with one-click approval.' },
  { icon: GitBranch, title: 'Smart Git Integration', description: 'AI-powered commit messages and branch management.' },
  { icon: Lock, title: 'Enterprise Security', description: 'SOC2 compliant with end-to-end encryption.' },
  { icon: Cloud, title: 'Cloud Native', description: 'Seamless integration with all major cloud providers.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Comprehensive insights into your development workflow and team velocity.' },
  { icon: Terminal, title: 'CLI First', description: 'Full-featured command line interface for power users.' },
  { icon: Workflow, title: 'Workflow Automation', description: 'Customizable automation for your development pipeline.' },
  { icon: Sparkles, title: 'Magic Mode', description: 'Let AI write, test, and deploy code autonomously. Just describe what you want and watch it happen.' },
]

export default function BentoGrid() {
  return (
    <section className="landing-section">
      <div className="landing-container">
        <SectionHeader
          eyebrow="Features"
          icon={Sparkles}
          title="The Complete"
          accent="Development Suite"
          description="Everything you need to build, secure, and scale — powered by local AI on your machine"
        />

        <div className="bento-grid">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="landing-card"
                style={{
                  padding: '1.5rem',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    alignSelf: 'flex-start',
                    background: 'var(--landing-accent-soft)',
                    border: '1px solid var(--landing-border)',
                  }}
                >
                  <Icon style={{ width: '1.25rem', height: '1.25rem', color: 'var(--landing-accent)' }} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--landing-text)' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--landing-muted)', lineHeight: 1.6, fontSize: '0.875rem' }}>
                  {f.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--landing-dim)', fontSize: '0.875rem', marginTop: '2.5rem' }}>
          And 50+ more features designed for modern development teams
        </p>
      </div>
    </section>
  )
}
