/** Read project files from Sidebar file tree (File System Access API). */

const CODE_EXTS = new Set(['html', 'htm', 'jsx', 'tsx', 'js', 'ts', 'mjs', 'css', 'scss'])
const SEO_EXTS = new Set(['html', 'htm', 'jsx', 'tsx', 'js', 'ts'])
const BUG_EXTS = new Set(['jsx', 'tsx', 'js', 'ts', 'mjs', 'css', 'scss', 'html', 'htm'])

export function flattenFileTree(items, out = []) {
  for (const item of items) {
    if (item.type === 'file') out.push(item)
    else if (item.children?.length) flattenFileTree(item.children, out)
  }
  return out
}

async function readFileItem(item) {
  if (item.handle) {
    const file = await item.handle.getFile()
    return file.text()
  }
  if (item.file) return item.file.text()
  return ''
}

/**
 * @param {Array} tree - fileStructure from Sidebar
 * @param {'seo'|'bugs'|'all'} mode
 */
export async function collectProjectFiles(tree, mode = 'all') {
  const exts =
    mode === 'seo' ? SEO_EXTS : mode === 'bugs' ? BUG_EXTS : CODE_EXTS
  const flat = flattenFileTree(tree)
  const files = []

  for (const item of flat) {
    const ext = item.name.split('.').pop()?.toLowerCase()
    if (!exts.has(ext)) continue
    try {
      const content = await readFileItem(item)
      files.push({
        path: item.id || item.name,
        name: item.name,
        content,
        handle: item.handle || null,
        ext,
      })
    } catch {
      /* skip unreadable */
    }
  }
  return files
}

const SYNC_SKIP_EXT = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot', 'mp4', 'mp3', 'zip',
  'pdf', 'exe', 'dll', 'bin',
])
const MAX_SYNC_FILE_BYTES = 1.5 * 1024 * 1024

/** All text files from opened folder for terminal workspace sync */
export async function collectAllFilesForSync(tree) {
  const flat = flattenFileTree(tree)
  const files = []

  for (const item of flat) {
    const ext = item.name.split('.').pop()?.toLowerCase()
    if (SYNC_SKIP_EXT.has(ext)) continue
    try {
      const content = await readFileItem(item)
      if (content.length > MAX_SYNC_FILE_BYTES) continue
      const relPath = (item.id || item.name).replace(/^root\/?/, '').replace(/^root\\/, '')
      files.push({ path: relPath, content })
    } catch {
      /* skip */
    }
  }
  return files
}

export async function writeProjectFile(fileEntry, content) {
  if (!fileEntry?.handle) return false
  try {
    const w = await fileEntry.handle.createWritable()
    await w.write(content)
    await w.close()
    return true
  } catch {
    return false
  }
}
