/** Optivix extension marketplace (VS Code–style install flow). */

export const EXTENSIONS_KEY = 'optivix_extensions'
export const EXTENSION_DATA_KEY = 'optivix_extension_data'

export const EXTENSION_CATALOG = [
  {
    id: 'html-preview',
    name: 'HTML Live Preview',
    publisher: 'Optivix',
    icon: '🌐',
    description: 'Preview HTML/CSS inside the IDE.',
    version: '1.2.0',
    size: '45 KB',
    downloads: '12.4k',
    category: 'Run',
    defaultInstall: true,
  },
  {
    id: 'js-runner',
    name: 'JavaScript Runner',
    publisher: 'Optivix',
    icon: '▶️',
    description: 'Run .js files in a sandbox; output in Console.',
    version: '1.1.0',
    size: '18 KB',
    downloads: '9.1k',
    category: 'Run',
    defaultInstall: true,
  },
  {
    id: 'npm-dev-server',
    name: 'Integrated Terminal',
    publisher: 'Optivix',
    icon: '⚡',
    description: 'Built-in shell in Console → Terminal. Run npm run dev, build, tests, and more.',
    version: '2.0.0',
    size: 'Built-in',
    downloads: '12k',
    category: 'Run',
    defaultInstall: true,
  },
  {
    id: 'python-runner',
    name: 'Python',
    publisher: 'Optivix',
    icon: '🐍',
    description: 'Run .py in browser via Pyodide (~8MB first download).',
    version: '1.0.0',
    size: '8.2 MB',
    downloads: '5.6k',
    category: 'Run',
  },
  {
    id: 'theme-one-dark',
    name: 'One Dark Pro',
    publisher: 'Optivix Themes',
    icon: '🌙',
    description: 'Dark theme for the code editor.',
    version: '1.3.1',
    size: '124 KB',
    downloads: '21k',
    category: 'Themes',
    theme: 'one-dark',
  },
  {
    id: 'theme-github-light',
    name: 'GitHub Light',
    publisher: 'Optivix Themes',
    icon: '☀️',
    description: 'Clean light theme for daytime coding.',
    version: '1.0.0',
    size: '98 KB',
    downloads: '7.3k',
    category: 'Themes',
    theme: 'github-light',
  },
  {
    id: 'prettier',
    name: 'Prettier',
    publisher: 'Prettier',
    icon: '✨',
    description: 'Format on save hints and style rules (Optivix formatter).',
    version: '3.2.0',
    size: '2.1 MB',
    downloads: '45k',
    category: 'Formatters',
  },
  {
    id: 'eslint',
    name: 'ESLint',
    publisher: 'Microsoft',
    icon: '🔍',
    description: 'Extra lint rules in Quick Scan for JS/TS.',
    version: '3.0.0',
    size: '4.5 MB',
    downloads: '38k',
    category: 'Linters',
  },
  {
    id: 'lang-php',
    name: 'PHP Intelephense',
    publisher: 'Optivix',
    icon: '🐘',
    description: 'PHP syntax highlighting and snippets.',
    version: '1.0.0',
    size: '28 KB',
    downloads: '3.2k',
    category: 'Languages',
  },
  {
    id: 'lang-go',
    name: 'Go',
    publisher: 'Go Team',
    icon: '🔵',
    description: 'Go language support in Monaco.',
    version: '1.0.0',
    size: '32 KB',
    downloads: '2.8k',
    category: 'Languages',
  },
  {
    id: 'lang-rust',
    name: 'rust-analyzer',
    publisher: 'Rust',
    icon: '🦀',
    description: 'Rust syntax highlighting.',
    version: '1.0.0',
    size: '30 KB',
    downloads: '2.1k',
    category: 'Languages',
  },
  {
    id: 'lang-java',
    name: 'Language Support for Java',
    publisher: 'Red Hat',
    icon: '☕',
    description: 'Java syntax highlighting.',
    version: '1.0.0',
    size: '35 KB',
    downloads: '4.1k',
    category: 'Languages',
  },
  {
    id: 'lang-cpp',
    name: 'C/C++',
    publisher: 'Microsoft',
    icon: '⚙️',
    description: 'C and C++ syntax highlighting.',
    version: '1.0.0',
    size: '38 KB',
    downloads: '3.9k',
    category: 'Languages',
  },
  {
    id: 'ai-deep-fix',
    name: 'AI Deep Fix',
    publisher: 'Optivix',
    icon: '🧠',
    description: 'Full-file AI repair with Ollama (missing code, JSX, CSS).',
    version: '2.0.0',
    size: '12 KB',
    downloads: '6.7k',
    category: 'AI',
    defaultInstall: true,
  },
  {
    id: 'explorer-filter',
    name: 'Explorer Filter',
    publisher: 'Optivix',
    icon: '📁',
    description: 'Filter explorer by *.tsx, *.js, etc.',
    version: '1.0.0',
    size: '8 KB',
    downloads: '4.4k',
    category: 'Other',
    defaultInstall: true,
  },
  {
    id: 'git-graph',
    name: 'Git Graph',
    publisher: 'mhutchie',
    icon: '🔀',
    description: 'Git clone helper and repo tips in sidebar.',
    version: '1.5.0',
    size: '890 KB',
    downloads: '11k',
    category: 'SCM',
  },
]

