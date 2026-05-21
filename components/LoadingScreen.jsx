/* eslint-disable */
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrandLogo from '@/components/BrandLogo'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 18
      })
    }, 80)

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
          style={{ background: 'var(--landing-bg, #0c0c0c)' }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-96 h-96 rounded-full blur-3xl"
              style={{ background: 'rgba(91, 156, 245, 0.15)' }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <BrandLogo size="lg" showWordmark showTagline />

            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'var(--landing-border)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background: 'var(--landing-accent, #5b9cf5)',
                }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            <motion.p
              className="text-xs tracking-widest uppercase"
              style={{ color: 'var(--landing-muted)' }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Initializing AI Engine…
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
