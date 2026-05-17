'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ParallaxLayer({ 
  children, 
  className = '',
  speed = 0.5,
  direction = 'vertical'
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, direction === 'vertical' ? 100 * speed : 0])
  const x = useTransform(scrollYProgress, [0, 1], [0, direction === 'horizontal' ? 100 * speed : 0])

  return (
    <motion.div
      ref={ref}
      style={{ y, x }}
      className={className}
    >
      {children}
    </motion.div>
  )
}