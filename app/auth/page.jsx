'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Eye, EyeOff, User, Mail, Lock, ArrowRight, Loader } from 'lucide-react'

const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/auth'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode]         = useState('login') // 'login' | 'register'
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

      // Save token + user to localStorage
      localStorage.setItem('nexus_token', data.token)
      localStorage.setItem('nexus_user', JSON.stringify(data.user))
      router.push('/ide')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', top: '10%', left: '10%', width: 300, height: 300, background: 'rgba(99,102,241,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '10%', width: 300, height: 300, background: 'rgba(139,92,246,0.15)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 420, background: 'rgba(15,20,25,0.85)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, padding: 36, backdropFilter: 'blur(20px)', position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#00d9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: 22, height: 22, color: 'white' }} />
          </div>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#00d9ff', WebkitTextFillColor: '#00d9ff' }}>Optivix</span>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              style={{ flex: 1, padding: '8px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all 0.2s', background: mode === m ? 'linear-gradient(135deg,#00d9ff22,#b026ff22)' : 'transparent', color: mode === m ? '#00d9ff' : 'rgba(255,255,255,0.4)', boxShadow: mode === m ? 'inset 0 0 0 1px rgba(99,102,241,0.3)' : 'none' }}
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
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    required={mode === 'register'}
                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)', color: '#e6edf3', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)', color: '#e6edf3', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.3)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                style={{ width: '100%', padding: '10px 40px 10px 36px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)', color: '#e6edf3', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex' }}>
                {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 4, padding: '12px', borderRadius: 12, border: 'none', background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #00d9ff, #b026ff)', color: 'white', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? (
              <><Loader style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />Processing...</>
            ) : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'}<ArrowRight style={{ width: 16, height: 16 }} /></>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 20 }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{ background: 'none', border: 'none', color: '#00d9ff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}












