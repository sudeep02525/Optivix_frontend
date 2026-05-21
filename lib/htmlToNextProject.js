/**
 * Build a full Next.js App Router project tree from fetched HTML.
 */

function slugify(text) {
  return (text || 'section')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32) || 'section'
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return (m?.[1] || 'Imported Site').trim().replace(/\s+/g, ' ')
}

function extractInlineStyles(html) {
  const blocks = []
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let m
  while ((m = re.exec(html))) blocks.push(m[1].trim())
  return blocks.join('\n\n')
}

function extractBodyInner(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return (m?.[1] || html).trim()
}

function htmlToJsxFragment(html) {
  let jsx = html
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, '')
  jsx = jsx.replace(/\sclass=/gi, ' className=')
  jsx = jsx.replace(/\sfor=/gi, ' htmlFor=')
  jsx = jsx.replace(/<(\w+)([^>]*?)\s\/>/gi, '<$1$2 />')
  jsx = jsx.replace(/<(img|br|hr|input|meta|link|area|base|col|embed|source|track|wbr)([^>]*)>/gi, '<$1$2 />')
  jsx = jsx.replace(/style="([^"]*)"/gi, (_, styles) => {
    const obj = styles
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((pair) => {
        const [k, ...rest] = pair.split(':')
        if (!k || !rest.length) return null
        const key = k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        return `${key}: '${rest.join(':').trim().replace(/'/g, "\\'")}'`
      })
      .filter(Boolean)
      .join(', ')
    return obj ? `style={{ ${obj} }}` : ''
  })
  jsx = jsx.replace(/onclick=/gi, 'onClick=')
  jsx = jsx.replace(/onchange=/gi, 'onChange=')
  return jsx
}

function splitIntoComponents(bodyHtml) {
  const parts = []
  const sectionRe = /<(header|nav|main|footer|section|article)([^>]*)>([\s\S]*?)<\/\1>/gi
  let m
  let lastIndex = 0
  while ((m = sectionRe.exec(bodyHtml))) {
    if (m.index > lastIndex) {
      const between = bodyHtml.slice(lastIndex, m.index).trim()
      if (between.length > 40) parts.push({ tag: 'div', name: `Block${parts.length + 1}`, html: between })
    }
    const tag = m[1].toLowerCase()
    const nameMap = { header: 'SiteHeader', nav: 'SiteNav', main: 'SiteMain', footer: 'SiteFooter', section: 'Section', article: 'Article' }
    const base = nameMap[tag] || 'Section'
    const name = parts.filter((p) => p.name.startsWith(base)).length ? `${base}${parts.length}` : base
    parts.push({ tag, name, html: m[0] })
    lastIndex = m.index + m[0].length
  }
  const tail = bodyHtml.slice(lastIndex).trim()
  if (tail.length > 40) parts.push({ tag: 'div', name: 'SiteContent', html: tail })
  if (parts.length === 0) parts.push({ tag: 'main', name: 'SiteMain', html: bodyHtml })
  return parts.slice(0, 8)
}

/**
 * @returns {{ files: { path: string, content: string }[], siteName: string }}
 */
export function buildNextProjectFromHtml(html, url = '') {
  const siteName = slugify(extractTitle(html))
  const title = extractTitle(html)
  const host = (() => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname
    } catch {
      return 'yoursite.com'
    }
  })()

  const bodyInner = extractBodyInner(html)
  const parts = splitIntoComponents(bodyInner)
  const inlineCss = extractInlineStyles(html)

  const componentFiles = parts.map((p) => {
    const jsx = htmlToJsxFragment(p.html)
    const needsClient = /onClick|onChange|onSubmit|useState|useEffect/i.test(jsx)
    return {
      path: `components/${p.name}.jsx`,
      content: `${needsClient ? "'use client'\n\n" : ''}export default function ${p.name}() {
  return (
    <>
${jsx.split('\n').map((l) => '      ' + l).join('\n')}
    </>
  )
}
`,
    }
  })

  const imports = componentFiles.map((f) => {
    const name = f.path.replace('components/', '').replace('.jsx', '')
    return `import ${name} from '@/components/${name}'`
  })

  const pageBody = componentFiles
    .map((f) => {
      const name = f.path.replace('components/', '').replace('.jsx', '')
      return `      <${name} />`
    })
    .join('\n')

  const files = [
    {
      path: 'package.json',
      content: JSON.stringify(
        {
          name: siteName,
          version: '0.1.0',
          private: true,
          scripts: { dev: 'next dev', build: 'next build', start: 'next start', lint: 'next lint' },
          dependencies: { next: '14.2.5', react: '^18.3.1', 'react-dom': '^18.3.1' },
          devDependencies: { eslint: '^8', 'eslint-config-next': '14.2.5' },
        },
        null,
        2
      ),
    },
    {
      path: 'next.config.mjs',
      content: `/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
`,
    },
    {
      path: 'jsconfig.json',
      content: JSON.stringify({ compilerOptions: { paths: { '@/*': ['./*'] } } }, null, 2),
    },
    {
      path: 'app/globals.css',
      content: `/* Imported from ${host} */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; min-height: 100%; }
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height: 1.5; color: #0f172a; background: #fff; }
img { max-width: 100%; height: auto; }
a { color: inherit; }

${inlineCss || '/* Add styles from original site */'}
`,
    },
    {
      path: 'app/layout.jsx',
      content: `import './globals.css'

export const metadata = {
  title: '${title.replace(/'/g, "\\'")}',
  description: 'Imported from ${host} via Optivix Website Analyzer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`,
    },
    {
      path: 'app/page.jsx',
      content: `${imports.join('\n')}

export default function Page() {
  return (
    <main>
${pageBody}
    </main>
  )
}
`,
    },
    {
      path: 'README.md',
      content: `# ${title}

Generated by **Optivix Website Analyzer** from \`${url || host}\`.

## Run locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Structure

- \`app/\` — Next.js App Router (layout, page, globals.css)
- \`components/\` — Sections extracted from the original HTML
`,
    },
    ...componentFiles,
  ]

  return { files, siteName, title }
}

export function buildProjectTree(files) {
  const root = { name: 'project', type: 'folder', children: [] }
  for (const f of files) {
    const segments = f.path.split('/')
    let node = root
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      const isFile = i === segments.length - 1
      if (isFile) {
        node.children.push({ name: seg, type: 'file', path: f.path, content: f.content })
      } else {
        const folderPath = segments.slice(0, i + 1).join('/')
        let folder = node.children.find((c) => c.type === 'folder' && c.name === seg)
        if (!folder) {
          folder = { name: seg, type: 'folder', path: folderPath, children: [] }
          node.children.push(folder)
        }
        node = folder
      }
    }
  }
  return root
}

export async function downloadProjectZip(files, zipName = 'optivix-next-site') {
  try {
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()
    for (const f of files) zip.file(f.path, f.content)
    const blob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${zipName}.zip`
    a.click()
    URL.revokeObjectURL(a.href)
    return true
  } catch {
    for (const f of files) {
      const blob = new Blob([f.content], { type: 'text/plain' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = f.path.replace(/\//g, '_')
      a.click()
      URL.revokeObjectURL(a.href)
      await new Promise((r) => setTimeout(r, 120))
    }
    return false
  }
}
