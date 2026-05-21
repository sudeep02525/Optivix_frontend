'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Settings, ChevronDown, Plus, Folder, FolderOpen, File, AlertCircle, LogOut, Sun, Moon, LayoutDashboard, Package } from 'lucide-react'
import IDEDashboard from '@/components/IDEDashboard'
import ExtensionsPanel from '@/components/ExtensionsPanel'
import { useTheme } from '@/components/ThemeContext'
import { getTerminalCwd, setTerminalCwd } from '@/lib/terminal'
const getFileColor = (name) => {
  const ext = name.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'js': case 'jsx': return '#facc15'
    case 'ts': case 'tsx': return '#60a5fa'
    case 'css': case 'scss': return '#f472b6'
    case 'html': return '#fb923c'
    case 'json': return '#fde047'
    case 'md': return '#9ca3af'
    default: return '#60a5fa'
  }
}

export default function Sidebar({ activeTab, setActiveTab, onFileSelect, onGitClone, analysisSnapshot, isFixing, onExtensionsChange, installedExtensions = [], onWorkspaceChange }) {
  const { theme, toggleTheme } = useTheme()
  const [expandedFolders, setExpandedFolders] = useState([])
  const [folderOpened, setFolderOpened] = useState(false)
  const [fileStructure, setFileStructure] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchGlob, setSearchGlob] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [explorerFilter, setExplorerFilter] = useState('')
  const [devPath, setDevPath] = useState('')
  const showExplorerFilter = installedExtensions.includes('explorer-filter')

  useEffect(() => {
    const stored = localStorage.getItem('nexus_user')
    if (stored) setUser(JSON.parse(stored))
    setDevPath(getTerminalCwd())
  }, [])

  useEffect(() => {
    const folderName = fileStructure[0]?.name || ''
    onWorkspaceChange?.({ fileStructure, folderOpened, folderName })
  }, [fileStructure, folderOpened, onWorkspaceChange])

  const handleLogout = () => {
    localStorage.removeItem('nexus_token')
    localStorage.removeItem('token')
    localStorage.removeItem('nexus_user')
    window.location.href = '/auth'
  }

  const flattenFiles = (items, out = []) => {
    for (const item of items) {
      if (item.type === 'file') out.push(item)
      else if (item.children) flattenFiles(item.children, out)
    }
    return out
  }

  const globMatch = (name, pattern) => {
    if (!pattern.trim()) return true
    const p = pattern.trim().replace(/\./g, '\\.').replace(/\*/g, '.*')
    try {
      return new RegExp(`^${p}$`, 'i').test(name)
    } catch {
      return name.toLowerCase().includes(pattern.toLowerCase())
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    if (!folderOpened || fileStructure.length === 0) {
      setSearchResults([])
      return
    }
    setSearching(true)
    const q = searchQuery.toLowerCase()
    const files = flattenFiles(fileStructure)
    const results = []
    for (const item of files) {
      if (!globMatch(item.name, searchGlob)) continue
      try {
        let content = ''
        if (item.handle) {
          const file = await item.handle.getFile()
          content = await file.text()
        } else if (item.file) {
          content = await item.file.text()
        } else continue
        const lines = content.split('\n')
        lines.forEach((line, idx) => {
          if (line.toLowerCase().includes(q)) {
            results.push({
              id: `${item.id}-${idx}`,
              file: item.name,
              line: idx + 1,
              preview: line.trim().slice(0, 120),
              item,
            })
          }
        })
      } catch {
        /* skip unreadable */
      }
    }
    setSearchResults(results.slice(0, 50))
    setSearching(false)
  }

  const dark = theme === 'dark'
  const bg = 'var(--ide-surface)'
  const border = 'var(--ide-border)'
  const textMain = 'var(--ide-text)'
  const textMid = 'var(--ide-text-muted)'
  const textDim = 'var(--ide-text-dim)'
  const hoverBg = 'var(--landing-accent-soft)'
  const activeBg = 'rgba(var(--landing-accent-rgb), 0.15)'
  const accent = 'var(--landing-accent)'

  const tabs = [
    { id: 'explorer', icon: FileText,  label: 'Explorer'   },
    { id: 'search',   icon: Search,    label: 'Search'     },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'extensions', icon: Package, label: 'Extensions' },
    { id: 'settings', icon: Settings,  label: 'Settings'   },
  ]

  const filterTreeItems = (items) => {
    if (!showExplorerFilter || !explorerFilter.trim()) return items
    return items.flatMap((item) => {
      if (item.type === 'folder') {
        const children = filterTreeItems(item.children || [])
        if (children.length > 0) return [{ ...item, children }]
        return []
      }
      return globMatch(item.name, explorerFilter) ? [item] : []
    })
  }

  const readDirectory = async (dirHandle, path = '') => {
    const entries = []
    for await (const entry of dirHandle.values()) {
      if (['node_modules', '.git', '.next', '.vscode', 'dist', 'build', '__pycache__'].includes(entry.name)) continue
      const fullPath = path ? `${path}/${entry.name}` : entry.name
      if (entry.kind === 'directory') {
        const children = await readDirectory(entry, fullPath)
        entries.push({ id: fullPath, name: entry.name, type: 'folder', children, handle: entry })
      } else {
        entries.push({ id: fullPath, name: entry.name, type: 'file', handle: entry })
      }
    }
    return entries.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === 'folder' ? -1 : 1
    })
  }

  const handleOpenFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        setLoading(true)
        const dirHandle = await window.showDirectoryPicker({
          mode: 'readwrite' // ✅ Write permission request
        })
        const children = await readDirectory(dirHandle)
        setFileStructure([{ id: 'root', name: dirHandle.name, type: 'folder', children, handle: dirHandle }])
        setExpandedFolders(['root'])
        setFolderOpened(true)
        setLoading(false)
      } else {
        const input = document.createElement('input')
        input.type = 'file'
        input.webkitdirectory = true
        input.multiple = true
        input.onchange = (e) => {
          const files = Array.from(e.target.files)
          if (files.length === 0) return
          const tree = {}
          files.forEach(file => {
            const parts = file.webkitRelativePath.split('/')
            let node = tree
            parts.forEach((part, i) => {
              if (i === parts.length - 1) {
                if (!node.__files) node.__files = []
                node.__files.push({ id: file.webkitRelativePath, name: part, type: 'file', file })
              } else {
                if (!node[part]) node[part] = {}
                node = node[part]
              }
            })
          })
          const toTree = (obj, basePath = '') => {
            const result = []
            Object.keys(obj).forEach(key => {
              if (key === '__files') { result.push(...obj[key]); return }
              const path = basePath ? `${basePath}/${key}` : key
              result.push({ id: path, name: key, type: 'folder', children: toTree(obj[key], path) })
            })
            return result.sort((a, b) => { if (a.type === b.type) return a.name.localeCompare(b.name); return a.type === 'folder' ? -1 : 1 })
          }
          const rootName = files[0].webkitRelativePath.split('/')[0]
          setFileStructure([{ id: 'root', name: rootName, type: 'folder', children: toTree(tree[rootName] || tree) }])
          setExpandedFolders(['root'])
          setFolderOpened(true)
        }
        input.click()
      }
    } catch (err) {
      setLoading(false)
      if (err.name !== 'AbortError') console.error('Folder open error:', err)
    }
  }

  const handleFileClick = async (item) => {
    if (item.type !== 'file') return
    setSelectedFile(item.id)
    try {
      let content = ''
      if (item.handle) {
        const file = await item.handle.getFile()
        const binaryExts = ['png', 'jpg', 'jpeg', 'gif', 'ico', 'woff', 'woff2', 'ttf', 'eot']
        const ext = item.name.split('.').pop()?.toLowerCase()
        content = binaryExts.includes(ext)
          ? `// Binary file: ${item.name}\n// Cannot display binary content.`
          : await file.text()
      } else if (item.file) {
        content = await item.file.text()
      } else {
        content = `// File: ${item.name}\n// No content available`
      }
      console.log('File content loaded:', item.name, content.substring(0, 100)) // Debug log
      if (onFileSelect) onFileSelect(item.name, content, item.handle || null)
    } catch (err) {
      console.error('File read error:', err)
      const errorContent = `// Error reading file: ${item.name}\n// ${err.message}`
      if (onFileSelect) onFileSelect(item.name, errorContent, null)
    }
  }

  const toggleFolder = (id) => {
    setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const renderFileTree = (items, depth = 0) => items.map(item => (
    <div key={item.id}>
      {item.type === 'folder' ? (
        <div>
          <button
            onClick={() => toggleFolder(item.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 5, padding: `4px 6px 4px ${8 + depth * 14}px`, background: 'none', border: 'none', cursor: 'pointer', color: textMid, fontSize: 12, borderRadius: 5, textAlign: 'left' }}
            onMouseEnter={e => e.currentTarget.style.background = hoverBg}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <ChevronDown style={{ width: 12, height: 12, flexShrink: 0, transition: 'transform 0.15s', transform: expandedFolders.includes(item.id) ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
            {expandedFolders.includes(item.id)
              ? <FolderOpen style={{ width: 14, height: 14, flexShrink: 0, color: '#5b9cf5' }} />
              : <Folder    style={{ width: 14, height: 14, flexShrink: 0, color: 'rgba(91,156,245,0.5)' }} />
            }
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
          </button>
          {expandedFolders.includes(item.id) && item.children?.length > 0 && <div>{renderFileTree(item.children, depth + 1)}</div>}
          {expandedFolders.includes(item.id) && item.children?.length === 0 && (
            <div style={{ paddingLeft: 8 + (depth+1)*14 + 20, fontSize: 10, color: textDim, fontStyle: 'italic', paddingTop: 2, paddingBottom: 2 }}>empty folder</div>
          )}
        </div>
      ) : (
        <button
          onClick={() => handleFileClick(item)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 5, padding: `4px 6px 4px ${8 + depth * 14 + 18}px`, background: selectedFile === item.id ? activeBg : 'none', border: 'none', cursor: 'pointer', color: selectedFile === item.id ? textMain : textMid, fontSize: 12, borderRadius: 5, textAlign: 'left' }}
          onMouseEnter={e => { if (selectedFile !== item.id) e.currentTarget.style.background = hoverBg }}
          onMouseLeave={e => { if (selectedFile !== item.id) e.currentTarget.style.background = 'none' }}
        >
          <File style={{ width: 13, height: 13, flexShrink: 0, color: getFileColor(item.name) }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
        </button>
      )}
    </div>
  ))

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: 0 }}>
      {/* Tab Icons - Vertical Sidebar */}
      <div style={{ width: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0', background: bg, borderRight: `1px solid ${border}`, flexShrink: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            style={{ 
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0, 
              borderRadius: 8, 
              border: 'none', 
              cursor: 'pointer', 
              transition: 'all 0.15s', 
              background: activeTab === tab.id ? activeBg : 'transparent', 
              color: activeTab === tab.id ? '#5b9cf5' : textDim,
              position: 'relative'
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) e.currentTarget.style.background = hoverBg
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent'
            }}
          >
            <tab.icon style={{ width: 20, height: 20 }} />
            {activeTab === tab.id && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 3,
                height: 24,
                background: accent,
                borderRadius: '0 3px 3px 0'
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div style={{ width: 220, minWidth: 220, display: 'flex', flexDirection: 'column', background: bg, borderRight: `1px solid ${border}`, overflow: 'hidden', flexShrink: 0, color: textMain }}>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'explorer' && (
          <div style={{ padding: '10px 8px' }}>
            {!folderOpened ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 12px', textAlign: 'center' }}>
                <Folder style={{ width: 48, height: 48, color: 'rgba(91,156,245,0.3)', marginBottom: 12 }} />
                <p style={{ fontSize: 12, fontWeight: 600, color: textMid, marginBottom: 6 }}>You have not yet opened a folder</p>
                <p style={{ fontSize: 11, color: textDim, marginBottom: 14, lineHeight: 1.5 }}>Open a folder to see its files here.</p>
                <button
                  onClick={handleOpenFolder}
                  disabled={loading}
                  style={{ width: '100%', padding: '7px 12px', borderRadius: 8, border: '1px solid rgba(91,156,245,0.3)', background: 'rgba(91,156,245,0.1)', color: '#5b9cf5', fontSize: 12, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
                >
                  {loading ? 'Loading...' : 'Open Folder'}
                </button>
                <button type="button" onClick={onGitClone} style={{ marginTop: 6, fontSize: 11, color: textDim, background: 'none', border: 'none', cursor: 'pointer' }}>Clone Repository</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, padding: '0 4px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: textDim, textTransform: 'uppercase', letterSpacing: 1 }}>Explorer</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <button title="New File" style={{ padding: 4, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', color: textDim }}><Plus style={{ width: 13, height: 13 }} /></button>
                    <button title="Open Folder" onClick={handleOpenFolder} style={{ padding: 4, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', color: textDim }}><FolderOpen style={{ width: 13, height: 13 }} /></button>
                  </div>
                </div>
                {showExplorerFilter && (
                  <input
                    type="text"
                    value={explorerFilter}
                    onChange={(e) => setExplorerFilter(e.target.value)}
                    placeholder="Filter (*.js, *.tsx)"
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      marginBottom: 8,
                      borderRadius: 6,
                      fontSize: 11,
                      border: `1px solid ${border}`,
                      background: 'var(--ide-hero-panel)',
                      color: textMain,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
                <div>{renderFileTree(filterTreeItems(fileStructure))}</div>
              </>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div style={{ padding: 12 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: textDim, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Search in Files</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search..." 
                style={{ 
                  width: '100%', 
                  padding: '8px 10px', 
                  borderRadius: 8, 
                  fontSize: 12, 
                  background: dark ? 'rgba(91,156,245,0.08)' : 'rgba(0,150,200,0.1)', 
                  border: `1px solid ${border}`, 
                  color: textMain, 
                  outline: 'none', 
                  boxSizing: 'border-box',
                  marginBottom: 8
                }} 
              />
              <input 
                type="text" 
                value={searchGlob}
                onChange={e => setSearchGlob(e.target.value)}
                placeholder="Files to include (e.g., *.js)" 
                style={{ 
                  width: '100%', 
                  padding: '7px 10px', 
                  borderRadius: 8, 
                  fontSize: 11, 
                  background: dark ? 'rgba(91,156,245,0.08)' : 'rgba(0,150,200,0.1)', 
                  border: `1px solid ${border}`, 
                  color: textMain, 
                  outline: 'none', 
                  boxSizing: 'border-box',
                  marginBottom: 8
                }} 
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching || !folderOpened}
                style={{
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(91,156,245,0.3)',
                  background: 'rgba(91,156,245,0.1)',
                  color: '#5b9cf5',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: searching || !folderOpened ? 'not-allowed' : 'pointer',
                  opacity: searching || !folderOpened ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6
                }}
              >
                <Search style={{ width: 14, height: 14 }} />
                {searching ? 'Searching…' : 'Search'}
              </button>
            </div>
            {!folderOpened ? (
              <div style={{ marginTop: 8, padding: 12, borderRadius: 8, background: dark ? 'rgba(91,156,245,0.06)' : 'rgba(0,150,200,0.08)', border: `1px solid ${border}`, textAlign: 'center' }}>
                <Folder style={{ width: 28, height: 28, color: textDim, margin: '0 auto 8px' }} />
                <div style={{ fontSize: 11, color: textDim }}>Open a folder in Explorer first</div>
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: dark ? 'rgba(91,156,245,0.06)' : 'rgba(0,150,200,0.08)', border: `1px solid ${border}`, textAlign: 'center' }}>
                <Search style={{ width: 32, height: 32, color: textDim, margin: '0 auto 8px' }} />
                <div style={{ fontSize: 11, color: textDim }}>{searchQuery ? 'No matches' : 'No results yet'}</div>
                <div style={{ fontSize: 10, color: textDim, marginTop: 4 }}>Enter a term and press Search</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                <div style={{ fontSize: 10, color: textDim, marginBottom: 4 }}>{searchResults.length} match(es)</div>
                {searchResults.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleFileClick(r.item)}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8, border: `1px solid ${border}`, background: dark ? 'rgba(91,156,245,0.06)' : 'rgba(0,150,200,0.06)', cursor: 'pointer', color: textMain }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#5b9cf5' }}>{r.file}:{r.line}</div>
                    <div style={{ fontSize: 10, color: textDim, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.preview}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <IDEDashboard
            healthScore={analysisSnapshot?.healthScore ?? 100}
            issues={analysisSnapshot?.issues ?? []}
            aiModel={analysisSnapshot?.aiModel}
            isFixing={isFixing}
          />
        )}

        {activeTab === 'extensions' && (
          <ExtensionsPanel onExtensionsChange={onExtensionsChange} />
        )}

        {activeTab === 'settings' && (
          <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Settings</div>
            
            {/* Theme Toggle */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: 'block', marginBottom: 8 }}>Appearance</label>
              <div style={{ 
                display: 'flex', 
                gap: 8,
                padding: 8,
                borderRadius: 8,
                background: dark ? 'rgba(91,156,245,0.08)' : 'rgba(0,150,200,0.1)',
                border: `1px solid ${border}`
              }}>
                <button
                  onClick={() => theme !== 'light' && toggleTheme()}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: !dark ? 'rgba(255,255,255,0.9)' : 'transparent',
                    color: !dark ? '#1a1a2e' : textDim,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    if (dark) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  }}
                  onMouseLeave={e => {
                    if (dark) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Sun style={{ width: 16, height: 16, color: !dark ? '#f59e0b' : textDim }} />
                  Light
                </button>
                <button
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: dark ? 'rgba(91,156,245,0.2)' : 'transparent',
                    color: dark ? '#5b9cf5' : textDim,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    boxShadow: dark ? 'none' : 'none',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => {
                    if (!dark) e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
                  }}
                  onMouseLeave={e => {
                    if (!dark) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <Moon style={{ width: 16, height: 16, color: dark ? '#5b9cf5' : textDim }} />
                  Dark
                </button>
              </div>
            </div>

            <div style={{ height: 1, background: border }} />

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMid, display: 'block', marginBottom: 6 }}>
                Terminal (optional override)
              </label>
              <input
                type="text"
                value={devPath}
                onChange={(e) => {
                  setDevPath(e.target.value)
                  setTerminalCwd(e.target.value)
                }}
                placeholder="Auto when you open a folder"
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: `1px solid ${border}`,
                  background: 'var(--ide-hero-panel)',
                  color: textMain,
                  fontSize: 11,
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ fontSize: 10, color: textDim, marginTop: 4, lineHeight: 1.4 }}>
                Open a folder in Explorer — files sync to terminal automatically. Override path only if needed.
              </p>
            </div>

            <div style={{ height: 1, background: border }} />

            {/* Other Settings */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMid }}>Auto-save on fix</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMid }}>Word wrap</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMid }}>Line numbers</label>
              <input type="checkbox" defaultChecked />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: textMid }}>Minimap</label>
              <input type="checkbox" />
            </div>
          </div>
        )}
      </div>

      {/* Footer - User info */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${border}`, flexShrink: 0 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Avatar */}
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: '#0c0c0c' }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textMain, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{ padding: 5, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', color: textDim, display: 'flex', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = textDim}
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ fontSize: 11, color: textDim }}>Connected</span>
            <a href="/auth" style={{ marginLeft: 'auto', fontSize: 11, color: '#5b9cf5', textDecoration: 'none', fontWeight: 600 }}>Sign In</a>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}











