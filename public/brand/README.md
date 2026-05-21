# Optivix Brand Assets

## Palette (from `app/globals.css`)

| Token | Dark | Light |
|-------|------|-------|
| Background | `#0c0c0c` | `#f8fafc` |
| Surface | `#161616` | `#ffffff` |
| Accent | `#5b9cf5` | `#2563eb` |
| Accent bright | `#7eb3f7` | `#3b82f6` |
| Text | `#fafafa` | `#0f172a` |

## Files

| File | Use |
|------|-----|
| `logo-icon.svg` | Icon only, transparent (navbar, favicon source) |
| `logo.svg` | Full lockup dark wordmark |
| `logo-light.svg` | Full lockup light wordmark |
| `logo.png` | 512×512 PNG |
| `logo@2x.png` | 1024×1024 PNG |
| `favicon-16x16.png` | Browser tab |
| `favicon-32x32.png` | Browser tab |
| `apple-touch-icon.png` | iOS home screen |

## Regenerate PNGs

```bash
npm run brand:assets
```

## React component

```jsx
import BrandLogo from '@/components/BrandLogo'

<BrandLogo size="md" showWordmark showTagline href="/" />
```

Sizes: `xs` | `sm` | `md` | `lg`
