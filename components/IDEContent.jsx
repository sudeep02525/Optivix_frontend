'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Sidebar from '@/components/Sidebar.jsx'
import AIAnalysisPanel from '@/components/AIAnalysisPanel.jsx'
import Console from '@/components/Console.jsx'
import CodeEditor from '@/components/CodeEditor.jsx'
import { WELCOME_EDITOR_CODE, isSourceStructurallyBroken, repairBrokenJsxShell } from '@/lib/codeAnalyzer'
import WebsiteAnalyzer from '@/components/WebsiteAnalyzer.jsx'
import FreePeriodBanner from '@/components/FreePeriodBanner.jsx'
import GitCloneModal from '@/components/GitCloneModal.jsx'
import SelfHealModal from '@/components/SelfHealModal.jsx'
import IDETerminal from '@/components/IDETerminal.jsx'
import { useTheme } from '@/components/ThemeContext'
import { Loader, Globe, Wrench, ChevronRight, Bug, Search, File, FileCheck, Menu, Shield, Zap, Play, X } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import { runCode } from '@/lib/codeRunner'
import { getInstalledExtensions, isExtensionInstalled } from '@/lib/extensions'
import { collectProjectFiles, writeProjectFile } from '@/lib/projectFiles'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function authHeaders() {
  const token = localStorage.getItem('nexus_token')
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

function languageFromFileName(fileName) {
  const ext = fileName?.split('.').pop()?.toLowerCase()
  const map = {
    html: 'html', htm: 'html', css: 'css', json: 'json',
    js: 'javascript', jsx: 'javascript', mjs: 'javascript',
    ts: 'typescript', tsx: 'typescript', py: 'python',
  }
  return map[ext] || 'javascript'
}

async function fixFolderSeoViaApi(files) {
  const token = localStorage.getItem('nexus_token')
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/ai/fix-folder-seo`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        files: files.map((f) => ({ path: f.path, name: f.name, content: f.content })),
      }),
    })
    const data = await res.json()
    if (!res.ok) return null
    return data
  } catch {
    return null
  }
}

async function fixProjectViaApi(files, deepFix = true) {
  const token = localStorage.getItem('nexus_token')
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/ai/fix-project`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        files: files.map((f) => ({ path: f.path, name: f.name, content: f.content })),
        deepFix,
      }),
    })
    const data = await res.json()
    if (!res.ok) return null
    return data
  } catch {
    return null
  }
}

