'use client'

import { motion } from 'framer-motion'

export default function SectionDivider({ variant = 'glow' }) {
  if (variant === 'glow') {
    return (
      <div style={{ position: 'relative', height: '1px', margin: '0.5rem 0', overflow: 'visible' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent, rgba(0,217,255,0.3), transparent)',
        }} />
        <motion.div
          style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8rem', height: '2rem', borderRadius: '9999px',
            filter: 'blur(16px)',
            background: 'radial-gradient(ellipse, rgba(0,217,255,0.5), transparent)',
          }}
          animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [1, 1.3, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '2rem 0' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            style={{
              width: '0.375rem', height: '0.375rem', borderRadius: '9999px',
              background: '#00d9ff',
            }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    )
  }

  return null
}
