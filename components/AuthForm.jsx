'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Loader, ArrowLeft } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import BrandLogo from '@/components/BrandLogo'

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth'

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode]         = useState('login')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = mode === 'register' ? { name, email, password } : { email, password }
      const res  = await fetch(`${API}/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      localStorage.setItem('nexus_token', data.token)
      localStorage.setItem('token', data.token)
      localStorage.setItem('nexus_user', JSON.stringify(data.user))
      router.push('/ide')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px 10px 36px',
    borderRadius: 10,
    border: '1px solid var(--landing-border)',
    background: 'var(--landing-bg-soft)',
    color: 'var(--landing-text)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      className="font-display"
      style={{
        minHeight: '100vh',
        background: 'var(--landing-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <motion.div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }} initial={false}>
        <ThemeToggle />
      </motion.div>
      <Link
        href="/"
        style={{
          position: 'fixed',
          top: 20,
          left: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--landing-muted)',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 500,
          zIndex: 10,
        }}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="landing-card"
        style={{ width: '100%', maxWidth: 420, padding: 36, position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <BrandLogo size="lg" showWordmark showTagline />
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--landing-bg-soft)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 28,
          border: '1px solid var(--landing-border)',
        }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 9,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s',
                background: mode === m ? 'var(--landing-accent-soft)' : 'transparent',
                color: mode === m ? 'var(--landing-accent)' : 'var(--landing-dim)',
                boxShadow: mode === m ? 'inset 0 0 0 1px var(--landing-border-accent)' : 'none',
              }}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence>
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <label style={{ fontSize: 12, color: 'var(--landing-muted)', display: 'block', marginBottom: 6 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--landing-dim)' }} />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    required={mode === 'register'}
                    style={inputStyle}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={{ fontSize: 12, color: 'var(--landing-muted)', display: 'block', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--landing-dim)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'var(--landing-muted)', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'var(--landing-dim)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                style={{ ...inputStyle, padding: '10px 40px 10px 36px' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--landing-dim)', display: 'flex' }}>
                {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--landing-danger)', fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              marginTop: 4,
              width: '100%',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <><Loader style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />Processing...</>
            ) : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight style={{ width: 16, height: 16 }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--landing-dim)', marginTop: 20 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{ background: 'none', border: 'none', color: 'var(--landing-accent)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
