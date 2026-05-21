'use client'

import Image from 'next/image'
import Link from 'next/link'
const SIZES = {
  xs: { icon: 20, gap: 6, name: 13, tag: 9 },
  sm: { icon: 28, gap: 8, name: 15, tag: 10 },
  md: { icon: 36, gap: 10, name: 17, tag: 10 },
  lg: { icon: 48, gap: 12, name: 22, tag: 11 },
}

/**
 * Optivix brand mark — icon + optional wordmark & tagline.
 * Uses SVG assets from /public/brand (transparent background).
 */
export default function BrandLogo({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  href,
  className = '',
  style = {},
}) {
  const s = SIZES[size] || SIZES.md
  const iconSrc = '/brand/logo-icon.svg'

  const content = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        textDecoration: 'none',
        color: 'inherit',
        ...style,
      }}
    >
      <Image
        src={iconSrc}
        alt="Optivix"
        width={s.icon}
        height={s.icon}
        priority={size === 'lg'}
        style={{ flexShrink: 0, display: 'block' }}
      />
      {showWordmark && (
        <div style={{ lineHeight: 1.1, minWidth: 0 }}>
          <span
            style={{
              display: 'block',
              fontSize: s.name,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--landing-text, var(--ide-text, #fafafa))',
            }}
          >
            Optivix
          </span>
          {showTagline && (
            <span
              style={{
                display: 'block',
                fontSize: s.tag,
                fontWeight: 600,
                color: 'var(--landing-muted, var(--ide-text-muted, #9ca3af))',
                marginTop: 1,
              }}
            >
              AI-native IDE
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    )
  }
  return content
}
