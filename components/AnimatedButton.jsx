'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'

export default function AnimatedButton({ 
  children, 
  variant = 'primary',
  size = 'medium',
  icon = 'none',
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-primary text-white hover:opacity-90',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    outline: 'border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5'
  }

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  const icons = {
    none: null,
    arrow: ArrowRight,
    sparkles: Sparkles,
    zap: Zap
  }

  const Icon = icons[icon]

  return (
    <motion.button
      className={`relative rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {children}
        {Icon && (
          <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        )}
      </span>

      {/* Glow effect for primary variant */}
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 -z-10" />
      )}
    </motion.button>
  )
}