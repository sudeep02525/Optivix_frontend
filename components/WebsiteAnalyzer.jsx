'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, X, Download, Code, AlertCircle, CheckCircle, Zap, Shield, Search, TrendingUp, ChevronDown } from 'lucide-react'

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

  return { issues, suggestions, score, stats: { title: titleText, imgTotal, h1Count: h1Matches.length } }
}

export default function WebsiteAnalyzer({ onClose }) {
  const [url, setUrl]               = useState('')
  const [loading, setLoading]       = useState(false)
  const [progress, setProgress]     = useState(0)
  const [step, setStep]             = useState('')
  const [result, setResult]         = useState(null)
  const [htmlCode, setHtmlCode]     = useState('')
  const [activeTab, setActiveTab]   = useState('issues') // 'issues' | 'code'
  const [error, setError]           = useState('')
  const [expandedIssue, setExpandedIssue] = useState(null)

  const analyze = async () => {
    if (!url.trim()) return
    const target = url.startsWith('http') ? url : `https://${url}`
    setLoading(true); setResult(null); setHtmlCode(''); setError(''); setProgress(0)

    try {
      const steps = [
        [20, 'Connecting to website...'],
        [40, 'Fetching HTML content...'],
        [60, 'Analyzing SEO tags...'],
        [80, 'Checking performance & security...'],
        [95, 'Generating report...'],
      ]
      for (const [p, s] of steps) {
        setProgress(p); setStep(s)
        await new Promise(r => setTimeout(r, 300))
      }

      // Use allorigins proxy to fetch HTML
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}`
      const res = await fetch(proxyUrl)
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)
      const data = await res.json()
      const html = data.contents || ''

      if (!html) throw new Error('Could not retrieve website content. The site may block external requests.')

      setProgress(100); setStep('Done!')
      setHtmlCode(html)
      setResult(analyzeHTML(html, target))
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

  const sevColor = { critical: '#f87171', high: '#fb923c', medium: '#facc15', low: '#60a5fa' }
  const sevBg    = { critical: 'rgba(239,68,68,0.1)', high: 'rgba(249,115,22,0.1)', medium: 'rgba(234,179,8,0.1)', low: 'rgba(59,130,246,0.1)' }
  const sevBdr   = { critical: 'rgba(239,68,68,0.3)', high: 'rgba(249,115,22,0.3)', medium: 'rgba(234,179,8,0.3)', low: 'rgba(59,130,246,0.3)' }

  const scoreColor = result
    ? result.score >= 80 ? '#4ade80' : result.score >= 60 ? '#facc15' : result.score >= 40 ? '#fb923c' : '#f87171'
    : '#00d9ff'

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        style={{ background: '#0a0e27', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#00d9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#00d9ff', WebkitTextFillColor: '#00d9ff' }}>Website Analyzer</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Full SEO, performance & security audit + source code</div>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 6, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.06)', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex' }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* URL Input */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(99,102,241,0.08)', display: 'flex', gap: 8, flexShrink: 0 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && analyze()}
            placeholder="Enter website URL (e.g., https://example.com)"
            disabled={loading}
            style={{ flex: 1, padding: '9px 14px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)', color: '#e6edf3', fontSize: 13, outline: 'none' }}
          />
          <button
            onClick={analyze}
            disabled={loading || !url.trim()}
            style={{ padding: '9px 20px', borderRadius: 10, border: 'none', background: loading ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #00d9ff, #b026ff)', color: 'white', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
          >
            {loading ? `${progress}%` : 'Analyze'}
          </button>
        </div>

        {/* Progress */}
        {loading && (
          <div style={{ padding: '10px 20px', flexShrink: 0 }}>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: 'linear-gradient(90deg, #00d9ff, #b026ff)', borderRadius: 99 }} />
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'rgba(255,255,255,0.3)', gap: 12 }}>
              <Globe style={{ width: 48, height: 48 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Ready to Analyze</div>
              <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 340 }}>Enter any website URL and click Analyze to get a full SEO, performance, security audit and the complete source code.</div>
            </div>
          )}

          {result && (
            <>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(99,102,241,0.08)', flexShrink: 0 }}>
                {[
                  { id: 'issues', label: `Issues (${result.issues.length})`, icon: AlertCircle },
                  { id: 'suggestions', label: `Suggestions (${result.suggestions.length})`, icon: TrendingUp },
                  { id: 'code', label: 'Source Code', icon: Code },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: activeTab === tab.id ? '#00d9ff' : 'rgba(255,255,255,0.4)', borderBottom: activeTab === tab.id ? '2px solid #00d9ff' : '2px solid transparent', marginBottom: -1 }}
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

              {/* Tab content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>

                {/* Issues tab */}
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
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8, lineHeight: 1.5 }}>{issue.desc}</p>
                            <div style={{ fontSize: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '7px 10px', borderLeft: `2px solid ${sevColor[issue.sev]}` }}>
                              <span style={{ color: 'rgba(255,255,255,0.4)' }}>💡 Fix: </span>
                              <span style={{ color: 'rgba(255,255,255,0.75)' }}>{issue.fix}</span>
                            </div>
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
                      <div key={i} style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, color: '#00d9ff', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '2px 7px', borderRadius: 99 }}>{s.cat}</span>
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
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', color: '#00d9ff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        <Download style={{ width: 13, height: 13 }} />
                        Save as HTML
                      </button>
                    </div>
                    <pre style={{ background: '#0a0e27', border: '1px solid rgba(99,102,241,0.1)', borderRadius: 10, padding: 14, fontSize: 11, color: '#e6edf3', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 400, overflowY: 'auto', fontFamily: '"JetBrains Mono", "Fira Code", monospace', lineHeight: 1.6 }}>
                      {htmlCode}
                    </pre>
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











