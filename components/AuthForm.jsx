'use client'

import '@/styles/auth.css'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader,
  ArrowLeft,
  Shield,
  Sparkles,
  Code2,
} from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth'

const FEATURES = [
  { icon: Code2, title: 'AI-powered IDE', desc: 'Fix bugs, SEO, and analyze code in one workspace' },
  { icon: Sparkles, title: '30-day free trial', desc: 'Unlimited AI during your welcome period' },
  { icon: Shield, title: 'Verified signup', desc: 'OTP on your email when you create an account' },
]

function OtpInput({ value, onChange, disabled }) {
  const refs = useRef([])
  const digits = (value + '      ').slice(0, 6).split('')

  const setDigit = (index, char) => {
    const d = char.replace(/\D/g, '').slice(-1)
    const arr = digits.map((c) => c.trim() || '')
    arr[index] = d
    onChange(arr.join('').slice(0, 6))
    if (d && index < 5) refs.current[index + 1]?.focus()
  }

  const onKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const onPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) onChange(pasted)
  }

  return (
    <div style={{ display: 'flex', gap: 8 }} onPaste={onPaste}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digits[i]?.trim() || ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className="auth-otp-digit"
        />
      ))}
    </div>
  )
}

export default function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [error, setError] = useState('')

  const inputStyle = {
    width: '100%',
    padding: '11px 12px 11px 38px',
    borderRadius: 10,
    border: '1px solid var(--landing-border)',
    background: 'var(--landing-bg-soft)',
    color: 'var(--landing-text)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const sendOtp = async () => {
    if (mode !== 'register') return
    setError('')
    if (!email.trim()) {
      setError('Pehle email daalo')
      return
    }
    if (!name.trim()) {
      setError('Pehle apna naam daalo')
      return
    }
    setOtpLoading(true)
    try {
      const res = await fetch(`${API}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'OTP email nahi bheja ja saka')
      setOtpSent(true)
      setOtp('')
    } catch (err) {
      setError(err.message)
      setOtpSent(false)
    } finally {
      setOtpLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'register') {
      if (!otpSent) {
        setError('Pehle Send OTP dabao — code aapki email par jayega')
        return
      }
      if (otp.length !== 6) {
        setError('6 digit OTP poora daalo')
        return
      }
    }
    setLoading(true)
    try {
      const body =
        mode === 'register'
          ? { name, email, password, otp }
          : { email, password }
      const res = await fetch(`${API}/${mode}`, {
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

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setOtpSent(false)
    setOtp('')
  }

  return (
    <div className="auth-page font-display">
      <aside className="auth-left">
        <div className="auth-left-glow" aria-hidden />
        <Link href="/" className="auth-back-link">
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back to Home
        </Link>

        <div className="auth-left-content">
          <BrandLogo size="lg" showWordmark showTagline />
          <h1 className="auth-left-title">Build smarter with Optivix</h1>
          <p className="auth-left-desc">
            Your AI workspace for code, SEO, and live projects — all in one place.
          </p>
          <ul className="auth-features">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title}>
                <span className="auth-feature-icon">
                  <Icon style={{ width: 18, height: 18, color: 'var(--landing-accent)' }} />
                </span>
                <div className="auth-feature-body">
                  <strong>{title}</strong>
                  <p className="auth-feature-desc">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="auth-left-footer">© {new Date().getFullYear()} Optivix</p>
      </aside>

      <main className="auth-right">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="auth-form-panel"
        >
          <h2 className="auth-form-title">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="auth-form-sub">
            {mode === 'login'
              ? 'Email aur password se sign in karo'
              : 'Email verify karo, phir account banao'}
          </p>

          <form onSubmit={submit} className="auth-form">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <label className="auth-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User className="auth-field-icon" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      style={inputStyle}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="auth-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail className="auth-field-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (mode === 'register') {
                      setOtpSent(false)
                      setOtp('')
                    }
                  }}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <div className="auth-otp-head">
                  <label className="auth-label" style={{ marginBottom: 0 }}>
                    Email OTP
                  </label>
                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={otpLoading}
                    className="auth-otp-send"
                  >
                    {otpLoading ? 'Sending…' : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
                <OtpInput value={otp} onChange={setOtp} disabled={!otpSent} />
                <p className="auth-otp-hint">
                  {otpSent
                    ? `6-digit code bheja gaya — ${email.trim()} ki inbox / spam check karo`
                    : 'Send OTP dabao — code isi email par aayega jo upar likhi hai'}
                </p>
              </div>
            )}

            <div>
              <label className="auth-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock className="auth-field-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  style={{ ...inputStyle, padding: '11px 40px 11px 38px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="auth-eye-btn"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary auth-submit">
              {loading ? (
                <>
                  <Loader className="auth-spin" style={{ width: 16, height: 16 }} />
                  Processing…
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="auth-switch-link"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