async function fixBugsViaApi(code, fileName, deepFix = false) {
  const token = localStorage.getItem('nexus_token')
  if (!token) return null
  try {
    const res = await fetch(`${API_URL}/api/ai/fix-bugs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        code,
        language: languageFromFileName(fileName),
        fileName: fileName || '',
        deepFix,
      }),
    })
    const data = await res.json()
    if (!res.ok || !data.fixedCode) return null
    return {
      fixed: data.fixedCode,
      log: Array.isArray(data.log) ? data.log : ['✅ Fix applied'],
      aiModel: data.aiModel,
    }
  } catch {
    return null
  }
}

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
function isHtmlFile(fileName) {
  return fileName && /\.html?$/i.test(fileName)
}

function fixSEO(code, fileName) {
  if (!isHtmlContent(code, fileName)) {
    return {
      fixed: code,
      log: ['⚠️ SEO fix needs HTML content — open an .html file or paste HTML in the editor.'],
    }
  }

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

function isHtmlContent(code, fileName) {
  if (isHtmlFile(fileName)) return true
  return /<html|<!DOCTYPE|<head|<body|<title|<meta[\s>]/i.test(code)
}

// ── Bug Fixer ─────────────────────────────────────────────────────────────────
function fixBugs(code, fileName = '') {
  if (isSourceStructurallyBroken(code, fileName)) {
    const repaired = repairBrokenJsxShell(code, fileName)
    if (repaired !== code) {
      return {
        fixed: repaired,
        log: [
          '✅ Repaired component wrapper and imports',
          '⚠️ Check import paths (e.g. react-router-dom) match your project',
        ],
      }
    }
    return {
      fixed: code,
      log: [
        '⚠️ File is incomplete — could not auto-repair.',
        '💡 Use Reload file, Ctrl+Z, or restore from git/backup.',
      ],
    }
  }

  let fixed = code
  const log = []

  const varCount = (fixed.match(/^\s*var\s+/gm) || []).length
  if (varCount > 0) { fixed = fixed.replace(/^\s*var\s+/gm, (m) => m.replace('var', 'let')); log.push(`✅ Converted ${varCount} var → let`) }

  const eqCount = (fixed.match(/([^=!])==([^=])/g) || []).length
  if (eqCount > 0) { fixed = fixed.replace(/([^=!])==([^=])/g, '$1===$2'); log.push(`✅ Fixed ${eqCount} == → ===`) }

  if (/\.innerHTML\s*=\s*['"`]/.test(fixed)) {
    fixed = fixed.replace(/\.innerHTML\s*=\s*(['"`][^'"`]*['"`])/g, '.textContent = $1')
    log.push('✅ Fixed innerHTML → textContent (prevents XSS)')
  }

  if (/\beval\s*\(/.test(fixed)) {
    fixed = fixed.split('\n').map(line => {
      if (/\beval\s*\(/.test(line) && !line.trim().startsWith('//')) {
        return line.replace(/\beval\s*\(/, '/* eval() disabled — security risk */ // eval(')
      }
      return line
    }).join('\n')
    log.push('✅ Disabled eval() — refactor this code manually')
  }

  const sqlRisk = fixed.split('\n').filter(l =>
    /SELECT|INSERT|UPDATE|DELETE/i.test(l) && /\+\s*\w+|'\s*\+|"[\s]*\+/.test(l) && !l.trim().startsWith('//')
  ).length
  if (sqlRisk > 0) {
    log.push(`⚠️ ${sqlRisk} possible SQL injection (string concat in query) — use parameterized queries`)
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

function languageLabel(name, code) {
  if (!name) {
    if (/<html|<!DOCTYPE/i.test(code)) return 'HTML'
    if (/^\s*[\[{]/.test(code?.trim())) return 'JSON'
    return 'JavaScript'
  }
  const ext = name.split('.').pop()?.toLowerCase()
  const labels = { js: 'JavaScript', jsx: 'JSX', ts: 'TypeScript', tsx: 'TSX', html: 'HTML', htm: 'HTML', css: 'CSS', json: 'JSON', md: 'Markdown', py: 'Python' }
  return labels[ext] || ext?.toUpperCase() || 'Plain text'
}

const IDEPage = () => {
  const prefersReducedMotion = useReducedMotion()
  const variants = createAnimationVariants(prefersReducedMotion)
  
  const [code, setCode] = useState(WELCOME_EDITOR_CODE)

  const [isFixing, setIsFixing]           = useState(false)
  const [fixProgress, setFixProgress]     = useState(0)
  const [activeTab, setActiveTab]         = useState('explorer')
  const [fixLog, setFixLog]               = useState([])
  const [showWebsiteAnalyzer, setShowWebsiteAnalyzer] = useState(false)
  const [showGitClone, setShowGitClone] = useState(false)
  const [showSelfHeal, setShowSelfHeal] = useState(false)
  const [analysisSnapshot, setAnalysisSnapshot] = useState({ issues: [], healthScore: 100, aiModel: null })
  const [selectedFile, setSelectedFile]   = useState(null)
  const [currentFileHandle, setCurrentFileHandle] = useState(null)
  const [saveStatus, setSaveStatus]       = useState('')
  const [showFixMenu, setShowFixMenu]     = useState(false)
  const [authChecked, setAuthChecked]     = useState(false)
  const [sidebarOpen, setSidebarOpen]     = useState(false)
  const [isMobile, setIsMobile]           = useState(false)
  const [isRunning, setIsRunning]         = useState(false)
  const [runLog, setRunLog]               = useState([])
  const [showPreview, setShowPreview]     = useState(false)
  const [previewHtml, setPreviewHtml]     = useState('')
  const [installedExtensions, setInstalledExtensions] = useState([])
  const [editorThemeRevision, setEditorThemeRevision] = useState(0)
  const [workspace, setWorkspace] = useState({ fileStructure: [], folderOpened: false, folderName: '' })
  const [consolePanel, setConsolePanel] = useState('output')
  const codeRef = useRef(code)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  // Keep ref in sync so async fix uses latest editor content
  useEffect(() => {
    codeRef.current = code
  }, [code])

  useEffect(() => {
    setInstalledExtensions(getInstalledExtensions())
  }, [])

  // Auth guard - redirect to /auth if not logged in
  useEffect(() => {
    const token = localStorage.getItem('nexus_token')
    if (!token) {
      window.location.href = '/auth'
    } else {
      setAuthChecked(true)
    }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

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
      <div style={{ height: '100vh', background: 'var(--ide-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <BrandLogo size="lg" showWordmark style={{ justifyContent: 'center', marginBottom: 16 }} />
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(91,156,245,0.2)', borderTopColor: 'var(--landing-accent)', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--ide-text-muted)', fontSize: 13 }}>Loading workspace…</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const handleFileSelect = (fileName, fileContent, fileHandle) => {
    const content = fileContent ?? `// ${fileName}\n// File is empty or could not be loaded`
    setSelectedFile(fileName)
    setCurrentFileHandle(fileHandle || null)
    setCode(content)
    codeRef.current = content
    setFixLog([])
  }

  const reloadCurrentFile = async () => {
    if (!currentFileHandle || !selectedFile) {
      setSaveStatus('no-file')
      setTimeout(() => setSaveStatus(''), 2000)
      return
    }
    try {
      setSaveStatus('saving')
      const file = await currentFileHandle.getFile()
      const content = await file.text()
      setCode(content)
      codeRef.current = content
      setSaveStatus('reloaded')
    } catch {
      setSaveStatus('error')
    }
    setTimeout(() => setSaveStatus(''), 2000)
  }

  // ── Run fix (bugs or SEO) ──────────────────────────────────────────────────
  const runFix = async (type) => {
    setShowFixMenu(false)
    setIsFixing(true)
    setFixProgress(0)
    setFixLog([])

    const steps = type === 'seo'
      ? [
          [10, '📂 Scanning project folder...'],
          [20, '🔍 Detecting website type & purpose...'],
          [35, '🏷️ Title, description, keywords...'],
          [50, '📱 Viewport, robots, canonical...'],
          [65, '🔗 Open Graph + Twitter Card...'],
          [80, '📊 Schema.org JSON-LD...'],
          [90, '🖼️ Alt text + H1 + all HTML pages...'],
          [100, '✅ Applying SEO to entire folder...'],
        ]
      : [
          [20, '🔍 Analyzing code structure...'],
          [40, '🐛 Detecting bugs and anti-patterns...'],
          [60, '🔒 Scanning for security vulnerabilities...'],
          [80, '⚡ Checking performance issues...'],
          [100, '✅ Applying fixes...'],
        ]

    for (const [progress, msg] of steps) {
      await new Promise(r => setTimeout(r, type === 'bugs' && progress >= 60 ? 80 : 150))
      setFixProgress(progress)
      setFixLog(prev => [...prev, msg])
    }

    const currentCode = codeRef.current
    let fixed = currentCode
    let log = []

    const deepFix = isExtensionInstalled('ai-deep-fix')
    const folderReady = workspace.folderOpened && workspace.fileStructure?.length > 0

    if (type === 'seo') {
      let projectFiles = []
      if (folderReady) {
        setFixLog((prev) => [...prev, '📂 Reading all HTML files in folder...'])
        projectFiles = await collectProjectFiles(workspace.fileStructure, 'seo')
      }
      if (projectFiles.length === 0 && (isHtmlContent(currentCode, selectedFile) || isHtmlFile(selectedFile))) {
        projectFiles = [{ path: selectedFile || 'index.html', name: selectedFile || 'index.html', content: currentCode, handle: currentFileHandle }]
      }

      if (projectFiles.length > 0) {
        const apiResult = await fixFolderSeoViaApi(projectFiles)
          if (apiResult?.files?.length) {
          let saved = 0
          const extraLogs = []
          for (const rf of apiResult.files) {
            const orig = projectFiles.find((f) => f.path === rf.path || f.name === rf.name)
            if (orig?.handle) {
              const ok = await writeProjectFile(orig, rf.content)
              if (ok) saved++
            } else if (rf.name === 'index.html' || rf.path?.endsWith('index.html')) {
              setSelectedFile('index.html')
              fixed = rf.content
              extraLogs.push('📝 New index.html — save to project root')
            }
            if (rf.path === selectedFile || rf.name === selectedFile) {
              fixed = rf.content
            }
          }
          if (!selectedFile && apiResult.files[0] && fixed === currentCode) fixed = apiResult.files[0].content
          log = [
            ...(apiResult.logs || []),
            ...extraLogs,
            `✅ ${apiResult.summary || 'Folder SEO complete'}`,
            `💾 Saved ${saved} file(s) to disk`,
            ...(apiResult.aiModel ? [`🤖 ${apiResult.aiModel}`] : []),
          ]
          if (apiResult.aiModel) setAnalysisSnapshot((s) => ({ ...s, aiModel: apiResult.aiModel }))
        } else {
          ;({ fixed, log } = fixSEO(currentCode, selectedFile))
          log = ['ℹ️ Backend offline — local SEO rules', ...log]
        }
      } else {
        ;({ fixed, log } = fixSEO(currentCode, selectedFile))
        log = ['⚠️ Open a folder with .html files, or open an HTML file', ...log]
      }
    } else {
      setFixLog((prev) => [...prev, '🤖 Full project code analysis...'])
      if (deepFix) setFixLog((prev) => [...prev, '🧠 JSX + CSS + missing code will be added…'])

      let projectFiles = []
      if (folderReady) {
        projectFiles = await collectProjectFiles(workspace.fileStructure, 'bugs')
      }

      if (projectFiles.length > 1) {
        const apiResult = await fixProjectViaApi(projectFiles, deepFix)
        if (apiResult?.files?.length) {
          let saved = 0
          for (const rf of apiResult.files) {
            const orig = projectFiles.find((f) => f.path === rf.path || f.name === rf.name)
            if (orig?.handle) {
              const ok = await writeProjectFile(orig, rf.content)
              if (ok) saved++
            }
            if (rf.path === selectedFile || rf.name === selectedFile) fixed = rf.content
          }
          log = [...(apiResult.logs || []), apiResult.summary || '', `💾 Saved ${saved} file(s)`]
          if (apiResult.aiModel) setAnalysisSnapshot((s) => ({ ...s, aiModel: apiResult.aiModel }))
        } else {
          const apiResult = await fixBugsViaApi(currentCode, selectedFile, deepFix)
          if (apiResult) {
            fixed = apiResult.fixed
            log = apiResult.log
            if (apiResult.aiModel) setAnalysisSnapshot((s) => ({ ...s, aiModel: apiResult.aiModel }))
          } else {
            ;({ fixed, log } = fixBugs(currentCode, selectedFile))
            log = ['ℹ️ Backend/Ollama unavailable — local rules only', ...log]
          }
        }
      } else {
        const apiResult = await fixBugsViaApi(currentCode, selectedFile, deepFix)
        if (apiResult) {
          fixed = apiResult.fixed
          log = apiResult.log
          if (apiResult.aiModel) setAnalysisSnapshot((s) => ({ ...s, aiModel: apiResult.aiModel }))
        } else {
          ;({ fixed, log } = fixBugs(currentCode, selectedFile))
          log = ['ℹ️ Backend/Ollama unavailable — local rules only', ...log]
        }
      }
    }

    setCode(fixed)
    codeRef.current = fixed
    setFixLog(prev => [...prev, '', '── Results ──', ...log])

    const truncated = fixed.length < currentCode.length * 0.65
    const broken = isSourceStructurallyBroken(fixed, selectedFile)

    if (currentFileHandle && !truncated && !broken) {
      try {
        const w = await currentFileHandle.createWritable()
        await w.write(fixed)
        await w.close()
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch { /* ignore */ }
    } else if (currentFileHandle && (truncated || broken)) {
      setFixLog((prev) => [
        ...prev,
        '⚠️ Not saved to disk — result would damage an incomplete file. Reload file or undo (Ctrl+Z).',
      ])
    }

    setTimeout(() => { setIsFixing(false); setFixProgress(0) }, 1200)
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setRunLog(['▶ Starting…'])
    const currentCode = codeRef.current
    try {
      const result = await runCode({
        code: currentCode,
        fileName: selectedFile || '',
        installedExtensions,
      })
      setRunLog((prev) => [...prev, ...(result.logs || [])])
      if (result.type === 'preview' && result.html) {
        setPreviewHtml(result.html)
        setShowPreview(true)
        setRunLog((prev) => [...prev, '🖥 Preview opened below editor'])
      } else if (result.output) {
        setRunLog((prev) => [
          ...prev,
          result.type === 'error' ? `❌ ${result.output}` : '── Output ──',
          ...(result.type === 'error' ? [] : [result.output]),
        ])
      }
    } catch (e) {
      setRunLog((prev) => [...prev, `❌ ${e.message || 'Run failed'}`])
    } finally {
      setIsRunning(false)
    }
  }

  const accent = 'var(--landing-accent)'
  const topBdr = 'var(--ide-border)'
  const textCol = 'var(--ide-text)'
  const textDim = 'var(--ide-text-muted)'
  const surface = 'var(--ide-surface)'
  const cardBg = 'var(--ide-card-bg)'

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={variants.pageEntry}
      className="ide-shell"
    >
      {/* Free Period Banner */}
      <FreePeriodBanner />

      {/* ── TOP BAR ───────────────────────────────────────────────────────── */}
      <motion.div 
        variants={variants.topBar}
        className="ide-topbar"
        style={{ zIndex: showFixMenu ? 1001 : 10 }}
      >

        {/* Left: Logo + file */}
        <motion.div variants={variants.topBar} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          {isMobile && (
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: 8, border: '1px solid var(--ide-border)',
                background: 'var(--ide-surface)', color: 'var(--ide-text)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>
          )}
          <div className="ide-topbar-brand" style={{ flexShrink: 0 }}>
            <BrandLogo href="/" size="sm" showWordmark />
          </div>

          <AnimatePresence mode="wait">
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="ide-topbar-file"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 8px', borderRadius: 6, background: 'var(--landing-accent-soft)', fontSize: 12, color: textDim, maxWidth: 220, overflow: 'hidden' }}
              >
                <File style={{ width: 14, height: 14, color: textDim, flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile}</span>
                <AnimatePresence mode="wait">
                  {saveStatus === 'saving'  && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#facc15', flexShrink: 0 }}>saving...</motion.span>}
                  {saveStatus === 'saved'   && <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ color: '#4ade80', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 2 }}><FileCheck style={{ width: 12, height: 12 }} /> saved</motion.span>}
                  {saveStatus === 'error'   && <motion.span initial={{ opacity: 0, x: [-10, 10, -10, 0] }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} style={{ color: '#f87171', flexShrink: 0 }}>✗ error</motion.span>}
                  {saveStatus === 'no-file' && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: '#fb923c', flexShrink: 0 }}>no file open</motion.span>}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <motion.button
            variants={variants.button}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={handleRunCode}
            disabled={isRunning || isFixing}
            title="Run code (JS, HTML, CSS, JSON, Python with extension)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 8,
              border: `1px solid ${topBdr}`,
              background: 'rgba(16,185,129,0.12)',
              color: 'var(--landing-success)',
              fontSize: 12,
              fontWeight: 700,
              cursor: isRunning || isFixing ? 'not-allowed' : 'pointer',
              opacity: isRunning || isFixing ? 0.5 : 1,
            }}
          >
            <Play style={{ width: 14, height: 14 }} />
            <span className="ide-hide-mobile">{isRunning ? 'Running…' : 'Run'}</span>
          </motion.button>
          {/* Analyze Website */}
          <motion.button
            variants={variants.button}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowWebsiteAnalyzer(true)}
            className="ide-hide-mobile"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${topBdr}`, background: 'var(--landing-accent-soft)', color: accent, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Globe style={{ width: 14, height: 14 }} />
            <span className="ide-hide-mobile">Analyze</span>
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
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: 'none', background: accent, color: 'var(--landing-btn-text)', fontSize: 12, fontWeight: 700, cursor: isFixing ? 'not-allowed' : 'pointer', opacity: isFixing ? 0.6 : 1 }}
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
                  style={{ position: 'absolute', top: '110%', right: 0, zIndex: 1000, background: cardBg, border: `1px solid ${topBdr}`, borderRadius: 10, overflow: 'hidden', minWidth: 180, boxShadow: isDarkMode ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)' }}
                >
                  <motion.button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); runFix('bugs') }}
                    whileHover={{ 
                      backgroundColor: isDarkMode ? 'rgba(91,156,245,0.08)' : 'rgba(91,156,245,0.1)',
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
                      <div style={{ fontSize: 11, color: textDim }}>Full scan + AI adds missing code</div>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); runFix('seo') }}
                    whileHover={{ 
                      backgroundColor: isDarkMode ? 'rgba(91,156,245,0.08)' : 'rgba(91,156,245,0.1)',
                      x: 4
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', color: textCol, fontSize: 13, textAlign: 'left' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(91,156,245,0.1)', border: '1px solid rgba(91,156,245,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Search style={{ width: 16, height: 16, color: accent }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Fix SEO</div>
                      <div style={{ fontSize: 11, color: textDim }}>Whole folder — detects site & adds all SEO</div>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowFixMenu(false); setShowSelfHeal(true) }}
                    whileHover={{ backgroundColor: isDarkMode ? 'rgba(91,156,245,0.08)' : 'rgba(91,156,245,0.1)', x: 4 }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', color: textCol, fontSize: 13, textAlign: 'left', borderTop: `1px solid ${topBdr}` }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Shield style={{ width: 16, height: 16, color: 'var(--landing-success)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>Self-Heal</div>
                      <div style={{ fontSize: 11, color: textDim }}>Production crash → hotfix deploy</div>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* ── MAIN BODY ─────────────────────────────────────────────────────── */}
      {sidebarOpen && isMobile && (
        <motion.div className="ide-mobile-backdrop" onClick={() => setSidebarOpen(false)} role="presentation" />
      )}
      <div className="ide-body">

        {/* Sidebar */}
        <motion.div variants={variants.sidebar} className={`ide-sidebar-wrap${sidebarOpen ? ' ide-sidebar-wrap--open' : ''}`}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onGitClone={() => setShowGitClone(true)}
            analysisSnapshot={analysisSnapshot}
            isFixing={isFixing}
            onFileSelect={(name, content, handle) => {
              handleFileSelect(name, content, handle)
              setSidebarOpen(false)
            }}
            onExtensionsChange={(ids) => {
              setInstalledExtensions(ids)
              setEditorThemeRevision((n) => n + 1)
            }}
            installedExtensions={installedExtensions}
            onWorkspaceChange={setWorkspace}
          />
        </motion.div>

        {/* Center + Right */}
        <div className="ide-main">

          {/* Editor + AI Panel */}
          <motion.div variants={variants.editor} className="ide-editor-row">

            {/* Code Editor - Glass Card */}
            <motion.div 
              className="ide-editor-card"
              style={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', 
                borderRadius: 16, 
                border: `1px solid ${topBdr}`, 
                minWidth: 0,
                minHeight: 0,
                background: surface,
                backdropFilter: 'blur(12px)',
                boxShadow: isDarkMode 
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
                background: 'var(--ide-hero-panel)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {selectedFile && currentFileHandle && (
                    <button
                      type="button"
                      onClick={reloadCurrentFile}
                      title="Reload full file from disk"
                      style={{
                        fontSize: 10,
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: `1px solid ${topBdr}`,
                        background: 'transparent',
                        color: textDim,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Reload file
                    </button>
                  )}
                  {saveStatus && (
                    <span style={{ fontSize: 10, color: saveStatus === 'error' ? '#f87171' : accent }}>{saveStatus}</span>
                  )}
                  <span style={{ fontSize: 11, color: textDim }}>{languageLabel(selectedFile, code)}</span>
                </div>
              </div>
              
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: showPreview ? '1 1 55%' : '1 1 auto', minHeight: 0, overflow: 'hidden' }}>
                  <CodeEditor
                    code={code}
                    setCode={setCode}
                    isDarkMode={isDarkMode}
                    fileKey={selectedFile || 'welcome'}
                    themeRevision={editorThemeRevision}
                  />
                </div>
                {showPreview && (
                  <div style={{ flex: '0 0 45%', minHeight: 120, borderTop: `1px solid ${topBdr}`, display: 'flex', flexDirection: 'column', background: 'var(--ide-hero-panel)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: textDim }}>Live preview</span>
                      <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: textDim, padding: 4 }}
                        aria-label="Close preview"
                      >
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    </div>
                    <iframe
                      title="Preview"
                      srcDoc={previewHtml}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      style={{ flex: 1, width: '100%', border: 'none', background: '#fff' }}
                    />
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div 
              variants={variants.aiPanel}
              className="ide-ai-panel"
              style={{ 
                flexShrink: 0, 
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 16,
                border: `1px solid ${topBdr}`,
                minHeight: 0,
                background: surface,
                backdropFilter: 'blur(12px)',
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)' 
                  : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
              }}
            >
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <AIAnalysisPanel
                  code={code}
                  fileName={selectedFile}
                  isHealing={isFixing}
                  isDarkMode={isDarkMode}
                  onRunFix={runFix}
                  onCodeChange={(next) => { setCode(next); codeRef.current = next }}
                  onAnalysisUpdate={setAnalysisSnapshot}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Console - Glass Card */}
          <motion.div 
            variants={variants.console}
            className="ide-console-wrap"
          >
            <div style={{
              height: '100%',
              borderRadius: 16,
              border: `1px solid ${topBdr}`,
              background: isDarkMode ? 'rgba(24,24,27,0.6)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              boxShadow: isDarkMode 
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
                background: 'var(--ide-hero-panel)',
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
                <div style={{ display: 'flex', gap: 4 }}>
                  {[
                    { id: 'output', label: 'Output' },
                    { id: 'terminal', label: 'Terminal' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setConsolePanel(tab.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        border: `1px solid ${consolePanel === tab.id ? 'var(--landing-accent)' : topBdr}`,
                        background: consolePanel === tab.id ? 'var(--landing-accent-soft)' : 'transparent',
                        color: consolePanel === tab.id ? 'var(--landing-accent)' : textDim,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {consolePanel === 'terminal' ? (
                  <IDETerminal
                    folderName={workspace.folderName}
                    folderOpened={workspace.folderOpened}
                    fileStructure={workspace.fileStructure}
                  />
                ) : (
                  <Console isDarkMode={isDarkMode} fixLog={fixLog} isFixing={isFixing} runLog={runLog} isRunning={isRunning} />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── WEBSITE ANALYZER MODAL ────────────────────────────────────────── */}
      <AnimatePresence>
        {showWebsiteAnalyzer && (
          <WebsiteAnalyzer
            isDarkMode={isDarkMode}
            onClose={() => setShowWebsiteAnalyzer(false)}
            onOpenInEditor={(html) => {
              setCode(html)
              codeRef.current = html
              setSelectedFile('audited-page.html')
            }}
          />
        )}
      </AnimatePresence>
      {showGitClone && <GitCloneModal onClose={() => setShowGitClone(false)} />}
      {showSelfHeal && (
        <SelfHealModal
          code={code}
          fileName={selectedFile}
          onClose={() => setShowSelfHeal(false)}
          onHealed={(fixed) => {
            setCode(fixed)
            codeRef.current = fixed
            setFixLog(['🛡️ Self-heal applied', '✅ Production hotfix deployed'])
          }}
        />
      )}

      {/* ── FIX OVERLAY ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isFixing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'var(--ide-overlay)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              style={{ background: surface, border: '1px solid var(--landing-border-accent)', borderRadius: 16, padding: 28, maxWidth: 360, width: '90%', boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid rgba(91,156,245,0.2)', borderTopColor: accent, marginBottom: 12 }}
                />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fafafa' }}>
                  AI is fixing your code...
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{fixProgress}% Complete</p>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
                <motion.div
                  animate={{ width: `${fixProgress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', background: accent, borderRadius: 99 }}
                />
              </div>

              {/* Log */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px', maxHeight: 160, overflowY: 'auto' }}>
                {fixLog.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ fontSize: 11, color: line === '' ? 'transparent' : line.startsWith('──') ? 'rgba(91,156,245,0.6)' : 'rgba(255,255,255,0.7)', fontFamily: 'monospace', marginBottom: 2, borderTop: line.startsWith('──') ? '1px solid rgba(91,156,245,0.15)' : 'none', paddingTop: line.startsWith('──') ? 6 : 0 }}
                  >
                    {line || ' '}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close fix menu on outside click — z-index below top bar so dropdown stays clickable */}
      {showFixMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000 }}
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
