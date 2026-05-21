'use client'

import { motion } from 'framer-motion'

/**
 * Consistent landing section header — typography from globals.css
 */
export default function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  accent,
  description,
  align = 'center',
  className = '',
}) {
  const centered = align === 'center'

  return (
    <motion.header
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-40px' }}
      className={`section-header ${centered ? 'section-header--center' : 'section-header--left'} ${className}`}
    >
      {eyebrow && (
        <div className="section-eyebrow">
          {Icon && <Icon className="section-eyebrow__icon" aria-hidden />}
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="section-title">
        {title}
        {accent != null && accent !== '' && (
          <>
            {' '}
            <span className="section-title-accent">{accent}</span>
          </>
        )}
      </h2>
      {description && <p className="section-desc">{description}</p>}
    </motion.header>
  )
}
