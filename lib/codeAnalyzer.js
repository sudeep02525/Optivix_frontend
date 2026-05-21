/**
 * Browser-side code analysis (Quick Scan). Kept in sync with backend localHeuristicAnalysis where possible.
 */

const MIN_SCAN_LENGTH = 10

export function computeHealthScore(issues) {
  const c = issues.filter((i) => i.severity === 'critical').length
  const h = issues.filter((i) => i.severity === 'high').length
  const m = issues.filter((i) => i.severity === 'medium').length
  const l = issues.filter((i) => i.severity === 'low').length
  return Math.max(0, 100 - c * 25 - h * 15 - m * 7 - l * 2)
}

function stripStringsAndComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/`(?:\\.|[^`\\])*`/g, '``')
}

function checkStructuralBalance(code, fileType) {
  const issues = []
  const isJsLike = ['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx'].includes(fileType)
  if (!isJsLike && fileType !== 'json') return issues

  const stripped = stripStringsAndComments(code)
  const open = { '(': 0, '[': 0, '{': 0 }
  const close = { ')': '(', ']': '[', '}': '{' }
  const stack = []

  for (const ch of stripped) {
    if (ch in open) stack.push(ch)
    else if (ch in close) {
      const expected = close[ch]
      if (stack.length === 0 || stack[stack.length - 1] !== expected) {
        issues.push({
          id: 'struct-bracket',
          type: 'bug',
          severity: 'critical',
          line: null,
          title: 'Mismatched brackets or parentheses',
          description: 'Unbalanced (), [], or {} — code may not run or parse correctly.',
          fix: 'Check each opening bracket has a matching close on the same nesting level.',
        })
        return issues
      }
      stack.pop()
    }
  }

  if (stack.length > 0) {
    const missing = stack[stack.length - 1] === '(' ? ')' : stack[stack.length - 1] === '[' ? ']' : '}'
    issues.push({
      id: 'struct-unclosed',
      type: 'bug',
      severity: 'critical',
      line: null,
      title: 'Unclosed bracket or parenthesis',
      description: `Code has unclosed "${stack[stack.length - 1]}" — add "${missing}" or remove the extra opener.`,
      fix: 'Close all brackets before saving or running the file.',
    })
  }

  if (fileType === 'json') {
    try {
      JSON.parse(code)
    } catch {
      /* handled in main analyzer */
    }
  }

  return issues
}

/** Detect truncated / broken source (e.g. missing imports, return outside function). */
export function checkIncompleteSource(code, fileName = '') {
  const issues = []
  if (!code || code.trim().length < MIN_SCAN_LENGTH) return issues

  const ext = fileName?.split('.').pop()?.toLowerCase() || ''
  const isModule = ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext) || !ext

  if (!isModule) return issues

  if (/import\s*\{/.test(code) && !/\bfrom\s+['"`]/.test(code)) {
    issues.push({
      id: 'inc-import',
      type: 'bug',
      severity: 'critical',
      line: (code.split('\n').findIndex((l) => /import\s*\{/.test(l)) + 1) || null,
      title: 'Incomplete import statement',
      description: 'import { ... } has no "from \'module\'" — file may be truncated or corrupted.',
      fix: 'Restore the full import line(s) and component wrapper. Try Reload file or Ctrl+Z.',
    })
  }

  if (/^import\s*$/m.test(code)) {
    issues.push({
      id: 'inc-import-empty',
      type: 'bug',
      severity: 'critical',
      line: null,
      title: 'Empty import statement',
      description: 'An import line has no module or bindings.',
      fix: 'Complete the import or remove the broken line.',
    })
  }

  const lines = code.split('\n')
  let seenFunction = false
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (
      /^(export\s+)?(default\s+)?function\s+\w/.test(t) ||
      /^const\s+\w+\s*=\s*(\(|async\s*\()/.test(t) ||
      /=>\s*\{/.test(t)
    ) {
      seenFunction = true
    }
    if (/^return\s*[\(\{]/.test(t) && !seenFunction) {
      issues.push({
        id: `inc-return-${i + 1}`,
        type: 'bug',
        severity: 'critical',
        line: i + 1,
        title: 'return outside a function',
        description: `Line ${i + 1}: return must be inside a component or function — top of file is missing.`,
        fix: 'Add export default function ComponentName() { before the return, or restore from git/backup.',
      })
    }
  }

  if (['jsx', 'tsx'].includes(ext)) {
    const hasExport = /export\s+default/.test(code)
    const hasComponent =
      /function\s+[A-Z]\w*/.test(code) ||
      /const\s+[A-Z]\w*\s*=/.test(code)
    if (!hasExport && !hasComponent) {
      issues.push({
        id: 'inc-jsx-wrap',
        type: 'bug',
        severity: 'critical',
        line: null,
        title: 'Missing React component wrapper',
        description: `${fileName} should export a component (export default function …).`,
        fix: 'Wrap JSX in a function and export it as default.',
      })
    }
  }

  return issues
}

export function isSourceStructurallyBroken(code, fileName = '') {
  return checkIncompleteSource(code, fileName).length > 0
}

export function monacoLanguageFromFileName(fileName) {
  if (!fileName) return 'javascript'
  const ext = fileName.split('.').pop()?.toLowerCase()
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    less: 'less',
    html: 'html',
    htm: 'html',
    md: 'markdown',
    py: 'python',
    php: 'php',
    go: 'go',
    rs: 'rust',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    cs: 'csharp',
    sql: 'sql',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    sh: 'shell',
    bash: 'shell',
  }
  return map[ext] || 'javascript'
}

export function analyzeCodeForIssues(code, fileType = 'javascript', fileName = '') {
  if (!code || code.trim().length < MIN_SCAN_LENGTH) {
    return { issues: [], score: null, status: code?.trim() ? 'too_short' : 'empty' }
  }

  const issues = []
  const lines = code.split('\n')
  const lang = (fileType || 'javascript').toLowerCase()

  issues.push(...checkIncompleteSource(code, fileName))
  issues.push(...checkStructuralBalance(code, lang))

  if (['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx'].includes(lang)) {
    lines.forEach((line, i) => {
      const n = i + 1
      const t = line.trim()

      if (/console\.(log|warn|error|debug|info|table|trace)\(/.test(t) && !t.startsWith('//'))
        issues.push({
          id: `bug-con-${n}`,
          type: 'bug',
          severity: 'low',
          line: n,
          title: 'console left in code',
          description: `Line ${n}: console statements should not be in production.`,
          fix: 'Remove console calls or use a logging library.',
        })

      if (/([^=!])==([^=])/.test(line) && !t.startsWith('//') && !t.startsWith('*'))
        issues.push({
          id: `bug-eq-${n}`,
          type: 'bug',
          severity: 'medium',
          line: n,
          title: 'Loose equality (==)',
          description: `Line ${n}: == performs type coercion. Prefer ===.`,
          fix: 'Replace == with === when types should match.',
        })

      if (/^\s*var\s+/.test(line))
        issues.push({
          id: `bug-var-${n}`,
          type: 'bug',
          severity: 'low',
          line: n,
          title: 'Using var instead of let/const',
          description: `Line ${n}: var can cause hoisting bugs.`,
          fix: 'Use const or let instead of var.',
        })

      if (/\.innerHTML\s*=/.test(t) && !t.startsWith('//'))
        issues.push({
          id: `sec-ih-${n}`,
          type: 'security',
          severity: 'critical',
          line: n,
          title: 'innerHTML — XSS risk',
          description: `Line ${n}: innerHTML with user data enables XSS.`,
          fix: 'Use textContent or React JSX.',
        })

      if (/\beval\s*\(/.test(t) && !t.startsWith('//'))
        issues.push({
          id: `sec-ev-${n}`,
          type: 'security',
          severity: 'critical',
          line: n,
          title: 'eval() usage',
          description: `Line ${n}: eval runs arbitrary code — major security risk.`,
          fix: 'Remove eval(); use JSON.parse or refactor logic.',
        })

      if (/(password|secret|api_key|apikey|token|private_key)\s*=\s*['"`][^'"`]{3,}/i.test(t) && !t.startsWith('//'))
        issues.push({
          id: `sec-pw-${n}`,
          type: 'security',
          severity: 'critical',
          line: n,
          title: 'Hardcoded secret/password',
          description: `Line ${n}: secrets in source can leak via git or bundles.`,
          fix: 'Use environment variables (.env) and never commit secrets.',
        })

      if (/fetch\s*\(\s*['"`]http:\/\//.test(t) && !t.startsWith('//'))
        issues.push({
          id: `sec-http-${n}`,
          type: 'security',
          severity: 'high',
          line: n,
          title: 'HTTP instead of HTTPS',
          description: `Line ${n}: HTTP is not encrypted.`,
          fix: 'Use https:// for API calls.',
        })

      if (/key=\{index\}/.test(t))
        issues.push({
          id: `pf-key-${n}`,
          type: 'performance',
          severity: 'medium',
          line: n,
          title: 'Array index used as React key',
          description: `Line ${n}: index keys break on reorder/delete.`,
          fix: 'Use key={item.id} or another stable id.',
        })
    })

    const effectCount = (code.match(/useEffect\s*\(/g) || []).length
    const depsCount = (code.match(/useEffect\s*\([^)]+,\s*\[/g) || []).length
    if (effectCount > depsCount)
      issues.push({
        id: 'bug-eff',
        type: 'bug',
        severity: 'high',
        line: null,
        title: 'useEffect missing dependency array',
        description: 'useEffect without deps runs every render.',
        fix: 'Add a dependency array: useEffect(() => {...}, [deps])',
      })

    const asyncCount = (code.match(/async\s+function|async\s*\(/g) || []).length
    const tryCount = (code.match(/try\s*\{/g) || []).length
    if (asyncCount > 0 && tryCount === 0)
      issues.push({
        id: 'bug-try',
        type: 'bug',
        severity: 'high',
        line: null,
        title: 'Async without try/catch',
        description: `${asyncCount} async call(s) with no error handling.`,
        fix: 'Wrap await in try/catch or use .catch().',
      })
  }

  if (lang === 'json') {
    try {
      JSON.parse(code)
    } catch (e) {
      issues.push({
        id: 'json-invalid',
        type: 'bug',
        severity: 'critical',
        line: null,
        title: 'Invalid JSON syntax',
        description: e.message,
        fix: 'Fix JSON syntax (quotes, commas, trailing commas).',
      })
    }
  }

  if (lang === 'css') {
    lines.forEach((line, i) => {
      const n = i + 1
      const t = line.trim()
      if (/!important/.test(t))
        issues.push({
          id: `css-imp-${n}`,
          type: 'bug',
          severity: 'low',
          line: n,
          title: 'Using !important',
          description: `Line ${n}: !important is hard to override.`,
          fix: 'Refactor specificity instead of !important.',
        })
    })
  }

  if (lang === 'html') {
    const imgWithoutAlt = (code.match(/<img(?![^>]*\balt=)[^>]*>/gi) || []).length
    if (imgWithoutAlt > 0)
      issues.push({
        id: 'html-img-alt',
        type: 'bug',
        severity: 'high',
        line: null,
        title: `${imgWithoutAlt} image(s) missing alt`,
        description: 'Missing alt hurts accessibility and SEO.',
        fix: 'Add alt="..." to every <img>.',
      })

    if (!/<title[^>]*>[^<]+<\/title>/i.test(code))
      issues.push({
        id: 'html-title',
        type: 'bug',
        severity: 'critical',
        line: null,
        title: 'Missing <title> tag',
        description: 'Pages need a <title> for SEO and tabs.',
        fix: 'Add <title> in <head>.',
      })
  }

  const seen = new Set()
  const deduped = issues.filter((i) => {
    const k = `${i.type}-${i.line}-${i.title}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return {
    issues: deduped,
    score: computeHealthScore(deduped),
    status: 'ok',
  }
}

export function mergeAnalysisIssues(primary = [], extra = []) {
  const seen = new Set()
  return [...primary, ...extra].filter((i) => {
    const k = `${i.type}-${i.line}-${i.title}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/** Wrap broken JSX (orphan return / incomplete import) into a valid component shell. */
export function repairBrokenJsxShell(code, fileName = 'Component.jsx') {
  if (!code?.trim()) return code
  const base = (fileName || 'Component').replace(/\.[^.]+$/, '')
  const compName = base.charAt(0).toUpperCase() + base.slice(1).replace(/[^a-zA-Z0-9_$]/g, '') || 'Component'

  let body = code
    .replace(/^import\s*\{[\s\S]*?(?:\n\n|\n)/m, '')
    .replace(/^import\s*$/gm, '')
    .trim()

  // Orphan closing brace from a deleted function wrapper
  if (/^\s*return\s*\([\s\S]*\)\s*\}\s*$/m.test(body)) {
    body = body.replace(/\}\s*$/, '').trim()
  }

  const usesNavLink = /<NavLink/i.test(body)
  const importLine = usesNavLink
    ? "import { NavLink } from 'react-router-dom'\n\n"
    : "import React from 'react'\n\n"

  if (!/export\s+default/.test(body) && /return\s*\(/.test(body)) {
    const inner = body.startsWith('return') ? body : `return (\n${body}\n  )`
    return `${importLine}export default function ${compName}() {\n  ${inner}\n}\n`
  }

  if (/import\s*\{/.test(code) && !/\bfrom\s+['"`]/.test(code)) {
    return `${importLine}${body}`
  }

  return code
}

/** Apply one reported issue in the editor (Quick Scan / fallback). */
export function applyLocalFix(code, issue, fileType = 'javascript', fileName = '') {
  if (!issue) return code
  const title = (issue.title || '').toLowerCase()
  const line = issue.line
  let fixed = code

  if (
    title.includes('incomplete import') ||
    title.includes('return outside') ||
    title.includes('missing react component') ||
    title.includes('missing component wrapper')
  ) {
    return repairBrokenJsxShell(code, fileName)
  }

  if (title.includes('console')) {
    fixed = fixed.replace(/console\.(log|warn|debug|error|info)\(/g, '// console.$1(')
  }
  if (title.includes('==') || title.includes('equality')) {
    fixed = fixed.replace(/([^=!])==([^=])/g, '$1===$2')
  }
  if (title.includes('var')) {
    fixed = fixed.replace(/^\s*var\s+/gm, (m) => m.replace('var', 'let'))
  }
  if (title.includes('innerhtml') || title.includes('xss')) {
    fixed = fixed.replace(/\.innerHTML\s*=\s*(['"`][^'"`]*['"`])/g, '.textContent = $1')
  }
  if (title.includes('eval')) {
    fixed = fixed
      .split('\n')
      .map((ln, i) => {
        if (line && i + 1 !== line) return ln
        if (/\beval\s*\(/.test(ln) && !ln.trim().startsWith('//')) {
          return ln.replace(/\beval\s*\(/, '/* eval disabled */ // eval(')
        }
        return ln
      })
      .join('\n')
  }
  if (title.includes('key') && title.includes('index')) {
    fixed = fixed.replace(/key=\{index\}/g, 'key={item.id}')
  }

  return fixed
}

export const MIN_CODE_LENGTH_FOR_SCAN = MIN_SCAN_LENGTH

export const WELCOME_EDITOR_CODE = `// Welcome to Optivix 🚀
// Demo issues below — edit or delete lines; AI Analysis updates live.
// Fix → Fix Bugs removes var, ==, and console.

var demoUser = "guest"
if (demoUser == "guest") console.log("demo mode")

// Try deleting the two lines above — score should rise when issues are gone.
`
