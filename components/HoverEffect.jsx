'use client'

import { motion } from 'framer-motion'

export default function HoverEffect({ 
  children, 
  className = '',
  effect = 'glow',
  intensity = 'medium'
}) {
  const effects = {
    glow: {
      whileHover: { 
        boxShadow: '0 0 30px rgba(0, 217, 255, 0.4)',
        transition: { duration: 0.3 }
      }
    },
    lift: {
      whileHover: { 
        y: -8,
        transition: { duration: 0.2 }
      },
      whileTap: { scale: 0.98 }
    },
    scale: {
      whileHover: { 
        scale: 1.05,
        transition: { duration: 0.2 }
      },
      whileTap: { scale: 0.95 }
    },
    rotate: {
      whileHover: { 
        rotate: 5,
        transition: { duration: 0.3 }
      }
    },
    tilt: {
      whileHover: { 
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }
    }
  }

  const intensityMultipliers = {
    light: 0.5,
    medium: 1,
    strong: 1.5
  }

  const selectedEffect = effects[effect]
  const multiplier = intensityMultipliers[intensity]

  // Adjust effect based on intensity
  const adjustedEffect = {
    ...selectedEffect,
    whileHover: selectedEffect.whileHover ? {
      ...selectedEffect.whileHover,
      ...(selectedEffect.whileHover.y && { y: selectedEffect.whileHover.y * multiplier }),
      ...(selectedEffect.whileHover.scale && { scale: 1 + (selectedEffect.whileHover.scale - 1) * multiplier }),
      ...(selectedEffect.whileHover.rotate && { rotate: selectedEffect.whileHover.rotate * multiplier }),
      ...(selectedEffect.whileHover.rotateX && { rotateX: selectedEffect.whileHover.rotateX * multiplier }),
      ...(selectedEffect.whileHover.rotateY && { rotateY: selectedEffect.whileHover.rotateY * multiplier }),
    } : undefined
  }

  return (
    <motion.div
      className={className}
      {...adjustedEffect}
    >
      {children}
    </motion.div>
  )
}