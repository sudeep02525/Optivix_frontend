/**
 * Export Optivix logo PNGs and favicons from SVG source.
 * Run: node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp'
import { readFileSync, copyFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const brand = path.join(root, 'public', 'brand')
const iconSvg = path.join(brand, 'logo-icon.svg')
const svgBuffer = readFileSync(iconSvg)

const exports = [
  { name: 'logo.png', size: 512 },
  { name: 'logo@2x.png', size: 1024 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const { name, size } of exports) {
  await sharp(svgBuffer, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(brand, name))
  console.log(`✓ public/brand/${name} (${size}px)`)
}

// Root favicon + Next.js app icons
await sharp(svgBuffer, { density: 300 }).resize(32, 32).png().toFile(path.join(root, 'public', 'favicon.ico'))
console.log('✓ public/favicon.ico (32px PNG-based)')

copyFileSync(iconSvg, path.join(root, 'app', 'icon.svg'))
console.log('✓ app/icon.svg')

await sharp(svgBuffer, { density: 300 }).resize(180, 180).png().toFile(path.join(root, 'app', 'apple-icon.png'))
console.log('✓ app/apple-icon.png')
