import { collectAllFilesForSync } from '@/lib/projectFiles'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function authHeaders() {
  const token = localStorage.getItem('nexus_token')
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

/**
 * Copy opened IDE folder to backend workspace so terminal can run npm, mkdir, etc.
 */
export async function syncWorkspaceToServer(folderName, fileStructure, onProgress) {
  if (!folderName || !fileStructure?.length) {
    return { ok: false, error: 'Open a folder in Explorer first' }
  }

  onProgress?.('Reading project files…')
  const files = await collectAllFilesForSync(fileStructure)
  if (!files.length) {
    return { ok: false, error: 'No files to sync. Open a folder with your project.' }
  }

  onProgress?.(`Uploading ${files.length} files…`)
  const res = await fetch(`${API_URL}/api/workspace/sync`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ folderName, files }),
  })
  const data = await res.json()
  if (!res.ok) return { ok: false, error: data.error || 'Sync failed' }
  return { ok: true, ...data }
}
