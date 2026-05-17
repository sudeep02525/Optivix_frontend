/* eslint-disable */
'use client'

import { motion } from 'framer-motion'

export default function GradientAnimation({ 
  children, 
  className = '',
  gradient = 'from-cyan-500 via-purple-500 to-pink-500',
  speed = 'slow'
}) {
  const speedClass = {
    slow: 'animate-gradient-shift',
    medium: 'animate-gradient-shift-medium',
    fast: 'animate-gradient-shift-fast'
  }[speed]

  return (
    <div className={`relative ${className}`}>
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-linear-to-r ${gradient} ${speedClass} opacity-20 blur-xl`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}