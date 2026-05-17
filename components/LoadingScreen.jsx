/* eslint-disable */
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 18
      })
    }, 80)

    // Hide after 1.6s
    const timer = setTimeout(() => setVisible(false), 1600)
    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#0a0e27' }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-96 h-96 rounded-full blur-3xl opacity-30"
              style={{ background: 'radial-gradient(circle, #00d9ff, #b026ff, transparent)' }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <div style={{ padding: '1.25rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #00d9ff, #b026ff)', boxShadow: '0 20px 40px rgba(0,217,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: '2.5rem', height: '2.5rem', color: '#fff' }} />
            </div>

            <motion.span
              className="text-3xl font-bold gradient-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Optivix
            </motion.span>

            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg, #00d9ff, #b026ff)' }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            <motion.p
              className="text-xs text-gray-500 tracking-widest uppercase"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Initializing AI Engine...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}