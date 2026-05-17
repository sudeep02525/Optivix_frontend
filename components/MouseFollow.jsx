/* eslint-disable */
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function MouseFollow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div className="w-4 h-4 rounded-full bg-linear-to-r from-cyan-400 to-purple-400" />
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
      >
        <div className="w-10 h-10 rounded-full border border-cyan-400/30" />
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="fixed pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{
          x: mousePosition.x - 40,
          y: mousePosition.y - 40,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.3 : 0.1,
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
          mass: 1,
        }}
      >
        <div className="w-20 h-20 rounded-full  blur-xl" />
      </motion.div>

      {/* Interactive trail particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{ zIndex: 1 }}
          animate={{
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            opacity: [0, 0.5, 0],
          }}
          transition={{
            x: {
              type: 'spring',
              stiffness: 1000,
              damping: 50,
              delay: i * 0.05,
            },
            y: {
              type: 'spring',
              stiffness: 1000,
              damping: 50,
              delay: i * 0.05,
            },
            opacity: {
              duration: 0.5,
              delay: i * 0.05,
              repeat: Infinity,
            },
          }}
        >
          <div className="w-2 h-2 rounded-full bg-linear-to-r from-cyan-400 to-purple-400" />
        </motion.div>
      ))}
    </>
  )
}