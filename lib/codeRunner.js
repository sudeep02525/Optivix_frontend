/** Run code in the browser (sandboxed). */

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = resolve
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

let pyodideReady = null

async function getPyodide() {
  if (pyodideReady) return pyodideReady
  pyodideReady = (async () => {
    await loadScript(`${PYODIDE_CDN}pyodide.js`)
    if (!window.loadPyodide) throw new Error('Pyodide failed to load')
    return window.loadPyodide({ indexURL: PYODIDE_CDN })
  })()
  return pyodideReady
}

function extOf(fileName) {
  return fileName?.split('.').pop()?.toLowerCase() || ''
}

function runJavaScript(code, fileName) {
  const logs = []
  const lines = []
  const fakeConsole = {
    log: (...a) => lines.push(a.map((x) => (typeof x === 'object' ? JSON.stringify(x) : String(x))).join(' ')),
    warn: (...a) => lines.push('⚠ ' + a.join(' ')),
    error: (...a) => lines.push('✗ ' + a.join(' ')),
    info: (...a) => lines.push(a.join(' ')),
  }
  try {
    const ext = extOf(fileName)
    if (ext === 'jsx' || ext === 'tsx') {
      return {
        type: 'error',
        output: 'JSX/TSX needs a build step. Save as .js or use HTML preview for UI.',
        logs: ['⚠️ Use plain JavaScript or HTML for Run'],
      }
    }
    const wrapped = code.includes('export ') || code.includes('import ')
      ? `// Modules not supported in sandbox — wrap in a function\n(function(){\n${code}\n})()`
      : code
    const fn = new Function('console', `"use strict";\n${wrapped}`)
    const result = fn(fakeConsole)
    if (result !== undefined) lines.push('→ ' + String(result))
    logs.push('✅ JavaScript finished')
    return {
      type: 'output',
      output: lines.length ? lines.join('\n') : '(no output)',
      logs,
    }
  } catch (e) {
    return {
      type: 'error',
      output: e.message || String(e),
      logs: [`❌ ${e.message}`],
    }
  }
}

async function runPython(code) {
  try {
    const py = await getPyodide()
    try {
      await py.loadPackagesFromImports(code)
    } catch {
      /* optional deps */
    }
    py.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`)
    await py.runPythonAsync(code)
    const out = py.runPython('sys.stdout.getvalue()')
    return {
      type: 'output',
      output: (out && String(out).trim()) || '(no output)',
      logs: ['✅ Python finished (Pyodide)'],
    }
  } catch (e) {
    return {
      type: 'error',
      output: e.message || String(e),
      logs: [`❌ Python: ${e.message}`],
    }
  }
}

/**
 * @param {{ code: string, fileName?: string, installedExtensions?: string[] }} opts
 */
export async function runCode({ code, fileName = '', installedExtensions = [] }) {
  const ext = extOf(fileName)
  const installed = installedExtensions || []

  if (!code?.trim()) {
    return { type: 'error', output: 'Nothing to run — add code first.', logs: ['⚠️ Editor is empty'] }
  }

  if (ext === 'html' || ext === 'htm' || (!fileName && /<html|<!DOCTYPE|<body/i.test(code))) {
    if (!installed.includes('html-preview')) {
      return {
        type: 'error',
        output: 'Install "HTML Live Preview" from Extensions.',
        logs: ['⚠️ Extension required: html-preview'],
      }
    }
    const doc = code.includes('<html') ? code : `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${code}</body></html>`
    return { type: 'preview', html: doc, logs: ['✅ HTML preview ready'] }
  }

  if (ext === 'css' || (!fileName && /@media|^\s*[\.\#]/m.test(code))) {
    if (!installed.includes('html-preview')) {
      return { type: 'error', output: 'Install HTML Live Preview extension.', logs: [] }
    }
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${code}</style></head><body><div style="padding:24px;font-family:sans-serif"><h2>CSS Preview</h2><p class="demo">Sample text</p><button class="demo">Button</button></div></body></html>`
    return { type: 'preview', html, logs: ['✅ CSS preview ready'] }
  }

  if (ext === 'json' || (!fileName && /^\s*[\[{]/.test(code.trim()))) {
    try {
      const parsed = JSON.parse(code)
      return {
        type: 'output',
        output: JSON.stringify(parsed, null, 2),
        logs: ['✅ Valid JSON'],
      }
    } catch (e) {
      return { type: 'error', output: e.message, logs: [`❌ JSON: ${e.message}`] }
    }
  }

  if (ext === 'py' || ext === 'python') {
    if (!installed.includes('python-runner')) {
      return {
        type: 'error',
        output: 'Install "Python Runner" from Extensions (sidebar → Extensions).',
        logs: ['⚠️ Download Python Runner extension first'],
      }
    }
    return runPython(code)
  }

  if (['js', 'mjs', 'cjs'].includes(ext) || installed.includes('js-runner')) {
    if (!installed.includes('js-runner') && ext !== 'js') {
      return { type: 'error', output: 'Install JavaScript Runner extension.', logs: [] }
    }
    return runJavaScript(code, fileName)
  }

  if (!fileName && !ext) {
    return runJavaScript(code, fileName)
  }

  return {
    type: 'error',
    output: `Cannot run .${ext || 'file'} here. Supported: .js, .html, .css, .json, .py (with extension).`,
    logs: ['💡 Install language/run extensions from Extensions tab'],
  }
}
