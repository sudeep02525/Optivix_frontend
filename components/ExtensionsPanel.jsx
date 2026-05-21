'use client'

import { useState, useEffect, useMemo } from 'react'
import { Download, Trash2, CheckCircle, Search, Package, Star } from 'lucide-react'
import {
  EXTENSION_CATALOG,
  getInstalledExtensions,
  downloadExtension,
  uninstallExtension,
  searchExtensions,
} from '@/lib/extensions'

export default function ExtensionsPanel({ onExtensionsChange }) {
  const [installed, setInstalled] = useState([])
  const [tab, setTab] = useState('marketplace')
  const [query, setQuery] = useState('')
  const [downloading, setDownloading] = useState(null)
  const [progress, setProgress] = useState(0)

  const refresh = () => {
    const ids = getInstalledExtensions()
    setInstalled(ids)
    onExtensionsChange?.(ids)
  }

  useEffect(() => {
    refresh()
  }, [])

  const marketplace = useMemo(() => searchExtensions(query), [query])
  const installedList = useMemo(
    () => EXTENSION_CATALOG.filter((e) => installed.includes(e.id)),
    [installed]
  )

  const handleInstall = async (id) => {
    if (installed.includes(id)) return
    setDownloading(id)
    setProgress(0)
    try {
      await downloadExtension(id, setProgress)
      refresh()
    } finally {
      setDownloading(null)
      setProgress(0)
    }
  }

  const handleUninstall = (id) => {
    if (uninstallExtension(id)) refresh()
  }

  const accent = 'var(--landing-accent)'
  const border = 'var(--ide-border)'
  const textMain = 'var(--ide-text)'
  const textDim = 'var(--ide-text-muted)'
  const cardBg = 'var(--ide-hero-panel)'

  const ExtensionCard = ({ ext, showInstall = true }) => {
    const isOn = installed.includes(ext.id)
    const busy = downloading === ext.id
    return (
      <div
        style={{
          padding: 10,
          borderRadius: 10,
          border: `1px solid ${border}`,
          background: cardBg,
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'var(--landing-accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {ext.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: textMain }}>{ext.name}</div>
            <div style={{ fontSize: 10, color: textDim }}>{ext.publisher}</div>
            <div style={{ fontSize: 10, color: textDim, marginTop: 4, lineHeight: 1.4 }}>{ext.description}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 9, color: textDim, flexWrap: 'wrap' }}>
              <span>v{ext.version}</span>
              <span>{ext.size}</span>
              {ext.downloads && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Star style={{ width: 8, height: 8 }} /> {ext.downloads}
                </span>
              )}
              <span style={{ padding: '1px 6px', borderRadius: 4, background: 'var(--landing-accent-soft)', color: accent }}>
                {ext.category}
              </span>
            </div>
          </div>
        </div>
        {busy && (
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: accent, transition: 'width 0.2s' }} />
            </div>
            <div style={{ fontSize: 9, color: textDim, marginTop: 4 }}>Downloading… {progress}%</div>
          </div>
        )}
        {showInstall && (
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
            {isOn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--landing-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle style={{ width: 12, height: 12 }} /> Installed
                </span>
                {!ext.defaultInstall && (
                  <button
                    type="button"
                    onClick={() => handleUninstall(ext.id)}
                    style={{ fontSize: 10, padding: '4px 8px', borderRadius: 6, border: `1px solid ${border}`, background: 'transparent', color: '#f87171', cursor: 'pointer' }}
                  >
                    Uninstall
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled={!!downloading}
                onClick={() => handleInstall(ext.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: accent,
                  color: 'var(--landing-btn-text)',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: downloading ? 'wait' : 'pointer',
                }}
              >
                <Download style={{ width: 12, height: 12 }} />
                Install
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '10px 10px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Package style={{ width: 14, height: 14, color: accent }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: textMain }}>Extensions</span>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {['marketplace', 'installed'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: 8,
                border: 'none',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
                background: tab === t ? accent : 'transparent',
                color: tab === t ? 'var(--landing-btn-text)' : textDim,
              }}
            >
              {t === 'marketplace' ? 'Marketplace' : `Installed (${installed.length})`}
            </button>
          ))}
        </div>
        {tab === 'marketplace' && (
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <Search style={{ position: 'absolute', left: 8, top: 8, width: 12, height: 12, color: textDim }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search extensions…"
              style={{
                width: '100%',
                padding: '7px 10px 7px 28px',
                borderRadius: 8,
                border: `1px solid ${border}`,
                background: cardBg,
                color: textMain,
                fontSize: 11,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 10px' }}>
        {tab === 'marketplace' &&
          marketplace.map((ext) => <ExtensionCard key={ext.id} ext={ext} />)}
        {tab === 'installed' &&
          (installedList.length === 0 ? (
            <p style={{ fontSize: 11, color: textDim, textAlign: 'center', padding: 20 }}>No extensions installed</p>
          ) : (
            installedList.map((ext) => <ExtensionCard key={ext.id} ext={ext} showInstall />)
          ))}
      </div>
    </div>
  )
}
