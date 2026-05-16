'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Zap,
  Shield,
  Gauge,
  Code2,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  const features = [
    {
      id: 'bug-detection',
      icon: AlertCircle,
      title: 'Live Bug Detection',
      description: 'Real-time analysis catches bugs before they reach production',
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Security Scanner',
      description: 'Identify vulnerabilities and security risks instantly',
    },
    {
      id: 'performance',
      icon: Gauge,
      title: 'Performance Optimizer',
      description: 'Optimize your code for speed and efficiency',
    },
    {
      id: 'self-healing',
      icon: Sparkles,
      title: 'Self-Healing Mode',
      description: 'AI automatically fixes issues with one click',
    },
    {
      id: 'code-review',
      icon: Code2,
      title: 'AI Code Review',
      description: 'Get intelligent suggestions for code improvement',
    },
    {
      id: 'smart-suggestions',
      icon: Zap,
      title: 'Smart Suggestions',
      description: 'Context-aware completions and refactoring hints',
    },
  ]

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Senior Engineer at TechCorp',
      quote: 'Optivix reduced our bug detection time by 80%. It is like having a senior engineer review every line of code.',
      avatar: 'AC',
    },
    {
      name: 'Sarah Williams',
      role: 'CTO at StartupXYZ',
      quote: 'The auto-heal feature is a game-changer. We ship faster and with more confidence.',
      avatar: 'SW',
    },
    {
      name: 'Marcus Johnson',
      role: 'Full Stack Developer',
      quote: 'Finally, an IDE that understands security. Caught 3 critical vulnerabilities I would have missed.',
      avatar: 'MJ',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e27', color: '#e0e0e0', overflow: 'hidden' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        backgroundColor: 'rgba(15, 20, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 217, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <span className="gradient-text" style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Optivix</span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
            <a href="#features" style={{ color: 'rgba(224, 224, 224, 0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ color: 'rgba(224, 224, 224, 0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Pricing</a>
            <a href="#testimonials" style={{ color: 'rgba(224, 224, 224, 0.6)', transition: 'color 0.3s', textDecoration: 'none' }}>Testimonials</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/auth"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                color: '#00d9ff',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.3s'
              }}
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)',
                color: 'white',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'all 0.3s'
              }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '8rem', paddingBottom: '5rem', padding: '8rem 1.5rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '5rem',
              left: '2.5rem',
              width: '18rem',
              height: '18rem',
              backgroundColor: 'rgba(0, 217, 255, 0.2)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}
          />
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: '2.5rem',
              width: '18rem',
              height: '18rem',
              backgroundColor: 'rgba(176, 38, 255, 0.2)',
              borderRadius: '50%',
              filter: 'blur(60px)'
            }}
          />
        </div>

        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              display: 'inline-block',
              marginBottom: '1.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 217, 255, 0.1)',
              border: '1px solid rgba(0, 217, 255, 0.3)'
            }}>
              <span style={{ color: '#00d9ff', fontSize: '0.875rem', fontWeight: '600' }}>✨ The Future of Development</span>
            </div>

            <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              <span className="gradient-text">Developers spend more time</span>
              <br />
              <span style={{ color: '#e0e0e0' }}>fixing software than building it.</span>
              <br />
              <span className="gradient-text">Optivix changes that.</span>
            </h1>

            <p style={{ fontSize: '1.25rem', color: 'rgba(224, 224, 224, 0.7)', marginBottom: '2rem', maxWidth: '42rem', margin: '0 auto 2rem' }}>
              An AI-native self-healing coding environment that detects bugs, security issues, and performance problems—then fixes them automatically.
            </p>

            <div className="hero-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              <Link
                href="/auth"
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)',
                  color: 'white',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s'
                }}
              >
                Start Coding Free
                <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
              </Link>
              <Link
                href="/auth"
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  color: '#00d9ff',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s'
                }}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 1.5rem', backgroundColor: 'rgba(15, 20, 25, 0.5)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              <span className="gradient-text">AI-Powered Features</span>
            </h2>
            <p style={{ color: 'rgba(224, 224, 224, 0.6)', fontSize: '1.125rem' }}>Everything you need to write better code, faster</p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="glass hover-glow"
                  style={{ padding: '1.5rem', cursor: 'pointer' }}
                >
                  <div style={{
                    marginBottom: '1rem',
                    display: 'inline-block',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 217, 255, 0.1)',
                    transition: 'background-color 0.3s'
                  }}>
                    <Icon style={{ width: '1.5rem', height: '1.5rem', color: '#00d9ff' }} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ color: 'rgba(224, 224, 224, 0.6)', fontSize: '0.875rem' }}>{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '5rem 1.5rem', backgroundColor: 'rgba(15, 20, 25, 0.5)' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Loved by <span className="gradient-text">Developers</span>
            </h2>
            <p style={{ color: 'rgba(224, 224, 224, 0.6)', fontSize: '1.125rem' }}>Join thousands of developers building the future</p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass"
                style={{ padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600' }}>{testimonial.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(224, 224, 224, 0.6)' }}>{testimonial.role}</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(224, 224, 224, 0.8)', fontStyle: 'italic' }}>"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h2>
            <p style={{ color: 'rgba(224, 224, 224, 0.6)', fontSize: '1.125rem' }}>Choose the plan that fits your needs</p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                name: 'Starter',
                price: '$29',
                features: ['Up to 5 projects', 'Basic AI analysis', 'Community support'],
              },
              {
                name: 'Professional',
                price: '$99',
                features: ['Unlimited projects', 'Advanced AI features', 'Priority support', 'Team collaboration'],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'On-premise option'],
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass"
                style={{
                  padding: '2rem',
                  border: plan.highlighted ? '2px solid rgba(0, 217, 255, 0.5)' : '1px solid rgba(0, 217, 255, 0.12)',
                  transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{plan.name}</h3>
                <div className="gradient-text" style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  {plan.price}
                  {plan.price !== 'Custom' && <span style={{ fontSize: '1.125rem', color: 'rgba(224, 224, 224, 0.6)' }}>/mo</span>}
                </div>
                <ul style={{ marginBottom: '2rem', listStyle: 'none', padding: 0 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: '#00d9ff' }} />
                      <span style={{ color: 'rgba(224, 224, 224, 0.8)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: plan.highlighted ? 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)' : 'transparent',
                    border: plan.highlighted ? 'none' : '1px solid rgba(0, 217, 255, 0.3)',
                    color: plan.highlighted ? 'white' : '#00d9ff'
                  }}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(176, 38, 255, 0.1) 100%)',
          filter: 'blur(60px)'
        }} />
        <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Ready to Transform Your Development?</h2>
            <p style={{ fontSize: '1.25rem', color: 'rgba(224, 224, 224, 0.7)', marginBottom: '2rem' }}>Join the future of software development today</p>
            <Link
              href="/auth"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)',
                color: 'white',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(0, 217, 255, 0.1)', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00d9ff 0%, #b026ff 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
                </div>
                <span className="gradient-text" style={{ fontWeight: 'bold' }}>Optivix</span>
              </div>
              <p style={{ color: 'rgba(224, 224, 224, 0.6)', fontSize: '0.875rem' }}>The future of software development</p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: 'rgba(224, 224, 224, 0.6)' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Security</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: 'rgba(224, 224, 224, 0.6)' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.875rem', color: 'rgba(224, 224, 224, 0.6)' }}>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a></li>
                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(0, 217, 255, 0.1)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(224, 224, 224, 0.6)', fontSize: '0.875rem' }}>
            <p>© 2026 Optivix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

