const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
export const TERMINAL_CWD_KEY = 'optivix_dev_cwd'

export function getTerminalCwd() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(TERMINAL_CWD_KEY) || ''
}

export function setTerminalCwd(path) {
  localStorage.setItem(TERMINAL_CWD_KEY, path)
}

function authHeaders() {
  const token = localStorage.getItem('nexus_token')
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

export async function terminalExec(command, cwd) {
  const res = await fetch(`${API_URL}/api/terminal/exec`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ command, cwd }),
  })
  return res.json()
}

export async function terminalSetCwd(cwd) {
  const res = await fetch(`${API_URL}/api/terminal/cwd`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ cwd }),
  })
  return res.json()
}

export async function terminalStatus() {
  const res = await fetch(`${API_URL}/api/terminal/status`, { headers: authHeaders() })
  if (!res.ok) return { history: [], cwd: null }
  return res.json()
}
