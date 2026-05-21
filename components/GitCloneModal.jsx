'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitBranch, X, Copy, Check } from 'lucide-react'

export default function GitCloneModal({ onClose }) {
  const [url, setUrl] = useState('https://github.com/user/repo.git')
  const [copied, setCopied] = useState(false)
  const cmd = url.trim() ? `git clone ${url.trim()}` : 'git clone <repository-url>'

  const copyCmd = () => {
    navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div style={{ position: 'fixed', inset: 0, background: 'var(--ide-overlay)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ width: '100%', maxWidth: 480, background: 'var(--ide-surface)', border: '1px solid var(--ide-border)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--landing-shadow-lg)' }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--ide-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GitBranch style={{ width: 20, height: 20, color: 'var(--landing-accent)' }} />
            <span style={{ fontWeight: 700, color: 'var(--ide-text)' }}>Clone Repository</span>
          </div>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'var(--ide-hero-panel)', borderRadius: 8, padding: 6, cursor: 'pointer', color: 'var(--ide-text-muted)' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 13, color: 'var(--ide-text-muted)', lineHeight: 1.6, margin: 0 }}>
            Clone in your terminal, then use <strong>Open Folder</strong> in the explorer.
          </p>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://github.com/org/repo.git"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid var(--ide-border)', background: 'var(--ide-hero-panel)', color: 'var(--ide-text)', fontSize: 13, boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <code style={{ flex: 1, fontSize: 12, padding: '10px 12px', borderRadius: 10, background: 'var(--ide-hero-panel)', border: '1px solid var(--ide-border)', color: 'var(--landing-accent)', overflow: 'auto' }}>
              {cmd}
            </code>
            <button type="button" onClick={copyCmd} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: 'var(--landing-accent)', color: 'var(--landing-btn-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12 }}>
              {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
