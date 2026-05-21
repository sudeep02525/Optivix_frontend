const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
export const DEV_CWD_KEY = 'optivix_dev_cwd'

export function getDevCwd() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(DEV_CWD_KEY) || ''
}

export function setDevCwd(path) {
  localStorage.setItem(DEV_CWD_KEY, path)
}

function authHeaders() {
  const token = localStorage.getItem('nexus_token')
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

export async function startDevServer(cwd) {
  const res = await fetch(`${API_URL}/api/dev/start`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ cwd }),
  })
  return res.json()
}

export async function stopDevServer() {
  const res = await fetch(`${API_URL}/api/dev/stop`, {
    method: 'POST',
    headers: authHeaders(),
  })
  return res.json()
}

export async function fetchDevStatus() {
  const res = await fetch(`${API_URL}/api/dev/status`, { headers: authHeaders() })
  if (!res.ok) return { running: false, logs: [], previewUrl: null }
  return res.json()
}