export function getInstalledExtensions() {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EXTENSIONS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch { /* ignore */ }
  return EXTENSION_CATALOG.filter((e) => e.defaultInstall).map((e) => e.id)
}

export function getExtensionData() {
  try {
    const raw = localStorage.getItem(EXTENSION_DATA_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveExtensionData(id, data) {
  const all = getExtensionData()
  all[id] = { ...all[id], ...data, installedAt: Date.now() }
  localStorage.setItem(EXTENSION_DATA_KEY, JSON.stringify(all))
}

export function setInstalledExtensions(ids) {
  localStorage.setItem(EXTENSIONS_KEY, JSON.stringify(ids))
}

export function isExtensionInstalled(id) {
  return getInstalledExtensions().includes(id)
}

export function getActiveEditorTheme() {
  const installed = getInstalledExtensions()
  for (const ext of EXTENSION_CATALOG) {
    if (ext.theme && installed.includes(ext.id)) return ext.theme
  }
  return null
}

/** Simulated VS Code marketplace download with progress */
export async function downloadExtension(id, onProgress) {
  const ext = EXTENSION_CATALOG.find((e) => e.id === id)
  if (!ext) throw new Error('Extension not found')

  const steps = ext.size?.includes('MB') ? 12 : 6
  for (let i = 0; i <= steps; i++) {
    await new Promise((r) => setTimeout(r, 120 + Math.random() * 80))
    onProgress?.(Math.round((i / steps) * 100))
  }

  const ids = getInstalledExtensions()
  if (!ids.includes(id)) setInstalledExtensions([...ids, id])

  saveExtensionData(id, {
    version: ext.version,
    publisher: ext.publisher,
    downloaded: true,
  })

  onProgress?.(100)
  return ext
}

export function installExtension(id) {
  const ids = getInstalledExtensions()
  if (!ids.includes(id)) setInstalledExtensions([...ids, id])
}

export function uninstallExtension(id) {
  const ext = EXTENSION_CATALOG.find((e) => e.id === id)
  if (ext?.defaultInstall) return false
  setInstalledExtensions(getInstalledExtensions().filter((x) => x !== id))
  const all = getExtensionData()
  delete all[id]
  localStorage.setItem(EXTENSION_DATA_KEY, JSON.stringify(all))
  return true
}

export function searchExtensions(query) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return EXTENSION_CATALOG
  return EXTENSION_CATALOG.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.publisher.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
  )
}

export function getExtensionLanguages(installed) {
  const map = {
    'lang-php': 'php',
    'lang-go': 'go',
    'lang-rust': 'rust',
    'lang-java': 'java',
    'lang-cpp': 'cpp',
  }
  return installed.map((id) => map[id]).filter(Boolean)
}
