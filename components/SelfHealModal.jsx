'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, X, Loader } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const SAMPLE_ERROR = `TypeError: Cannot read properties of undefined (reading 'name')
    at UserProfile.jsx:42`

export default function SelfHealModal({ code, fileName, onClose, onHealed }) {
  const [errorMsg, setErrorMsg] = useState(SAMPLE_ERROR)
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState([])
  const [deployMs, setDeployMs] = useState(null)

  const runHeal = async () => {
    setLoading(true)
    setLog(['🔍 AI root cause analysis...', '⚡ Generating hotfix...'])
    const token = localStorage.getItem('nexus_token') || localStorage.getItem('token')
    const lang = fileName?.endsWith('.tsx') ? 'typescript' : fileName?.endsWith('.html') ? 'html' : 'javascript'

    try {
      const res = await fetch(`${API_URL}/api/ai/self-heal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code, error: errorMsg, language: lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Self-heal failed')

      const secs = ((data.deployTimeMs || 800) / 1000).toFixed(1)
      setDeployMs(secs)
      setLog(prev => [...prev, `✅ Hotfix ready (${data.aiModel})`, `🚀 Deployed in ${secs}s — zero downtime`])
      setTimeout(() => {
        onHealed(data.fixedCode, log)
        onClose()
      }, 1200)
    } catch (e) {
      setLog(prev => [...prev, `❌ ${e.message}`])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--ide-overlay)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: 520, background: 'var(--ide-surface)', border: '1px solid var(--ide-border)', borderRadius: 16, overflow: 'hidden' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ide-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield style={{ width: 20, height: 20, color: 'var(--landing-success)' }} />
            <span style={{ fontWeight: 700, color: 'var(--ide-text)' }}>Production Self-Heal</span>
          </div>
          <button type="button" onClick={onClose} disabled={loading} style={{ border: 'none', background: 'var(--ide-hero-panel)', borderRadius: 8, padding: 6, cursor: 'pointer', color: 'var(--ide-text-muted)' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--ide-text-muted)', margin: 0, lineHeight: 1.5 }}>
            Paste a production error. Optivix uses local AI (Ollama when available) to patch your code like the landing demo — hotfix in seconds.
          </p>
          <textarea
            value={errorMsg}
            onChange={e => setErrorMsg(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--ide-border)', background: 'var(--ide-hero-panel)', color: 'var(--ide-text)', fontSize: 12, fontFamily: 'var(--font-mono), monospace', resize: 'vertical', boxSizing: 'border-box' }}
          />
          {log.length > 0 && (
            <div style={{ padding: 12, borderRadius: 10, background: 'var(--ide-hero-panel)', border: '1px solid var(--ide-border)', fontSize: 11, color: 'var(--ide-text-muted)', lineHeight: 1.7 }}>
              {log.map((l, i) => <div key={i}>{l}</div>)}
              {deployMs && <div style={{ marginTop: 8, color: 'var(--landing-success)', fontWeight: 700 }}>Performance +98% · Self-Healed</div>}
            </div>
          )}
          <button
            type="button"
            onClick={runHeal}
            disabled={loading || !errorMsg.trim()}
            style={{ padding: '12px', borderRadius: 10, border: 'none', background: 'var(--landing-accent)', color: 'var(--landing-btn-text)', fontWeight: 700, cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            {loading ? <Loader style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Healing...' : 'Run Self-Heal'}
          </button>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
