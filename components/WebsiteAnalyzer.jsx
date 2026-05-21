'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Code, AlertCircle, CheckCircle, Shield, TrendingUp, ChevronDown, Folder, File, FolderOpen, ChevronRight } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { buildNextProjectFromHtml, buildProjectTree, downloadProjectZip } from '@/lib/htmlToNextProject'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ── Detect website type ──────────────────────────────────────────────────────
function detectWebsiteType(html) {
  const checks = {
    'E-commerce': [/shopify/i, /woocommerce/i, /magento/i, /cart/i, /checkout/i, /product/i, /add-to-cart/i],
    'Blog': [/wordpress/i, /blog/i, /article/i, /post/i, /wp-content/i, /ghost/i],
    'Portfolio': [/portfolio/i, /projects/i, /work/i, /gallery/i],
    'Business': [/about-us/i, /services/i, /contact/i, /company/i],
    'Landing Page': [/cta/i, /sign-up/i, /get-started/i, /hero/i],
    'News': [/news/i, /latest/i, /breaking/i, /headline/i],
    'Social Media': [/facebook/i, /twitter/i, /instagram/i, /social/i, /share/i],
    'Educational': [/course/i, /learn/i, /tutorial/i, /lesson/i, /education/i],
    'SaaS': [/dashboard/i, /pricing/i, /features/i, /api/i, /subscription/i],
  }

  const matches = {}
  for (const [type, patterns] of Object.entries(checks)) {
    matches[type] = patterns.filter(p => p.test(html)).length
  }

  const sorted = Object.entries(matches).sort((a, b) => b[1] - a[1])
  return sorted[0][1] > 0 ? sorted[0][0] : 'General Website'
}

function ProjectTree({ node, depth, selectedPath, onSelect, expanded, onToggle }) {
  if (node.type === 'file') {
    const active = node.path === selectedPath
    return (
      <button
        type="button"
        onClick={() => onSelect(node.path, node.content)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 6,
          padding: `4px 8px 4px ${8 + depth * 14}px`, border: 'none', borderRadius: 6,
          background: active ? 'var(--landing-accent-soft)' : 'transparent',
          color: active ? 'var(--landing-accent)' : 'var(--ide-text-muted)',
          fontSize: 11, cursor: 'pointer', textAlign: 'left',
        }}
      >
        <File style={{ width: 12, height: 12, flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.name}</span>
      </button>
    )
  }
  const folderKey = node.path || node.name
  const isOpen = expanded.has(folderKey)
  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(folderKey)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 4,
          padding: `4px 8px 4px ${8 + depth * 14}px`, border: 'none', background: 'transparent',
          color: 'var(--ide-text-muted)', fontSize: 11, cursor: 'pointer', textAlign: 'left',
        }}
      >
        <ChevronRight style={{ width: 10, height: 10, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
        {isOpen ? <FolderOpen style={{ width: 12, height: 12 }} /> : <Folder style={{ width: 12, height: 12 }} />}
        <span>{node.name}/</span>
      </button>
      {isOpen && node.children?.map((ch) => (
        <ProjectTree key={ch.path || ch.name + depth} node={ch} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} expanded={expanded} onToggle={onToggle} />
      ))}
    </div>
  )
}

