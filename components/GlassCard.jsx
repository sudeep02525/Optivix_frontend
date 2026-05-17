'use client'

import { motion } from 'framer-motion'

export default function GlassCard({ 
  children, 
  className = '',
  intensity = 'medium',
  hoverEffect = true,
  ...props 
}) {
  const intensityClass = {
    light: 'glass-light',
    medium: 'glass',
    dark: 'glass-dark',
    ultra: 'backdrop-blur-xl bg-white/5 border border-white/10'
  }[intensity]

  return (
    <motion.div
      className={`${intensityClass} rounded-3xl ${className}`}
      whileHover={hoverEffect ? { 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={hoverEffect ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}