'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/Sidebar.jsx'
import AIAnalysisPanel from '@/components/AIAnalysisPanel.jsx'
import Console from '@/components/Console.jsx'
import CodeEditor from '@/components/CodeEditor.jsx'
import WebsiteAnalyzer from '@/components/WebsiteAnalyzer.jsx'
import { Zap, Loader, Globe, Sun, Moon, Wrench, ChevronRight, Bug, Search } from 'lucide-react'

// ── SEO Fixer ─────────────────────────────────────────────────────────────────
function fixSEO(code) {
  let fixed = code
  const log = []

  if (!/<title[\s>]/i.test(fixed)) {
    fixed = fixed.replace(/<head([^>]*)>/i, `<head$1>\n  <title>Page Title - Your Website</title>`)
    log.push('✅ Added <title> tag')
  } else if (/<title>\s*<\/title>/i.test(fixed)) {
    fixed = fixed.replace(/<title>\s*<\/title>/i, '<title>Page Title - Your Website</title>')
    log.push('✅ Filled empty <title> tag')
  }

  if (!/<meta[^>]+name=["']description["']/i.test(fixed)) {
    fixed = fixed.replace(/<\/title>/i, `</title>\n  <meta name="description" content="Your page description here - 150-160 characters recommended." />`)
    log.push('✅ Added meta description')
  }

  if (!/<meta[^>]+name=["']viewport["']/i.test(fixed)) {
    fixed = fixed.replace(/<\/title>/i, `</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />`)
    log.push('✅ Added meta viewport (mobile-friendly)')
  }

  if (!/<meta[^>]+charset/i.test(fixed)) {
    fixed = fixed.replace(/<head([^>]*)>/i, `<head$1>\n  <meta charset="UTF-8" />`)
    log.push('✅ Added meta charset UTF-8')
  }

  if (!/<meta[^>]+name=["']robots["']/i.test(fixed)) {
    fixed = fixed.replace(/<\/title>/i, `</title>\n  <meta name="robots" content="index, follow" />`)
    log.push('✅ Added meta robots (index, follow)')
  }

  if (!/<meta[^>]+property=["']og:/i.test(fixed)) {
    fixed = fixed.replace(/<\/title>/i, `</title>
  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Page Title - Your Website" />
  <meta property="og:description" content="Your page description here." />
  <meta property="og:image" content="https://yoursite.com/og-image.jpg" />
  <meta property="og:url" content="https://yoursite.com" />`)
    log.push('✅ Added Open Graph tags (Facebook/WhatsApp preview)')
  }

  if (!/<meta[^>]+name=["']twitter:/i.test(fixed)) {
    fixed = fixed.replace(/<\/title>/i, `</title>
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title - Your Website" />
  <meta name="twitter:description" content="Your page description here." />`)
    log.push('✅ Added Twitter Card tags')
  }

  if (!/<link[^>]+rel=["']canonical["']/i.test(fixed)) {
    fixed = fixed.replace(/<\/title>/i, `</title>\n  <link rel="canonical" href="https://yoursite.com" />`)
    log.push('✅ Added canonical URL (prevents duplicate content)')
  }

  const imgWithoutAlt = (fixed.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length
  if (imgWithoutAlt > 0) {
    fixed = fixed.replace(/<img(?![^>]*\balt=)([^>]*)>/gi, '<img$1 alt="Descriptive image text here">')
    log.push(`✅ Added alt text to ${imgWithoutAlt} image(s)`)
  }

  const h1Count = (fixed.match(/<h1[\s>]/gi) || []).length
  if (h1Count === 0 && /<body/i.test(fixed)) log.push('⚠️ No <h1> tag found — add one (only one per page)')
  if (h1Count > 1) log.push(`⚠️ Found ${h1Count} <h1> tags — only one is allowed, change others to <h2> or <h3>`)

  if (/<html(?![^>]*\blang=)[^>]*>/i.test(fixed)) {
    fixed = fixed.replace(/<html([^>]*)>/i, '<html$1 lang="en">')
    log.push('✅ Added HTML lang="en" attribute')
  }

  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(fixed)) {
    fixed = fixed.replace(/<\/head>/i, `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Title",
    "description": "Your page description",
    "url": "https://yoursite.com"
  }
  </script>
</head>`)
    log.push('✅ Added Schema.org JSON-LD structured data')
  }

  const inlineCount = (fixed.match(/style="[^"]+"/g) || []).length
  if (inlineCount > 3) log.push(`⚠️ Found ${inlineCount} inline styles — move them to a CSS file`)

  if (log.length === 0) log.push('✅ SEO already looks good!')
  return { fixed, log }
}

// ── Bug Fixer ─────────────────────────────────────────────────────────────────
function fixBugs(code) {
  let fixed = code
  const log = []

  const varCount = (fixed.match(/^\s*var\s+/gm) || []).length
  if (varCount > 0) { fixed = fixed.replace(/\bvar\b/g, 'let'); log.push(`✅ Converted ${varCount} var → let`) }

  const eqCount = (fixed.match(/[^=!<>]==[^=]/g) || []).length
  if (eqCount > 0) { fixed = fixed.replace(/([^=!<>])==([^=])/g, '$1===$2'); log.push(`✅ Fixed ${eqCount} == → ===`) }

  if (/\.innerHTML\s*=\s*['"`]/.test(fixed)) {
    fixed = fixed.replace(/\.innerHTML\s*=\s*(['"`][^'"`]*['"`])/g, '.textContent = $1')
    log.push('✅ Fixed innerHTML → textContent (prevents XSS)')
  }

  if (/\beval\s*\(/.test(fixed)) {
    fixed = fixed.replace(/\beval\s*\(/g, '/* REMOVED: eval() is dangerous */ (')
    log.push('✅ Marked eval() — remove it manually')
  }

  const consoleCount = (fixed.match(/console\.(log|warn|debug)\(/g) || []).length
  if (consoleCount > 0) {
    fixed = fixed.replace(/console\.(log|warn|debug)\(/g, '// console.$1(')
    log.push(`✅ Commented out ${consoleCount} console.log(s)`)
  }

  if (/await fetch\(/.test(fixed) && !/try\s*\{/.test(fixed))
    log.push('⚠️ fetch() calls have no try-catch — wrap them manually')

  if (/key=\{index\}/.test(fixed)) {
    fixed = fixed.replace(/key=\{index\}/g, 'key={item.id /* use unique id */}')
    log.push('✅ Fixed key={index} → key={item.id}')
  }

  if (/\{JSON\.stringify/.test(fixed)) {
    fixed = fixed.replace(/\{JSON\.stringify/g, '{/* useMemo recommended */ JSON.stringify')
    log.push('⚠️ JSON.stringify in JSX — use useMemo for performance')
  }

  if (log.length === 0) log.push('✅ No obvious bugs found!')
  return { fixed, log }
}

// ─────────────────────────────────────────────────────────────────────────────

const IDEPage = () => {
  const [code, setCode] = useState(
`// Welcome to Optivix 🚀
//
// Getting started:
// 1. Click "Open Folder" to open your project
// 2. Click "Fix" to fix bugs or SEO issues
// 3. Click "Analyze Website" to audit any website's SEO
//
// Features:
// ✨ Real-time bug detection
// 🔒 Security vulnerability scanning
// ⚡ Performance optimization
// 🤖 AI-powered auto-fix
// 🌐 Website analysis

`)

  const [isFixing, setIsFixing]           = useState(false)
  const [fixProgress, setFixProgress]     = useState(0)
  const [activeTab, setActiveTab]         = useState('explorer')
  const [fixLog, setFixLog]               = useState([])
  const [showWebsiteAnalyzer, setShowWebsiteAnalyzer] = useState(false)
  const [selectedFile, setSelectedFile]   = useState(null)
  const [isDarkMode, setIsDarkMode]       = useState(true)
  const [currentFileHandle, setCurrentFileHandle] = useState(null)
  const [saveStatus, setSaveStatus]       = useState('')
  const [showFixMenu, setShowFixMenu]     = useState(false)
  const [authChecked, setAuthChecked]     = useState(false)

  // Auth guard - redirect to /auth if not logged in
  useEffect(() => {
    const token = localStorage.getItem('nexus_token')
    if (!token) {
      window.location.href = '/auth'
    } else {
      setAuthChecked(true)
    }
  }, [])

  // Dark/Light mode
  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDarkMode)
  }, [isDarkMode])

  // Ctrl+S to save
  useEffect(() => {
    const onKey = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        await saveFile()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [code, currentFileHandle])

  const saveFile = async () => {
    if (!currentFileHandle) { setSaveStatus('no-file'); setTimeout(() => setSaveStatus(''), 2000); return }
    try {
      setSaveStatus('saving')
      const w = await currentFileHandle.createWritable()
      await w.write(code); await w.close()
      setSaveStatus('saved')
    } catch { setSaveStatus('error') }
    setTimeout(() => setSaveStatus(''), 2000)
  }

  // Show loading while checking auth - AFTER all hooks
  if (!authChecked) {
    return (
      <div style={{ height: '100vh', background: '#0a0e27', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#00d9ff', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Loading Optivix...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const handleFileSelect = (fileName, fileContent, fileHandle) => {
    setSelectedFile(fileName)
    setCurrentFileHandle(fileHandle || null)
    setCode(fileContent !== undefined ? fileContent : `// ${fileName}\nconsole.log('File: ${fileName}')`)
  }

  // ── Run fix (bugs or SEO) ──────────────────────────────────────────────────
  const runFix = async (type) => {
    setShowFixMenu(false)
    setIsFixing(true)
    setFixProgress(0)
    setFixLog([])

    const steps = type === 'seo'
      ? [
          [15, '🔍 Scanning HTML structure...'],
          [30, '🏷️ Checking meta tags...'],
          [45, '📱 Mobile-friendliness check...'],
          [60, '🔗 Checking Open Graph / Social tags...'],
          [75, '📊 Checking Schema.org structured data...'],
          [90, '🖼️ Checking image alt text...'],
          [100, '✅ Applying SEO fixes...'],
        ]
      : [
          [20, '🔍 Analyzing code structure...'],
          [40, '🐛 Detecting bugs and anti-patterns...'],
          [60, '🔒 Scanning for security vulnerabilities...'],
          [80, '⚡ Checking performance issues...'],
          [100, '✅ Applying fixes...'],
        ]

    for (const [progress, msg] of steps) {
      await new Promise(r => setTimeout(r, 400))
      setFixProgress(progress)
      setFixLog(prev => [...prev, msg])
    }

    const { fixed, log } = type === 'seo' ? fixSEO(code) : fixBugs(code)
    setCode(fixed)
    setFixLog(prev => [...prev, '', '── Results ──', ...log])

    // Auto-save if file is open
    if (currentFileHandle) {
      try {
        const w = await currentFileHandle.createWritable()
        await w.write(fixed); await w.close()
        setSaveStatus('saved'); setTimeout(() => setSaveStatus(''), 2000)
      } catch { /* ignore */ }
    }

    setTimeout(() => { setIsFixing(false); setFixProgress(0) }, 1200)
  }

  // ── Theme colors ───────────────────────────────────────────────────────────
  const dark    = isDarkMode
  const topBg   = dark ? '#18181b' : '#dde3ea'
  const topBdr  = dark ? 'rgba(99,102,241,0.1)' : 'rgba(0,150,200,0.2)'
  const rootBg  = dark ? '#0a0e27' : '#f0f4f8'
  const textCol = dark ? '#e0e0e0' : '#1a1a2e'
  const textDim = dark ? 'rgba(224,224,224,0.5)' : 'rgba(26,26,46,0.5)'

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: rootBg, color: textCol }}>

      {/* ── TOP BAR ───────────────────────────────────────────────────────── */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', background: topBg, borderBottom: `1px solid ${topBdr}`, flexShrink: 0 }}>

        {/* Left: Logo + file */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#00d9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap style={{ width: 14, height: 14, color: 'white' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#00d9ff', WebkitTextFillColor: '#00d9ff' }}>Optivix</span>
          </div>

          {selectedFile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', fontSize: 12, color: textDim, maxWidth: 220, overflow: 'hidden' }}>
              <span>📄</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile}</span>
              {saveStatus === 'saving'  && <span style={{ color: '#facc15', flexShrink: 0 }}>saving...</span>}
              {saveStatus === 'saved'   && <span style={{ color: '#4ade80', flexShrink: 0 }}>✓ saved</span>}
              {saveStatus === 'error'   && <span style={{ color: '#f87171', flexShrink: 0 }}>✗ error</span>}
              {saveStatus === 'no-file' && <span style={{ color: '#fb923c', flexShrink: 0 }}>no file open</span>}
            </div>
          )}
        </div>

        {/* Right: Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Dark/Light toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            style={{ padding: 7, borderRadius: 8, border: 'none', cursor: 'pointer', background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: dark ? '#fde047' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isDarkMode ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
          </button>

          {/* Analyze Website */}
          <button
            onClick={() => setShowWebsiteAnalyzer(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.12)', color: '#4ade80', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Globe style={{ width: 14, height: 14 }} />
            Analyze Website
          </button>

          {/* Fix button with dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowFixMenu(!showFixMenu)}
              disabled={isFixing}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#00d9ff', color: 'white', fontSize: 12, fontWeight: 700, cursor: isFixing ? 'not-allowed' : 'pointer', opacity: isFixing ? 0.6 : 1 }}
            >
              {isFixing ? (
                <><Loader style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /><span>Fixing... {fixProgress}%</span></>
              ) : (
                <><Wrench style={{ width: 14, height: 14 }} /><span>Fix</span><ChevronRight style={{ width: 12, height: 12, transform: showFixMenu ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} /></>
              )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {showFixMenu && !isFixing && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '110%', right: 0, zIndex: 100, background: dark ? '#18181b' : '#e8edf5', border: `1px solid ${topBdr}`, borderRadius: 10, overflow: 'hidden', minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                >
                  <button
                    onClick={() => runFix('bugs')}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', color: textCol, fontSize: 13, textAlign: 'left', borderBottom: `1px solid ${topBdr}` }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.08)' : 'rgba(0,150,200,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bug style={{ width: 16, height: 16, color: '#f87171' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Fix Bugs</div>
                      <div style={{ fontSize: 11, color: textDim }}>Fixes var, ==, eval, console.log</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runFix('seo')}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', color: textCol, fontSize: 13, textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = dark ? 'rgba(99,102,241,0.08)' : 'rgba(0,150,200,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Search style={{ width: 16, height: 16, color: '#4ade80' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Fix SEO</div>
                      <div style={{ fontSize: 11, color: textDim }}>Fixes meta, og tags, schema, alt text</div>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onFileSelect={handleFileSelect} isDarkMode={isDarkMode} />

        {/* Center + Right */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>

          {/* Editor + AI Panel */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 8, padding: 8 }}>

            {/* Code Editor */}
            <div style={{ flex: 1, overflow: 'hidden', borderRadius: 10, border: `1px solid ${topBdr}`, minWidth: 0 }}>
              <CodeEditor code={code} setCode={setCode} isDarkMode={isDarkMode} />
            </div>

            {/* AI Analysis Panel */}
            <div style={{ width: 280, flexShrink: 0, overflow: 'hidden' }}>
              <AIAnalysisPanel code={code} isHealing={isFixing} isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Console */}
          <div style={{ flexShrink: 0, padding: '0 8px 8px' }}>
            <Console isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>

      {/* ── WEBSITE ANALYZER MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {showWebsiteAnalyzer && <WebsiteAnalyzer onClose={() => setShowWebsiteAnalyzer(false)} />}
      </AnimatePresence>

      {/* ── FIX OVERLAY ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFixing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              style={{ background: '#18181b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 16, padding: 28, maxWidth: 360, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(99,102,241,0.2)', borderTopColor: '#00d9ff', marginBottom: 12 }}
                />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#00d9ff', WebkitTextFillColor: '#00d9ff' }}>
                  AI is fixing your code...
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{fixProgress}% Complete</p>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
                <motion.div
                  animate={{ width: `${fixProgress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #00d9ff, #b026ff)', borderRadius: 99 }}
                />
              </div>

              {/* Log */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px', maxHeight: 160, overflowY: 'auto' }}>
                {fixLog.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 11, color: line === '' ? 'transparent' : line.startsWith('──') ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.7)', fontFamily: 'monospace', marginBottom: 2, borderTop: line.startsWith('──') ? '1px solid rgba(99,102,241,0.15)' : 'none', paddingTop: line.startsWith('──') ? 6 : 0 }}
                  >
                    {line || ' '}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close fix menu on outside click */}
      {showFixMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setShowFixMenu(false)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default IDEPage












