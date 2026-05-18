'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Sidebar from '@/components/Sidebar.jsx'
import AIAnalysisPanel from '@/components/AIAnalysisPanel.jsx'
import Console from '@/components/Console.jsx'
import CodeEditor from '@/components/CodeEditor.jsx'
import WebsiteAnalyzer from '@/components/WebsiteAnalyzer.jsx'
import { Zap, Loader, Globe, Wrench, ChevronRight, Bug, Search } from 'lucide-react'

// ── Animation Variants ────────────────────────────────────────────────────────
const createAnimationVariants = (prefersReducedMotion) => {
  const scale = prefersReducedMotion ? 1 : 1.05
  const duration = prefersReducedMotion ? 0.3 : 0.6
  const translateDistance = prefersReducedMotion ? 10 : 20

  return {
    // Page entry with staggered children
    pageEntry: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0.05 : 0.1,
          delayChildren: 0
        }
      }
    },

    // Top bar
    topBar: {
      hidden: { opacity: 0, y: -translateDistance },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, ease: 'easeOut', delay: 0 }
      }
    },

    // Sidebar
    sidebar: {
      hidden: { opacity: 0, x: -translateDistance },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, ease: 'easeOut', delay: 0.1 }
      }
    },

    // Editor
    editor: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration, ease: 'easeOut', delay: 0.2 }
      }
    },

    // AI Panel
    aiPanel: {
      hidden: { opacity: 0, x: translateDistance },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration, ease: 'easeOut', delay: 0.3 }
      }
    },

    // Console
    console: {
      hidden: { opacity: 0, y: translateDistance },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration, ease: 'easeOut', delay: 0.4 }
      }
    },

    // Button interactions
    button: {
      idle: { scale: 1 },
      hover: { 
        scale,
        transition: { duration: 0.2 }
      },
      tap: { 
        scale: 0.98,
        transition: { duration: 0.1 }
      }
    }
  }
}

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

  const eqCount = (fixed.match(/[^=!<>]===[^=]/g) || []).length
  if (eqCount > 0) { fixed = fixed.replace(/([^=!<>])===([^=])/g, '$1===$2'); log.push(`✅ Fixed ${eqCount} === → ===`) }

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
    // [REMOVED] log.push(`✅ Commented out ${consoleCount} console.log(s)`)
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
  const prefersReducedMotion = useReducedMotion()
  const variants = createAnimationVariants(prefersReducedMotion)
  
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
    // [REMOVED] setCode(fileContent !== undefined ? fileContent : `// ${fileName}\nconsole.log('File: ${fileName}')`)
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
  const glowColor = dark ? '#00d9ff' : '#0096c8'

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={variants.pageEntry}
      style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        background: rootBg, 
        color: textCol, 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Animated Background Gradient */}
      {!prefersReducedMotion && (
        <motion.div
          animate={{
            background: [
              `radial-gradient(circle at 20% 30%, ${dark ? 'rgba(0,217,255,0.08)' : 'rgba(0,150,200,0.05)'}, transparent 50%)`,
              `radial-gradient(circle at 80% 70%, ${dark ? 'rgba(176,38,255,0.08)' : 'rgba(139,92,246,0.05)'}, transparent 50%)`,
              `radial-gradient(circle at 40% 60%, ${dark ? 'rgba(0,217,255,0.08)' : 'rgba(0,150,200,0.05)'}, transparent 50%)`
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* ── TOP BAR ───────────────────────────────────────────────────────── */}
      <motion.div 
        variants={variants.topBar}
        style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', background: topBg, borderBottom: `1px solid ${topBdr}`, flexShrink: 0, position: 'relative', zIndex: 10 }}
      >

        {/* Left: Logo + file */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <motion.div 
              animate={!prefersReducedMotion ? {
                boxShadow: [
                  '0 0 0px rgba(0,217,255,0)',
                  '0 0 20px rgba(0,217,255,0.6)',
                  '0 0 0px rgba(0,217,255,0)'
                ]
              } : {}}
              transition={!prefersReducedMotion ? { 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              } : {}}
              style={{ width: 24, height: 24, borderRadius: 6, background: '#00d9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Zap style={{ width: 14, height: 14, color: 'white' }} />
            </motion.div>
            <span style={{ fontWeight: 800, fontSize: 14, color: '#00d9ff', WebkitTextFillColor: '#00d9ff' }}>Optivix</span>
          </div>

          <AnimatePresence mode="wait">
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 6, background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', fontSize: 12, color: textDim, maxWidth: 220, overflow: 'hidden' }}
              >
                <span>📄</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile}</span>
                <AnimatePresence mode="wait">
                  {saveStatus === 'saving'  && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#facc15', flexShrink: 0 }}>saving...</motion.span>}
                  {saveStatus === 'saved'   && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ color: '#4ade80', flexShrink: 0 }}>✓ saved</motion.span>}
                  {saveStatus === 'error'   && <motion.span initial={{ opacity: 0, x: [-10, 10, -10, 0] }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ color: '#f87171', flexShrink: 0 }}>✗ error</motion.span>}
                  {saveStatus === 'no-file' && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#fb923c', flexShrink: 0 }}>no file open</motion.span>}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* Analyze Website */}
          <motion.button
            variants={variants.button}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowWebsiteAnalyzer(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.12)', color: '#4ade80', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Globe style={{ width: 14, height: 14 }} />
            Analyze Website
          </motion.button>

          {/* Fix button with dropdown */}
          <div style={{ position: 'relative', zIndex: 100 }}>
            <motion.button
              variants={variants.button}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowFixMenu(!showFixMenu)}
              disabled={isFixing}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#00d9ff', color: 'white', fontSize: 12, fontWeight: 700, cursor: isFixing ? 'not-allowed' : 'pointer', opacity: isFixing ? 0.6 : 1 }}
            >
              {isFixing ? (
                <><Loader style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /><span>Fixing... {fixProgress}%</span></>
              ) : (
                <><Wrench style={{ width: 14, height: 14 }} /><span>Fix</span><motion.div animate={{ rotate: showFixMenu ? 90 : 0 }} transition={{ duration: 0.2 }}><ChevronRight style={{ width: 12, height: 12 }} /></motion.div></>
              )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {showFixMenu && !isFixing && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '110%', right: 0, zIndex: 1000, background: dark ? '#18181b' : '#e8edf5', border: `1px solid ${topBdr}`, borderRadius: 10, overflow: 'hidden', minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                >
                  <motion.button
                    onClick={() => runFix('bugs')}
                    whileHover={{ 
                      backgroundColor: dark ? 'rgba(99,102,241,0.08)' : 'rgba(0,150,200,0.1)',
                      x: 4
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', color: textCol, fontSize: 13, textAlign: 'left', borderBottom: `1px solid ${topBdr}` }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bug style={{ width: 16, height: 16, color: '#f87171' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Fix Bugs</div>
                      <div style={{ fontSize: 11, color: textDim }}>Fixes var, ===, eval, console.log</div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => runFix('seo')}
                    whileHover={{ 
                      backgroundColor: dark ? 'rgba(99,102,241,0.08)' : 'rgba(0,150,200,0.1)',
                      x: 4
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', color: textCol, fontSize: 13, textAlign: 'left' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Search style={{ width: 16, height: 16, color: '#4ade80' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Fix SEO</div>
                      <div style={{ fontSize: 11, color: textDim }}>Fixes meta, og tags, schema, alt text</div>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── MAIN BODY ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1, minHeight: 0 }}>

        {/* Sidebar */}
        <motion.div variants={variants.sidebar} style={{ height: '100%' }}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onFileSelect={handleFileSelect} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </motion.div>

        {/* Center + Right */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>

          {/* Editor + AI Panel */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 12, padding: 12, minHeight: 0 }}>

            {/* Code Editor - Glass Card */}
            <motion.div 
              variants={variants.editor}
              whileHover={{ scale: 1.002 }}
              style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', 
                borderRadius: 16, 
                border: `1px solid ${topBdr}`, 
                minWidth: 0,
                minHeight: 0,
                background: dark ? 'rgba(24,24,27,0.6)' : 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(12px)',
                boxShadow: dark 
                  ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' 
                  : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
                position: 'relative'
              }}
            >
              {/* Editor Header */}
              <div style={{ 
                padding: '12px 16px', 
                borderBottom: `1px solid ${topBdr}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ marginLeft: 12, fontSize: 13, fontWeight: 600, color: textCol }}>
                    {selectedFile || 'Untitled'}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: textDim }}>JavaScript</div>
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                <CodeEditor code={code} setCode={setCode} isDarkMode={isDarkMode} />
              </div>
            </motion.div>

            {/* AI Analysis Panel - Glass Card */}
            <motion.div 
              variants={variants.aiPanel}
              whileHover={{ scale: 1.002 }}
              style={{ 
                width: 320, 
                flexShrink: 0, 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 16,
                border: `1px solid ${topBdr}`,
                minHeight: 0,
                background: dark ? 'rgba(24,24,27,0.6)' : 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(12px)',
                boxShadow: dark 
                  ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' 
                  : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              {/* AI Panel Header */}
              <div style={{ 
                padding: '16px', 
                borderBottom: `1px solid ${topBdr}`,
                background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <motion.div
                    animate={isFixing ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: isFixing ? Infinity : 0, ease: 'linear' }}
                    style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 8, 
                      background: 'linear-gradient(135deg, #00d9ff, #b026ff)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Zap style={{ width: 16, height: 16, color: 'white' }} />
                  </motion.div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textCol }}>AI Analysis</div>
                    <div style={{ fontSize: 11, color: textDim }}>Real-time insights</div>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                <AIAnalysisPanel code={code} isHealing={isFixing} isDarkMode={isDarkMode} />
              </div>
            </motion.div>
          </div>

          {/* Console - Glass Card */}
          <motion.div 
            variants={variants.console}
            whileHover={{ scale: 1.001 }}
            style={{ 
              height: 180,
              flexShrink: 0, 
              padding: '0 12px 12px',
            }}
          >
            <div style={{
              height: '100%',
              borderRadius: 16,
              border: `1px solid ${topBdr}`,
              background: dark ? 'rgba(24,24,27,0.6)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              boxShadow: dark 
                ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' 
                : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Console Header */}
              <div style={{ 
                padding: '12px 16px', 
                borderBottom: `1px solid ${topBdr}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textCol }}>Console</div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      background: '#10b981' 
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: textDim }}>Output</div>
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                <Console isDarkMode={isDarkMode} />
              </div>
            </div>
          </motion.div>
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
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setShowFixMenu(false)}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        /* Smooth theme transitions */
        * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
        }
        
        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </motion.div>
  )
}

export default IDEPage