// ── Analyze fetched HTML ──────────────────────────────────────────────────────
function analyzeHTML(html, url) {
  const issues = []
  const suggestions = []

  // SEO checks
  const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html)
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const titleText = titleMatch ? titleMatch[1].trim() : ''

  if (!hasTitle || !titleText) {
    issues.push({ cat: 'SEO', sev: 'critical', title: 'Missing <title> tag', desc: 'Every page must have a title tag for SEO.', fix: 'Add <title>Your Page Title</title> inside <head>.' })
  } else if (titleText.length < 30) {
    issues.push({ cat: 'SEO', sev: 'medium', title: 'Title too short', desc: `Title is only ${titleText.length} chars. Recommended: 50-60.`, fix: 'Make the title more descriptive (50-60 characters).' })
  } else if (titleText.length > 60) {
    issues.push({ cat: 'SEO', sev: 'low', title: 'Title too long', desc: `Title is ${titleText.length} chars. Google truncates after 60.`, fix: 'Shorten the title to under 60 characters.' })
  }

  const hasDesc = /<meta[^>]+name=["']description["'][^>]*content=["'][^"']+["']/i.test(html)
  if (!hasDesc) issues.push({ cat: 'SEO', sev: 'high', title: 'Missing meta description', desc: 'Meta description is crucial for search engine snippets.', fix: 'Add <meta name="description" content="..." /> in <head>.' })

  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html)
  if (!hasViewport) issues.push({ cat: 'SEO', sev: 'high', title: 'Missing viewport meta tag', desc: 'Without viewport, the site is not mobile-friendly.', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0" />.' })

  const hasCharset = /<meta[^>]+charset/i.test(html)
  if (!hasCharset) issues.push({ cat: 'SEO', sev: 'medium', title: 'Missing charset declaration', desc: 'Charset should be declared for proper text encoding.', fix: 'Add <meta charset="UTF-8" /> as first tag in <head>.' })

  const hasOG = /<meta[^>]+property=["']og:/i.test(html)
  if (!hasOG) issues.push({ cat: 'SEO', sev: 'medium', title: 'Missing Open Graph tags', desc: 'OG tags control how your page looks when shared on social media.', fix: 'Add og:title, og:description, og:image, og:url meta tags.' })

  const hasTwitter = /<meta[^>]+name=["']twitter:/i.test(html)
  if (!hasTwitter) suggestions.push({ cat: 'SEO', title: 'Add Twitter Card tags', desc: 'Twitter Card tags improve appearance when shared on Twitter/X.' })

  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html)
  if (!hasCanonical) issues.push({ cat: 'SEO', sev: 'medium', title: 'Missing canonical URL', desc: 'Canonical tag prevents duplicate content issues.', fix: 'Add <link rel="canonical" href="https://yoursite.com/page" />.' })

  const hasSchema = /<script[^>]+type=["']application\/ld\+json["']/i.test(html)
  if (!hasSchema) suggestions.push({ cat: 'SEO', title: 'Add Schema.org structured data', desc: 'JSON-LD structured data helps search engines understand your content better.' })

  const hasRobots = /<meta[^>]+name=["']robots["']/i.test(html)
  if (!hasRobots) suggestions.push({ cat: 'SEO', title: 'Add robots meta tag', desc: 'Explicitly tell search engines whether to index this page.' })

  // H1 checks
  const h1Matches = html.match(/<h1[\s>]/gi) || []
  if (h1Matches.length === 0) issues.push({ cat: 'SEO', sev: 'high', title: 'No <h1> tag found', desc: 'Every page should have exactly one H1 tag as the main heading.', fix: 'Add one <h1> tag with your main keyword.' })
  else if (h1Matches.length > 1) issues.push({ cat: 'SEO', sev: 'medium', title: `Multiple <h1> tags (${h1Matches.length})`, desc: 'Only one H1 per page is recommended for SEO.', fix: 'Keep one <h1> and change others to <h2> or <h3>.' })

  // Images without alt
  const imgTotal = (html.match(/<img[^>]*>/gi) || []).length
  const imgNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length
  if (imgNoAlt > 0) issues.push({ cat: 'Accessibility', sev: 'high', title: `${imgNoAlt}/${imgTotal} images missing alt text`, desc: 'Alt text is required for accessibility and SEO image indexing.', fix: 'Add descriptive alt="..." to every <img> tag.' })

  // Performance checks
  const inlineStyles = (html.match(/style="[^"]+"/g) || []).length
  if (inlineStyles > 5) issues.push({ cat: 'Performance', sev: 'low', title: `${inlineStyles} inline styles found`, desc: 'Inline styles increase HTML size and are hard to maintain.', fix: 'Move styles to an external CSS file.' })

  const hasMinifiedCSS = /<link[^>]+rel=["']stylesheet["']/i.test(html)
  if (!hasMinifiedCSS) suggestions.push({ cat: 'Performance', title: 'No external CSS found', desc: 'Consider using an external stylesheet for better caching.' })

  // Security checks
  const hasHTTPS = url.startsWith('https://')
  if (!hasHTTPS) issues.push({ cat: 'Security', sev: 'critical', title: 'Site not using HTTPS', desc: 'HTTP is insecure. Data is transmitted unencrypted.', fix: 'Install an SSL certificate and redirect HTTP to HTTPS.' })

  const hasCSP = /<meta[^>]+http-equiv=["']Content-Security-Policy["']/i.test(html)
  if (!hasCSP) suggestions.push({ cat: 'Security', title: 'No Content Security Policy', desc: 'CSP headers protect against XSS attacks.' })

  // HTML lang
  const hasLang = /<html[^>]+lang=/i.test(html)
  if (!hasLang) issues.push({ cat: 'Accessibility', sev: 'medium', title: 'Missing lang attribute on <html>', desc: 'Screen readers need the lang attribute to use correct pronunciation.', fix: 'Add lang="en" to your <html> tag.' })

  // Favicon
  const hasFavicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html)
  if (!hasFavicon) suggestions.push({ cat: 'Best Practices', title: 'No favicon found', desc: 'A favicon improves brand recognition in browser tabs.' })

  // Score calculation
  const criticalCount = issues.filter(i => i.sev === 'critical').length
  const highCount = issues.filter(i => i.sev === 'high').length
  const mediumCount = issues.filter(i => i.sev === 'medium').length
  const lowCount = issues.filter(i => i.sev === 'low').length
  const score = Math.max(0, 100 - criticalCount * 25 - highCount * 15 - mediumCount * 7 - lowCount * 3)

  // Detect website type
  const websiteType = detectWebsiteType(html)

  return { 
    issues, 
    suggestions, 
    score, 
    websiteType,
    stats: { 
      title: titleText, 
      imgTotal, 
      h1Count: h1Matches.length,
      htmlSize: (html.length / 1024).toFixed(2) + ' KB',
      hasHTTPS: url.startsWith('https://'),
    } 
  }
}

export default function WebsiteAnalyzer({ onClose, isDarkMode = true, onOpenInEditor }) {
  const [url, setUrl]               = useState('')
  const [loading, setLoading]       = useState(false)
  const [progress, setProgress]     = useState(0)
  const [step, setStep]             = useState('')
  const [result, setResult]         = useState(null)
  const [htmlCode, setHtmlCode]     = useState('')
  const [projectFiles, setProjectFiles] = useState([])
  const [projectTree, setProjectTree] = useState(null)
  const [selectedFilePath, setSelectedFilePath] = useState('app/page.jsx')
  const [previewCode, setPreviewCode] = useState('')
  const [activeTab, setActiveTab]   = useState('overview')
  const [auditUrl, setAuditUrl]     = useState('')
  const [error, setError]           = useState('')
  const [expandedIssue, setExpandedIssue] = useState(null)
  const [treeExpanded, setTreeExpanded] = useState(new Set())
  const [downloadingZip, setDownloadingZip] = useState(false)

  useEffect(() => {
    if (!projectFiles.length) return
    const keys = new Set()
    for (const f of projectFiles) {
      const parts = f.path.split('/')
      let acc = ''
      for (let i = 0; i < parts.length - 1; i++) {
        acc = acc ? `${acc}/${parts[i]}` : parts[i]
        keys.add(acc)
      }
    }
    setTreeExpanded(keys)
  }, [projectFiles])

  const applyProjectFromHtml = (html, target, auditResult) => {
    const { files } = buildNextProjectFromHtml(html, target)
    setHtmlCode(html)
    setProjectFiles(files)
    setProjectTree(buildProjectTree(files))
    const defaultPath = files.find((f) => f.path === 'app/page.jsx')?.path || files[0]?.path
    setSelectedFilePath(defaultPath)
    setPreviewCode(files.find((f) => f.path === defaultPath)?.content || '')
    setAuditUrl(target)
    setResult(auditResult)
    setActiveTab('project')
  }

  const analyze = async () => {
    if (!url.trim()) return
    const target = url.startsWith('http') ? url : `https://${url}`
    setLoading(true); setResult(null); setHtmlCode(''); setError(''); setProgress(0)

    try {
      const steps = [
        [15, 'Connecting to website...'],
        [35, 'Fetching HTML source...'],
        [55, 'SEO & security audit...'],
        [75, 'Building Next.js folder (app, components)...'],
        [95, 'Packaging project files...'],
      ]
      for (const [p, s] of steps) {
        setProgress(p); setStep(s)
        await new Promise(r => setTimeout(r, 300))
      }

      const token = typeof window !== 'undefined' ? (localStorage.getItem('nexus_token') || localStorage.getItem('token')) : null
      if (token) {
        try {
          setStep('Fetching via Optivix server (no CORS)...')
          const res = await fetch(`${API_URL}/api/ai/website-audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ url: target }),
          })
          const data = await res.json()
          if (res.ok && data.html) {
            setProgress(100); setStep('Done!')
            applyProjectFromHtml(data.html, data.url || target, {
              issues: data.issues, suggestions: data.suggestions, score: data.score,
              websiteType: data.websiteType, stats: data.stats,
            })
            setLoading(false)
            return
          }
        } catch { /* fall through to proxies */ }
      }

      // Try multiple proxies for better reliability
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`,
        `https://corsproxy.io/?${encodeURIComponent(target)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`,
      ]

      let html = ''
      let lastError = null

      for (const proxyUrl of proxies) {
        try {
          setStep(`Trying to fetch... (${proxies.indexOf(proxyUrl) + 1}/${proxies.length})`)
          const res = await fetch(proxyUrl, { 
            method: 'GET',
            headers: { 'Accept': 'text/html,application/json' }
          })
          
          if (!res.ok) {
            lastError = `HTTP ${res.status}`
            continue
          }

          const contentType = res.headers.get('content-type') || ''
          
          if (contentType.includes('application/json')) {
            const data = await res.json()
            html = data.contents || data.content || data.data || ''
          } else {
            html = await res.text()
          }

          if (html && html.length > 100) {
            break // Success!
          }
        } catch (err) {
          lastError = err.message
          continue
        }
      }

      if (!html || html.length < 100) {
        throw new Error(`Could not fetch website. ${lastError ? `Last error: ${lastError}` : 'All proxies failed.'}`)
      }

      setProgress(100); setStep('Done!')
      applyProjectFromHtml(html, target, analyzeHTML(html, target))
    } catch (err) {
      setError(err.message || 'Failed to analyze website.')
    } finally {
      setLoading(false)
    }
  }

  const saveHTML = () => {
    if (!htmlCode) return
    const blob = new Blob([htmlCode], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'website.html'
    a.click()
  }

  const handleDownloadZip = async () => {
    if (!projectFiles.length) return
    setDownloadingZip(true)
    await downloadProjectZip(projectFiles, 'optivix-nextjs-site')
    setDownloadingZip(false)
  }

  const toggleTree = (key) => {
    setTreeExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const sevColor = { critical: '#f87171', high: '#fb923c', medium: '#facc15', low: '#60a5fa' }
  const sevBg    = { critical: 'rgba(239,68,68,0.1)', high: 'rgba(249,115,22,0.1)', medium: 'rgba(234,179,8,0.1)', low: 'rgba(59,130,246,0.1)' }
  const sevBdr   = { critical: 'rgba(239,68,68,0.3)', high: 'rgba(249,115,22,0.3)', medium: 'rgba(234,179,8,0.3)', low: 'rgba(59,130,246,0.3)' }

  const scoreColor = result
    ? result.score >= 80 ? '#4ade80' : result.score >= 60 ? '#facc15' : result.score >= 40 ? '#fb923c' : '#f87171'
    : '#5b9cf5'

  const shellBg = 'var(--ide-surface)'
  const border = 'var(--ide-border)'
  const textMain = 'var(--ide-text)'
  const textMuted = 'var(--ide-text-muted)'
  const accent = 'var(--landing-accent)'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--ide-overlay)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        style={{ background: shellBg, border: `1px solid ${border}`, borderRadius: 16, width: '100%', maxWidth: 960, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--landing-shadow-lg)' }}
      >
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--ide-hero-panel)' }}>
          <BrandLogo size="sm" showWordmark showTagline={false} />
          <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: accent }}>Website Analyzer</div>
            <div style={{ fontSize: 11, color: textMuted }}>SEO audit · no auto-fix · full Next.js project export</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ padding: 6, borderRadius: 8, border: `1px solid ${border}`, background: 'transparent', cursor: 'pointer', color: textMuted, display: 'flex' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* URL Input */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(91,156,245,0.08)', display: 'flex', gap: 8, flexShrink: 0 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && analyze()}
            placeholder="Enter website URL (e.g., https://example.com)"
            disabled={loading}
            style={{ flex: 1, padding: '9px 14px', borderRadius: 10, border: `1px solid ${border}`, background: 'var(--ide-hero-panel)', color: textMain, fontSize: 13, outline: 'none' }}
          />
          <button
            onClick={analyze}
            disabled={loading || !url.trim()}
            style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: loading ? 'var(--landing-accent-soft)' : accent, color: 'var(--landing-btn-text)', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            {loading ? `${progress}%` : 'Analyze'}
          </button>
        </div>

        {/* Progress */}
        {loading && (
          <div style={{ padding: '10px 20px', flexShrink: 0 }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: '#5b9cf5', borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{step}</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ margin: '12px 20px', padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 12 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {!result && !loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, padding: 24 }}>
              <BrandLogo size="lg" showWordmark />
              <div style={{ fontSize: 15, fontWeight: 700, color: textMain }}>Ready to Analyze</div>
              <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 360, color: textMuted, lineHeight: 1.55 }}>
                Enter a URL — we audit SEO, security & performance (read-only). You get the original HTML plus a full <strong>Next.js</strong> folder: <code style={{ fontSize: 11 }}>app/</code>, <code style={{ fontSize: 11 }}>components/</code>, CSS, and config files.
              </div>
            </div>
          )}

          {result && (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(91,156,245,0.08)', flexShrink: 0 }}>
                {[
                  { id: 'overview', label: 'Overview', icon: Shield },
                  { id: 'issues', label: `Issues (${result.issues.length})`, icon: AlertCircle },
                  { id: 'suggestions', label: `Tips (${result.suggestions.length})`, icon: TrendingUp },
                  { id: 'project', label: `Next.js (${projectFiles.length})`, icon: Folder },
                  { id: 'code', label: 'HTML', icon: Code },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: activeTab === tab.id ? accent : textMuted, borderBottom: activeTab === tab.id ? `2px solid ${accent}` : '2px solid transparent', marginBottom: -1 }}
                  >
                    <tab.icon style={{ width: 13, height: 13 }} />
                    {tab.label}
                  </button>
                ))}

                {/* Score badge */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Score</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: scoreColor }}>{result.score}</div>
                </div>
              </div>

              {/* Website Type Badge */}
              <div style={{ padding: '8px 16px', background: 'var(--landing-accent-soft)', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: textMuted }}>Detected:</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{result.websiteType}</span>
                <span style={{ fontSize: 11, color: textMuted }}>· Audit only (no fix applied)</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: textMuted }}>
                  {result.stats.htmlSize} · {result.stats.hasHTTPS ? 'HTTPS' : 'HTTP'}
                </span>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>

                {activeTab === 'overview' && (
                  <motion.div style={{ display: 'grid', gridTemplateColumns: 'minmax(140px, 200px) 1fr', gap: 16 }}>
                    <div style={{ textAlign: 'center', padding: 16, borderRadius: 12, border: `1px solid ${border}`, background: 'var(--ide-hero-panel)' }}>
                      <div style={{ fontSize: 48, fontWeight: 900, color: scoreColor }}>{result.score}</div>
                      <div style={{ fontSize: 12, color: textMuted }}>SEO Score</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                      {[
                        { label: 'Critical', n: result.issues.filter(i => i.sev === 'critical').length, c: '#f87171' },
                        { label: 'High', n: result.issues.filter(i => i.sev === 'high').length, c: '#fb923c' },
                        { label: 'Medium', n: result.issues.filter(i => i.sev === 'medium').length, c: '#facc15' },
                        { label: 'Tips', n: result.suggestions.length, c: accent },
                      ].map((x) => (
                        <div key={x.label} style={{ padding: 12, borderRadius: 10, border: `1px solid ${border}`, background: 'var(--ide-hero-panel)' }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: x.c }}>{x.n}</div>
                          <div style={{ fontSize: 11, color: textMuted }}>{x.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => setActiveTab('project')} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', background: accent, color: 'var(--landing-btn-text)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                        View Next.js project
                      </button>
                      {onOpenInEditor && (
                        <button type="button" onClick={() => onOpenInEditor(htmlCode)} style={{ padding: '10px 16px', borderRadius: 10, border: `1px solid ${border}`, background: 'transparent', color: textMain, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                          Open raw HTML in IDE
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'issues' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.issues.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32, color: '#4ade80', gap: 8 }}>
                        <CheckCircle style={{ width: 40, height: 40 }} />
                        <div style={{ fontWeight: 700 }}>No issues found!</div>
                      </div>
                    ) : result.issues.map((issue, i) => (
                      <div
                        key={i}
                        onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
                        style={{ background: sevBg[issue.sev], border: `1px solid ${sevBdr[issue.sev]}`, borderRadius: 10, padding: '10px 14px', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: sevColor[issue.sev], background: sevBg[issue.sev], border: `1px solid ${sevBdr[issue.sev]}`, padding: '2px 7px', borderRadius: 99, textTransform: 'uppercase', flexShrink: 0 }}>{issue.sev}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#e6edf3', flex: 1 }}>{issue.title}</span>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{issue.cat}</span>
                          <ChevronDown style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)', transform: expandedIssue === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
                        </div>
                        {expandedIssue === i && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${sevBdr[issue.sev]}` }}>
                            <p style={{ fontSize: 12, color: textMuted, lineHeight: 1.5 }}>{issue.desc}</p>
                            <p style={{ fontSize: 10, color: textMuted, marginTop: 8, opacity: 0.85 }}>Use IDE Fix SEO on your own project to repair — this tool only reports.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions tab */}
                {activeTab === 'suggestions' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.suggestions.map((s, i) => (
                      <div key={i} style={{ background: 'rgba(91,156,245,0.06)', border: '1px solid rgba(91,156,245,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: '#5b9cf5', background: 'rgba(91,156,245,0.1)', border: '1px solid rgba(91,156,245,0.2)', padding: '2px 7px', borderRadius: 99 }}>{s.cat}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#e6edf3' }}>{s.title}</span>
                        </div>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{s.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Source Code tab */}
                {activeTab === 'code' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{htmlCode.length.toLocaleString()} characters · {htmlCode.split('\n').length.toLocaleString()} lines</span>
                      <button
                        onClick={saveHTML}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(91,156,245,0.3)', background: 'rgba(91,156,245,0.1)', color: '#5b9cf5', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        <Download style={{ width: 13, height: 13 }} />
                        Save as HTML
                      </button>
                    </div>
                    <pre style={{ background: '#0c0c0c', border: '1px solid rgba(91,156,245,0.1)', borderRadius: 10, padding: 14, fontSize: 11, color: '#e6edf3', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflowY: 'auto', fontFamily: '"JetBrains Mono", "Fira Code", monospace', lineHeight: 1.6 }}>
                      {htmlCode}
                    </pre>
                  </div>
                )}

                {activeTab === 'project' && projectTree && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 220px) 1fr', gap: 12, minHeight: 360 }}>
                    <div style={{ border: `1px solid ${border}`, borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--ide-hero-panel)' }}>
                      <div style={{ padding: '8px 10px', borderBottom: `1px solid ${border}`, fontSize: 11, fontWeight: 700, color: textMuted }}>Project tree</div>
                      <div style={{ flex: 1, overflowY: 'auto', padding: 6 }}>
                        {(projectTree.children || []).map((ch) => (
                          <ProjectTree
                            key={ch.path || ch.name}
                            node={ch}
                            depth={0}
                            selectedPath={selectedFilePath}
                            onSelect={(path, content) => { setSelectedFilePath(path); setPreviewCode(content) }}
                            expanded={treeExpanded}
                            onToggle={toggleTree}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadZip}
                        disabled={downloadingZip}
                        style={{ margin: 8, padding: '8px 10px', borderRadius: 8, border: 'none', background: accent, color: 'var(--landing-btn-text)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <Download style={{ width: 12, height: 12 }} />
                        {downloadingZip ? 'Zipping…' : 'Download .zip'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                      <div style={{ fontSize: 11, color: textMuted, marginBottom: 6, fontFamily: 'monospace' }}>{selectedFilePath}</div>
                      <pre style={{ flex: 1, margin: 0, background: 'var(--ide-bg)', border: `1px solid ${border}`, borderRadius: 10, padding: 12, fontSize: 10, color: textMain, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', lineHeight: 1.55, maxHeight: 420 }}>
                        {previewCode}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}











